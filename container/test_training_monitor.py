#!/usr/bin/env python3
"""CPU contracts for the independent training monitor; run inside the image."""
import argparse
import importlib.util
import json
import os
from pathlib import Path
import tempfile
import time
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location("training_monitor", Path(__file__).with_name("training_monitor.py"))
monitor = importlib.util.module_from_spec(spec)
spec.loader.exec_module(monitor)


class MonitorContract(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.report = Path(self.temporary.name) / "report"
        self.run = Path(self.temporary.name) / "run"
        self.report.mkdir(); (self.run / "params").mkdir(parents=True)
        self.manifest = {"log_dir": str(self.run), "passed": False, "start_iteration": 0}
        self.write("train_result.json", self.manifest)
        (self.report / "driver.log").write_text("Learning iteration 0/5000\nMean value loss: 0.01\nMean surrogate loss: -0.02\nIteration time: 6.5s\nLearning iteration 1/5000\n")
        self.process_patch = patch.object(monitor, "training_processes", return_value=[{"pid_in_container": 123}])
        self.process_patch.start(); self.addCleanup(self.process_patch.stop)

    def write(self, name, value):
        (self.report / name).write_text(json.dumps(value))

    def complete(self):
        checkpoint = self.run / "model_4999.pt"
        checkpoints = []
        for iteration in list(range(0, 5000, 200)) + [4999]:
            path = self.run / f"model_{iteration}.pt"
            path.touch()
            checkpoints.append({"path": str(path), "iteration": iteration, "passed": True,
                "nonfinite_tensors": [], "critic_heads": 23, "optimizer_kind": "muon_adamw",
                "optimizer_state_entries": 143})
        checkpoints[-1].update(actor_change_from_first={"changed_tensors": 2}, critic_change_from_first={"changed_tensors": 2})
        self.manifest.update(passed=True, final_iteration=4999, iterations_completed=5000,
                             iterations_requested=5000, task="Ame2-G1-Gaze", num_envs=4096,
                             optimizer="muon", use_mixed_precision=True, critic_heads=23,
                             world_size=1, final_checkpoint=str(checkpoint))
        self.write("train_result.json", self.manifest)
        self.write("job.json", {"exit_code": 0, "ended_utc": "2026-10-10T14:00:00+00:00"})
        self.write("validation.json", {"passed": True, "run": str(self.run)})
        loss_tags = {f"Loss/{name}": {"finite": True, "count": 5000, "first_step": 0, "last_step": 4999}
                     for name in ("value", "surrogate", "entropy", "entropy_coef", "symmetry", "auxiliary", "learning_rate")}
        self.audit = {"passed": True, "runs": [{"path": str(self.run), "updates_proven": True,
            "checkpoints": checkpoints,
            "tensorboard": {"passed": True, "tags": loss_tags}}]}
        self.write("checkpoint_audit.json", self.audit)
        (self.report / "exit_code.txt").write_text("0\n")
        (self.run / "params/agent.yaml").write_text("seed: 42\nmax_iterations: 5000\nalgorithm:\n  optimizer: muon\n  use_mixed_precision: true\n  multi_head_critic: true\nnum_steps_per_env: 24\nactor:\n  class_name: AME2GazeModel\nsave_interval: 200\n")
        (self.run / "params/env.yaml").write_text("viewer:\n  eye: !!python/tuple [1, 2, 3]\nslice: !!python/object/apply:builtins.slice [0, 1, 1]\nscene:\n  num_envs: 4096\n  terrain:\n    terrain_generator:\n      num_rows: 10\n      num_cols: 60\n")

    def test_running_manifest_and_partial_iteration(self):
        progress = monitor.inspect(self.report, self.run, 5000)
        self.assertEqual((progress["state"], progress["iterations_completed"]), ("running", 1))
        self.assertTrue(progress["finite_loss"])

    def test_nonzero_exit(self):
        (self.report / "exit_code.txt").write_text("1")
        self.assertEqual(monitor.inspect(self.report, self.run, 5000)["state"], "failed")

    def test_missing_final_evidence_grace(self):
        self.complete(); (self.report / "job.json").unlink()
        self.assertEqual(monitor.inspect(self.report, self.run, 5000)["state"], "finalizing")
        os.utime(self.report / "exit_code.txt", (time.time() - 121,) * 2)
        self.assertEqual(monitor.inspect(self.report, self.run, 5000)["state"], "incomplete")

    def test_empty_exit_file_during_shell_redirection(self):
        (self.report / "exit_code.txt").touch()
        self.assertEqual(monitor.inspect(self.report, self.run, 5000)["state"], "finalizing")
        os.utime(self.report / "exit_code.txt", (time.time() - 121,) * 2)
        self.assertEqual(monitor.inspect(self.report, self.run, 5000)["state"], "incomplete")

    def test_complete_with_inert_isaac_yaml(self):
        self.complete()
        progress = monitor.inspect(self.report, self.run, 5000)
        self.assertEqual(progress["state"], "completed")
        self.assertTrue(progress["current_checkpoint_finite"])

    def test_incorrect_final_loss_step(self):
        self.complete()
        self.audit["runs"][0]["tensorboard"]["tags"]["Loss/value"]["last_step"] = 4998
        self.write("checkpoint_audit.json", self.audit)
        self.assertEqual(monitor.inspect(self.report, self.run, 5000)["state"], "failed")

    def test_missing_loss_tag(self):
        self.complete()
        del self.audit["runs"][0]["tensorboard"]["tags"]["Loss/learning_rate"]
        self.write("checkpoint_audit.json", self.audit)
        self.assertEqual(monitor.inspect(self.report, self.run, 5000)["state"], "failed")

    def test_incomplete_loss_record_count(self):
        self.complete()
        self.audit["runs"][0]["tensorboard"]["tags"]["Loss/surrogate"]["count"] = 4999
        self.write("checkpoint_audit.json", self.audit)
        self.assertEqual(monitor.inspect(self.report, self.run, 5000)["state"], "failed")

    def test_nonzero_loss_start(self):
        self.complete()
        self.audit["runs"][0]["tensorboard"]["tags"]["Loss/entropy"]["first_step"] = 1
        self.write("checkpoint_audit.json", self.audit)
        self.assertEqual(monitor.inspect(self.report, self.run, 5000)["state"], "failed")

    def test_missing_saved_checkpoint(self):
        self.complete()
        self.audit["runs"][0]["checkpoints"].pop(1)
        self.write("checkpoint_audit.json", self.audit)
        self.assertEqual(monitor.inspect(self.report, self.run, 5000)["state"], "failed")

    def test_missing_checkpoint_file(self):
        self.complete(); (self.run / "model_200.pt").unlink()
        self.assertEqual(monitor.inspect(self.report, self.run, 5000)["state"], "failed")

    def test_wrong_saved_optimizer(self):
        self.complete()
        self.audit["runs"][0]["checkpoints"][1]["optimizer_kind"] = "adam_family"
        self.write("checkpoint_audit.json", self.audit)
        self.assertEqual(monitor.inspect(self.report, self.run, 5000)["state"], "failed")

    def test_wrong_seed(self):
        self.complete()
        path = self.run / "params/agent.yaml"
        path.write_text(path.read_text().replace("seed: 42", "seed: 43"))
        self.assertEqual(monitor.inspect(self.report, self.run, 5000)["state"], "failed")

    def test_wrong_terrain_same_tile_count(self):
        self.complete()
        path = self.run / "params/env.yaml"
        path.write_text(path.read_text().replace("num_rows: 10", "num_rows: 30").replace("num_cols: 60", "num_cols: 20"))
        self.assertEqual(monitor.inspect(self.report, self.run, 5000)["state"], "failed")

    def test_wrong_configured_iterations(self):
        self.complete()
        path = self.run / "params/agent.yaml"
        path.write_text(path.read_text().replace("max_iterations: 5000", "max_iterations: 4000"))
        self.assertEqual(monitor.inspect(self.report, self.run, 5000)["state"], "failed")

    def test_nonfinite_loss_valid_json(self):
        log = self.report / "driver.log"
        log.write_text(log.read_text().replace("0.01", "nan"))
        progress = monitor.inspect(self.report, self.run, 5000)
        self.assertEqual(progress["state"], "attention_required")
        json.dumps(progress, allow_nan=False)

    def test_wrong_run_rejected(self):
        self.manifest["log_dir"] = str(self.run / "different")
        self.write("train_result.json", self.manifest)
        with self.assertRaises(AssertionError):
            monitor.inspect(self.report, self.run, 5000)

    def test_older_audit_does_not_prove_current_checkpoint(self):
        self.complete()
        (self.report / "exit_code.txt").unlink()
        (self.run / "model_5000.pt").touch()
        self.assertIsNone(monitor.inspect(self.report, self.run, 5000)["current_checkpoint_finite"])


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    result = unittest.TextTestRunner(verbosity=2).run(unittest.defaultTestLoader.loadTestsFromTestCase(MonitorContract))
    if args.output:
        monitor.atomic_json(args.output, {"schema_version": 1, "name": "training_monitor_contract",
                            "passed": result.wasSuccessful(), "tests_run": result.testsRun,
                            "checks": sorted(name for name in dir(MonitorContract) if name.startswith("test_")),
                            "monitor_source_sha256": monitor.SOURCE_SHA256})
    raise SystemExit(0 if result.wasSuccessful() else 1)
