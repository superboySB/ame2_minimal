#!/usr/bin/env python3
"""Require evidence from the current training invocation, never old sibling runs."""
import argparse
import json
from pathlib import Path
import subprocess
import sys

import yaml


def validate(run, audit, *, iteration, optimizer="muon", mixed=True, single_head=False):
    run = Path(run)
    if not audit.get("passed") or len(audit.get("runs", [])) != 1:
        raise AssertionError("Checkpoint audit did not prove this one run")
    item = audit["runs"][0]
    latest = item["checkpoints"][-1]
    assert Path(item["path"]).resolve() == run.resolve(), "Audited a different training run"
    assert latest["iteration"] == iteration, (latest["iteration"], iteration)
    assert latest["optimizer_kind"] == ("muon_adamw" if optimizer == "muon" else "adam_family")
    assert latest["critic_heads"] == 1 if single_head else latest["critic_heads"] > 1
    for filename in ("agent.yaml", "env.yaml"):
        assert (run / "params" / filename).is_file(), f"Missing configuration: {filename}"
    config = yaml.safe_load((run / "params/agent.yaml").read_text())
    assert config["algorithm"]["optimizer"] == optimizer
    assert config["algorithm"]["use_mixed_precision"] is mixed
    return {"run": str(run.resolve()), "iteration": iteration, "optimizer": optimizer,
            "mixed_precision": mixed, "critic_heads": latest["critic_heads"], "passed": True}


parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("mode", choices=("capture", "audit", "matrix", "resume-source"))
parser.add_argument("--experiment")
parser.add_argument("--before", type=Path)
parser.add_argument("--summary", type=Path)
parser.add_argument("--report", type=Path)
parser.add_argument("--iteration", type=int)
parser.add_argument("--train_result", type=Path)
args = parser.parse_args()
if args.mode == "capture":
    folder = Path("logs/rsl_rl") / args.experiment
    args.report.write_text(json.dumps([str(item.resolve()) for item in folder.glob("*") if item.is_dir()]) + "\n")
elif args.mode == "audit":
    old = set(json.loads(args.before.read_text()))
    folder = Path("logs/rsl_rl") / args.experiment
    new = sorted({str(item.resolve()) for item in folder.glob("*") if item.is_dir()} - old)
    assert len(new) == 1, f"Expected exactly one new run, found {new}"
    manifest = json.loads(args.train_result.read_text())
    assert manifest["passed"] and manifest["iterations_completed"] == manifest["iterations_requested"]
    assert manifest["final_iteration"] == args.iteration
    assert Path(manifest["log_dir"]).resolve() == Path(new[0]).resolve()
    assert Path(manifest["final_checkpoint"]).is_file()
    if int(manifest.get("world_size", 1)) > 1:
        rank_one = args.train_result.with_name(f"{args.train_result.stem}.rank1.json")
        other = json.loads(rank_one.read_text())
        assert manifest["rank"] == 0 and other["rank"] == 1
        assert int(other["world_size"]) == int(manifest["world_size"]) == 2
        assert other["passed"] and other["final_iteration"] == args.iteration
        assert other["iterations_completed"] == manifest["iterations_completed"]
        assert other["start_iteration"] == manifest["start_iteration"]
        assert Path(other["log_dir"]).resolve() == Path(manifest["log_dir"]).resolve()
    audit_path = args.report.parent / "checkpoint_audit.json"
    subprocess.run(["/isaac-sim/python.sh", "scripts/research/checkpoint_audit.py", new[0], "--tensorboard",
                    "--require_updates", "--output", str(audit_path)], check=True)
    result = validate(new[0], json.loads(audit_path.read_text()), iteration=args.iteration)
    args.report.write_text(json.dumps(result, indent=2) + "\n")
elif args.mode == "matrix":
    summary = json.loads(args.summary.read_text())
    assert summary["passed"] and len(summary["jobs"]) == 5
    result = []
    for job in summary["jobs"]:
        assert job["passed"] and len(job["new_training_runs"]) == 1
        single = job["name"] == "single_head_critic"
        adam = "adam" in job["name"]
        result.append(validate(job["new_training_runs"][0], json.loads(Path(job["checkpoint_audit"]).read_text()),
                               iteration=1 if single else 2, optimizer="adam" if adam else "muon",
                               mixed=not adam, single_head=single))
    args.report.write_text(json.dumps({"passed": True, "runs": result}, indent=2) + "\n")
else:
    summary = json.loads(args.summary.read_text())
    assert summary["passed"]
    job, = [item for item in summary["jobs"] if item["name"] == "gaze_muon_bf16"]
    assert job["passed"] and len(job["new_training_runs"]) == 1
    checkpoint = (Path(job["new_training_runs"][0]) / "model_2.pt").resolve()
    assert checkpoint.is_file()
    print(checkpoint)
