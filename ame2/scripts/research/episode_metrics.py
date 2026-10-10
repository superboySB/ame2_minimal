"""First-episode outcomes sampled after physics and before automatic reset.

This module depends only on PyTorch and the standard library. The optional
Isaac Lab adapter uses the environment's public data and wraps reward compute
without changing its return value or calling observation/command computation.
"""

from __future__ import annotations

import math
from collections.abc import Callable, Mapping

import torch


class FirstEpisodeMetrics:
    """Freeze each environment's metrics when its first done signal arrives."""

    def __init__(
        self,
        num_envs: int,
        step_dt: float,
        device: str | torch.device = "cpu",
        position_threshold_m: float = 0.5,
        heading_threshold_rad: float = 0.5,
    ):
        if num_envs < 1 or not math.isfinite(step_dt) or step_dt <= 0:
            raise ValueError("num_envs and step_dt must be positive")
        if not 0 < position_threshold_m or not 0 < heading_threshold_rad:
            raise ValueError("Goal thresholds must be positive")
        self.num_envs = num_envs
        self.step_dt = step_dt
        self.device = torch.device(device)
        self.position_threshold_m = position_threshold_m
        self.heading_threshold_rad = heading_threshold_rad
        self.completed = torch.zeros(num_envs, dtype=torch.bool, device=self.device)
        self.ever_position_goal = torch.zeros_like(self.completed)
        self.ever_pose_goal = torch.zeros_like(self.completed)
        self.terminated = torch.zeros_like(self.completed)
        self.timeout = torch.zeros_like(self.completed)
        self.length_steps = torch.zeros(num_envs, dtype=torch.long, device=self.device)
        self.minimum_distance = torch.full((num_envs,), float("inf"), device=self.device)
        self.last_distance = torch.full_like(self.minimum_distance, float("nan"))
        self.last_heading = torch.full_like(self.minimum_distance, float("nan"))
        self.first_position_step = torch.full_like(self.length_steps, -1)
        self.first_pose_step = torch.full_like(self.length_steps, -1)
        self.terminal_terms: dict[str, torch.Tensor] = {}

    def _vector(self, value: torch.Tensor, name: str, dtype: torch.dtype) -> torch.Tensor:
        value = torch.as_tensor(value, device=self.device, dtype=dtype).reshape(-1)
        if value.numel() != self.num_envs:
            raise ValueError(f"{name} must contain {self.num_envs} elements")
        return value

    @torch.no_grad()
    def record(
        self,
        distance_m: torch.Tensor,
        heading_error_rad: torch.Tensor,
        episode_length_steps: torch.Tensor,
        terminated: torch.Tensor,
        timeouts: torch.Tensor,
        termination_terms: Mapping[str, torch.Tensor] | None = None,
    ) -> None:
        """Record one pre-reset state, including the terminal physics step.

        A length-zero initial observation is allowed. Inputs for environments
        that already completed their first episode are ignored. Position and
        heading must satisfy their thresholds in the *same* sample for a pose
        goal. Early termination and timeout are retained independently.
        """
        active = ~self.completed
        distance = self._vector(distance_m, "distance_m", torch.float32)
        heading = self._vector(heading_error_rad, "heading_error_rad", torch.float32)
        length = self._vector(episode_length_steps, "episode_length_steps", torch.long)
        early = self._vector(terminated, "terminated", torch.bool)
        timeout = self._vector(timeouts, "timeouts", torch.bool)
        if not bool(torch.isfinite(distance[active]).all() & torch.isfinite(heading[active]).all()):
            raise ValueError("Active first-episode distances and headings must be finite")
        if bool(((length < self.length_steps) & active).any()):
            raise ValueError("First-episode step count decreased before a done snapshot")
        heading = torch.remainder(heading + math.pi, 2 * math.pi) - math.pi
        position_goal = distance < self.position_threshold_m
        pose_goal = position_goal & (heading.abs() < self.heading_threshold_rad)
        first_position = active & position_goal & ~self.ever_position_goal
        first_pose = active & pose_goal & ~self.ever_pose_goal
        self.first_position_step[first_position] = length[first_position]
        self.first_pose_step[first_pose] = length[first_pose]
        self.ever_position_goal |= active & position_goal
        self.ever_pose_goal |= active & pose_goal
        self.minimum_distance[active] = torch.minimum(self.minimum_distance[active], distance[active])
        self.last_distance[active] = distance[active]
        self.last_heading[active] = heading[active]
        self.length_steps[active] = length[active]
        finished = active & (early | timeout)
        self.terminated[finished] = early[finished]
        self.timeout[finished] = timeout[finished]
        for name, values in (termination_terms or {}).items():
            flags = self._vector(values, name, torch.bool)
            if name not in self.terminal_terms:
                self.terminal_terms[name] = torch.zeros_like(self.completed)
            self.terminal_terms[name][finished] = flags[finished]
        self.completed |= finished

    def as_report(self) -> dict:
        """Return JSON-compatible first-episode evidence; unfinished is censored."""
        position_goal = self.last_distance < self.position_threshold_m
        pose_goal = position_goal & (self.last_heading.abs() < self.heading_threshold_rad)
        success = self.completed & self.timeout & ~self.terminated & pose_goal
        environments = []
        for i in range(self.num_envs):
            complete = bool(self.completed[i])
            first_position = int(self.first_position_step[i])
            first_pose = int(self.first_pose_step[i])
            environments.append({
                "env_id": i,
                "ever_position_goal": bool(self.ever_position_goal[i]),
                "ever_pose_goal": bool(self.ever_pose_goal[i]),
                "success": bool(success[i]),
                "terminated": bool(self.terminated[i]),
                "timeout": bool(self.timeout[i]),
                "censored": not complete,
                "episode_length_steps": int(self.length_steps[i]),
                "duration_seconds": int(self.length_steps[i]) * self.step_dt,
                "minimum_goal_distance_m": float(self.minimum_distance[i]),
                "first_position_goal_step": first_position if first_position >= 0 else None,
                "first_pose_goal_step": first_pose if first_pose >= 0 else None,
                "terminal_goal_distance_m": float(self.last_distance[i]) if complete else None,
                "terminal_heading_error_rad": float(self.last_heading[i]) if complete else None,
                "terminal_position_goal": bool(position_goal[i]) if complete else None,
                "terminal_pose_goal": bool(pose_goal[i]) if complete else None,
                "last_observed_goal_distance_m": float(self.last_distance[i]),
                "last_observed_heading_error_rad": float(self.last_heading[i]),
                "terminal_terms": [name for name, flags in self.terminal_terms.items() if bool(flags[i])],
            })
        return {
            "scope": "initial reset through first terminated-or-timeout state, inclusive",
            "sampling_phase": "after physics/reward computation and before automatic reset",
            "position_threshold_m": self.position_threshold_m,
            "heading_threshold_rad": self.heading_threshold_rad,
            "success_definition": (
                "First episode ends with timeout=true and terminated=false, and its pre-reset "
                "terminal planar goal distance is <0.5m and absolute wrapped heading error is <0.5rad. "
                "Censored episodes are not successful. This tests the terminal pose, not a dwell-time requirement."
                if self.position_threshold_m == 0.5 and self.heading_threshold_rad == 0.5 else
                "First episode ends by timeout without early termination and its pre-reset terminal "
                "position and heading satisfy the reported strict thresholds; censored is not successful."
            ),
            "duration_definition": "Elapsed first-episode simulation time; censored episodes show observed time only.",
            "environments": environments,
            "summary": {
                "num_environments": self.num_envs,
                "ever_position_goal": sum(item["ever_position_goal"] for item in environments),
                "ever_pose_goal": sum(item["ever_pose_goal"] for item in environments),
                "successes": sum(item["success"] for item in environments),
                "terminated": sum(item["terminated"] for item in environments),
                "timeouts": sum(item["timeout"] for item in environments),
                "censored": sum(item["censored"] for item in environments),
            },
        }


