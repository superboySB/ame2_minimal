#!/usr/bin/env python3
"""Copy real diagnostic PDFs and plot actual Isaac training events inside Docker."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import shutil


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--report-root", type=Path, required=True)
    parser.add_argument("--output", type=Path, default=Path("../usage_assets"))
    parser.add_argument("--training-root", type=Path)
    args = parser.parse_args()
    root = args.report_root.resolve()
    output = args.output.resolve() / "diagnostics"
    output.mkdir(parents=True, exist_ok=True)
    evidence = {"diagnostics": [], "gui": [], "training": []}
    for name in ("reward_curves.pdf", "debug_plots.pdf"):
        source = root / "cli" / "reward_debug_plots" / name
        if source.is_file():
            target = output / name
            shutil.copyfile(source, target)
            evidence["diagnostics"].append({"source": str(source), "source_sha256": sha256(source),
                                             "file": name, "sha256": sha256(target)})
    training_video_report = root / "extras" / "train_video_io" / "train_result.json"
    if training_video_report.is_file():
        result = json.loads(training_video_report.read_text())
        source = Path(result["log_dir"]) / "io_descriptors" / "IO_descriptors.yaml"
        if result.get("passed") is True and source.is_file():
            target = output / "IO_descriptors.yaml"
            shutil.copyfile(source, target)
            evidence["diagnostics"].append({"source": str(source), "source_sha256": sha256(source),
                                             "file": target.name, "sha256": sha256(target),
                                             "report": str(training_video_report),
                                             "report_sha256": sha256(training_video_report)})
    for name, source in (("image_sync.json", root / "image_sync.json"),
                         ("browser_result.json", root / "browser" / "browser_result.json"),
                         ("full_progress.json", root / "cloud_full" / "progress.json")):
        if source.is_file() and (json.loads(source.read_text()).get("passed") is True
                                 or name == "full_progress.json"):
            target = output / name
            shutil.copyfile(source, target)
            evidence["diagnostics"].append({"source": str(source), "source_sha256": sha256(source),
                                             "file": target.name, "sha256": sha256(target)})

    capture = root / "gui-webagg" / "capture.json"
    if capture.is_file() and json.loads(capture.read_text()).get("passed") is True:
        curves = sorted(capture.parent.glob("curve_*.png"))
        if curves:
            source = curves[-1]
            target = output / "hip_acceleration_gui.png"
            shutil.copyfile(source, target)
            evidence["gui"].append({"source": str(source), "source_sha256": sha256(source),
                                    "file": target.name, "sha256": sha256(target),
                                    "capture": str(capture), "capture_sha256": sha256(capture),
                                    "meaning": "Actual rendered WebAgg curve, not independently decoded sensor samples"})
    gui_source = root / "gui-fabric" / "isaac-gui-fabric.png"
    gui_report = gui_source.parent / "play_result.json"
    if gui_source.is_file() and gui_report.is_file():
        target = output / "isaac_gui_g1.png"
        shutil.copyfile(gui_source, target)
        evidence["gui"].append({"source": str(gui_source), "source_sha256": sha256(gui_source),
                                "file": target.name, "sha256": sha256(target),
                                "report": str(gui_report), "report_sha256": sha256(gui_report),
                                "meaning": "Actual X11 Isaac GUI with default Fabric and visible G1"})

    training = (args.training_root or root / "cloud_matrix_final" / "matrix").resolve()
    names = ("base_muon_bf16", "base_adam_fp32", "gaze_muon_bf16", "gaze_adam_fp32")
    complete = all((training / name / "checkpoint_audit.json").is_file() for name in names)
    if complete:
        from tensorboard.backend.event_processing.event_accumulator import EventAccumulator
        import matplotlib
        matplotlib.use("Agg")
        import matplotlib.pyplot as plt

        figure, axes = plt.subplots(1, 3, figsize=(15, 4.6), layout="constrained")
        colors = ("#247ba0", "#70ad47", "#dd6b20", "#a44a9e")
        changes = []
        for name, color in zip(names, colors):
            result_path = training / name / "train_result.json"
            audit_path = training / name / "checkpoint_audit.json"
            result = json.loads(result_path.read_text())
            audit = json.loads(audit_path.read_text())
            if not result["passed"] or not audit["passed"] or result["iterations_completed"] != 3:
                raise ValueError(f"Expected three successfully audited real updates: {result_path}")
            log_dir = Path(result["log_dir"])
            event_files = sorted(log_dir.glob("events.out.tfevents.*"))
            if not event_files:
                raise FileNotFoundError(f"Pull the real TensorBoard events first: {log_dir}")
            accumulator = EventAccumulator(str(log_dir), size_guidance={"scalars": 0}).Reload()
            row = {"name": name, "result": str(result_path), "result_sha256": sha256(result_path),
                   "audit": str(audit_path), "audit_sha256": sha256(audit_path),
                   "events": [{"path": str(path), "sha256": sha256(path)} for path in event_files],
                   "num_envs": result["num_envs"], "seed": result["seed"],
                   "iterations_completed": result["iterations_completed"], "scalars": {}}
            for axis, tag in zip(axes[:2], ("Loss/value", "Loss/surrogate")):
                points = accumulator.Scalars(tag)
                row["scalars"][tag] = [{"step": point.step, "value": point.value} for point in points]
                axis.plot([point.step for point in points], [point.value for point in points],
                          marker="o", label=name, color=color)
            run = next(run for run in audit["runs"] if run["path"] == str(log_dir))
            last = run["checkpoints"][-1]
            row["parameter_change"] = {"first_iteration": run["checkpoints"][0]["iteration"],
                                       "last_iteration": last["iteration"],
                                       "actor": last["actor_change_from_first"],
                                       "critic": last["critic_change_from_first"]}
            changes.append(last["actor_change_from_first"]["max_absolute_parameter_change"])
            evidence["training"].append(row)
        for axis, title in zip(axes[:2], ("Value loss", "PPO surrogate loss")):
            axis.set(title=title, xlabel="PPO update index", ylabel="Recorded scalar", xticks=(0, 1, 2))
            axis.grid(alpha=0.2)
        axes[0].legend(fontsize=8)
        axes[2].bar(range(4), changes, color=colors)
        axes[2].set(title="Actor parameter change", ylabel="Max absolute change: checkpoint 0 to 2",
                    xticks=range(4), xticklabels=("Base\nMuon/bf16", "Base\nAdam/fp32", "Gaze\nMuon/bf16", "Gaze\nAdam/fp32"))
        axes[2].grid(axis="y", alpha=0.2)
        figure.suptitle("Real Isaac training smoke test: 64 envs, seed 42, three PPO updates\n"
                        "Finite updates only; these short traces do not establish convergence or policy quality.",
                        fontsize=13)
        for extension in ("png", "pdf"):
            target = output / f"training_smoke.{extension}"
            figure.savefig(target, dpi=160)
        plt.close(figure)
    else:
        print(f"Training figure deferred: all four fresh audited runs are required under {training}")
    (output / "provenance.json").write_text(json.dumps(evidence, ensure_ascii=False, indent=2) + "\n")
    print(f"Copied {len(evidence['diagnostics'])} real diagnostic artifact(s) and {len(evidence['gui'])} GUI artifact(s); "
          f"plotted {len(evidence['training'])} training run(s)")


if __name__ == "__main__":
    main()
