"""CPU-only tests for terminal sampling and first-episode isolation."""

import math
from types import SimpleNamespace
import unittest

import torch

from episode_metrics import FirstEpisodeMetrics, install_reward_snapshot


class FirstEpisodeMetricsTests(unittest.TestCase):
    def record(self, metrics, distance, heading, length, early=False, timeout=False, terms=None):
        metrics.record(torch.tensor([distance]), torch.tensor([heading]), torch.tensor([length]),
                       torch.tensor([early]), torch.tensor([timeout]), terms)

    def test_later_episode_success_cannot_replace_first_failure(self):
        metrics = FirstEpisodeMetrics(1, 0.02)
        self.record(metrics, 3.0, 0.0, 0)
        self.record(metrics, 2.0, 0.0, 3, early=True,
                    terms={"early_gravity": torch.tensor([True])})
        self.record(metrics, 0.1, 0.0, 0)
        self.record(metrics, 0.1, 0.0, 800, timeout=True)
        result = metrics.as_report()["environments"][0]
        self.assertFalse(result["ever_position_goal"])
        self.assertFalse(result["ever_pose_goal"])
        self.assertFalse(result["success"])
        self.assertTrue(result["terminated"])
        self.assertFalse(result["timeout"])
        self.assertEqual(result["episode_length_steps"], 3)
        self.assertEqual(result["minimum_goal_distance_m"], 2.0)
        self.assertEqual(result["terminal_terms"], ["early_gravity"])

    def test_position_and_heading_must_coincide(self):
        metrics = FirstEpisodeMetrics(1, 0.02)
        self.record(metrics, 0.2, 0.6, 1)
        self.record(metrics, 0.8, 0.1, 800, timeout=True)
        result = metrics.as_report()["environments"][0]
        self.assertTrue(result["ever_position_goal"])
        self.assertFalse(result["ever_pose_goal"])
        self.assertFalse(result["success"])

    def test_strict_thresholds_and_wrapped_heading(self):
        metrics = FirstEpisodeMetrics(1, 0.02)
        self.record(metrics, 0.5, 0.0, 1)
        self.record(metrics, 0.2, 0.5, 2)
        self.assertFalse(metrics.as_report()["environments"][0]["ever_pose_goal"])
        self.record(metrics, 0.2, 2 * math.pi + 0.1, 800, timeout=True)
        result = metrics.as_report()["environments"][0]
        self.assertTrue(result["success"])
        self.assertEqual(result["first_pose_goal_step"], 800)
        self.assertAlmostEqual(result["terminal_heading_error_rad"], 0.1, places=5)

    def test_simultaneous_timeout_and_early_is_not_success(self):
        metrics = FirstEpisodeMetrics(1, 0.02)
        self.record(metrics, 0.1, 0.1, 800, early=True, timeout=True,
                    terms={"early_gravity": torch.tensor([True]), "time_out": torch.tensor([True])})
        result = metrics.as_report()["environments"][0]
        self.assertTrue(result["ever_pose_goal"])
        self.assertTrue(result["terminated"])
        self.assertTrue(result["timeout"])
        self.assertFalse(result["censored"])
        self.assertFalse(result["success"])

    def test_unfinished_episode_is_censored_despite_reaching(self):
        metrics = FirstEpisodeMetrics(1, 0.02)
        self.record(metrics, 0.1, 0.1, 3)
        result = metrics.as_report()["environments"][0]
        self.assertTrue(result["ever_pose_goal"])
        self.assertTrue(result["censored"])
        self.assertFalse(result["success"])
        self.assertIsNone(result["terminal_goal_distance_m"])
        self.assertIsNone(result["terminal_heading_error_rad"])
        self.assertEqual(result["duration_seconds"], 0.06)

    def test_environment_masks_freeze_independently(self):
        metrics = FirstEpisodeMetrics(2, 0.02)
        metrics.record(torch.tensor([2.0, 0.2]), torch.zeros(2), torch.tensor([1, 1]),
                       torch.tensor([True, False]), torch.zeros(2, dtype=torch.bool))
        metrics.record(torch.tensor([0.0, 0.1]), torch.zeros(2), torch.tensor([0, 800]),
                       torch.zeros(2, dtype=torch.bool), torch.tensor([False, True]))
        results = metrics.as_report()["environments"]
        self.assertFalse(results[0]["success"])
        self.assertEqual(results[0]["episode_length_steps"], 1)
        self.assertTrue(results[1]["success"])
        self.assertEqual(results[1]["episode_length_steps"], 800)

    def test_hook_snapshots_before_reset_without_changing_reward_or_rng(self):
        rewards = torch.tensor([7.0])

        class FakeRewardManager:
            def compute(self, dt):
                self.last_dt = dt
                return rewards

        manager = FakeRewardManager()
        original_compute = manager.compute
        data = SimpleNamespace(root_pos_w=torch.tensor([[0.0, 0.0, 0.0]]), heading_w=torch.tensor([0.0]))
        command = SimpleNamespace(pos_command_w=torch.tensor([[1.0, 0.0, 0.0]]),
                                  heading_command_w=torch.tensor([-math.pi + 0.1]))
        terms = {"early_gravity": torch.tensor([False]), "time_out": torch.tensor([False])}
        termination = SimpleNamespace(terminated=terms["early_gravity"], time_outs=terms["time_out"],
                                      active_terms=list(terms), get_term=terms.__getitem__)
        raw = SimpleNamespace(reward_manager=manager, scene={"robot": SimpleNamespace(data=data)},
                              command_manager=SimpleNamespace(get_term=lambda name: command),
                              termination_manager=termination, episode_length_buf=torch.tensor([0]))
        metrics = FirstEpisodeMetrics(1, 0.02)
        rng = torch.random.get_rng_state().clone()
        restore = install_reward_snapshot(raw, metrics)
        # Fake physics has advanced into a successful terminal state.
        data.root_pos_w[:] = torch.tensor([[0.9, 0.0, 0.0]])
        data.heading_w[:] = math.pi - 0.1
        raw.episode_length_buf[:] = 800
        terms["time_out"][:] = True
        returned = manager.compute(dt=0.02)
        self.assertIs(returned, rewards)
        self.assertTrue(torch.equal(rng, torch.random.get_rng_state()))
        # Simulate Isaac's subsequent auto-reset: this must not replace the snapshot.
        data.root_pos_w[:] = 99.0
        data.heading_w[:] = 0.0
        raw.episode_length_buf[:] = 0
        result = metrics.as_report()["environments"][0]
        self.assertTrue(result["success"])
        self.assertAlmostEqual(result["terminal_goal_distance_m"], 0.1, places=5)
        self.assertAlmostEqual(result["terminal_heading_error_rad"], 0.2, places=5)
        self.assertEqual(result["episode_length_steps"], 800)
        restore()
        self.assertEqual(manager.compute, original_compute)


if __name__ == "__main__":
    unittest.main()
