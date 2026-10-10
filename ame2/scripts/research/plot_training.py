#!/usr/bin/env python3
"""Export actual TensorBoard scalar curves from one exact training run on CPU.

Inside the existing image (no Isaac SimulationApp required):
  /isaac-sim/python.sh scripts/research/plot_training.py \
    --run logs/rsl_rl/research_official_full/2026-10-10_04-38-09_full \
    --output ../outputs/research/full-curves

Add --expected_last_step 4999 to require all seven project Loss/* tags and
finite samples whose steps equal [0, 1, ..., 4999] exactly, once each in order.
Any additional iteration Loss/* series must meet the same requirement. Missing
tags, gaps, duplicate steps, or later steps fail the gate. This validates the
curves, not checkpoint quality, locomotion success, or paper reproduction.
Without that argument the export is a snapshot.
The output directory must be absent or empty. Events must be a stable local
snapshot: concurrent changes are rejected instead of recording ambiguous hashes.
"""

import argparse
import hashlib
import json
import math
from pathlib import Path
import sys


REQUIRED_LOSS_TAGS = (
    "Loss/value", "Loss/surrogate", "Loss/entropy", "Loss/entropy_coef",
    "Loss/symmetry", "Loss/auxiliary", "Loss/learning_rate",
)


def sha256(path):
    result = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            result.update(chunk)
    return result.hexdigest()


def event_sources(run):
    return [
        {"path": str(path), "name": path.name, "bytes": path.stat().st_size,
         "sha256": sha256(path)}
        for path in sorted(run.glob("events.out.tfevents.*")) if path.is_file()
    ]


def number(value):
    """Keep JSON standards compliant while recording nonfinite scalar failures."""
    value = float(value)
    return value if math.isfinite(value) else None


def scalar_record(samples, tag):
    points = [
        {"step": int(sample.step), "value": number(sample.value),
         "wall_time": number(sample.wall_time)} for sample in samples
    ]
    finite_values = [point["value"] for point in points if point["value"] is not None]
    return {
        "source": "TensorBoard EventAccumulator.Scalars",
        "x_axis": "elapsed_seconds" if tag.endswith("/time") else "iteration",
        "count": len(points), "first": points[0], "last": points[-1],
        "first_step": points[0]["step"], "last_step": points[-1]["step"],
        "minimum_step": min(point["step"] for point in points),
        "maximum_step": max(point["step"] for point in points),
        "minimum_value": min(finite_values) if finite_values else None,
        "maximum_value": max(finite_values) if finite_values else None,
        "finite": len(finite_values) == len(points),
        "nonfinite_count": len(points) - len(finite_values),
        "wall_time_finite": all(point["wall_time"] is not None for point in points),
        "points": points,
    }


def loss_sequence_gate(scalars, expected_last_step):
    requested = expected_last_step is not None
    loss_tags = [tag for tag, record in scalars.items()
                 if tag.startswith("Loss/") and record["x_axis"] == "iteration"]
    missing = sorted(set(REQUIRED_LOSS_TAGS) - set(loss_tags))
    checks = {}
    for tag in loss_tags:
        record = scalars[tag]
        steps = [point["step"] for point in record["points"]]
        end = expected_last_step if requested else record["maximum_step"]
        # Equivalent to steps == list(range(end + 1)), without allocating a
        # potentially large reference sequence from an invalid input step.
        contiguous = len(steps) == end + 1 and all(step == index for index, step in enumerate(steps))
        in_range = {step for step in steps if 0 <= step <= end}
        checks[tag] = {
            "first_step": record["first_step"], "count": record["count"],
            "last_step": record["last_step"], "maximum_step": record["maximum_step"],
            "sequence_expected_last_step": end, "expected_count": end + 1,
            "contiguous_step_sequence": contiguous,
            "duplicate_step_count": len(steps) - len(set(steps)),
            "missing_step_count": end + 1 - len(in_range),
            "out_of_range_step_count": sum(not 0 <= step <= end for step in steps),
            "finite": record["finite"], "wall_time_finite": record["wall_time_finite"],
            "passed": (contiguous and record["finite"] and record["wall_time_finite"]) if requested else None,
        }
    return {
        "requested": requested, "expected_last_step": expected_last_step,
        "scope": "Seven required iteration Loss/* tags plus any additional iteration Loss/* series must each contain exactly steps 0..expected once in order and finite samples; other metrics may log at different frequencies",
        "required_tags": list(REQUIRED_LOSS_TAGS), "missing_required_tags": missing,
        "tags": checks,
        "passed": (not missing and bool(checks) and all(check["passed"] for check in checks.values())) if requested else None,
    }


