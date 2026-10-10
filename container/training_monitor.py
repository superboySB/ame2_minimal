#!/usr/bin/env python3
"""Track one official training run without launching or changing its training.

Run inside the research Docker. Completion requires the existing training job's
successful manifest, exit status, checkpoint audit and exact-run validation.
"""

import argparse
import datetime as dt
import hashlib
import json
import math
import os
from pathlib import Path
import re
import statistics
import time

SOURCE_SHA256 = hashlib.sha256(Path(__file__).read_bytes()).hexdigest()


def read_json(path):
    for attempt in range(3):
        try:
            return json.loads(path.read_text())
        except FileNotFoundError:
            return None
        except json.JSONDecodeError:
            if attempt < 2:
                time.sleep(0.05)
    return None


def atomic_json(path, value):
    temporary = path.with_name(f".{path.name}.{os.getpid()}.tmp")
    temporary.write_text(json.dumps(value, indent=2, allow_nan=False) + "\n")
    temporary.replace(path)


def training_processes():
    result = []
    for entry in Path("/proc").iterdir():
        if not entry.name.isdigit():
            continue
        try:
            argv = (entry / "cmdline").read_bytes().decode(errors="replace").split("\0")
            if any(arg.endswith("scripts/rsl_rl/train.py") for arg in argv):
                result.append({"pid_in_container": int(entry.name), "argv": argv[:-1]})
        except (OSError, ProcessLookupError):
            pass
    return result


def final_evidence(report_dir, run_dir, manifest, iterations):
    validation = read_json(report_dir / "validation.json")
    audit = read_json(report_dir / "checkpoint_audit.json")
    job = read_json(report_dir / "job.json")
    if not (validation and audit and job):
        return None
    assert job["exit_code"] == 0 and job["ended_utc"]
    assert validation["passed"] and Path(validation["run"]).resolve() == run_dir
    assert manifest["passed"] and manifest["final_iteration"] == iterations - 1
    assert manifest["iterations_completed"] == manifest["iterations_requested"]
    assert manifest["start_iteration"] + manifest["iterations_completed"] == iterations
    assert manifest["task"] == "Ame2-G1-Gaze" and manifest["num_envs"] == 4096
    assert manifest["optimizer"] == "muon" and manifest["use_mixed_precision"] is True
    assert manifest["critic_heads"] == 23 and manifest["world_size"] == 1
    assert Path(manifest["final_checkpoint"]).resolve() == run_dir / f"model_{iterations - 1}.pt"
    assert Path(manifest["final_checkpoint"]).is_file()
    assert audit["passed"] and len(audit["runs"]) == 1
    run = audit["runs"][0]
    assert Path(run["path"]).resolve() == run_dir and run["updates_proven"]
    expected_iterations = list(range(0, iterations, 200)) + [iterations - 1]
    assert [item["iteration"] for item in run["checkpoints"]] == expected_iterations, "Missing or unexpected saved checkpoint"
    for checkpoint in run["checkpoints"]:
        path = run_dir / f"model_{checkpoint['iteration']}.pt"
        assert Path(checkpoint["path"]).resolve() == path and path.is_file(), "Missing or wrong checkpoint path"
        assert checkpoint["critic_heads"] == 23 and checkpoint["optimizer_kind"] == "muon_adamw", "Unexpected checkpoint architecture or optimizer"
        assert checkpoint["optimizer_state_entries"] > 0, "Missing optimizer state"
    latest = run["checkpoints"][-1]
    assert latest["iteration"] == iterations - 1 and latest["passed"]
    assert latest["critic_heads"] == 23 and latest["optimizer_kind"] == "muon_adamw"
    assert all(item["passed"] and not item["nonfinite_tensors"] for item in run["checkpoints"])
    assert all(latest[key]["changed_tensors"] > 0 for key in ("actor_change_from_first", "critic_change_from_first"))
    assert run["tensorboard"]["passed"]
    tags = run["tensorboard"]["tags"]
    required_losses = {f"Loss/{name}" for name in (
        "value", "surrogate", "entropy", "entropy_coef", "symmetry", "auxiliary", "learning_rate")}
    assert required_losses <= tags.keys(), "Missing required TensorBoard loss tag"
    for name in required_losses:
        value = tags[name]
        assert value["finite"] and value["count"] == iterations and value["first_step"] == 0 and value["last_step"] == iterations - 1, f"Incomplete or nonfinite TensorBoard loss history: {name}"
    assert all(value["finite"] for name, value in tags.items() if name.startswith("Loss/"))
    import yaml
    agent = yaml.safe_load((run_dir / "params/agent.yaml").read_text())
    # Isaac serializes tuples and slices using Python YAML tags. BaseLoader
    # reads only inert strings/lists/maps, without constructing Python objects.
    env = yaml.load((run_dir / "params/env.yaml").read_text(), Loader=yaml.BaseLoader)
    terrain = env["scene"]["terrain"]["terrain_generator"]
    assert int(env["scene"]["num_envs"]) == 4096 and (int(terrain["num_rows"]), int(terrain["num_cols"])) == (10, 60), "Unexpected environment or terrain configuration"
    assert agent["seed"] == 42 and agent["max_iterations"] == iterations, "Unexpected seed or iteration configuration"
    assert agent["algorithm"]["optimizer"] == "muon" and agent["algorithm"]["use_mixed_precision"] is True
    assert agent["algorithm"]["multi_head_critic"] is True and agent["num_steps_per_env"] == 24
    assert agent["actor"]["class_name"] == "AME2GazeModel" and agent["save_interval"] == 200
    return True


