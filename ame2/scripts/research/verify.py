#!/usr/bin/env python3
"""Bounded Isaac Lab checks with JSON evidence; run with the container Python.

Examples (from /workspace/ame2-minimal/ame2):
  /isaac-sim/python.sh scripts/research/verify.py --headless --terrain all --steps 100
  /isaac-sim/python.sh scripts/research/verify.py --headless --terrain stones \
    --checkpoint ../modelzoo/g1_gaze_64000env_10h/model_2400.pt --steps 800 --video --export_jit

Passing the checks means that the simulator and policy execute with finite
tensors. Goal-reaching and termination outcomes are reported separately; a
short rollout is not evidence of successful training or reliable locomotion.
"""

import argparse
from pathlib import Path

from isaaclab.app import AppLauncher

parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
parser.add_argument("--task", default="Ame2-G1-Gaze-Play")
parser.add_argument("--terrain", default="all", help="all, default, or a sub-terrain name")
parser.add_argument("--difficulty", type=float, default=0.5)
parser.add_argument("--num_envs", type=int, default=16)
parser.add_argument("--steps", type=int, default=100)
parser.add_argument("--seed", type=int, default=42)
parser.add_argument("--checkpoint", type=Path)
parser.add_argument("--policy", choices=("auto", "zero", "random", "native", "jit"), default="auto")
parser.add_argument("--export_jit", action="store_true", help="Script, freeze, reload, and compare the actor")
parser.add_argument("--video", action="store_true")
parser.add_argument("--attention", action="store_true", help="Draw native actor attention over the height scan")
parser.add_argument("--mid360", action="store_true", help="Check raw Mid360 raycasting without the unreleased neural mapper")
parser.add_argument("--report", type=Path, default=Path("logs/research/verify.json"))
AppLauncher.add_app_launcher_args(parser)
args = parser.parse_args()
if args.steps < 1 or args.num_envs < 1 or not 0.0 <= args.difficulty <= 1.0:
    parser.error("steps/num_envs must be positive and difficulty must lie in [0, 1]")
if args.video:
    args.enable_cameras = True
args.report = args.report.resolve()
args.report.parent.mkdir(parents=True, exist_ok=True)
app_launcher = AppLauncher(args)
simulation_app = app_launcher.app

import copy
import hashlib
import importlib.metadata
import json
import os
import platform
import sys
import time
import traceback
from datetime import datetime, timezone

import gymnasium as gym
import torch

from isaaclab_rl.rsl_rl import RslRlVecEnvWrapper
from isaaclab_tasks.utils import parse_env_cfg
from isaaclab_tasks.utils.parse_cfg import load_cfg_from_registry
from rsl_rl.runners import OnPolicyRunner

import ame2.tasks  # noqa: F401
from ame2.tasks.terrains import AME2_TERRAINS_CFG_G1


def finite(value, name):
    """Check nested observation groups without assuming one concatenated vector."""
    if isinstance(value, torch.Tensor):
        if not bool(torch.isfinite(value).all()):
            raise FloatingPointError(f"Non-finite values in {name}, shape={tuple(value.shape)}")
    elif hasattr(value, "items"):
        for key, item in value.items():
            finite(item, f"{name}.{key}")