def install_reward_snapshot(raw, metrics: FirstEpisodeMetrics) -> Callable[[], None]:
    """Install an evaluation-only hook and return its cleanup function.

    Isaac Lab 2.3.2 manager_based_rl_env.py computes termination flags at lines
    203-206 and rewards at 208, then resets at 219-221. Sampling after the
    original reward compute captures terminal physics state before curriculum,
    reset, and command resampling. World goal/heading are used because the
    command's body-frame cached error is refreshed only at line 232.

    Install after the RSL wrapper's initial reset. No additional observations,
    command computations, resets, random samples, or physics steps are made.
    """
    manager = raw.reward_manager
    original_compute = manager.compute
    robot = raw.scene["robot"]
    command = raw.command_manager.get_term("base_pose")

    def snapshot(initial: bool = False) -> None:
        distance = (command.pos_command_w[:, :2] - robot.data.root_pos_w[:, :2]).norm(dim=-1)
        heading = command.heading_command_w - robot.data.heading_w
        zeros = torch.zeros_like(raw.episode_length_buf, dtype=torch.bool)
        term_manager = raw.termination_manager
        metrics.record(
            distance, heading, raw.episode_length_buf,
            zeros if initial else term_manager.terminated,
            zeros if initial else term_manager.time_outs,
            None if initial else {name: term_manager.get_term(name) for name in term_manager.active_terms},
        )

    if bool((raw.episode_length_buf != 0).any()):
        raise ValueError("First-episode metrics must start immediately after the initial reset")
    snapshot(initial=True)

    def compute_with_snapshot(*args, **kwargs):
        reward = original_compute(*args, **kwargs)
        snapshot()
        return reward

    manager.compute = compute_with_snapshot

    def restore() -> None:
        if manager.compute is compute_with_snapshot:
            manager.compute = original_compute

    return restore
