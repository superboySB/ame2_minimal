# Copyright (c) 2022-2026, The Isaac Lab Project Developers (https://github.com/isaac-sim/IsaacLab/blob/main/CONTRIBUTORS.md).
# All rights reserved.
#
# SPDX-License-Identifier: BSD-3-Clause

"""Script to run an environment with random action agent."""

"""Launch Isaac Sim Simulator first."""

import argparse
from collections.abc import Mapping
import os
import sys
import traceback

from isaaclab.app import AppLauncher

parser = argparse.ArgumentParser(description="Random agent for Isaac Lab environments.")
parser.add_argument(
    "--disable_fabric", action="store_true", default=False, help="Disable fabric and use USD I/O operations."
)
parser.add_argument("--num_envs", type=int, default=None, help="Number of environments to simulate.")
parser.add_argument("--task", type=str, default=None, help="Name of the task.")
parser.add_argument("--max_steps", type=int, default=0, help="Stop after this many steps; 0 runs until the app closes.")
AppLauncher.add_app_launcher_args(parser)
args_cli = parser.parse_args()
if args_cli.max_steps < 0:
    parser.error("--max_steps must be non-negative")

# launch omniverse app
app_launcher = AppLauncher(args_cli)
simulation_app = app_launcher.app

"""Rest everything follows."""

import gymnasium as gym
import torch

import isaaclab_tasks  # noqa: F401
from isaaclab_tasks.utils import parse_env_cfg

import ame2.tasks  # noqa: F401


def require_finite(value, name):
    """Check all observation tensors, including nested observation groups."""
    if isinstance(value, torch.Tensor):
        if not torch.isfinite(value).all().item():
            raise FloatingPointError(f"Non-finite {name}")
    elif isinstance(value, Mapping):
        for key, item in value.items():
            require_finite(item, f"{name}.{key}")
    elif isinstance(value, (tuple, list)):
        for index, item in enumerate(value):
            require_finite(item, f"{name}[{index}]")


def main():
    """Random actions agent with Isaac Lab environment."""
    env_cfg = parse_env_cfg(
        args_cli.task, device=args_cli.device, num_envs=args_cli.num_envs, use_fabric=not args_cli.disable_fabric
    )
    env = gym.make(args_cli.task, cfg=env_cfg)

    # print info (this is vectorized environment)
    print(f"[INFO]: Gym observation space: {env.observation_space}")
    print(f"[INFO]: Gym action space: {env.action_space}")
    steps = 0
    try:
        observations, _ = env.reset()
        require_finite(observations, "reset observations")
        while simulation_app.is_running() and (not args_cli.max_steps or steps < args_cli.max_steps):
            with torch.inference_mode():
                actions = 2 * torch.rand(env.action_space.shape, device=env.unwrapped.device) - 1
                require_finite(actions, "actions")
                observations, rewards, _, _, _ = env.step(actions)
                require_finite(observations, "observations")
                require_finite(rewards, "rewards")
                steps += 1
        if args_cli.max_steps and steps != args_cli.max_steps:
            raise RuntimeError(f"Simulator stopped after {steps}/{args_cli.max_steps} requested steps")
        print(f"[AGENT_RESULT] agent=random passed=True steps={steps} finite_actions_rewards_observations=True", flush=True)
    finally:
        env.close()


if __name__ == "__main__":
    try:
        main()
        simulation_app.close()
    except BaseException:
        traceback.print_exc()
        sys.stdout.flush()
        sys.stderr.flush()
        # Kit's fast shutdown may otherwise turn an uncaught failure into exit 0.
        os._exit(1)