def sha256(path):
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def main(report):
    cfg = parse_env_cfg(args.task, device=args.device, num_envs=args.num_envs)
    cfg.seed = args.seed
    generator = cfg.scene.terrain.terrain_generator
    if args.terrain != "default":
        names = list(AME2_TERRAINS_CFG_G1.sub_terrains) if args.terrain == "all" else [args.terrain]
        missing = set(names) - set(AME2_TERRAINS_CFG_G1.sub_terrains)
        if missing:
            raise ValueError(f"Unknown terrains: {sorted(missing)}")
        if args.num_envs < len(names):
            raise ValueError(f"Need at least {len(names)} environments to cover {len(names)} terrains")
        generator.sub_terrains = {name: copy.deepcopy(AME2_TERRAINS_CFG_G1.sub_terrains[name]) for name in names}
        for terrain in generator.sub_terrains.values():
            terrain.proportion = 1.0 / len(names)
        # Isaac Lab stores each named patch set in one [rows, cols, N, 3]
        # tensor. The release's held-out test tiles use 10 target patches
        # whereas training tiles use 30. Match N only in this combined test
        # scene; the official training configuration remains untouched.
        patch_names = {name for terrain in generator.sub_terrains.values()
                       for name in (terrain.flat_patch_sampling or {})}
        patch_overrides = {}
        for patch_name in patch_names:
            patches = [terrain.flat_patch_sampling[patch_name]
                       for terrain in generator.sub_terrains.values()
                       if patch_name in (terrain.flat_patch_sampling or {})]
            counts = sorted({patch.num_patches for patch in patches})
            if len(counts) > 1:
                for patch in patches:
                    patch.num_patches = min(counts)
                patch_overrides[patch_name] = {"original_counts": counts, "combined_scene_count": min(counts)}
        if patch_overrides:
            report["combined_scene_patch_overrides"] = patch_overrides
        generator.num_rows = 1
        generator.num_cols = len(names)
        generator.difficulty_range = (args.difficulty, args.difficulty)
        # The random generator samples a terrain independently per tile and
        # can omit types. Curriculum generation assigns one type per column
        # by cumulative proportion; equal weights and N columns give exactly
        # one of each type. Environment difficulty progression stays disabled.
        generator.curriculum = True
        generator.use_cache = False
        cfg.scene.terrain.max_init_terrain_level = 0
        cfg.curriculum.terrain_levels = None
    else:
        names = list(generator.sub_terrains)
    cfg.scene.height_scanner.debug_vis = False
    cfg.commands.base_pose.debug_vis = False
    cfg.viewer.origin_type = "asset_root"
    cfg.viewer.asset_name = "robot"
    cfg.viewer.env_index = 0
    cfg.viewer.eye = (-3.2, -4.0, 2.6)
    cfg.viewer.lookat = (1.0, 0.0, 0.4)
    cfg.viewer.resolution = (960, 640)
    if args.mid360:
        from ame2.sensors.mid360_lidar import Mid360RayCasterCfg
        cfg.scene.lidar_cam = Mid360RayCasterCfg(
            prim_path="{ENV_REGEX_NS}/Robot/mid360_link", update_period=0.1,
            mesh_prim_paths=["/World/ground"], keep_world_ray_buffers=True,
        )
    cfg.log_dir = str(args.report.parent)
    report["terrain_names"] = names
    report["registered_tasks"] = sorted(name for name in gym.registry if name.startswith("Ame2-"))
    report["terrain_grid"] = {"rows": generator.num_rows, "columns": generator.num_cols,
                              "difficulty_range": list(generator.difficulty_range),
                              "generator_curriculum": generator.curriculum,
                              "environment_terrain_curriculum": cfg.curriculum.terrain_levels is not None}
    env = gym.make(args.task, cfg=cfg, render_mode="rgb_array" if args.video else None)
    try:
        if args.video:
            env = gym.wrappers.RecordVideo(
                env, video_folder=str(args.report.parent / "videos"), name_prefix=args.report.stem,
                step_trigger=lambda step: step == 0, video_length=args.steps, disable_logger=True,
            )
        agent_cfg = load_cfg_from_registry(args.task, "rsl_rl_cfg_entry_point")
        agent_cfg.device = str(env.unwrapped.device)
        env = RslRlVecEnvWrapper(env, clip_actions=agent_cfg.clip_actions)
        raw = env.unwrapped
        obs = env.get_observations()
        finite(obs, "initial_observations")
        report["observation_shapes"] = {key: list(value.shape) for key, value in obs.items()}
        report["actions"] = env.num_actions
        report["reward_terms"] = list(raw.reward_manager.active_terms)
        report["termination_terms"] = list(raw.termination_manager.active_terms)
        report["step_dt"] = raw.step_dt
        policy_mode = ("native" if args.checkpoint else "zero") if args.policy == "auto" else args.policy
        report["policy_mode"] = policy_mode
        runner = actor = scripted = None
        if policy_mode in ("native", "jit") or args.export_jit:
            if not args.checkpoint:
                raise ValueError("A checkpoint is required for policy inference or JIT export")
            checkpoint = args.checkpoint.resolve(strict=True)
            report["checkpoint"] = {"path": str(checkpoint), "sha256": sha256(checkpoint)}
            runner = OnPolicyRunner(env, agent_cfg.to_dict(), log_dir=None, device=agent_cfg.device)
            # Inference needs the actor/critic weights; optimizer state can differ
            # across releases and is deliberately tested by training resume instead.
            runner.load(str(checkpoint), load_cfg={"actor": True, "critic": True, "iteration": True},
                        map_location=agent_cfg.device)
            actor = runner.get_inference_policy(device=agent_cfg.device)
            report["checkpoint"]["iteration"] = runner.current_learning_iteration
            report["critic_heads"] = runner.alg.num_critic_heads
            if args.export_jit or policy_mode == "jit":
                export_path = args.report.parent / f"{args.report.stem}.jit"
                scripted = torch.jit.freeze(torch.jit.script(actor.as_jit().cpu().eval()))
                scripted.save(str(export_path))
                scripted = torch.jit.load(str(export_path), map_location=raw.device).eval()
                with torch.inference_mode():
                    native = actor(obs)
                    exported = scripted(obs["teacher_prop"], obs["teacher_mapping"])[0]
                    difference = float((native - exported).abs().max())
                    torch.testing.assert_close(native, exported, rtol=1e-4, atol=1e-5)
                report["jit"] = {"path": str(export_path), "sha256": sha256(export_path),
                                 "max_absolute_action_error": difference, "passed": True}
        marker = None
        if args.attention:
            if actor is None or policy_mode != "native":
                raise ValueError("--attention requires a native checkpoint policy")
            from isaaclab.markers import VisualizationMarkers, VisualizationMarkersCfg
            import isaaclab.sim as sim_utils
            marker = VisualizationMarkers(VisualizationMarkersCfg(
                prim_path="/Visuals/ResearchAttention",
                markers={f"shade_{i}": sim_utils.SphereCfg(radius=0.025,
                    visual_material=sim_utils.PreviewSurfaceCfg(diffuse_color=(i / 10, 0.0, 1 - i / 10)))
                    for i in range(11)},
            ))
        robot = raw.scene["robot"]
        command = raw.command_manager.get_term("base_pose")
        initial_position = robot.data.root_pos_w.clone()
        cumulative_reward = torch.zeros(env.num_envs, device=raw.device)
        minimum_distance = torch.full_like(cumulative_reward, float("inf"))
        early_terminations = torch.zeros(env.num_envs, device=raw.device, dtype=torch.long)
        timeouts = torch.zeros_like(early_terminations)
        reached = torch.zeros(env.num_envs, device=raw.device, dtype=torch.bool)
        steps = 0
        for step in range(args.steps):
            if not simulation_app.is_running():
                raise RuntimeError(f"Simulator stopped after {step} of {args.steps} required steps")
            with torch.inference_mode():
                distance = (command.pos_command_w[:, :2] - robot.data.root_pos_w[:, :2]).norm(dim=-1)
                minimum_distance = torch.minimum(minimum_distance, distance)
                reached |= distance < 0.5
                if policy_mode == "zero":
                    actions = torch.zeros((env.num_envs, env.num_actions), device=raw.device)
                elif policy_mode == "random":
                    actions = 2 * torch.rand((env.num_envs, env.num_actions), device=raw.device) - 1
                elif policy_mode == "jit":
                    actions = scripted(obs["teacher_prop"], obs["teacher_mapping"])[0]
                elif marker is not None:
                    actions, attention = actor(obs, return_attention=True)
                    weights = attention[0].reshape(-1)
                    scaled = (weights - weights.min()) / (weights.max() - weights.min() + 1e-8)
                    points = raw.scene["height_scanner"].data.ray_hits_w[0].clone()
                    points[:, 2] += 0.04
                    valid = torch.isfinite(points).all(dim=-1)
                    marker.visualize(points[valid], marker_indices=(scaled[valid] * 10).long())
                else:
                    actions = actor(obs)
                finite(actions, "actions")
                obs, rewards, dones, infos = env.step(actions)
                finite(obs, "observations")
                finite(rewards, "rewards")
                finite(robot.data.root_state_w, "root_state")
                finite(robot.data.joint_pos, "joint_positions")
                cumulative_reward += rewards.reshape(-1)
                early_terminations += raw.termination_manager.terminated.long()
                timeouts += raw.termination_manager.time_outs.long()
                if actor is not None:
                    actor.reset(dones)
            steps = step + 1
        distance = (command.pos_command_w[:, :2] - robot.data.root_pos_w[:, :2]).norm(dim=-1)
        minimum_distance = torch.minimum(minimum_distance, distance)
        reached |= distance < 0.5
        terrain_types = raw.scene.terrain.terrain_types.tolist()
        report["environments"] = [{
            "env_id": i, "terrain": names[terrain_types[i]] if args.terrain != "default" else f"column_{terrain_types[i]}",
            "terrain_column": terrain_types[i], "reward_sum": float(cumulative_reward[i]),
            "minimum_goal_distance_m": float(minimum_distance[i]), "final_goal_distance_m": float(distance[i]),
            "reached_goal": bool(reached[i]), "early_terminations": int(early_terminations[i]),
            "timeouts": int(timeouts[i]), "initial_position": initial_position[i].tolist(),
            "final_position": robot.data.root_pos_w[i].tolist(),
        } for i in range(env.num_envs)]
        report["steps_completed"] = steps
        report["simulation_seconds"] = steps * raw.step_dt
        report["finite_checks_passed"] = True
        if args.mid360:
            lidar = raw.scene["lidar_cam"]
            hits = lidar.data.ray_hits_w
            valid = torch.isfinite(hits).all(dim=-1)
            if not bool(valid.any()):
                raise AssertionError("Raw Mid360 raycaster did not return any terrain hits")
            report["mid360"] = {"ray_hit_shape": list(hits.shape),
                                "finite_hits_per_env": valid.sum(dim=-1).tolist(),
                                "mapping_model_used": False, "passed": True}
        if args.terrain == "all":
            observed = {item["terrain"] for item in report["environments"]}
            if observed != set(names):
                raise AssertionError(f"Not all terrains were visited: {set(names) - observed}")
        report["passed"] = True
    finally:
        # Isaac Lab 2.3.2 may retain the viewport controller through UI
        # references after env.close deletes scene. Unsubscribe tracking first.
        controller = getattr(env.unwrapped, "viewport_camera_controller", None)
        tracking = getattr(controller, "_viewport_camera_update_handle", None)
        if tracking is not None:
            tracking.unsubscribe()
            controller._viewport_camera_update_handle = None
        env.close()
        report["videos"] = [str(path) for path in sorted((args.report.parent / "videos").glob(f"{args.report.stem}*.mp4"))]


if __name__ == "__main__":
    started = time.monotonic()
    report = {"schema_version": 1, "started_utc": datetime.now(timezone.utc).isoformat(),
              "command": sys.argv, "arguments": {key: str(value) if isinstance(value, Path) else value
                                                 for key, value in vars(args).items()},
              "python": platform.python_version(), "torch": torch.__version__,
              "cuda": torch.version.cuda, "passed": False,
              "packages": {name: importlib.metadata.version(name) for name in ("isaaclab", "rsl-rl-lib", "ame2")}}
    try:
        main(report)
    except BaseException as error:
        report["error"] = {"type": type(error).__name__, "message": str(error), "traceback": traceback.format_exc()}
        traceback.print_exc()
        raise
    finally:
        report["wall_seconds"] = time.monotonic() - started
        args.report.write_text(json.dumps(report, indent=2) + "\n")
        print(f"[RESEARCH_RESULT] passed={report['passed']} report={args.report}", flush=True)
        if not report["passed"]:
            # Kit's default fastShutdown terminates the interpreter with 0,
            # masking a pending exception. The report and traceback are already
            # flushed and env.close() has run when an env was constructed.
            sys.stdout.flush()
            sys.stderr.flush()
            os._exit(1)
        simulation_app.close()
