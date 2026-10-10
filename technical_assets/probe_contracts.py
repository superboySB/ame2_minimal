#!/usr/bin/env python3
"""Read trusted AME2 checkpoint/JIT formats on CPU, without SimulationApp.

The JIT must first be exported using note.md. This checks serialized tensor
contracts with synthetic inputs; it does not measure locomotion quality.
"""

import argparse
import hashlib
import json
from pathlib import Path

import numpy as np
import torch


def digest(path):
    result = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            result.update(chunk)
    return result.hexdigest()


def tensor_info(tensor):
    return {"shape": list(tensor.shape), "dtype": str(tensor.dtype),
            "finite": bool(torch.isfinite(tensor).all())}


def examples(state):
    keys = list(state)
    selected = keys[:3] + [key for key in keys if key.endswith("std") or key.startswith("output_mlp")][-3:]
    return {key: tensor_info(state[key]) for key in dict.fromkeys(selected)}


def probe(root, checkpoint_path, jit_path):
    # Only inspect trusted pickle-based checkpoints from this project.
    checkpoint = torch.load(checkpoint_path, map_location="cpu", weights_only=False)
    policy = torch.jit.load(str(jit_path), map_location="cpu").eval()
    prop = torch.zeros(2, 82, dtype=torch.float32)
    mapping = torch.zeros(2, 26, 15, 3, dtype=torch.float32)
    with torch.inference_mode():
        outputs = policy(prop, mapping)
        gaze = policy.forward_with_gaze(prop, mapping) if hasattr(policy, "forward_with_gaze") else None
    directions_path = root / "ame2/ame2/sensors/mid360_raydirs.npy"
    directions = np.load(directions_path, allow_pickle=False)
    norms = np.linalg.norm(directions, axis=-1)

    def relative(path):
        return path.resolve().relative_to(root).as_posix()

    return {
        "schema_version": 1, "evidence_kind": "Docker_CPU_artifact_contract_probe",
        "scope": "Synthetic zero inputs verify serialized signatures and tensor formats, not rollout quality.",
        "checkpoint": {
            "path": relative(checkpoint_path), "sha256": digest(checkpoint_path), "keys": list(checkpoint),
            "iteration": checkpoint["iter"], "actor_examples": examples(checkpoint["actor_state_dict"]),
            "critic_examples": examples(checkpoint["critic_state_dict"]),
            "actor_tensor_dtypes": sorted({str(value.dtype) for value in checkpoint["actor_state_dict"].values()
                                           if isinstance(value, torch.Tensor)}),
            "optimizer_keys": list(checkpoint["optimizer_state_dict"]),
            "optimizer_groups": [
                {key: value for key, value in group.items() if key != "params"}
                | {"parameter_count": len(group["params"])}
                for group in checkpoint["optimizer_state_dict"]["param_groups"]],
        },
        "jit": {
            "path": relative(jit_path), "sha256": digest(jit_path), "forward_schema": str(policy.forward.schema),
            "input_shapes": {"prop": list(prop.shape), "teacher_mapping": list(mapping.shape)},
            "outputs": [tensor_info(value) for value in outputs],
            "forward_with_gaze_schema": str(policy.forward_with_gaze.schema) if gaze is not None else None,
            "gaze_outputs": [tensor_info(value) for value in gaze] if gaze is not None else None,
        },
        "mid360_directions": {
            "path": relative(directions_path), "sha256": digest(directions_path),
            "shape": list(directions.shape), "dtype": str(directions.dtype),
            "norm_min": float(norms.min()), "norm_max": float(norms.max()),
            "contains_measured_ranges_or_labels": False,
        },
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo-root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--checkpoint", type=Path, default=Path("modelzoo/g1_gaze_64000env_10h/model_2400.pt"))
    parser.add_argument("--jit", type=Path, required=True)
    parser.add_argument("--output", type=Path, default=Path("technical_assets/contracts.json"))
    parser.add_argument("--check", action="store_true", help="Compare with the saved report without writing")
    args = parser.parse_args()
    root = args.repo_root.resolve()
    paths = [path if path.is_absolute() else root / path for path in (args.checkpoint, args.jit, args.output)]
    torch.set_num_threads(4)
    result = probe(root, paths[0], paths[1])
    if args.check:
        expected = json.loads(paths[2].read_text())
        # Older evidence also records a collection timestamp; the format is invariant.
        expected.pop("collected_utc", None)
        if json.loads(json.dumps(result, allow_nan=False)) != expected:
            raise SystemExit("Artifact contract mismatch")
        print(f"Artifact contracts match: {paths[2]}")
    else:
        paths[2].write_text(json.dumps(result, indent=2, ensure_ascii=False, allow_nan=False) + "\n")
        print(f"Artifact contracts written: {paths[2]}")