def select_panels(scalars):
    """Prefer meaningful project diagnostics, retaining every scalar in JSON."""
    specifications = [
        ("Critic loss", "loss", ["Loss/value"]),
        ("PPO surrogate loss", "loss", ["Loss/surrogate"]),
        ("Policy entropy", "entropy", ["Loss/entropy"]),
        ("Other optimization losses", "loss", ["Loss/auxiliary", "Loss/symmetry"]),
        ("Training episode reward", "reward", ["Train/mean_reward"]),
        ("Training episode length", "policy steps", ["Train/mean_episode_length"]),
        ("Training reach EMA (online; not evaluation)", "logged EMA",
         ["Log/SuccessRateReachEMA"]),
        ("Terrain curriculum", "terrain level", ["Curriculum/terrain_levels"]),
        ("Yaw curriculum", "logged yaw limit", ["Curriculum/YawLimit"]),
        ("Goal-cone curriculum", "logged cone angle", ["Curriculum/GoalConeAngle"]),
        ("Mapping-noise curriculum", "logged noise scale", ["Curriculum/TeacherMappingNoise"]),
        ("Policy action standard deviation", "mean std", ["Policy/mean_std"]),
        ("Optimizer learning rate", "learning rate", ["Loss/learning_rate"]),
        ("Training throughput", "transitions / second", ["Perf/total_fps"]),
        ("Time per iteration", "seconds", ["Perf/collection_time", "Perf/learning_time"]),
    ]
    panels = []
    used = set()
    for title, ylabel, preferred in specifications:
        tags = [tag for tag in preferred if tag in scalars]
        if tags:
            panels.append({"title": title, "y_label": ylabel, "tags": tags})
            used.update(tags)
    # Other algorithms may log different loss, curriculum, or performance names.
    # Put each unmatched diagnostic on its own axis so differing units are clear.
    for tag in sorted(scalars):
        if tag not in used and scalars[tag]["x_axis"] == "iteration" and tag.startswith(
            ("Loss/", "Policy/", "Curriculum/", "Perf/")
        ):
            panels.append({"title": tag, "y_label": "logged value", "tags": [tag]})
    return panels


