#!/usr/bin/env python3
"""Synthetic CPU logger integration; this does not train or validate a policy.

Run in the AME2 image with the checkout mounted at /workspace/ame2-minimal:
  /isaac-sim/python.sh container/verify_tensorboard_close.py --report REPORT.json
"""
import argparse
import hashlib
import inspect
import json
import math
import os
from pathlib import Path
import platform
import tempfile
import time

import torch
from torch.utils.tensorboard import SummaryWriter
from tensorboard.backend.event_processing.event_accumulator import EventAccumulator

from rsl_rl.utils.logger import Logger


class ExternalWriter:
    def __init__(self):
        self.stop_calls = 0
        self.close_calls = 0

    def stop(self):
        self.stop_calls += 1

    def close(self):
        self.close_calls += 1


def verify(result, steps):
    # No environment, model, optimizer, simulator or CUDA tensor is created.
    logger = Logger.__new__(Logger)
    logger.writer = None
    logger.stop_logging_writer()
    result["none_writer_unchanged"] = True
    external = {}
    for kind in ("wandb", "neptune"):
        logger.writer = writer = ExternalWriter()
        logger.logger_type = kind
        logger.stop_logging_writer()
        assert writer.stop_calls == 1 and writer.close_calls == 0
        external[kind] = {"stop_calls": writer.stop_calls, "close_calls": writer.close_calls}
    result["external_writer_behavior"] = external

    tags = tuple(f"Loss/{name}" for name in (
        "value", "surrogate", "entropy", "entropy_coef", "symmetry", "auxiliary", "learning_rate"))
    with tempfile.TemporaryDirectory(prefix="ame2-logger-close-") as directory:
        # A long flush interval and large queue exercise the explicit close
        # barrier, independently of the periodic 10-second training flush.
        writer = SummaryWriter(log_dir=directory, max_queue=65536, flush_secs=3600)
        logger.writer = writer
        logger.logger_type = "tensorboard"
        asynchronous = writer.file_writer.event_writer._async_writer
        for step in range(steps):
            for index, tag in enumerate(tags):
                writer.add_scalar(tag, float(step + index), step)
        result["queued_records_before_stop"] = asynchronous._byte_queue.qsize()
        logger.stop_logging_writer()
        result["writer_closed"] = writer.file_writer is None and writer.all_writers is None
        result["worker_stopped"] = not asynchronous._worker.is_alive()
        if not result["writer_closed"]:
            writer.close()  # Clean up a failing regression probe safely.
        assert result["writer_closed"] and result["worker_stopped"], "TensorBoard writer was not closed"
        assert asynchronous._byte_queue.qsize() == 0, "Pending records remained after close"
        logger.stop_logging_writer()  # SummaryWriter.close is idempotent.
        events = EventAccumulator(directory, size_guidance={"scalars": 0}).Reload()
        assert set(events.Tags()["scalars"]) == set(tags)
        result["tags"] = {}
        for index, tag in enumerate(tags):
            values = events.Scalars(tag)
            item = {"count": len(values), "first_step": values[0].step, "last_step": values[-1].step,
                    "steps_contiguous": [value.step for value in values] == list(range(steps)),
                    "finite": all(math.isfinite(value.value) for value in values),
                    "values_match": all(value.value == float(value.step + index) for value in values)}
            result["tags"][tag] = item
            assert item["count"] == steps and item["steps_contiguous"] and item["finite"] and item["values_match"]
        result["event_files"] = [{"name": path.name, "bytes": path.stat().st_size,
                                  "sha256": hashlib.sha256(path.read_bytes()).hexdigest()}
                                 for path in sorted(Path(directory).glob("events.out.tfevents.*"))]
    result["temporary_event_files_removed_after_validation"] = True
    result["cuda_initialized"] = torch.cuda.is_initialized()
    assert not result["cuda_initialized"]
    result["passed"] = True


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--report", type=Path, required=True)
    parser.add_argument("--steps", type=int, default=2000)
    args = parser.parse_args()
    assert 1 <= args.steps <= 8000
    args.report.parent.mkdir(parents=True, exist_ok=True)
    source = Path(inspect.getfile(Logger)).resolve()
    result = {"schema_version": 1, "kind": "synthetic_logger_integration", "passed": False,
              "python": platform.python_version(), "torch": torch.__version__, "steps": args.steps,
              "logger_source": str(source), "logger_source_sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
              "nvidia_visible_devices": os.environ.get("NVIDIA_VISIBLE_DEVICES"),
              "limitations": ["Synthetic scalar logging only; no policy, simulator or training is run.",
                              "This is not evidence for the original 5000-iteration cloud training.",
                              "This changes future processes only; an existing loaded writer is unchanged."]}
    started = time.monotonic()
    try:
        verify(result, args.steps)
    except BaseException as error:
        result["error"] = {"type": type(error).__name__, "message": str(error)}
        raise
    finally:
        result["wall_seconds"] = time.monotonic() - started
        args.report.write_text(json.dumps(result, indent=2, allow_nan=False) + "\n")
        print(json.dumps({"kind": result["kind"], "passed": result["passed"], "report": str(args.report)}), flush=True)
