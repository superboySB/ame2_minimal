#!/usr/bin/env python3
"""Evaluate an audited model_4999.pt in the existing research Docker.

After the original cloud run has completed and cloud.sh pull has synchronized
its reports and checkpoints, run from /workspace/ame2-minimal/ame2:

  /isaac-sim/python.sh scripts/research/evaluate_final.py \
    --training_report ../outputs/research/reproduce-20261010/cloud_full \
    --output ../outputs/research/reproduce-20261010/full-final-policy

This script never launches training. It refuses unfinished training evidence,
keeps failed evaluation attempts, and separates execution from task success.
"""

import argparse
from datetime import datetime, timezone
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import signal
import subprocess
import sys
import time
import traceback


ROOT = Path(__file__).resolve().parents[3]
PYTHON = "/isaac-sim/python.sh"
TASK = "Ame2-G1-Gaze-Play"


def digest(path):
    value = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            value.update(block)
    return value.hexdigest()


def write_summary(path, result):
    temporary = path.with_suffix(".tmp")
    temporary.write_text(json.dumps(result, indent=2, allow_nan=False) + "\n")
    temporary.replace(path)


def completed_training(report_dir):
    terminal_path = report_dir / "monitor_result.json"
    assert terminal_path.is_file(), "Original training has no completed monitor result yet"
    terminal = json.loads(terminal_path.read_text())
    assert terminal["passed"] and terminal["state"] == "completed", "Original training is not complete"
    manifest = json.loads((report_dir / "train_result.json").read_text())
    checkpoint = Path(manifest["final_checkpoint"]).resolve()
    assert checkpoint.name == "model_4999.pt", "Final checkpoint is not model_4999.pt"
    run = checkpoint.parent
    assert Path(manifest["log_dir"]).resolve() == run, "Manifest belongs to a different run"
    assert Path(terminal["run"]).resolve() == run, "Monitor belongs to a different run"
    spec = importlib.util.spec_from_file_location("training_monitor", ROOT / "container/training_monitor.py")
    monitor = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(monitor)
    assert monitor.final_evidence(report_dir, run, manifest, 5000) is True, "Final training evidence is incomplete"
    audit = json.loads((report_dir / "checkpoint_audit.json").read_text())
    # Verify transferred bytes for the initial/final pair used by the local audit.
    for item in (audit["runs"][0]["checkpoints"][0], audit["runs"][0]["checkpoints"][-1]):
        assert digest(Path(item["path"])) == item["sha256"], "Transferred checkpoint SHA256 mismatch"
    return checkpoint, manifest, audit


def execute(command, log, timeout):
    environment = dict(os.environ, OMP_NUM_THREADS="8", MKL_NUM_THREADS="8", OPENBLAS_NUM_THREADS="8", MPLBACKEND="Agg")
    start = time.monotonic()
    timed_out = False
    with log.open("w") as stream:
        process = subprocess.Popen(command, cwd=ROOT / "ame2", env=environment,
                                   stdout=stream, stderr=subprocess.STDOUT, start_new_session=True)
        try:
            code = process.wait(timeout=timeout)
        except subprocess.TimeoutExpired:
            timed_out = True
            code = stop_child(process, signal.SIGINT, 30)
        except BaseException:
            stop_child(process, signal.SIGTERM, 15)
            raise
    return {"command": command, "exit_code": code, "timed_out": timed_out,
            "wall_seconds": time.monotonic() - start, "log": str(log), "log_sha256": digest(log),
            "passed": code == 0 and not timed_out}


def stop_child(process, first_signal, grace):
    # Each child gets its own session; never signal an unrelated simulator.
    try:
        os.killpg(process.pid, first_signal)
    except ProcessLookupError:
        pass
    try:
        return process.wait(timeout=grace)
    except subprocess.TimeoutExpired:
        try:
            os.killpg(process.pid, signal.SIGKILL)
        except ProcessLookupError:
            pass
        return process.wait()


def quality_summary(result):
    episodes = result["first_episode"]["environments"]
    assert len(episodes) == result["arguments"]["num_envs"], "Incomplete first-episode metrics"
    return {
        "environments": len(episodes),
        "position_goal_ever": sum(item["ever_position_goal"] for item in episodes),
        "pose_goal_ever": sum(item["ever_pose_goal"] for item in episodes),
        "pose_goal_at_timeout_without_early_termination": sum(item["success"] for item in episodes),
        "early_terminations": sum(item["terminated"] for item in episodes),
        "timeouts": sum(item["timeout"] for item in episodes),
        "censored": sum(item["censored"] for item in episodes),
        "definition": result["first_episode"]["success_definition"],
    }


