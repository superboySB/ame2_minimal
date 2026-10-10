#!/usr/bin/env python3
"""Run reproducible, bounded validation jobs sequentially inside the Isaac Docker.

Each job has its own log, report and exit status. Failed jobs remain failed in
the summary; use a fresh output directory after fixing the underlying problem.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import signal
import subprocess
import sys
import time
from datetime import datetime, timezone

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--phase", choices=("tasks", "terrains", "cli", "training"), required=True)
parser.add_argument("--output", type=Path, required=True)
parser.add_argument("--checkpoint", type=Path, default=Path("../modelzoo/g1_gaze_64000env_10h/model_2400.pt"))
parser.add_argument("--timeout", type=int, default=1200)
parser.add_argument("--steps", type=int, default=800)
parser.add_argument("--num_envs", type=int, default=64, help="Per-worker environments for bounded training")
args = parser.parse_args()
args.output = args.output.resolve()
if args.output.exists() and any(args.output.iterdir()):
    parser.error("--output must be empty; previous evidence is never overwritten")
args.output.mkdir(parents=True, exist_ok=True)
checkpoint = str(args.checkpoint.resolve())
python = "/isaac-sim/python.sh"
jobs = []


def verify(name, task, *extra):
    folder = args.output / name
    jobs.append((name, [python, "scripts/research/verify.py", "--headless", "--task", task,
                       "--seed", "42", "--report", str(folder / "result.json"), *extra]))


if args.phase == "tasks":
    jobs.append(("inventory", [python, "scripts/research/inventory.py", "--output", str(args.output / "inventory.json")]))
    for task in ("Ame2-G1", "Ame2-G1-Play", "Ame2-G1-Gaze", "Ame2-G1-Gaze-Play"):
        verify(task.lower(), task, "--terrain", "all", "--num_envs", "16", "--steps", "32", "--policy", "random")
    verify("official_all_terrains", "Ame2-G1-Gaze-Play", "--terrain", "all", "--num_envs", "16",
           "--steps", str(args.steps), "--checkpoint", checkpoint, "--export_jit")
    verify("jit_all_terrains", "Ame2-G1-Gaze-Play", "--terrain", "all", "--num_envs", "16",
           "--steps", str(args.steps), "--checkpoint", checkpoint, "--policy", "jit")
    verify("raw_mid360", "Ame2-G1-Gaze-Play", "--terrain", "rough", "--num_envs", "1",
           "--steps", "32", "--checkpoint", checkpoint, "--mid360")
elif args.phase == "terrains":
    # Read terrain names from the actual inventory rather than inventing combinations.
    inventory_path = args.output / "inventory.json"
    inventory = subprocess.run([python, "scripts/research/inventory.py", "--output", str(inventory_path)], check=False)
    if inventory.returncode:
        raise SystemExit(inventory.returncode)
    data = json.loads(inventory_path.read_text())
    entries = data["terrains"]
    terrains = list(entries) if isinstance(entries, dict) else [entry["name"] for entry in entries]
    for terrain in terrains:
        verify(terrain, "Ame2-G1-Gaze-Play", "--terrain", terrain, "--num_envs", "1", "--steps", str(args.steps),
               "--difficulty", "0.35", "--checkpoint", checkpoint, "--video")
    verify("attention", "Ame2-G1-Gaze-Play", "--terrain", "climb_up", "--num_envs", "1", "--steps", "400",
           "--difficulty", "0.35", "--checkpoint", checkpoint, "--video", "--attention")
elif args.phase == "cli":
    base = [python, "scripts/rsl_rl/play.py", "--headless", "--task", "Ame2-G1-Gaze-Play", "--num_envs", "1",
            "--seed", "42", "--checkpoint", checkpoint]
    jobs.append(("play_export_video", base + ["--terrain", "rough", "--difficulty", "0.35", "--no_markers",
                 "--export", "--video", "--video_length", str(args.steps), "--output_dir", str(args.output / "play_export_video")]))
    jobs.append(("return_home_height_goal", base + ["--terrain", "climb_up", "--terrain_height", "0.25",
                 "--goal_x_range", "3", "4", "--difficulty", "0.2", "--return_home", "--no_markers",
                 "--video", "--video_length", "1600", "--output_dir", str(args.output / "return_home_height_goal")]))
    jobs.append(("fly_assistance", base + ["--terrain", "pit", "--difficulty", "0.35", "--fly", "--no_markers",
                 "--video", "--video_length", "500", "--output_dir", str(args.output / "fly_assistance")]))
    jobs.append(("reward_debug_plots", base + ["--terrain", "rough", "--difficulty", "0.35", "--plot", "--log_rewards",
                 "--max_steps", "850", "--output_dir", str(args.output / "reward_debug_plots")]))
elif args.phase == "training":
    for task, short in (("Ame2-G1", "base"), ("Ame2-G1-Gaze", "gaze")):
        for optimizer, mixed in (("muon", "true"), ("adam", "false")):
            name = f"{short}_{optimizer}_{'bf16' if mixed == 'true' else 'fp32'}"
            jobs.append((name, [python, "scripts/rsl_rl/train.py", "--headless", "--task", task,
                               "--num_envs", str(args.num_envs), "--max_iterations", "3", "--seed", "42",
                               "--experiment_name", "research_matrix", "--run_name", name, "--logger", "tensorboard",
                               f"agent.algorithm.optimizer={optimizer}", f"agent.algorithm.use_mixed_precision={mixed}",
                               "agent.save_interval=1"]))
    jobs.append(("single_head_critic", [python, "scripts/rsl_rl/train.py", "--headless", "--task", "Ame2-G1-Gaze",
                 "--num_envs", str(args.num_envs), "--max_iterations", "2", "--seed", "42", "--logger", "tensorboard",
                 "--experiment_name", "research_matrix", "--run_name", "single_head", "+agent.algorithm.multi_head_critic=false"]))

env = dict(os.environ)
env.update(OMP_NUM_THREADS="8", MKL_NUM_THREADS="8", OPENBLAS_NUM_THREADS="8", MPLBACKEND="Agg")
summary = {"schema_version": 1, "phase": args.phase, "started_utc": datetime.now(timezone.utc).isoformat(),
           "command": sys.argv, "jobs": [], "passed": False}
sources = sorted(set(Path("ame2").rglob("*.py")) | set(Path("scripts").rglob("*.py")) |
                 set(Path("../rsl_rl/rsl_rl").rglob("*.py")))
summary["source_sha256"] = {str(path): hashlib.sha256(path.read_bytes()).hexdigest() for path in sources}
for name, command in jobs:
    log = args.output / f"{name}.log"
    train_manifest = args.output / name / "train_result.json"
    if args.phase == "training":
        train_manifest.parent.mkdir(parents=True, exist_ok=True)
        command += ["--result_json", str(train_manifest)]
    start = time.monotonic()
    print(f"[SUITE] starting {name}; log={log}", flush=True)
    item = {"name": name, "command": command, "log": str(log), "timed_out": False}
    item["source_sha256"] = {str(path): hashlib.sha256(path.read_bytes()).hexdigest() for path in sources}
    training_root = None
    previous_runs = set()
    if args.phase == "training":
        training_root = Path("logs/rsl_rl") / command[command.index("--experiment_name") + 1]
        previous_runs = set(training_root.glob("*"))
    with log.open("w") as handle:
        process = subprocess.Popen(command, stdout=handle, stderr=subprocess.STDOUT, env=env, start_new_session=True)
        try:
            code = process.wait(timeout=args.timeout)
        except subprocess.TimeoutExpired:
            item["timed_out"] = True
            os.killpg(process.pid, signal.SIGINT)
            try:
                code = process.wait(timeout=30)
            except subprocess.TimeoutExpired:
                os.killpg(process.pid, signal.SIGKILL)
                code = process.wait()
    item.update(exit_code=code, wall_seconds=time.monotonic() - start, passed=code == 0 and not item["timed_out"],
                log_sha256=hashlib.sha256(log.read_bytes()).hexdigest())
    report_path = args.output / name / "result.json"
    if report_path.exists():
        result = json.loads(report_path.read_text())
        item["report"] = str(report_path)
        item["passed"] = item["passed"] and bool(result.get("passed"))
    elif args.phase == "tasks" and name != "inventory":
        item["passed"] = False
        item["error"] = "Child returned without the required verification report"
    if args.phase == "training":
        new_runs = sorted(set(training_root.glob("*")) - previous_runs)
        item["new_training_runs"] = [str(path) for path in new_runs]
        item["training_manifest"] = str(train_manifest)
        expected_heads = 1 if name == "single_head_critic" else 23
        expected_iterations = int(command[command.index("--max_iterations") + 1])
        if not train_manifest.is_file():
            item["passed"] = False
            item["error"] = "Training returned without the required result manifest"
        else:
            actual = json.loads(train_manifest.read_text())
            item["training_result"] = actual
            item["passed"] = item["passed"] and actual.get("passed", False)
            item["passed"] = item["passed"] and actual.get("critic_heads") == expected_heads
            item["passed"] = item["passed"] and actual.get("num_envs") == args.num_envs
            item["passed"] = item["passed"] and actual.get("iterations_completed") == expected_iterations
            item["passed"] = item["passed"] and actual.get("final_iteration") == expected_iterations - 1
            for override in command:
                if override.startswith("agent.algorithm.optimizer="):
                    item["passed"] = item["passed"] and actual.get("optimizer") == override.split("=", 1)[1]
                if override.startswith("agent.algorithm.use_mixed_precision="):
                    item["passed"] = item["passed"] and actual.get("use_mixed_precision") == (override.split("=", 1)[1] == "true")
        if len(new_runs) != 1:
            item["passed"] = False
            item["error"] = f"Expected one new training directory, found {len(new_runs)}"
        else:
            audit_dir = args.output / name
            audit_dir.mkdir(parents=True, exist_ok=True)
            if train_manifest.is_file():
                actual = json.loads(train_manifest.read_text())
                item["passed"] = item["passed"] and Path(actual.get("log_dir", "")).resolve() == new_runs[0].resolve()
                item["passed"] = item["passed"] and Path(actual.get("final_checkpoint", "")).is_file()
            audit_path = audit_dir / "checkpoint_audit.json"
            audit_command = [python, "scripts/research/checkpoint_audit.py", str(new_runs[0]),
                             "--tensorboard", "--require_updates", "--expected_heads", str(expected_heads),
                             "--output", str(audit_path)]
            with (audit_dir / "audit.log").open("w") as handle:
                audit = subprocess.run(audit_command, stdout=handle, stderr=subprocess.STDOUT, env=env, timeout=180)
            item["audit_command"] = audit_command
            item["checkpoint_audit"] = str(audit_path)
            item["passed"] = item["passed"] and audit.returncode == 0 and audit_path.exists()
            if audit_path.exists():
                evidence = json.loads(audit_path.read_text())
                item["passed"] = item["passed"] and bool(evidence.get("passed")) and len(evidence.get("runs", [])) == 1
                if evidence.get("runs"):
                    latest = evidence["runs"][0]["checkpoints"][-1]
                    item["passed"] = item["passed"] and latest["iteration"] == expected_iterations - 1
                    if train_manifest.is_file():
                        expected_optimizer = "muon_adamw" if actual.get("optimizer") == "muon" else "adam_family"
                        item["passed"] = item["passed"] and latest["optimizer_kind"] == expected_optimizer
            for configuration in ("env.yaml", "agent.yaml"):
                if not (new_runs[0] / "params" / configuration).is_file():
                    item["passed"] = False
                    item["error"] = f"Missing saved configuration: {configuration}"
    if args.phase == "cli":
        play_report = args.output / name / "play_result.json"
        item["play_report"] = str(play_report)
        if not play_report.is_file():
            item["passed"] = False
            item["error"] = "Child returned without play_result.json"
        else:
            result = json.loads(play_report.read_text())
            expected_steps = int(command[command.index("--video_length") + 1] if "--video_length" in command
                                 else command[command.index("--max_steps") + 1])
            item["passed"] = item["passed"] and result["steps_completed"] == expected_steps
            if "--video" in command:
                item["passed"] = item["passed"] and any((args.output / name / "videos/play").glob("*.mp4"))
            if "--export" in command:
                item["passed"] = item["passed"] and any((args.output / name).glob("*.jit"))
    summary["jobs"].append(item)
    summary["passed"] = all(job["passed"] for job in summary["jobs"])
    (args.output / "summary.json").write_text(json.dumps(summary, indent=2) + "\n")
    print(f"[SUITE] completed {name}; exit={code}; passed={item['passed']}", flush=True)
raise SystemExit(0 if summary["passed"] else 1)