def draw_curves(output, scalars, panels, run, last_iteration, gate):
    import matplotlib
    matplotlib.use("Agg")
    from matplotlib import pyplot as plt

    columns = min(3, len(panels))
    rows = math.ceil(len(panels) / columns)
    fig, axes = plt.subplots(rows, columns, figsize=(5.4 * columns, 3.0 * rows), squeeze=False)
    for ax, panel in zip(axes.flat, panels):
        for tag in panel["tags"]:
            points = scalars[tag]["points"]
            values = [point["value"] if point["value"] is not None else float("nan") for point in points]
            ax.plot([point["step"] for point in points], values, linewidth=1.1, label=tag)
        ax.set_title(panel["title"], fontsize=10)
        ax.set_xlabel("Logged iteration")
        ax.set_ylabel(panel["y_label"])
        ax.ticklabel_format(axis="x", style="plain", useOffset=False)
        ax.grid(alpha=0.25)
        ax.legend(fontsize=7, loc="best")
    for ax in list(axes.flat)[len(panels):]:
        ax.set_visible(False)
    state = "SNAPSHOT: no final-step gate requested"
    if gate["requested"]:
        state = f"Loss-series complete-step gate 0..{gate['expected_last_step']}: {'PASS' if gate['passed'] else 'FAIL'}"
    fig.suptitle(
        f"{run.parent.name} / {run.name}\nActual TensorBoard data; last logged iteration {last_iteration}",
        fontsize=13, y=0.995,
    )
    fig.text(0.5, 0.007,
             f"{state}\nRecorded training diagnostics, not paper success-rate reproduction. "
             "Raw samples; no smoothing or interpolated steps.",
             ha="center", va="bottom", fontsize=9)
    fig.tight_layout(rect=(0, 0.035, 1, 0.965))
    fig.savefig(output / "training_curves.png", dpi=150)
    # Omit a generated date so provenance comes from the exact sources and code.
    fig.savefig(output / "training_curves.svg", metadata={"Date": None})
    plt.close(fig)


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--run", type=Path, required=True, help="Exact run directory; only its direct event files are read")
    parser.add_argument("--output", type=Path, required=True, help="New or empty directory for PNG, SVG, and provenance JSON")
    parser.add_argument("--expected_last_step", type=int,
                        help="Require all 7 project Loss tags and any other iteration Loss series to have finite samples at exactly steps 0..N once each in order")
    args = parser.parse_args(argv)
    run, output = args.run.resolve(), args.output.resolve()
    if not run.is_dir():
        parser.error(f"Run is not a directory: {run}")
    if output.exists() and (not output.is_dir() or any(output.iterdir())):
        parser.error(f"Output must be a new or empty directory: {output}")
    if args.expected_last_step is not None and args.expected_last_step < 0:
        parser.error("--expected_last_step must be nonnegative")
    sources = event_sources(run)
    if not sources:
        parser.error(f"No direct events.out.tfevents.* files in exact run: {run}")

    from tensorboard.backend.event_processing.event_accumulator import EventAccumulator
    accumulator = EventAccumulator(str(run), size_guidance={"scalars": 0}, purge_orphaned_data=True).Reload()
    scalars = {}
    for tag in sorted(accumulator.Tags().get("scalars", [])):
        samples = accumulator.Scalars(tag)
        if samples:
            scalars[tag] = scalar_record(samples, tag)
    if sources != event_sources(run):
        parser.error("Source event files changed while reading; use a stable synced snapshot")
    if not scalars:
        parser.error(f"No scalar samples in exact run: {run}")
    loss_tags = [tag for tag, record in scalars.items()
                 if tag.startswith("Loss/") and record["x_axis"] == "iteration"]
    if not loss_tags:
        parser.error("No iteration-axis Loss/* scalars; cannot validate a training curve")
    last_iteration = max(record["maximum_step"] for record in scalars.values() if record["x_axis"] == "iteration")
    all_finite = all(record["finite"] and record["wall_time_finite"] for record in scalars.values())
    requested = args.expected_last_step is not None
    gate = loss_sequence_gate(scalars, args.expected_last_step)
    valid = all_finite and (not requested or gate["passed"])
    state = "snapshot" if not requested else ("expected_step_sequence_complete" if gate["passed"] else "expected_step_sequence_incomplete")
    panels = select_panels(scalars)
    output.mkdir(parents=True, exist_ok=True)
    draw_curves(output, scalars, panels, run, last_iteration, gate)
    report = {
        "schema_version": 1, "state": state,
        "scope": "TensorBoard curve validation only; no claim of training completion, checkpoint quality, or paper success-rate reproduction",
        "run": {"path": str(run), "name": run.name, "experiment": run.parent.name},
        "code": {"path": str(Path(__file__).resolve()), "sha256": sha256(Path(__file__))},
        "source_events": sources,
        "loader": {"implementation": "tensorboard.backend.event_processing.event_accumulator.EventAccumulator",
                   "scalar_size_guidance": 0, "purge_orphaned_data": True, "direct_event_files_only": True,
                   "stable_source_hashes_checked": True},
        "last_logged_iteration": last_iteration, "scalar_tag_count": len(scalars),
        "all_scalars_finite": all_finite, "expected_last_step_gate": gate,
        "curves_valid": valid, "scalar_tags": scalars,
        "plots": {"panels": panels, "smoothing": "none", "interpolated_samples": False,
                  "elapsed_seconds_tags_excluded_from_iteration_plots": [
                      tag for tag, record in scalars.items() if record["x_axis"] == "elapsed_seconds"],
                  "files": [{"path": name, "bytes": (output / name).stat().st_size,
                             "sha256": sha256(output / name)}
                            for name in ("training_curves.png", "training_curves.svg")]},
    }
    (output / "curves.json").write_text(json.dumps(report, indent=2, allow_nan=False) + "\n")
    print(json.dumps({"output": str(output), "state": state, "last_logged_iteration": last_iteration,
                      "scalar_tag_count": len(scalars), "all_scalars_finite": all_finite,
                      "expected_last_step_gate_passed": gate["passed"], "curves_valid": valid}))
    return 0 if valid else 1


if __name__ == "__main__":
    sys.exit(main())