def main(args, summary):
    checkpoint, manifest, remote_audit = completed_training(args.training_report)
    summary["training"] = {
        "report": str(args.training_report), "checkpoint": str(checkpoint), "sha256": digest(checkpoint),
        "final_iteration": manifest["final_iteration"], "iterations_completed": manifest["iterations_completed"],
        "task": manifest["task"], "num_envs": manifest["num_envs"], "critic_heads": manifest["critic_heads"],
        "optimizer": manifest["optimizer"], "world_size": manifest["world_size"],
        "training_checkpoint_audit_sha256": digest(args.training_report / "checkpoint_audit.json"),
        "training_source_manifest_sha256": digest(args.training_report / "source-sha256.txt"),
        "saved_checkpoints_audited": len(remote_audit["runs"][0]["checkpoints"]),
    }
    sources = set((ROOT / "ame2/ame2").rglob("*.py")) | set((ROOT / "ame2/scripts").rglob("*.py"))
    sources |= set((ROOT / "rsl_rl/rsl_rl").rglob("*.py")) | set((ROOT / "container").glob("*.py"))
    summary["evaluation_source_sha256"] = {str(path.relative_to(ROOT)): digest(path) for path in sorted(sources)}
    local_audit = args.output / "local_checkpoint_audit.json"
    job = execute([PYTHON, "scripts/research/checkpoint_audit.py", str(checkpoint.parent / "model_0.pt"),
                   str(checkpoint), "--tensorboard", "--require_updates", "--expected_heads", "23",
                   "--output", str(local_audit)], args.output / "local_checkpoint_audit.log", args.timeout)
    job["name"] = "local_checkpoint_audit"
    summary["jobs"].append(job)
    write_summary(args.output / "summary.json", summary)
    assert job["passed"] and json.loads(local_audit.read_text())["passed"], "Local checkpoint audit failed"

    # Three independently seeded all-terrain trials, plus native/JIT parity on seed42.
    scenarios = [(f"native_seed{seed}", "all", 16, seed, "native", .5, False, False) for seed in args.seeds]
    scenarios.append(("jit_seed42", "all", 16, 42, "jit", .5, False, False))
    scenarios.extend([
        ("rough_video", "rough", 1, 42, "native", .35, True, False),
        ("climb_up_attention_video", "climb_up", 1, 42, "native", .35, True, True),
    ])
    for name, terrain, count, seed, policy, difficulty, video, attention in scenarios:
        report = args.output / name / "result.json"
        report.parent.mkdir()
        command = [PYTHON, "scripts/research/verify.py", "--headless", "--task", TASK,
                   "--terrain", terrain, "--num_envs", str(count), "--steps", "800", "--seed", str(seed),
                   "--difficulty", str(difficulty), "--checkpoint", str(checkpoint), "--policy", policy,
                   "--first_episode", "--report", str(report)]
        if policy == "native":
            command.append("--export_jit")
        if video:
            command.append("--video")
        if attention:
            command.append("--attention")
        print(f"[FINAL_EVAL] {name}", flush=True)
        job = {"name": name, "report": str(report), "command": command,
               "log": str(args.output / f"{name}.log"), "passed": False}
        summary["jobs"].append(job)
        write_summary(args.output / "summary.json", summary)
        try:
            job.update(execute(command, args.output / f"{name}.log", args.timeout))
            if report.exists():
                result = json.loads(report.read_text())
                job["report_sha256"] = digest(report)
                job["passed"] &= bool(result["passed"] and result["steps_completed"] == 800
                                      and result["checkpoint"]["iteration"] == 4999
                                      and result["checkpoint"]["sha256"] == summary["training"]["sha256"])
                if terrain == "all":
                    job["passed"] &= len(result["terrain_names"]) == 16
                if job["passed"]:
                    job["quality"] = quality_summary(result)
                    job["jit_parity"] = result["jit"]
                    job["passed"] &= bool(result["jit"]["passed"])
                    if video:
                        job["passed"] &= bool(result["videos"] and all(Path(path).stat().st_size > 0 for path in result["videos"]))
            else:
                job["passed"] = False
                job["error"] = "Child returned without a result report"
        except BaseException as error:
            job["passed"] = False
            job["error"] = {"type": type(error).__name__, "message": str(error)}
            raise
        finally:
            write_summary(args.output / "summary.json", summary)
    summary["passed"] = all(job["passed"] for job in summary["jobs"])
    summary["execution_checks_passed"] = summary["passed"]
    summary["evaluation_complete"] = summary["passed"]
    summary["ended_utc"] = datetime.now(timezone.utc).isoformat()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--training_report", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--seeds", type=int, nargs="+", default=[42, 43, 44])
    parser.add_argument("--timeout", type=int, default=1200)
    args = parser.parse_args()
    args.training_report = args.training_report.resolve()
    args.output = args.output.resolve()
    if not args.seeds or len(args.seeds) != len(set(args.seeds)) or args.timeout < 1:
        parser.error("Use distinct seeds and a positive timeout")
    if args.output.exists() and any(args.output.iterdir()):
        parser.error("--output must be empty; previous evidence is never overwritten")
    args.output.mkdir(parents=True, exist_ok=True)
    started = time.monotonic()
    summary = {"schema_version": 1, "kind": "official_5000_final_policy_evaluation",
               "started_utc": datetime.now(timezone.utc).isoformat(), "command": sys.argv,
               "passed": False, "execution_checks_passed": False, "evaluation_complete": False, "jobs": [],
               "limitations": ["Execution and numeric checks do not imply reliable task performance.",
                               "First-episode success uses the documented position/heading-at-timeout metric, not a paper benchmark.",
                               "These teacher evaluations use privileged simulated mapping and do not validate real hardware."]}
    try:
        main(args, summary)
    except BaseException as error:
        summary["error"] = {"type": type(error).__name__, "message": str(error), "traceback": traceback.format_exc()}
        raise
    finally:
        summary["wall_seconds"] = time.monotonic() - started
        write_summary(args.output / "summary.json", summary)
        print(f"[FINAL_EVAL] passed={summary['passed']} report={args.output / 'summary.json'}", flush=True)
    raise SystemExit(0 if summary["passed"] else 1)