def inspect(report_dir, run_dir, iterations, interval=60, terminal_grace=120):
    manifest = read_json(report_dir / "train_result.json")
    assert manifest and Path(manifest["log_dir"]).resolve() == run_dir, "Wrong or missing exact-run manifest"
    text = re.sub(r"\x1b\[[0-9;]*m", "", (report_dir / "driver.log").read_text())
    pattern = r"Learning iteration (\d+)/\d+.*?Mean value loss:\s*(\S+).*?Mean surrogate loss:\s*(\S+).*?Iteration time:\s*([0-9.]+)s"
    rows = [{"iteration": int(a), "value_loss": float(b), "surrogate_loss": float(c), "iteration_seconds": float(d)}
            for a, b, c, d in re.findall(pattern, text, re.S)]
    finite = bool(rows) and all(math.isfinite(row[key]) for row in rows for key in ("value_loss", "surrogate_loss", "iteration_seconds"))
    progress = read_json(report_dir / "progress.json") or {}
    now = dt.datetime.now(dt.timezone.utc)
    checkpoints = sorted(run_dir.glob("model_*.pt"), key=lambda path: int(path.stem.split("_")[-1]))
    processes = training_processes()
    completed = rows[-1]["iteration"] + 1 if rows else manifest.get("start_iteration", 0)
    state = "running" if processes else "finalizing"
    exit_file = report_dir / "exit_code.txt"
    try:
        exit_text = exit_file.read_text().strip()
    except FileNotFoundError:
        exit_text = None
    # Shell redirection creates the file immediately before printf writes it.
    exit_code = int(exit_text) if exit_text else None
    terminal_error = None
    if exit_code is not None:
        state = "failed"
        if exit_code == 0:
            try:
                evidence = final_evidence(report_dir, run_dir, manifest, iterations)
                # The shell trap writes exit_code before job.json. Wait for
                # all evidence, but never interpret missing evidence as success.
                if evidence is None:
                    state = "finalizing" if time.time() - exit_file.stat().st_mtime < terminal_grace else "incomplete"
                elif evidence:
                    state = "completed"
            except AssertionError as error:
                terminal_error = {"type": type(error).__name__, "message": str(error)}
    elif exit_text is not None:
        state = "finalizing" if time.time() - exit_file.stat().st_mtime < terminal_grace else "incomplete"
    elif manifest.get("error"):
        state = "failed"
    elif rows and not finite:
        state = "attention_required"
    elif not processes and not manifest.get("passed") and time.time() - (report_dir / "driver.log").stat().st_mtime > 2 * interval:
        state = "interrupted"
    safe_rows = [{key: str(value) if isinstance(value, float) and not math.isfinite(value) else value
                  for key, value in row.items()} for row in rows[-5:]]
    progress.update(schema_version=1, state=state, completed=state == "completed", as_of_utc=now.isoformat(),
                    max_iterations=iterations, last_completed_iteration=completed - 1, iterations_completed=completed,
                    finite_loss=finite, recent_iterations=safe_rows, training_process_running=bool(processes),
                    training_processes_in_container=processes, log_dir=str(run_dir), exit_code=exit_code,
                    monitor_pid_in_container=os.getpid(), monitor_interval_seconds=interval,
                    monitor_source_sha256=SOURCE_SHA256, terminal_evidence_grace_seconds=terminal_grace)
    if terminal_error:
        progress["terminal_evidence_error"] = terminal_error
    if checkpoints:
        current = checkpoints[-1]
        progress.update(current_checkpoint=str(current), current_checkpoint_bytes=current.stat().st_size,
                        current_checkpoint_finite=None, current_checkpoint_audit=None)
        # Audits are produced explicitly at milestones, never on every poll.
        # A finite older checkpoint cannot prove a newly saved checkpoint.
        for filename in ("initial_checkpoint_audit.json", "checkpoint_0200_audit.json", "checkpoint_audit.json"):
            proof = read_json(report_dir / filename)
            if not proof or not proof.get("passed") or len(proof.get("runs", [])) != 1:
                continue
            audited_run = proof["runs"][0]
            if Path(audited_run["path"]).resolve() != run_dir:
                continue
            for checkpoint in audited_run["checkpoints"]:
                if checkpoint["iteration"] == int(current.stem.split("_")[-1]):
                    progress.update(current_checkpoint_finite=bool(checkpoint["passed"] and not checkpoint["nonfinite_tensors"]),
                                    current_checkpoint_audit=str(report_dir / filename))
    if rows:
        remaining = max(0, iterations - completed) * statistics.mean(row["iteration_seconds"] for row in rows[-10:])
        progress.update(estimated_seconds_remaining=remaining,
                        estimated_finish_utc=(now + dt.timedelta(seconds=remaining)).isoformat(),
                        estimate_basis="last up to 10 completed iteration times; estimate changes during training")
    if state == "completed":
        progress["final_evidence"] = ["train_result.json", "job.json", "exit_code.txt", "validation.json", "checkpoint_audit.json"]
    return progress


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--report", required=True, type=Path)
    parser.add_argument("--run", required=True, type=Path)
    parser.add_argument("--iterations", default=5000, type=int)
    parser.add_argument("--interval", default=60, type=float)
    parser.add_argument("--terminal-grace", default=120, type=float,
                        help="Seconds to wait for final evidence after exit code 0")
    parser.add_argument("--once", action="store_true")
    args = parser.parse_args()
    assert args.interval > 0 and args.iterations > 0 and args.terminal_grace > 0
    args.report = args.report.resolve(); args.run = args.run.resolve()
    while True:
        try:
            progress = inspect(args.report, args.run, args.iterations, args.interval, args.terminal_grace)
            atomic_json(args.report / "progress.json", progress)
        except Exception as error:
            atomic_json(args.report / "monitor_result.json", {"state": "monitor_error", "passed": False,
                        "as_of_utc": dt.datetime.now(dt.timezone.utc).isoformat(),
                        "error": {"type": type(error).__name__, "message": str(error)}})
            raise
        print(json.dumps({key: progress[key] for key in ("as_of_utc", "state", "last_completed_iteration")}), flush=True)
        if progress["state"] in ("completed", "failed", "incomplete", "attention_required", "interrupted"):
            atomic_json(args.report / "monitor_result.json", {"state": progress["state"],
                        "passed": progress["completed"], "as_of_utc": progress["as_of_utc"],
                        "last_completed_iteration": progress["last_completed_iteration"],
                        "run": str(args.run)})
            raise SystemExit(0 if progress["completed"] else 1)
        if args.once:
            break
        time.sleep(args.interval)
