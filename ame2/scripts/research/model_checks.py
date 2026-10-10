#!/usr/bin/env python3
"""Check both teacher actors' JIT exports after stochastic sampling, without Isaac.

Inputs are synthetic. This regression checks the public export API after a
training-style forward initializes torch.distributions.Normal; simulator and
trained-policy quality checks belong to verify.py and the training suite.
"""

import argparse
import json
from pathlib import Path
import sys
import time

import torch
from tensordict import TensorDict

from rsl_rl.models.AME2_models import AME2GazeModel, AME2Model


def main(args, report):
    torch.manual_seed(42)
    torch.set_num_threads(4)
    grid = torch.stack(torch.meshgrid(torch.linspace(-0.5, 1.5, 26), torch.linspace(-0.56, 0.56, 15),
                                    indexing="ij"), dim=-1)
    mapping = torch.cat([grid, torch.randn(26, 15, 1) * 0.1], dim=-1).unsqueeze(0).repeat(2, 1, 1, 1)
    obs = TensorDict({"teacher_mapping": mapping.to(args.device),
                      "teacher_prop": torch.randn(2, 82, device=args.device)}, batch_size=[2])
    for cls in (AME2Model, AME2GazeModel):
        actor = cls(obs, {"actor": ["teacher_mapping", "teacher_prop"]}, "actor", 23,
                    stochastic=True, noise_std_type="log").to(args.device).eval()
        with torch.inference_mode():
            sampled = actor(obs, stochastic_output=True)
            native, attention = actor(obs, return_attention=True)
        if not isinstance(actor.distribution, torch.distributions.Normal):
            raise AssertionError("Stochastic forward did not initialize Normal")
        path = args.report.parent / f"{cls.__name__}_after_stochastic.jit"
        scripted = torch.jit.freeze(torch.jit.script(actor.as_jit().cpu().eval()))
        scripted.save(str(path))
        reloaded = torch.jit.load(str(path), map_location=args.device).eval()
        with torch.inference_mode():
            output = reloaded(obs["teacher_prop"], obs["teacher_mapping"])[0]
        torch.testing.assert_close(output, native, rtol=1e-4, atol=1e-5)
        for tensor in (sampled, native, attention, output):
            if not bool(torch.isfinite(tensor).all()):
                raise AssertionError("Non-finite model output")
        report["models"].append({"class": cls.__name__, "actions_shape": list(output.shape),
                                 "attention_shape": list(attention.shape), "export": str(path),
                                 "normal_initialized_before_export": True,
                                 "max_absolute_action_error": float((output - native).abs().max()), "passed": True})
    report["passed"] = True


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--device", default="cpu")
    parser.add_argument("--report", type=Path, required=True)
    args = parser.parse_args()
    args.report.parent.mkdir(parents=True, exist_ok=True)
    started = time.monotonic()
    report = {"schema_version": 1, "command": sys.argv, "input_kind": "synthetic", "device": args.device,
              "torch": torch.__version__, "models": [], "passed": False}
    try:
        main(args, report)
    except BaseException as error:
        report["error"] = {"type": type(error).__name__, "message": str(error)}
        raise
    finally:
        report["wall_seconds"] = time.monotonic() - started
        args.report.write_text(json.dumps(report, indent=2) + "\n")
        print(f"[MODEL_CHECKS] passed={report['passed']} report={args.report}")
