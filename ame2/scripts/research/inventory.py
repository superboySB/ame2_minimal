#!/usr/bin/env python3
"""Extract the public feature inventory from source without importing Isaac Sim.

This is source evidence, not a runtime acceptance report. Use verify.py and
the official train.py/play.py entry points to collect executable evidence.
"""

import argparse
import ast
import hashlib
import json
from pathlib import Path


def literal(node):
    try:
        return ast.literal_eval(node)
    except (ValueError, TypeError):
        if isinstance(node, ast.Dict):
            return {literal(key): literal(value) for key, value in zip(node.keys, node.values)}
        if isinstance(node, (ast.List, ast.Tuple)):
            return [literal(item) for item in node.elts]
        if isinstance(node, ast.Call):
            return {"config_class": ast.unparse(node.func), **{item.arg: literal(item.value) for item in node.keywords}}
        if isinstance(node, ast.JoinedStr):
            return "".join(item.value if isinstance(item, ast.Constant) else
                           {"__name__": "ame2.tasks", "agents.__name__": "ame2.tasks.agents"}.get(
                               ast.unparse(item.value), "{" + ast.unparse(item.value) + "}")
                           for item in node.values)
        return ast.unparse(node)


def assignments(tree):
    return {target.id: item.value for item in tree.body if isinstance(item, ast.Assign)
            for target in item.targets if isinstance(target, ast.Name)}


def build_inventory(root):
    files = {name: root / relative for name, relative in {
        "registry": "ame2/ame2/tasks/__init__.py", "terrains": "ame2/ame2/tasks/terrains.py",
        "agents": "ame2/ame2/tasks/agents/rsl_rl_ppo_cfg.py", "environment": "ame2/ame2/tasks/ame2_env_cfg.py",
    }.items()}
    trees = {name: ast.parse(path.read_text()) for name, path in files.items()}
    tasks = []
    for item in trees["registry"].body:
        if isinstance(item, ast.Expr) and isinstance(item.value, ast.Call) and ast.unparse(item.value.func) == "gym.register":
            params = {keyword.arg: literal(keyword.value) for keyword in item.value.keywords}
            task_id = params["id"]
            # kwargs contains f-string entry points, so inspect its dict directly.
            kwargs = next(keyword.value for keyword in item.value.keywords if keyword.arg == "kwargs")
            tasks.append({"id": task_id, "mode": "play" if task_id.endswith("-Play") else "train",
                          "actor": "AME2GazeLSIOModel" if "Student" in task_id else
                                   "AME2GazeModel" if "Gaze" in task_id else "AME2Model",
                          "availability": "unreleased_mapping_model_required" if "Student" in task_id else "public",
                          "entry_points": {literal(key): literal(value) for key, value in zip(kwargs.keys, kwargs.values)}})
    terrain_call = assignments(trees["terrains"])["AME2_TERRAINS_CFG_G1"]
    terrain_dict = next(keyword.value for keyword in terrain_call.keywords if keyword.arg == "sub_terrains")
    terrains = []
    for key, value in zip(terrain_dict.keys, terrain_dict.values):
        params = literal(value)
        terrains.append({"name": literal(key), "training_probability_weight": params["proportion"],
                         "included_in_training": params["proportion"] > 0, "configuration": params})
    classes = {item.name: item for item in trees["agents"].body if isinstance(item, ast.ClassDef)}
    configs = {name: {key: literal(value) for key, value in assignments(cls).items()}
               for name, cls in classes.items() if name.startswith("PPORunnerCfg")}
    environment_classes = {item.name: item for item in trees["environment"].body if isinstance(item, ast.ClassDef)}
    rewards = assignments(environment_classes["RewardsCfg"])
    return {
        "schema_version": 1, "evidence_kind": "static_source_inventory",
        "source_files": {name: {"path": str(path.relative_to(root)),
                                "sha256": hashlib.sha256(path.read_bytes()).hexdigest()} for name, path in files.items()},
        "robots": [{"name": "Unitree G1", "asset": "ame2/ame2/assets/g1_lidar/g1_lidar.usd"}],
        "aircraft": [], "tasks": tasks, "terrains": terrains, "agent_configurations": configs,
        "reward_terms": {name: literal(value) for name, value in rewards.items()},
        "simulation_defaults": {"num_envs": 4096, "physics_dt_seconds": 0.005, "policy_decimation": 4,
                                "policy_hz": 50, "episode_seconds": 16, "terrain_rows": 10, "terrain_columns": 60},
        "published_checkpoint": "modelzoo/g1_gaze_64000env_10h/model_2400.pt",
        "student_required_artifacts": [{"path": str(path.relative_to(root)), "exists": path.is_file()}
                                       for path in (root / "ame2/ame2/NN_models/g1LivoxMapping_perframe.pt",
                                                    root / "ame2/ame2/NN_models/g1_gaze_teacher_isaaclab.jit")],
        "features": [
            {"name": "teacher_dense_attention", "tasks": ["Ame2-G1", "Ame2-G1-Play"], "available": True},
            {"name": "teacher_active_gaze", "tasks": ["Ame2-G1-Gaze", "Ame2-G1-Gaze-Play"], "available": True},
            {"name": "muon_optimizer", "default": True, "override": "agent.algorithm.optimizer=muon"},
            {"name": "adam_optimizer", "default": False, "override": "agent.algorithm.optimizer=adam"},
            {"name": "bf16_updates", "default": True, "override": "agent.algorithm.use_mixed_precision=true"},
            {"name": "fp32_updates", "default": False, "override": "agent.algorithm.use_mixed_precision=false"},
            {"name": "multi_head_critic", "default": True, "heads": len(rewards),
             "disable_override": "+agent.algorithm.multi_head_critic=false"},
            {"name": "critic_symmetry_augmentation", "default": True},
            {"name": "jit_export_and_inference", "available": True, "verification": "verify.py --export_jit --policy jit"},
            {"name": "onnx_export", "available": False, "reason": "AME2 actor as_onnx raises NotImplementedError"},
            {"name": "neural_mapping_and_student_distillation", "available": False,
             "reason": "The public release does not include the required neural mapping checkpoint"},
            {"name": "fly_debug_external_wrench", "available": True, "cli": "play.py --fly"},
            {"name": "return_home_debug", "available": True, "cli": "play.py --return_home"},
            {"name": "reward_and_joint_plots", "available": True, "cli": "play.py --log_rewards --plot"},
            {"name": "distributed_training", "available": True, "cli": "container/run.sh -g 0,1 train"},
        ],
        "validation_limits": ["Static inventory does not prove runtime behavior.",
                              "Finite tensors in a short rollout do not prove goal-reaching or training convergence.",
                              "The published 64000-environment run is distinct from the default 4096-environment configuration."]
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path)
    parser.add_argument("--preflight_task", help="Fail before starting Isaac Sim if a student model is missing")
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[3]
    inventory = build_inventory(root)
    if args.preflight_task:
        registered = {item["id"] for item in inventory["tasks"]}
        if args.preflight_task not in registered:
            parser.error(f"Unknown task {args.preflight_task!r}")
        missing = [item["path"] for item in inventory["student_required_artifacts"] if not item["exists"]]
        inventory["preflight"] = {"task": args.preflight_task,
                                  "passed": "Student" not in args.preflight_task or not missing,
                                  "missing_artifacts": missing if "Student" in args.preflight_task else []}
    output = json.dumps(inventory, indent=2) + "\n"
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(output)
    else:
        print(output, end="")
    if args.preflight_task and not inventory["preflight"]["passed"]:
        raise SystemExit(2)
