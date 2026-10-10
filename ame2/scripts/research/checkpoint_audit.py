#!/usr/bin/env python3
"""Audit trusted local checkpoints and TensorBoard scalars without Isaac Sim.

Run inside the AME2 image, for example:
  /isaac-sim/python.sh scripts/research/checkpoint_audit.py logs/rsl_rl/research_matrix \
    --tensorboard --require_updates --output ../outputs/research/checkpoint_audit.json

Checkpoint files are pickle-based. Only inspect checkpoints from a trusted
source. Gradients are not saved by this project; changed model parameters and
finite optimizer states provide evidence that optimization took place.
"""

import argparse
import hashlib
import json
import math
from pathlib import Path
import re
import sys
import time

import torch


def tensors(value, prefix=""):
    if isinstance(value, torch.Tensor):
        yield prefix, value
    elif isinstance(value, dict):
        for key, item in value.items():
            yield from tensors(item, f"{prefix}.{key}")
    elif isinstance(value, (tuple, list)):
        for index, item in enumerate(value):
            yield from tensors(item, f"{prefix}[{index}]")


def digest(path):
    result = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            result.update(chunk)
    return result.hexdigest()


def changed(first, current):
    changed_tensors = 0
    maximum = 0.0
    for name, tensor in current.items():
        if name not in first or first[name].shape != tensor.shape:
            raise ValueError(f"Model shape changed across checkpoints: {name}")
        difference = float((tensor.float() - first[name].float()).abs().max())
        changed_tensors += difference > 0.0
        maximum = max(maximum, difference)
    return {"changed_tensors": changed_tensors, "max_absolute_parameter_change": maximum}


def audit(path):
    checkpoint = torch.load(path, map_location="cpu", weights_only=False)
    required = ("actor_state_dict", "critic_state_dict", "optimizer_state_dict", "iter")
    missing = set(required) - set(checkpoint)
    if missing:
        raise KeyError(f"Missing checkpoint keys: {sorted(missing)}")
    count = 0
    nonfinite = []
    for name, tensor in tensors(checkpoint):
        count += 1
        if (tensor.is_floating_point() or tensor.is_complex()) and not bool(torch.isfinite(tensor).all()):
            nonfinite.append(name)
    critic = checkpoint["critic_state_dict"]
    head_tensor = critic.get("experts.0.net.4.weight")
    optimizer = checkpoint["optimizer_state_dict"]
    params = optimizer["param_groups"]
    optimizer_kind = "muon_adamw" if any(group.get("use_muon") for group in params) else "adam_family"
    item = {"path": str(path), "sha256": digest(path), "bytes": path.stat().st_size,
            "iteration": int(checkpoint["iter"]), "tensor_count": count, "nonfinite_tensors": nonfinite,
            "actor_parameters": sum(tensor.numel() for tensor in checkpoint["actor_state_dict"].values()),
            "critic_parameters": sum(tensor.numel() for tensor in critic.values()),
            "critic_heads": int(head_tensor.shape[0]) if head_tensor is not None else None,
            "optimizer_kind": optimizer_kind, "optimizer_parameter_groups": len(params),
            "optimizer_state_entries": len(optimizer["state"]), "passed": not nonfinite}
    return item, checkpoint


def scalar_audit(folder):
    from tensorboard.backend.event_processing.event_accumulator import EventAccumulator
    events = EventAccumulator(str(folder), size_guidance={"scalars": 0}).Reload()
    results = {}
    for tag in events.Tags().get("scalars", []):
        values = events.Scalars(tag)
        results[tag] = {"count": len(values), "first_step": values[0].step, "last_step": values[-1].step,
                        "minimum": min(item.value for item in values), "maximum": max(item.value for item in values),
                        "last": values[-1].value, "finite": all(math.isfinite(item.value) for item in values)}
    losses = {tag: values for tag, values in results.items() if tag.startswith("Loss/")}
    return {"tags": results, "loss_tags": sorted(losses),
            "passed": bool(losses) and all(item["finite"] for item in results.values())}


def main(args, report):
    files = set()
    for path in args.paths:
        if path.is_file():
            files.add(path.resolve())
        elif path.is_dir():
            files.update(item.resolve() for item in path.rglob("model_*.pt"))
        else:
            raise FileNotFoundError(path)
    if not files:
        raise FileNotFoundError("No model_*.pt checkpoints found")
    groups = {}
    for path in files:
        groups.setdefault(path.parent, []).append(path)
    for folder, paths in sorted(groups.items()):
        paths.sort(key=lambda path: int(re.search(r"(\d+)\.pt$", path.name)[1]))
        first = None
        run = {"path": str(folder), "checkpoints": [], "passed": True}
        for path in paths:
            item, checkpoint = audit(path)
            if args.expected_heads is not None:
                item["passed"] &= item["critic_heads"] == args.expected_heads
            if first is None:
                first = {key: checkpoint[key] for key in ("actor_state_dict", "critic_state_dict")}
            else:
                item["actor_change_from_first"] = changed(first["actor_state_dict"], checkpoint["actor_state_dict"])
                item["critic_change_from_first"] = changed(first["critic_state_dict"], checkpoint["critic_state_dict"])
            run["checkpoints"].append(item)
            run["passed"] &= item["passed"]
            del checkpoint
        if args.require_updates:
            latest = run["checkpoints"][-1]
            run["updates_proven"] = len(paths) > 1 and all(
                latest.get(key, {}).get("changed_tensors", 0) > 0
                for key in ("actor_change_from_first", "critic_change_from_first"))
            run["passed"] &= run["updates_proven"]
        if args.tensorboard:
            run["tensorboard"] = scalar_audit(folder)
            run["passed"] &= run["tensorboard"]["passed"]
        report["runs"].append(run)
    report["passed"] = all(run["passed"] for run in report["runs"])


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("paths", nargs="+", type=Path)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--tensorboard", action="store_true")
    parser.add_argument("--require_updates", action="store_true")
    parser.add_argument("--expected_heads", type=int)
    args = parser.parse_args()
    torch.set_num_threads(4)
    started = time.monotonic()
    report = {"schema_version": 1, "command": sys.argv, "runs": [], "passed": False,
              "limitations": ["Gradients are not stored in checkpoints and cannot be inspected after saving.",
                              "Finite weights and finite losses do not establish policy quality or convergence."]}
    try:
        main(args, report)
    except BaseException as error:
        report["error"] = {"type": type(error).__name__, "message": str(error)}
        raise
    finally:
        report["wall_seconds"] = time.monotonic() - started
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(json.dumps(report, indent=2) + "\n")
        print(f"[CHECKPOINT_AUDIT] passed={report['passed']} report={args.output}")
    raise SystemExit(0 if report["passed"] else 1)
