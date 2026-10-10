window.AME2_VIDEO_MANIFEST = {
  "schema_version": 1,
  "evidence_snapshot": "validation_snapshot.json",
  "transcode": {
    "video": "full duration; scale=640:-2; fps=15; libx264 preset=fast crf=27 yuv420p",
    "poster": "source time=35% duration; scale=640:-2; JPEG",
    "gif": "48 evenly sampled frames over full source; width=400; 96 colors; 8 fps; loop"
  },
  "notes": [
    "MP4 保留完整源视频时长，压缩至 640 像素宽与 15 fps。",
    "每段录像显示 env 0；同一 report 中其他环境的数值结果单独保留。",
    "目标半径为 0.5 m；进入半径、提前终止和有限值检查是不同指标。",
    "自动重置可能发生，单段汇总不代表论文成功率。",
    "训练录像使用持续更新的随机策略，最终 checkpoint 仅供追溯，不是该录像的固定策略。"
  ],
  "videos": [
    {
      "id": "climb_up_attention_video-result",
      "task": "Ame2-G1-Gaze-Play",
      "terrain": "climb_up",
      "difficulty": 0.35,
      "seed": 42,
      "policy": "native",
      "outcome": "进入目标半径",
      "assisted": false,
      "finite_checks_passed": true,
      "simulation_seconds": 16.0,
      "duration_seconds": 15.98,
      "steps_completed": 800,
      "started_utc": "2026-10-10T14:27:32.290542+00:00",
      "environment": {
        "env_id": 0,
        "terrain": "climb_up",
        "terrain_column": 0,
        "reward_sum": 239.16934204101562,
        "minimum_goal_distance_m": 0.04075479507446289,
        "final_goal_distance_m": 5.16763162612915,
        "reached_goal": true,
        "early_terminations": 0,
        "timeouts": 1,
        "initial_position": [
          -0.06907656788825989,
          0.02582111954689026,
          0.7799999713897705
        ],
        "final_position": [
          -0.11447832733392715,
          -0.16163530945777893,
          0.7799999713897705
        ]
      },
      "checkpoint": {
        "path": "/workspace/ame2-minimal/ame2/logs/rsl_rl/research_official_full/2026-10-10_04-38-09_full/model_4999.pt",
        "sha256": "0d859f33e5e642961f01fc078bde64e73ee9dd5e4ff0fca014b9637c7ce8b80e",
        "iteration": 4999
      },
      "jit": {
        "path": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/climb_up_attention_video/result.jit",
        "sha256": "26d802167186aa49efaacd73a4c98907c5f42244994858318df63a30d54c42cb",
        "max_absolute_action_error": 0.0,
        "passed": true
      },
      "source": {
        "path": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/climb_up_attention_video/videos/result-step-0.mp4",
        "sha256": "d475a6a2f8ec1137c95f199aca33c163960ed7aaabaed8b9b0d45edcec4126e8"
      },
      "report": {
        "path": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/climb_up_attention_video/result.json",
        "sha256": "b9bd186ceeea4320e852ca436f509ce7b15a2736b5546e8a8cc98832af851c00"
      },
      "video": "animations/climb_up_attention_video-result.mp4",
      "video_sha256": "bcc4fb025cd14ba09f1dd4d0bd4951086c000eaf72ecd7bda50104b723cb28ee",
      "poster": "animations/climb_up_attention_video-result.jpg",
      "poster_sha256": "5bc58ec5064b00b7eaf53dd5d9ec59170e568c59007c028bb080781227ef3a9c",
      "gif": "animations/climb_up_attention_video-result.gif",
      "gif_sha256": "cdb656d6dc7f95d2705f290f85e0ff17751c4a7592b7189fdbcd5178d43140a8",
      "gif_note": "完整片段均匀采样 48 帧、400 像素宽、96 色，8 fps 约 6 秒循环；源视频 15.98 秒；MP4 保留源视频时间"
    },
    {
      "id": "rough_video-result",
      "task": "Ame2-G1-Gaze-Play",
      "terrain": "rough",
      "difficulty": 0.35,
      "seed": 42,
      "policy": "native",
      "outcome": "进入目标半径",
      "assisted": false,
      "finite_checks_passed": true,
      "simulation_seconds": 16.0,
      "duration_seconds": 15.98,
      "steps_completed": 800,
      "started_utc": "2026-10-10T14:26:45.811762+00:00",
      "environment": {
        "env_id": 0,
        "terrain": "rough",
        "terrain_column": 0,
        "reward_sum": 260.93621826171875,
        "minimum_goal_distance_m": 0.12304555624723434,
        "final_goal_distance_m": 0.5262084603309631,
        "reached_goal": true,
        "early_terminations": 0,
        "timeouts": 1,
        "initial_position": [
          -0.06907656788825989,
          0.02582111954689026,
          0.7649999856948853
        ],
        "final_position": [
          -0.11447832733392715,
          -0.16163530945777893,
          0.7649999856948853
        ]
      },
      "checkpoint": {
        "path": "/workspace/ame2-minimal/ame2/logs/rsl_rl/research_official_full/2026-10-10_04-38-09_full/model_4999.pt",
        "sha256": "0d859f33e5e642961f01fc078bde64e73ee9dd5e4ff0fca014b9637c7ce8b80e",
        "iteration": 4999
      },
      "jit": {
        "path": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/rough_video/result.jit",
        "sha256": "26d802167186aa49efaacd73a4c98907c5f42244994858318df63a30d54c42cb",
        "max_absolute_action_error": 0.0,
        "passed": true
      },
      "source": {
        "path": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/rough_video/videos/result-step-0.mp4",
        "sha256": "725967959379cc5e34bf482f4bf856d4189c318a56198387f2b210c8e081c88a"
      },
      "report": {
        "path": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/rough_video/result.json",
        "sha256": "e24de70d5ead379c7f1dac9f78591360d4e4e93d96565fe04126326f1e9e787d"
      },
      "video": "animations/rough_video-result.mp4",
      "video_sha256": "61a79306dec5ca8bc734f5172b00e6e8ea8069a418c5d81c2560741d19ba1126",
      "poster": "animations/rough_video-result.jpg",
      "poster_sha256": "d0bf1a5f2f7dc9d70a7e488fb896de26a6ef7568c92fd3e36fa520b175a10b6e",
      "gif": "animations/rough_video-result.gif",
      "gif_sha256": "42a5395779fe6092502a95a466c296c8876b0ad6af1424a8a18e075ad86b86da",
      "gif_note": "完整片段均匀采样 48 帧、400 像素宽、96 色，8 fps 约 6 秒循环；源视频 15.98 秒；MP4 保留源视频时间"
    }
  ],
  "reports": [
    {
      "schema_version": 1,
      "started_utc": "2026-10-10T14:27:32.290542+00:00",
      "command": [
        "scripts/research/verify.py",
        "--headless",
        "--task",
        "Ame2-G1-Gaze-Play",
        "--terrain",
        "climb_up",
        "--num_envs",
        "1",
        "--steps",
        "800",
        "--seed",
        "42",
        "--difficulty",
        "0.35",
        "--checkpoint",
        "/workspace/ame2-minimal/ame2/logs/rsl_rl/research_official_full/2026-10-10_04-38-09_full/model_4999.pt",
        "--policy",
        "native",
        "--first_episode",
        "--report",
        "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/climb_up_attention_video/result.json",
        "--export_jit",
        "--video",
        "--attention"
      ],
      "arguments": {
        "task": "Ame2-G1-Gaze-Play",
        "terrain": "climb_up",
        "difficulty": 0.35,
        "num_envs": 1,
        "steps": 800,
        "seed": 42,
        "checkpoint": "/workspace/ame2-minimal/ame2/logs/rsl_rl/research_official_full/2026-10-10_04-38-09_full/model_4999.pt",
        "policy": "native",
        "export_jit": true,
        "video": true,
        "attention": true,
        "mid360": false,
        "first_episode": true,
        "report": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/climb_up_attention_video/result.json",
        "enable_cameras": true,
        "xr": false,
        "device": "cuda:0",
        "cpu": false,
        "verbose": false,
        "info": false,
        "rendering_mode": null,
        "kit_args": "",
        "anim_recording_enabled": false,
        "anim_recording_start_time": 0,
        "anim_recording_stop_time": 10,
        "headless": true,
        "hide_ui": true,
        "create_new_stage": false,
        "physics_gpu": 0,
        "active_gpu": 0
      },
      "python": "3.11.13",
      "torch": "2.7.0+cu128",
      "cuda": "12.8",
      "passed": true,
      "packages": {
        "isaaclab": "0.54.2",
        "rsl-rl-lib": "5.0.0",
        "ame2": "0.1.0"
      },
      "terrain_names": [
        "climb_up"
      ],
      "registered_tasks": [
        "Ame2-G1",
        "Ame2-G1-Gaze",
        "Ame2-G1-Gaze-Play",
        "Ame2-G1-Gaze-Student",
        "Ame2-G1-Gaze-Student-Play",
        "Ame2-G1-Play"
      ],
      "terrain_grid": {
        "rows": 1,
        "columns": 1,
        "difficulty_range": [
          0.35,
          0.35
        ],
        "generator_curriculum": true,
        "environment_terrain_curriculum": false
      },
      "observation_shapes": {
        "teacher_mapping": [
          1,
          26,
          15,
          3
        ],
        "teacher_prop": [
          1,
          82
        ],
        "critic": [
          1,
          499
        ]
      },
      "actions": 23,
      "reward_terms": [
        "ame2_position_tracking",
        "ame2_heading_tracking",
        "ame2_move2goal",
        "ame2_standatgoal",
        "early_termination_penalty",
        "undesired_spinning",
        "undesired_leaping",
        "undesired_non_foot_contacts",
        "undesired_stumbling",
        "undesired_slippage",
        "undesired_self_col_knee",
        "undesired_self_col_torso",
        "undesired_self_col_ankle",
        "base_roll_rate",
        "joint_regularization",
        "action_smoothness",
        "link_contact_forces",
        "body_lin_acc_l1",
        "joint_pos_limits",
        "joint_vel_limits",
        "joint_torque_limits",
        "ame2_optional_uppershaping",
        "ame2_optional_foot_shaping"
      ],
      "termination_terms": [
        "time_out",
        "early_gravity",
        "early_hip_acc",
        "early_illegal_contact",
        "early_stagnation"
      ],
      "step_dt": 0.02,
      "policy_mode": "native",
      "checkpoint": {
        "path": "/workspace/ame2-minimal/ame2/logs/rsl_rl/research_official_full/2026-10-10_04-38-09_full/model_4999.pt",
        "sha256": "0d859f33e5e642961f01fc078bde64e73ee9dd5e4ff0fca014b9637c7ce8b80e",
        "iteration": 4999
      },
      "critic_heads": 23,
      "jit": {
        "path": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/climb_up_attention_video/result.jit",
        "sha256": "26d802167186aa49efaacd73a4c98907c5f42244994858318df63a30d54c42cb",
        "max_absolute_action_error": 0.0,
        "passed": true
      },
      "environments": [
        {
          "env_id": 0,
          "terrain": "climb_up",
          "terrain_column": 0,
          "reward_sum": 239.16934204101562,
          "minimum_goal_distance_m": 0.04075479507446289,
          "final_goal_distance_m": 5.16763162612915,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            -0.06907656788825989,
            0.02582111954689026,
            0.7799999713897705
          ],
          "final_position": [
            -0.11447832733392715,
            -0.16163530945777893,
            0.7799999713897705
          ]
        }
      ],
      "first_episode": {
        "scope": "initial reset through first terminated-or-timeout state, inclusive",
        "sampling_phase": "after physics/reward computation and before automatic reset",
        "position_threshold_m": 0.5,
        "heading_threshold_rad": 0.5,
        "success_definition": "First episode ends with timeout=true and terminated=false, and its pre-reset terminal planar goal distance is <0.5m and absolute wrapped heading error is <0.5rad. Censored episodes are not successful. This tests the terminal pose, not a dwell-time requirement.",
        "duration_definition": "Elapsed first-episode simulation time; censored episodes show observed time only.",
        "environments": [
          {
            "env_id": 0,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.04071201756596565,
            "first_position_goal_step": 510,
            "first_pose_goal_step": 510,
            "terminal_goal_distance_m": 0.04071201756596565,
            "terminal_heading_error_rad": -0.15352797508239746,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.04071201756596565,
            "last_observed_heading_error_rad": -0.15352797508239746,
            "terminal_terms": [
              "time_out"
            ]
          }
        ],
        "summary": {
          "num_environments": 1,
          "ever_position_goal": 1,
          "ever_pose_goal": 1,
          "successes": 1,
          "terminated": 0,
          "timeouts": 1,
          "censored": 0
        }
      },
      "steps_completed": 800,
      "simulation_seconds": 16.0,
      "finite_checks_passed": true,
      "videos": [
        "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/climb_up_attention_video/videos/result-step-0.mp4"
      ],
      "wall_seconds": 36.58531601098366,
      "path": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/climb_up_attention_video/result.json",
      "sha256": "b9bd186ceeea4320e852ca436f509ce7b15a2736b5546e8a8cc98832af851c00"
    },
    {
      "schema_version": 1,
      "started_utc": "2026-10-10T14:26:10.869745+00:00",
      "command": [
        "scripts/research/verify.py",
        "--headless",
        "--task",
        "Ame2-G1-Gaze-Play",
        "--terrain",
        "all",
        "--num_envs",
        "16",
        "--steps",
        "800",
        "--seed",
        "42",
        "--difficulty",
        "0.5",
        "--checkpoint",
        "/workspace/ame2-minimal/ame2/logs/rsl_rl/research_official_full/2026-10-10_04-38-09_full/model_4999.pt",
        "--policy",
        "jit",
        "--first_episode",
        "--report",
        "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/jit_seed42/result.json"
      ],
      "arguments": {
        "task": "Ame2-G1-Gaze-Play",
        "terrain": "all",
        "difficulty": 0.5,
        "num_envs": 16,
        "steps": 800,
        "seed": 42,
        "checkpoint": "/workspace/ame2-minimal/ame2/logs/rsl_rl/research_official_full/2026-10-10_04-38-09_full/model_4999.pt",
        "policy": "jit",
        "export_jit": false,
        "video": false,
        "attention": false,
        "mid360": false,
        "first_episode": true,
        "report": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/jit_seed42/result.json",
        "enable_cameras": false,
        "xr": false,
        "device": "cuda:0",
        "cpu": false,
        "verbose": false,
        "info": false,
        "rendering_mode": null,
        "kit_args": "",
        "anim_recording_enabled": false,
        "anim_recording_start_time": 0,
        "anim_recording_stop_time": 10,
        "headless": true,
        "hide_ui": true,
        "create_new_stage": false,
        "physics_gpu": 0,
        "active_gpu": 0
      },
      "python": "3.11.13",
      "torch": "2.7.0+cu128",
      "cuda": "12.8",
      "passed": true,
      "packages": {
        "isaaclab": "0.54.2",
        "rsl-rl-lib": "5.0.0",
        "ame2": "0.1.0"
      },
      "combined_scene_patch_overrides": {
        "target": {
          "original_counts": [
            10,
            30
          ],
          "combined_scene_count": 10
        }
      },
      "terrain_names": [
        "rough",
        "stair_down",
        "stair_up",
        "boxes",
        "obstacles",
        "climb_up",
        "climb_down",
        "consecutive",
        "gap",
        "pallets",
        "beam",
        "stones",
        "pit",
        "peak",
        "test_1",
        "test_2"
      ],
      "registered_tasks": [
        "Ame2-G1",
        "Ame2-G1-Gaze",
        "Ame2-G1-Gaze-Play",
        "Ame2-G1-Gaze-Student",
        "Ame2-G1-Gaze-Student-Play",
        "Ame2-G1-Play"
      ],
      "terrain_grid": {
        "rows": 1,
        "columns": 16,
        "difficulty_range": [
          0.5,
          0.5
        ],
        "generator_curriculum": true,
        "environment_terrain_curriculum": false
      },
      "observation_shapes": {
        "teacher_mapping": [
          16,
          26,
          15,
          3
        ],
        "teacher_prop": [
          16,
          82
        ],
        "critic": [
          16,
          499
        ]
      },
      "actions": 23,
      "reward_terms": [
        "ame2_position_tracking",
        "ame2_heading_tracking",
        "ame2_move2goal",
        "ame2_standatgoal",
        "early_termination_penalty",
        "undesired_spinning",
        "undesired_leaping",
        "undesired_non_foot_contacts",
        "undesired_stumbling",
        "undesired_slippage",
        "undesired_self_col_knee",
        "undesired_self_col_torso",
        "undesired_self_col_ankle",
        "base_roll_rate",
        "joint_regularization",
        "action_smoothness",
        "link_contact_forces",
        "body_lin_acc_l1",
        "joint_pos_limits",
        "joint_vel_limits",
        "joint_torque_limits",
        "ame2_optional_uppershaping",
        "ame2_optional_foot_shaping"
      ],
      "termination_terms": [
        "time_out",
        "early_gravity",
        "early_hip_acc",
        "early_illegal_contact",
        "early_stagnation"
      ],
      "step_dt": 0.02,
      "policy_mode": "jit",
      "checkpoint": {
        "path": "/workspace/ame2-minimal/ame2/logs/rsl_rl/research_official_full/2026-10-10_04-38-09_full/model_4999.pt",
        "sha256": "0d859f33e5e642961f01fc078bde64e73ee9dd5e4ff0fca014b9637c7ce8b80e",
        "iteration": 4999
      },
      "critic_heads": 23,
      "jit": {
        "path": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/jit_seed42/result.jit",
        "sha256": "26d802167186aa49efaacd73a4c98907c5f42244994858318df63a30d54c42cb",
        "max_absolute_action_error": 4.76837158203125e-07,
        "passed": true
      },
      "environments": [
        {
          "env_id": 0,
          "terrain": "rough",
          "terrain_column": 0,
          "reward_sum": 276.9306640625,
          "minimum_goal_distance_m": 0.06655071675777435,
          "final_goal_distance_m": 2.7578251361846924,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            0.07378976047039032,
            -89.96841430664062,
            0.7549999952316284
          ],
          "final_position": [
            0.04071107506752014,
            -89.83202362060547,
            0.7549999952316284
          ]
        },
        {
          "env_id": 1,
          "terrain": "stair_down",
          "terrain_column": 1,
          "reward_sum": 29.145523071289062,
          "minimum_goal_distance_m": 0.9699978828430176,
          "final_goal_distance_m": 1.6968268156051636,
          "reached_goal": false,
          "early_terminations": 2,
          "timeouts": 0,
          "initial_position": [
            -0.17293024063110352,
            -77.83193969726562,
            2.6999998092651367
          ],
          "final_position": [
            2.949692726135254,
            -78.13754272460938,
            1.570754051208496
          ]
        },
        {
          "env_id": 2,
          "terrain": "stair_up",
          "terrain_column": 2,
          "reward_sum": 138.1060791015625,
          "minimum_goal_distance_m": 0.029765987768769264,
          "final_goal_distance_m": 3.793236017227173,
          "reached_goal": true,
          "early_terminations": 1,
          "timeouts": 0,
          "initial_position": [
            0.15759538114070892,
            -66.16976928710938,
            -0.9800000190734863
          ],
          "final_position": [
            -0.05318986997008324,
            -66.0911636352539,
            -1.13232421875
          ]
        },
        {
          "env_id": 3,
          "terrain": "boxes",
          "terrain_column": 3,
          "reward_sum": 237.68629455566406,
          "minimum_goal_distance_m": 0.23040179908275604,
          "final_goal_distance_m": 2.8286900520324707,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            -0.05352550745010376,
            -54.10257339477539,
            0.7799999713897705
          ],
          "final_position": [
            0.13399817049503326,
            -53.824344635009766,
            0.7799999713897705
          ]
        },
        {
          "env_id": 4,
          "terrain": "obstacles",
          "terrain_column": 4,
          "reward_sum": 255.2776641845703,
          "minimum_goal_distance_m": 0.24844200909137726,
          "final_goal_distance_m": 2.9107766151428223,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            -0.04984506964683533,
            -42.01253890991211,
            0.9099999666213989
          ],
          "final_position": [
            0.16499392688274384,
            -41.9508056640625,
            0.9099999666213989
          ]
        },
        {
          "env_id": 5,
          "terrain": "climb_up",
          "terrain_column": 5,
          "reward_sum": 25.447370529174805,
          "minimum_goal_distance_m": 1.0337045192718506,
          "final_goal_distance_m": 1.0873185396194458,
          "reached_goal": false,
          "early_terminations": 1,
          "timeouts": 0,
          "initial_position": [
            0.04115745425224304,
            -29.972734451293945,
            0.7799999713897705
          ],
          "final_position": [
            2.146796464920044,
            -29.87062644958496,
            0.8129769563674927
          ]
        },
        {
          "env_id": 6,
          "terrain": "climb_down",
          "terrain_column": 6,
          "reward_sum": 240.0007781982422,
          "minimum_goal_distance_m": 0.012725354172289371,
          "final_goal_distance_m": 3.2325804233551025,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            0.114842489361763,
            -17.95186996459961,
            1.3199999332427979
          ],
          "final_position": [
            -0.1119404062628746,
            -18.188207626342773,
            1.3199999332427979
          ]
        },
        {
          "env_id": 7,
          "terrain": "consecutive",
          "terrain_column": 7,
          "reward_sum": 240.8278350830078,
          "minimum_goal_distance_m": 0.07934137433767319,
          "final_goal_distance_m": 5.685482978820801,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            -0.05329671502113342,
            -6.075638771057129,
            0.7799999713897705
          ],
          "final_position": [
            0.08668269217014313,
            -6.159212589263916,
            0.7799999713897705
          ]
        },
        {
          "env_id": 8,
          "terrain": "gap",
          "terrain_column": 8,
          "reward_sum": 245.74539184570312,
          "minimum_goal_distance_m": 0.045173294842243195,
          "final_goal_distance_m": 2.908849000930786,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            0.062202975153923035,
            6.08181095123291,
            0.7799999713897705
          ],
          "final_position": [
            0.1332518607378006,
            5.898412227630615,
            0.7799999713897705
          ]
        },
        {
          "env_id": 9,
          "terrain": "pallets",
          "terrain_column": 9,
          "reward_sum": 248.7688446044922,
          "minimum_goal_distance_m": 0.08968044072389603,
          "final_goal_distance_m": 6.484679222106934,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            0.001975014805793762,
            17.86756706237793,
            0.8799999952316284
          ],
          "final_position": [
            -0.011329233646392822,
            18.157602310180664,
            0.8799999952316284
          ]
        },
        {
          "env_id": 10,
          "terrain": "beam",
          "terrain_column": 10,
          "reward_sum": 255.90078735351562,
          "minimum_goal_distance_m": 0.11049717664718628,
          "final_goal_distance_m": 5.348267555236816,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            0.1966199427843094,
            29.950069427490234,
            0.7799999713897705
          ],
          "final_position": [
            -0.11048053950071335,
            29.869224548339844,
            0.7799999713897705
          ]
        },
        {
          "env_id": 11,
          "terrain": "stones",
          "terrain_column": 11,
          "reward_sum": 263.2496643066406,
          "minimum_goal_distance_m": 0.00985979475080967,
          "final_goal_distance_m": 5.961185932159424,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            0.1934022456407547,
            42.18138122558594,
            0.9280452728271484
          ],
          "final_position": [
            0.13711093366146088,
            41.871978759765625,
            0.9280452728271484
          ]
        },
        {
          "env_id": 12,
          "terrain": "pit",
          "terrain_column": 12,
          "reward_sum": -0.9349551200866699,
          "minimum_goal_distance_m": 3.2830514907836914,
          "final_goal_distance_m": 3.8971621990203857,
          "reached_goal": false,
          "early_terminations": 1,
          "timeouts": 0,
          "initial_position": [
            -0.06086137890815735,
            53.919403076171875,
            0.2799999713897705
          ],
          "final_position": [
            0.9064035415649414,
            54.06982421875,
            0.24853435158729553
          ]
        },
        {
          "env_id": 13,
          "terrain": "peak",
          "terrain_column": 13,
          "reward_sum": 7.066906452178955,
          "minimum_goal_distance_m": 0.04918285459280014,
          "final_goal_distance_m": 0.04918285459280014,
          "reached_goal": true,
          "early_terminations": 2,
          "timeouts": 0,
          "initial_position": [
            -0.11118453741073608,
            66.16226959228516,
            1.7799999713897705
          ],
          "final_position": [
            3.624133348464966,
            66.18990325927734,
            0.7593565583229065
          ]
        },
        {
          "env_id": 14,
          "terrain": "test_1",
          "terrain_column": 14,
          "reward_sum": -10.690410614013672,
          "minimum_goal_distance_m": 3.5218636989593506,
          "final_goal_distance_m": 5.267175674438477,
          "reached_goal": false,
          "early_terminations": 4,
          "timeouts": 0,
          "initial_position": [
            -0.15217077732086182,
            78.1917495727539,
            1.7799999713897705
          ],
          "final_position": [
            0.4202752411365509,
            78.0798568725586,
            1.764243483543396
          ]
        },
        {
          "env_id": 15,
          "terrain": "test_2",
          "terrain_column": 15,
          "reward_sum": 1.4988397359848022,
          "minimum_goal_distance_m": 1.8694159984588623,
          "final_goal_distance_m": 4.278598308563232,
          "reached_goal": false,
          "early_terminations": 4,
          "timeouts": 0,
          "initial_position": [
            -0.13490793108940125,
            90.15071868896484,
            0.8799999952316284
          ],
          "final_position": [
            0.23305489122867584,
            90.1714859008789,
            0.8504264950752258
          ]
        }
      ],
      "first_episode": {
        "scope": "initial reset through first terminated-or-timeout state, inclusive",
        "sampling_phase": "after physics/reward computation and before automatic reset",
        "position_threshold_m": 0.5,
        "heading_threshold_rad": 0.5,
        "success_definition": "First episode ends with timeout=true and terminated=false, and its pre-reset terminal planar goal distance is <0.5m and absolute wrapped heading error is <0.5rad. Censored episodes are not successful. This tests the terminal pose, not a dwell-time requirement.",
        "duration_definition": "Elapsed first-episode simulation time; censored episodes show observed time only.",
        "environments": [
          {
            "env_id": 0,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.06655071675777435,
            "first_position_goal_step": 0,
            "first_pose_goal_step": 0,
            "terminal_goal_distance_m": 0.09120013564825058,
            "terminal_heading_error_rad": -0.015367746353149414,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.09120013564825058,
            "last_observed_heading_error_rad": -0.015367746353149414,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 1,
            "ever_position_goal": false,
            "ever_pose_goal": false,
            "success": false,
            "terminated": true,
            "timeout": false,
            "censored": false,
            "episode_length_steps": 302,
            "duration_seconds": 6.04,
            "minimum_goal_distance_m": 0.944068193435669,
            "first_position_goal_step": null,
            "first_pose_goal_step": null,
            "terminal_goal_distance_m": 0.944068193435669,
            "terminal_heading_error_rad": 1.9632704257965088,
            "terminal_position_goal": false,
            "terminal_pose_goal": false,
            "last_observed_goal_distance_m": 0.944068193435669,
            "last_observed_heading_error_rad": 1.9632704257965088,
            "terminal_terms": [
              "early_gravity"
            ]
          },
          {
            "env_id": 2,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": false,
            "terminated": true,
            "timeout": false,
            "censored": false,
            "episode_length_steps": 772,
            "duration_seconds": 15.44,
            "minimum_goal_distance_m": 0.029765987768769264,
            "first_position_goal_step": 327,
            "first_pose_goal_step": 340,
            "terminal_goal_distance_m": 0.3679571747779846,
            "terminal_heading_error_rad": -0.9074084758758545,
            "terminal_position_goal": true,
            "terminal_pose_goal": false,
            "last_observed_goal_distance_m": 0.3679571747779846,
            "last_observed_heading_error_rad": -0.9074084758758545,
            "terminal_terms": [
              "early_gravity"
            ]
          },
          {
            "env_id": 3,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.23040179908275604,
            "first_position_goal_step": 516,
            "first_pose_goal_step": 516,
            "terminal_goal_distance_m": 0.232864111661911,
            "terminal_heading_error_rad": 0.025249242782592773,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.232864111661911,
            "last_observed_heading_error_rad": 0.025249242782592773,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 4,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.24844200909137726,
            "first_position_goal_step": 280,
            "first_pose_goal_step": 299,
            "terminal_goal_distance_m": 0.2511325180530548,
            "terminal_heading_error_rad": 0.07163333892822266,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.2511325180530548,
            "last_observed_heading_error_rad": 0.07163333892822266,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 5,
            "ever_position_goal": false,
            "ever_pose_goal": false,
            "success": false,
            "terminated": true,
            "timeout": false,
            "censored": false,
            "episode_length_steps": 502,
            "duration_seconds": 10.040000000000001,
            "minimum_goal_distance_m": 2.2259860038757324,
            "first_position_goal_step": null,
            "first_pose_goal_step": null,
            "terminal_goal_distance_m": 2.383613348007202,
            "terminal_heading_error_rad": 0.1425013542175293,
            "terminal_position_goal": false,
            "terminal_pose_goal": false,
            "last_observed_goal_distance_m": 2.383613348007202,
            "last_observed_heading_error_rad": 0.1425013542175293,
            "terminal_terms": [
              "early_stagnation"
            ]
          },
          {
            "env_id": 6,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.012725354172289371,
            "first_position_goal_step": 317,
            "first_pose_goal_step": 318,
            "terminal_goal_distance_m": 0.11953939497470856,
            "terminal_heading_error_rad": 0.04828906059265137,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.11953939497470856,
            "last_observed_heading_error_rad": 0.04828906059265137,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 7,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.07934137433767319,
            "first_position_goal_step": 481,
            "first_pose_goal_step": 486,
            "terminal_goal_distance_m": 0.10696535557508469,
            "terminal_heading_error_rad": -0.16870498657226562,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.10696535557508469,
            "last_observed_heading_error_rad": -0.16870498657226562,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 8,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.045173294842243195,
            "first_position_goal_step": 305,
            "first_pose_goal_step": 309,
            "terminal_goal_distance_m": 0.04557633027434349,
            "terminal_heading_error_rad": -0.1032867431640625,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.04557633027434349,
            "last_observed_heading_error_rad": -0.1032867431640625,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 9,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.08968044072389603,
            "first_position_goal_step": 410,
            "first_pose_goal_step": 410,
            "terminal_goal_distance_m": 0.14294591546058655,
            "terminal_heading_error_rad": -0.14963150024414062,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.14294591546058655,
            "last_observed_heading_error_rad": -0.14963150024414062,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 10,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.11049717664718628,
            "first_position_goal_step": 372,
            "first_pose_goal_step": 372,
            "terminal_goal_distance_m": 0.11052364110946655,
            "terminal_heading_error_rad": 0.0058286190032958984,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.11052364110946655,
            "last_observed_heading_error_rad": 0.0058286190032958984,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 11,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.00985979475080967,
            "first_position_goal_step": 262,
            "first_pose_goal_step": 262,
            "terminal_goal_distance_m": 0.012356302700936794,
            "terminal_heading_error_rad": -0.07451343536376953,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.012356302700936794,
            "last_observed_heading_error_rad": -0.07451343536376953,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 12,
            "ever_position_goal": false,
            "ever_pose_goal": false,
            "success": false,
            "terminated": true,
            "timeout": false,
            "censored": false,
            "episode_length_steps": 502,
            "duration_seconds": 10.040000000000001,
            "minimum_goal_distance_m": 3.2830514907836914,
            "first_position_goal_step": null,
            "first_pose_goal_step": null,
            "terminal_goal_distance_m": 3.4227993488311768,
            "terminal_heading_error_rad": 0.36368703842163086,
            "terminal_position_goal": false,
            "terminal_pose_goal": false,
            "last_observed_goal_distance_m": 3.4227993488311768,
            "last_observed_heading_error_rad": 0.36368703842163086,
            "terminal_terms": [
              "early_stagnation"
            ]
          },
          {
            "env_id": 13,
            "ever_position_goal": false,
            "ever_pose_goal": false,
            "success": false,
            "terminated": true,
            "timeout": false,
            "censored": false,
            "episode_length_steps": 195,
            "duration_seconds": 3.9,
            "minimum_goal_distance_m": 3.0826492309570312,
            "first_position_goal_step": null,
            "first_pose_goal_step": null,
            "terminal_goal_distance_m": 3.0826492309570312,
            "terminal_heading_error_rad": 0.00821995735168457,
            "terminal_position_goal": false,
            "terminal_pose_goal": false,
            "last_observed_goal_distance_m": 3.0826492309570312,
            "last_observed_heading_error_rad": 0.00821995735168457,
            "terminal_terms": [
              "early_gravity"
            ]
          },
          {
            "env_id": 14,
            "ever_position_goal": false,
            "ever_pose_goal": false,
            "success": false,
            "terminated": true,
            "timeout": false,
            "censored": false,
            "episode_length_steps": 152,
            "duration_seconds": 3.04,
            "minimum_goal_distance_m": 4.424104690551758,
            "first_position_goal_step": null,
            "first_pose_goal_step": null,
            "terminal_goal_distance_m": 4.424104690551758,
            "terminal_heading_error_rad": 1.4467918872833252,
            "terminal_position_goal": false,
            "terminal_pose_goal": false,
            "last_observed_goal_distance_m": 4.424104690551758,
            "last_observed_heading_error_rad": 1.4467918872833252,
            "terminal_terms": [
              "early_gravity"
            ]
          },
          {
            "env_id": 15,
            "ever_position_goal": false,
            "ever_pose_goal": false,
            "success": false,
            "terminated": true,
            "timeout": false,
            "censored": false,
            "episode_length_steps": 184,
            "duration_seconds": 3.68,
            "minimum_goal_distance_m": 2.7773871421813965,
            "first_position_goal_step": null,
            "first_pose_goal_step": null,
            "terminal_goal_distance_m": 2.7773871421813965,
            "terminal_heading_error_rad": 1.6900451183319092,
            "terminal_position_goal": false,
            "terminal_pose_goal": false,
            "last_observed_goal_distance_m": 2.7773871421813965,
            "last_observed_heading_error_rad": 1.6900451183319092,
            "terminal_terms": [
              "early_gravity"
            ]
          }
        ],
        "summary": {
          "num_environments": 16,
          "ever_position_goal": 10,
          "ever_pose_goal": 10,
          "successes": 9,
          "terminated": 7,
          "timeouts": 9,
          "censored": 0
        }
      },
      "steps_completed": 800,
      "simulation_seconds": 16.0,
      "finite_checks_passed": true,
      "videos": [],
      "wall_seconds": 26.326675785006955,
      "path": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/jit_seed42/result.json",
      "sha256": "a0b187accdff65e2424e803295ec7512877777c1760c478c76dd60a0051a3876"
    },
    {
      "schema_version": 1,
      "command": [
        "scripts/research/checkpoint_audit.py",
        "/workspace/ame2-minimal/ame2/logs/rsl_rl/research_official_full/2026-10-10_04-38-09_full/model_0.pt",
        "/workspace/ame2-minimal/ame2/logs/rsl_rl/research_official_full/2026-10-10_04-38-09_full/model_4999.pt",
        "--tensorboard",
        "--require_updates",
        "--expected_heads",
        "23",
        "--output",
        "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/local_checkpoint_audit.json"
      ],
      "runs": [
        {
          "path": "/workspace/ame2-minimal/ame2/logs/rsl_rl/research_official_full/2026-10-10_04-38-09_full",
          "checkpoints": [
            {
              "path": "/workspace/ame2-minimal/ame2/logs/rsl_rl/research_official_full/2026-10-10_04-38-09_full/model_0.pt",
              "sha256": "41d9cfb01196aff788b92eec69d3bd84cf753f43c754936602adff7afb914de0",
              "bytes": 82509875,
              "iteration": 0,
              "tensor_count": 358,
              "nonfinite_tensors": [],
              "actor_parameters": 1274544,
              "critic_parameters": 9014144,
              "critic_heads": 23,
              "optimizer_kind": "muon_adamw",
              "optimizer_parameter_groups": 2,
              "optimizer_state_entries": 143,
              "passed": true
            },
            {
              "path": "/workspace/ame2-minimal/ame2/logs/rsl_rl/research_official_full/2026-10-10_04-38-09_full/model_4999.pt",
              "sha256": "0d859f33e5e642961f01fc078bde64e73ee9dd5e4ff0fca014b9637c7ce8b80e",
              "bytes": 82511607,
              "iteration": 4999,
              "tensor_count": 358,
              "nonfinite_tensors": [],
              "actor_parameters": 1274544,
              "critic_parameters": 9014144,
              "critic_heads": 23,
              "optimizer_kind": "muon_adamw",
              "optimizer_parameter_groups": 2,
              "optimizer_state_entries": 143,
              "passed": true,
              "actor_change_from_first": {
                "changed_tensors": 41,
                "max_absolute_parameter_change": 1.2847623825073242
              },
              "critic_change_from_first": {
                "changed_tensors": 102,
                "max_absolute_parameter_change": 2.4458084106445312
              }
            }
          ],
          "passed": true,
          "updates_proven": true,
          "tensorboard": {
            "tags": {
              "Episode_Reward/ame2_position_tracking": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 0.0,
                "maximum": 2.254222869873047,
                "last": 1.5873825550079346,
                "finite": true
              },
              "Episode_Reward/ame2_heading_tracking": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 0.0,
                "maximum": 1.1071646213531494,
                "last": 0.7731799483299255,
                "finite": true
              },
              "Episode_Reward/ame2_move2goal": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 0.024680575355887413,
                "maximum": 2.5199971199035645,
                "last": 2.150744915008545,
                "finite": true
              },
              "Episode_Reward/ame2_standatgoal": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 0.0,
                "maximum": 0.7967678308486938,
                "last": 0.5612019300460815,
                "finite": true
              },
              "Episode_Reward/early_termination_penalty": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": -0.6507071852684021,
                "maximum": -0.03038194589316845,
                "last": -0.4698241651058197,
                "finite": true
              },
              "Episode_Reward/undesired_spinning": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": -0.037173084914684296,
                "maximum": -0.002309635514393449,
                "last": -0.03310825675725937,
                "finite": true
              },
              "Episode_Reward/undesired_leaping": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": -0.006674460135400295,
                "maximum": -0.0017433655448257923,
                "last": -0.0036798110231757164,
                "finite": true
              },
              "Episode_Reward/undesired_non_foot_contacts": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": -0.044346895068883896,
                "maximum": -0.00045065314043313265,
                "last": -0.024626053869724274,
                "finite": true
              },
              "Episode_Reward/undesired_stumbling": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": -0.04497666656970978,
                "maximum": -0.00043380860006436706,
                "last": -0.028377419337630272,
                "finite": true
              },
              "Episode_Reward/undesired_slippage": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": -0.09055808186531067,
                "maximum": -0.005918340291827917,
                "last": -0.07687302678823471,
                "finite": true
              },
              "Episode_Reward/undesired_self_col_knee": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": -0.00045164645416662097,
                "maximum": 0.0,
                "last": -1.201923078042455e-05,
                "finite": true
              },
              "Episode_Reward/undesired_self_col_torso": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": -0.004279946908354759,
                "maximum": -1.1837121292046504e-06,
                "last": -0.0012869562488049269,
                "finite": true
              },
              "Episode_Reward/undesired_self_col_ankle": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": -0.002641040598973632,
                "maximum": 0.0,
                "last": -0.0012098908191546798,
                "finite": true
              },
              "Episode_Reward/base_roll_rate": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": -0.03783490136265755,
                "maximum": -0.002892147284001112,
                "last": -0.03112252801656723,
                "finite": true
              },
              "Episode_Reward/joint_regularization": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": -0.6615908145904541,
                "maximum": -0.07390736043453217,
                "last": -0.5892252922058105,
                "finite": true
              },
              "Episode_Reward/action_smoothness": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": -0.10473915934562683,
                "maximum": -0.006976084318011999,
                "last": -0.08918657898902893,
                "finite": true
              },
              "Episode_Reward/link_contact_forces": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": -0.037972934544086456,
                "maximum": -0.0013910200214013457,
                "last": -0.025255724787712097,
                "finite": true
              },
              "Episode_Reward/body_lin_acc_l1": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": -0.1803331822156906,
                "maximum": -0.010586773976683617,
                "last": -0.15627117455005646,
                "finite": true
              },
              "Episode_Reward/joint_pos_limits": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": -0.3143649399280548,
                "maximum": -0.003234829753637314,
                "last": -0.1395905464887619,
                "finite": true
              },
              "Episode_Reward/joint_vel_limits": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": -0.0036668013781309128,
                "maximum": 0.0,
                "last": -0.0021639803890138865,
                "finite": true
              },
              "Episode_Reward/joint_torque_limits": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": -0.16700422763824463,
                "maximum": -0.0023629639763385057,
                "last": -0.11679159104824066,
                "finite": true
              },
              "Episode_Reward/ame2_optional_uppershaping": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": -0.13206815719604492,
                "maximum": -0.0010773285757750273,
                "last": -0.07423033565282822,
                "finite": true
              },
              "Episode_Reward/ame2_optional_foot_shaping": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": -0.08296827971935272,
                "maximum": -0.000662492704577744,
                "last": -0.07271429896354675,
                "finite": true
              },
              "Curriculum/terrain_levels": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 0.0126953125,
                "maximum": 3.9495444297790527,
                "last": 3.9495444297790527,
                "finite": true
              },
              "Metrics/base_pose/error_pos": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 0.0,
                "maximum": 0.0,
                "last": 0.0,
                "finite": true
              },
              "Metrics/base_pose/error_heading": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 0.49570411443710327,
                "maximum": 1.301438570022583,
                "last": 0.7187355756759644,
                "finite": true
              },
              "Episode_Termination/time_out": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 0.0,
                "maximum": 0.33172607421875,
                "last": 0.31256103515625,
                "finite": true
              },
              "Episode_Termination/early_gravity": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 7.120768714230508e-05,
                "maximum": 0.9999288320541382,
                "last": 0.6041056513786316,
                "finite": true
              },
              "Episode_Termination/early_hip_acc": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 0.0,
                "maximum": 0.013946533203125,
                "last": 0.008148193359375,
                "finite": true
              },
              "Episode_Termination/early_illegal_contact": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 9.1552734375e-05,
                "maximum": 0.0815633162856102,
                "last": 0.0521341972053051,
                "finite": true
              },
              "Episode_Termination/early_stagnation": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 0.0,
                "maximum": 0.0417887382209301,
                "last": 0.0293680839240551,
                "finite": true
              },
              "Log/SuccessRateReachEMA": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 3.634903142368806e-12,
                "maximum": 0.293599933385849,
                "last": 0.29293587803840637,
                "finite": true
              },
              "Log/SuccessRate/Terrain_rough": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 2.1546949988127118e-11,
                "maximum": 0.43887782096862793,
                "last": 0.40774354338645935,
                "finite": true
              },
              "Log/TerrainLevel/Terrain_rough": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 0.009756098501384258,
                "maximum": 7.234357833862305,
                "last": 7.023754119873047,
                "finite": true
              },
              "Log/SuccessRate/Terrain_stair_down": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 5.00391785299148e-12,
                "maximum": 0.3035631775856018,
                "last": 0.15988102555274963,
                "finite": true
              },
              "Log/TerrainLevel/Terrain_stair_down": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 0.0,
                "maximum": 5.629268646240234,
                "last": 5.57560920715332,
                "finite": true
              },
              "Log/SuccessRate/Terrain_stair_up": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 0.0,
                "maximum": 0.3027397394180298,
                "last": 0.22469492256641388,
                "finite": true
              },
              "Log/TerrainLevel/Terrain_stair_up": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 0.0,
                "maximum": 4.863414764404297,
                "last": 4.863414764404297,
                "finite": true
              },
              "Log/SuccessRate/Terrain_boxes": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 0.0,
                "maximum": 0.8573325872421265,
                "last": 0.8489418029785156,
                "finite": true
              },
              "Log/TerrainLevel/Terrain_boxes": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 0.24390245974063873,
                "maximum": 6.70392370223999,
                "last": 6.148674488067627,
                "finite": true
              },
              "Log/SuccessRate/Terrain_obstacles": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 0.0,
                "maximum": 0.7089166641235352,
                "last": 0.704795241355896,
                "finite": true
              },
              "Log/TerrainLevel/Terrain_obstacles": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 0.0,
                "maximum": 7.173064708709717,
                "last": 6.471261978149414,
                "finite": true
              },
              "Log/SuccessRate/Terrain_climb_up": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 8.961187183059239e-16,
                "maximum": 0.31025320291519165,
                "last": 0.1289132833480835,
                "finite": true
              },
              "Log/TerrainLevel/Terrain_climb_up": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 0.0,
                "maximum": 3.9500982761383057,
                "last": 3.9500982761383057,
                "finite": true
              },
              "Log/SuccessRate/Terrain_climb_down": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 1.2719077906783033e-13,
                "maximum": 0.33913105726242065,
                "last": 0.18189886212348938,
                "finite": true
              },
              "Log/TerrainLevel/Terrain_climb_down": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 0.0,
                "maximum": 6.892683029174805,
                "last": 6.887805461883545,
                "finite": true
              },
              "Log/SuccessRate/Terrain_consecutive": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 0.0,
                "maximum": 0.4048248529434204,
                "last": 0.3657945692539215,
                "finite": true
              },
              "Log/TerrainLevel/Terrain_consecutive": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 0.0,
                "maximum": 6.068628311157227,
                "last": 6.068628311157227,
                "finite": true
              },
              "Log/SuccessRate/Terrain_gap": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 0.0,
                "maximum": 0.30202358961105347,
                "last": 0.16586633026599884,
                "finite": true
              },
              "Log/TerrainLevel/Terrain_gap": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 0.0,
                "maximum": 5.259385585784912,
                "last": 5.259385585784912,
                "finite": true
              },
              "Log/SuccessRate/Terrain_pallets": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 1.365700951714557e-14,
                "maximum": 0.3711518943309784,
                "last": 0.3274877369403839,
                "finite": true
              },
              "Log/TerrainLevel/Terrain_pallets": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 0.0,
                "maximum": 3.750371217727661,
                "last": 3.6969246864318848,
                "finite": true
              },
              "Log/SuccessRate/Terrain_beam": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 0.0,
                "maximum": 0.37312814593315125,
                "last": 0.22093942761421204,
                "finite": true
              },
              "Log/TerrainLevel/Terrain_beam": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 0.0,
                "maximum": 7.890138149261475,
                "last": 7.890138149261475,
                "finite": true
              },
              "Log/SuccessRate/Terrain_stones": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 0.0,
                "maximum": 0.29096704721450806,
                "last": 0.28908976912498474,
                "finite": true
              },
              "Log/TerrainLevel/Terrain_stones": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 0.0,
                "maximum": 2.573219060897827,
                "last": 0.5473374724388123,
                "finite": true
              },
              "Curriculum/YawLimit": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 0.0008508480386808515,
                "maximum": 3.1415929794311523,
                "last": 3.1415929794311523,
                "finite": true
              },
              "Curriculum/GoalConeAngle": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 10.009479522705078,
                "maximum": 45.0,
                "last": 45.0,
                "finite": true
              },
              "Curriculum/TeacherMappingNoise": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 1.3541668522520922e-05,
                "maximum": 0.05000000074505806,
                "last": 0.05000000074505806,
                "finite": true
              },
              "Loss/value": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 0.0031700669787824154,
                "maximum": 0.91551673412323,
                "last": 0.0606328547000885,
                "finite": true
              },
              "Loss/surrogate": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": -0.02221001125872135,
                "maximum": 0.005848290864378214,
                "last": -0.0012089357478544116,
                "finite": true
              },
              "Loss/entropy": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 13.043875694274902,
                "maximum": 32.52592468261719,
                "last": 13.595958709716797,
                "finite": true
              },
              "Loss/entropy_coef": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 0.002426062012091279,
                "maximum": 0.003999600186944008,
                "last": 0.002426062012091279,
                "finite": true
              },
              "Loss/symmetry": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 0.0,
                "maximum": 0.0,
                "last": 0.0,
                "finite": true
              },
              "Loss/auxiliary": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 0.0,
                "maximum": 1.1258060794716584e-06,
                "last": 7.925665101993218e-08,
                "finite": true
              },
              "Loss/learning_rate": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 9.999999747378752e-06,
                "maximum": 0.0010000000474974513,
                "last": 1.4999999621068127e-05,
                "finite": true
              },
              "Policy/mean_std": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 0.43669483065605164,
                "maximum": 0.9924723505973816,
                "last": 0.4555652141571045,
                "finite": true
              },
              "Perf/total_fps": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 7036.0,
                "maximum": 15006.0,
                "last": 14848.0,
                "finite": true
              },
              "Perf/collection_time": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 2.9729857444763184,
                "maximum": 9.446009635925293,
                "last": 3.0388543605804443,
                "finite": true
              },
              "Perf/learning_time": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 3.5699315071105957,
                "maximum": 4.523926734924316,
                "last": 3.5815224647521973,
                "finite": true
              },
              "Train/mean_reward": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": -21.550493240356445,
                "maximum": 90.34367370605469,
                "last": 50.183406829833984,
                "finite": true
              },
              "Train/mean_episode_length": {
                "count": 5000,
                "first_step": 0,
                "last_step": 4999,
                "minimum": 13.960000038146973,
                "maximum": 493.25,
                "last": 409.0,
                "finite": true
              },
              "Train/mean_reward/time": {
                "count": 5000,
                "first_step": 13,
                "last_step": 33258,
                "minimum": -21.550493240356445,
                "maximum": 90.34367370605469,
                "last": 50.183406829833984,
                "finite": true
              },
              "Train/mean_episode_length/time": {
                "count": 5000,
                "first_step": 13,
                "last_step": 33258,
                "minimum": 13.960000038146973,
                "maximum": 493.25,
                "last": 409.0,
                "finite": true
              },
              "Metrics/base_pose/error_pos_2d": {
                "count": 4999,
                "first_step": 1,
                "last_step": 4999,
                "minimum": 1.594122290611267,
                "maximum": 4.469947814941406,
                "last": 1.9174237251281738,
                "finite": true
              }
            },
            "loss_tags": [
              "Loss/auxiliary",
              "Loss/entropy",
              "Loss/entropy_coef",
              "Loss/learning_rate",
              "Loss/surrogate",
              "Loss/symmetry",
              "Loss/value"
            ],
            "passed": true
          }
        }
      ],
      "passed": true,
      "limitations": [
        "Gradients are not stored in checkpoints and cannot be inspected after saving.",
        "Finite weights and finite losses do not establish policy quality or convergence."
      ],
      "wall_seconds": 4.464749076170847,
      "path": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/local_checkpoint_audit.json",
      "sha256": "f5765529ef4f12ac4c9b9ca75c75d201c284f6477f69490a268f8bc16244b07b"
    },
    {
      "schema_version": 1,
      "started_utc": "2026-10-10T14:24:37.887954+00:00",
      "command": [
        "scripts/research/verify.py",
        "--headless",
        "--task",
        "Ame2-G1-Gaze-Play",
        "--terrain",
        "all",
        "--num_envs",
        "16",
        "--steps",
        "800",
        "--seed",
        "42",
        "--difficulty",
        "0.5",
        "--checkpoint",
        "/workspace/ame2-minimal/ame2/logs/rsl_rl/research_official_full/2026-10-10_04-38-09_full/model_4999.pt",
        "--policy",
        "native",
        "--first_episode",
        "--report",
        "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/native_seed42/result.json",
        "--export_jit"
      ],
      "arguments": {
        "task": "Ame2-G1-Gaze-Play",
        "terrain": "all",
        "difficulty": 0.5,
        "num_envs": 16,
        "steps": 800,
        "seed": 42,
        "checkpoint": "/workspace/ame2-minimal/ame2/logs/rsl_rl/research_official_full/2026-10-10_04-38-09_full/model_4999.pt",
        "policy": "native",
        "export_jit": true,
        "video": false,
        "attention": false,
        "mid360": false,
        "first_episode": true,
        "report": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/native_seed42/result.json",
        "enable_cameras": false,
        "xr": false,
        "device": "cuda:0",
        "cpu": false,
        "verbose": false,
        "info": false,
        "rendering_mode": null,
        "kit_args": "",
        "anim_recording_enabled": false,
        "anim_recording_start_time": 0,
        "anim_recording_stop_time": 10,
        "headless": true,
        "hide_ui": true,
        "create_new_stage": false,
        "physics_gpu": 0,
        "active_gpu": 0
      },
      "python": "3.11.13",
      "torch": "2.7.0+cu128",
      "cuda": "12.8",
      "passed": true,
      "packages": {
        "isaaclab": "0.54.2",
        "rsl-rl-lib": "5.0.0",
        "ame2": "0.1.0"
      },
      "combined_scene_patch_overrides": {
        "target": {
          "original_counts": [
            10,
            30
          ],
          "combined_scene_count": 10
        }
      },
      "terrain_names": [
        "rough",
        "stair_down",
        "stair_up",
        "boxes",
        "obstacles",
        "climb_up",
        "climb_down",
        "consecutive",
        "gap",
        "pallets",
        "beam",
        "stones",
        "pit",
        "peak",
        "test_1",
        "test_2"
      ],
      "registered_tasks": [
        "Ame2-G1",
        "Ame2-G1-Gaze",
        "Ame2-G1-Gaze-Play",
        "Ame2-G1-Gaze-Student",
        "Ame2-G1-Gaze-Student-Play",
        "Ame2-G1-Play"
      ],
      "terrain_grid": {
        "rows": 1,
        "columns": 16,
        "difficulty_range": [
          0.5,
          0.5
        ],
        "generator_curriculum": true,
        "environment_terrain_curriculum": false
      },
      "observation_shapes": {
        "teacher_mapping": [
          16,
          26,
          15,
          3
        ],
        "teacher_prop": [
          16,
          82
        ],
        "critic": [
          16,
          499
        ]
      },
      "actions": 23,
      "reward_terms": [
        "ame2_position_tracking",
        "ame2_heading_tracking",
        "ame2_move2goal",
        "ame2_standatgoal",
        "early_termination_penalty",
        "undesired_spinning",
        "undesired_leaping",
        "undesired_non_foot_contacts",
        "undesired_stumbling",
        "undesired_slippage",
        "undesired_self_col_knee",
        "undesired_self_col_torso",
        "undesired_self_col_ankle",
        "base_roll_rate",
        "joint_regularization",
        "action_smoothness",
        "link_contact_forces",
        "body_lin_acc_l1",
        "joint_pos_limits",
        "joint_vel_limits",
        "joint_torque_limits",
        "ame2_optional_uppershaping",
        "ame2_optional_foot_shaping"
      ],
      "termination_terms": [
        "time_out",
        "early_gravity",
        "early_hip_acc",
        "early_illegal_contact",
        "early_stagnation"
      ],
      "step_dt": 0.02,
      "policy_mode": "native",
      "checkpoint": {
        "path": "/workspace/ame2-minimal/ame2/logs/rsl_rl/research_official_full/2026-10-10_04-38-09_full/model_4999.pt",
        "sha256": "0d859f33e5e642961f01fc078bde64e73ee9dd5e4ff0fca014b9637c7ce8b80e",
        "iteration": 4999
      },
      "critic_heads": 23,
      "jit": {
        "path": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/native_seed42/result.jit",
        "sha256": "26d802167186aa49efaacd73a4c98907c5f42244994858318df63a30d54c42cb",
        "max_absolute_action_error": 4.76837158203125e-07,
        "passed": true
      },
      "environments": [
        {
          "env_id": 0,
          "terrain": "rough",
          "terrain_column": 0,
          "reward_sum": 281.4403991699219,
          "minimum_goal_distance_m": 0.05755393207073212,
          "final_goal_distance_m": 0.31000468134880066,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            0.07378976047039032,
            -89.96841430664062,
            0.7549999952316284
          ],
          "final_position": [
            0.10308213531970978,
            -90.04322814941406,
            0.7549999952316284
          ]
        },
        {
          "env_id": 1,
          "terrain": "stair_down",
          "terrain_column": 1,
          "reward_sum": 187.76937866210938,
          "minimum_goal_distance_m": 0.23785796761512756,
          "final_goal_distance_m": 2.009204864501953,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            -0.17293024063110352,
            -77.83193969726562,
            2.6999998092651367
          ],
          "final_position": [
            0.1223258227109909,
            -77.92804718017578,
            2.6999998092651367
          ]
        },
        {
          "env_id": 2,
          "terrain": "stair_up",
          "terrain_column": 2,
          "reward_sum": 214.2435302734375,
          "minimum_goal_distance_m": 0.11308266222476959,
          "final_goal_distance_m": 3.932039737701416,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            0.15759538114070892,
            -66.16976928710938,
            -0.9800000190734863
          ],
          "final_position": [
            -0.17624926567077637,
            -66.19886779785156,
            -0.9800000190734863
          ]
        },
        {
          "env_id": 3,
          "terrain": "boxes",
          "terrain_column": 3,
          "reward_sum": 236.67123413085938,
          "minimum_goal_distance_m": 0.20118923485279083,
          "final_goal_distance_m": 3.7888243198394775,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            -0.05352550745010376,
            -54.10257339477539,
            0.7799999713897705
          ],
          "final_position": [
            0.17676247656345367,
            -54.079994201660156,
            0.7799999713897705
          ]
        },
        {
          "env_id": 4,
          "terrain": "obstacles",
          "terrain_column": 4,
          "reward_sum": 256.4670715332031,
          "minimum_goal_distance_m": 0.26511746644973755,
          "final_goal_distance_m": 4.061428546905518,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            -0.04984506964683533,
            -42.01253890991211,
            0.9099999666213989
          ],
          "final_position": [
            -0.0024336129426956177,
            -42.16368103027344,
            0.9099999666213989
          ]
        },
        {
          "env_id": 5,
          "terrain": "climb_up",
          "terrain_column": 5,
          "reward_sum": 27.337928771972656,
          "minimum_goal_distance_m": 0.9184554219245911,
          "final_goal_distance_m": 1.067662239074707,
          "reached_goal": false,
          "early_terminations": 1,
          "timeouts": 0,
          "initial_position": [
            0.04115745425224304,
            -29.972734451293945,
            0.7799999713897705
          ],
          "final_position": [
            1.9408748149871826,
            -29.520750045776367,
            0.7826316952705383
          ]
        },
        {
          "env_id": 6,
          "terrain": "climb_down",
          "terrain_column": 6,
          "reward_sum": 243.72561645507812,
          "minimum_goal_distance_m": 0.004487309139221907,
          "final_goal_distance_m": 3.06551456451416,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            0.114842489361763,
            -17.95186996459961,
            1.3199999332427979
          ],
          "final_position": [
            0.06107683479785919,
            -18.129314422607422,
            1.3199999332427979
          ]
        },
        {
          "env_id": 7,
          "terrain": "consecutive",
          "terrain_column": 7,
          "reward_sum": 195.77549743652344,
          "minimum_goal_distance_m": 0.11013294011354446,
          "final_goal_distance_m": 5.16267204284668,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            -0.05329671502113342,
            -6.075638771057129,
            0.7799999713897705
          ],
          "final_position": [
            0.049306511878967285,
            -5.914506435394287,
            0.7799999713897705
          ]
        },
        {
          "env_id": 8,
          "terrain": "gap",
          "terrain_column": 8,
          "reward_sum": 21.712100982666016,
          "minimum_goal_distance_m": 0.6494410634040833,
          "final_goal_distance_m": 1.2580862045288086,
          "reached_goal": false,
          "early_terminations": 2,
          "timeouts": 0,
          "initial_position": [
            0.062202975153923035,
            6.08181095123291,
            0.7799999713897705
          ],
          "final_position": [
            2.1108508110046387,
            4.667342662811279,
            0.8900908827781677
          ]
        },
        {
          "env_id": 9,
          "terrain": "pallets",
          "terrain_column": 9,
          "reward_sum": 47.87207794189453,
          "minimum_goal_distance_m": 0.04011670872569084,
          "final_goal_distance_m": 0.04011670872569084,
          "reached_goal": true,
          "early_terminations": 1,
          "timeouts": 0,
          "initial_position": [
            0.001975014805793762,
            17.86756706237793,
            0.8799999952316284
          ],
          "final_position": [
            5.079013347625732,
            14.188530921936035,
            0.7731847763061523
          ]
        },
        {
          "env_id": 10,
          "terrain": "beam",
          "terrain_column": 10,
          "reward_sum": 256.552978515625,
          "minimum_goal_distance_m": 0.10439623147249222,
          "final_goal_distance_m": 5.014909267425537,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            0.1966199427843094,
            29.950069427490234,
            0.7799999713897705
          ],
          "final_position": [
            0.025081515312194824,
            30.08001136779785,
            0.7799999713897705
          ]
        },
        {
          "env_id": 11,
          "terrain": "stones",
          "terrain_column": 11,
          "reward_sum": 91.33074951171875,
          "minimum_goal_distance_m": 0.008549459278583527,
          "final_goal_distance_m": 0.047969743609428406,
          "reached_goal": true,
          "early_terminations": 1,
          "timeouts": 0,
          "initial_position": [
            0.1934022456407547,
            42.18138122558594,
            0.9280452728271484
          ],
          "final_position": [
            5.32283353805542,
            44.88467788696289,
            0.8164049983024597
          ]
        },
        {
          "env_id": 12,
          "terrain": "pit",
          "terrain_column": 12,
          "reward_sum": 12.615118026733398,
          "minimum_goal_distance_m": 3.2676780223846436,
          "final_goal_distance_m": 3.8721702098846436,
          "reached_goal": false,
          "early_terminations": 1,
          "timeouts": 0,
          "initial_position": [
            -0.06086137890815735,
            53.919403076171875,
            0.2799999713897705
          ],
          "final_position": [
            0.9227398037910461,
            54.21870422363281,
            0.23101015388965607
          ]
        },
        {
          "env_id": 13,
          "terrain": "peak",
          "terrain_column": 13,
          "reward_sum": -17.788002014160156,
          "minimum_goal_distance_m": 1.791481852531433,
          "final_goal_distance_m": 1.791481852531433,
          "reached_goal": false,
          "early_terminations": 3,
          "timeouts": 0,
          "initial_position": [
            -0.11118453741073608,
            66.16226959228516,
            1.7799999713897705
          ],
          "final_position": [
            1.1033194065093994,
            65.60049438476562,
            1.741471529006958
          ]
        },
        {
          "env_id": 14,
          "terrain": "test_1",
          "terrain_column": 14,
          "reward_sum": 7.832769393920898,
          "minimum_goal_distance_m": 2.834364891052246,
          "final_goal_distance_m": 4.695729732513428,
          "reached_goal": false,
          "early_terminations": 3,
          "timeouts": 0,
          "initial_position": [
            -0.15217077732086182,
            78.1917495727539,
            1.7799999713897705
          ],
          "final_position": [
            1.0611200332641602,
            77.73480987548828,
            1.5315990447998047
          ]
        },
        {
          "env_id": 15,
          "terrain": "test_2",
          "terrain_column": 15,
          "reward_sum": 5.2360382080078125,
          "minimum_goal_distance_m": 1.8989324569702148,
          "final_goal_distance_m": 3.0611488819122314,
          "reached_goal": false,
          "early_terminations": 4,
          "timeouts": 0,
          "initial_position": [
            -0.13490793108940125,
            90.15071868896484,
            0.8799999952316284
          ],
          "final_position": [
            1.4501023292541504,
            89.80597686767578,
            0.589244544506073
          ]
        }
      ],
      "first_episode": {
        "scope": "initial reset through first terminated-or-timeout state, inclusive",
        "sampling_phase": "after physics/reward computation and before automatic reset",
        "position_threshold_m": 0.5,
        "heading_threshold_rad": 0.5,
        "success_definition": "First episode ends with timeout=true and terminated=false, and its pre-reset terminal planar goal distance is <0.5m and absolute wrapped heading error is <0.5rad. Censored episodes are not successful. This tests the terminal pose, not a dwell-time requirement.",
        "duration_definition": "Elapsed first-episode simulation time; censored episodes show observed time only.",
        "environments": [
          {
            "env_id": 0,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.05755393207073212,
            "first_position_goal_step": 0,
            "first_pose_goal_step": 0,
            "terminal_goal_distance_m": 0.22371700406074524,
            "terminal_heading_error_rad": -0.13680195808410645,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.22371700406074524,
            "last_observed_heading_error_rad": -0.13680195808410645,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 1,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.23785796761512756,
            "first_position_goal_step": 520,
            "first_pose_goal_step": 638,
            "terminal_goal_distance_m": 0.29835236072540283,
            "terminal_heading_error_rad": -0.30574965476989746,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.29835236072540283,
            "last_observed_heading_error_rad": -0.30574965476989746,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 2,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.11308266222476959,
            "first_position_goal_step": 351,
            "first_pose_goal_step": 435,
            "terminal_goal_distance_m": 0.15023279190063477,
            "terminal_heading_error_rad": -0.276627779006958,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.15023279190063477,
            "last_observed_heading_error_rad": -0.276627779006958,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 3,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.20118923485279083,
            "first_position_goal_step": 495,
            "first_pose_goal_step": 495,
            "terminal_goal_distance_m": 0.2015298753976822,
            "terminal_heading_error_rad": 0.030031919479370117,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.2015298753976822,
            "last_observed_heading_error_rad": 0.030031919479370117,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 4,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.26511746644973755,
            "first_position_goal_step": 279,
            "first_pose_goal_step": 297,
            "terminal_goal_distance_m": 0.2729600965976715,
            "terminal_heading_error_rad": 0.09627342224121094,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.2729600965976715,
            "last_observed_heading_error_rad": 0.09627342224121094,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 5,
            "ever_position_goal": false,
            "ever_pose_goal": false,
            "success": false,
            "terminated": true,
            "timeout": false,
            "censored": false,
            "episode_length_steps": 312,
            "duration_seconds": 6.24,
            "minimum_goal_distance_m": 1.9528340101242065,
            "first_position_goal_step": null,
            "first_pose_goal_step": null,
            "terminal_goal_distance_m": 1.9528340101242065,
            "terminal_heading_error_rad": 0.13290071487426758,
            "terminal_position_goal": false,
            "terminal_pose_goal": false,
            "last_observed_goal_distance_m": 1.9528340101242065,
            "last_observed_heading_error_rad": 0.13290071487426758,
            "terminal_terms": [
              "early_gravity"
            ]
          },
          {
            "env_id": 6,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.004355520009994507,
            "first_position_goal_step": 319,
            "first_pose_goal_step": 319,
            "terminal_goal_distance_m": 0.004355520009994507,
            "terminal_heading_error_rad": 0.033014535903930664,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.004355520009994507,
            "last_observed_heading_error_rad": 0.033014535903930664,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 7,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.11010400950908661,
            "first_position_goal_step": 574,
            "first_pose_goal_step": 574,
            "terminal_goal_distance_m": 0.11010400950908661,
            "terminal_heading_error_rad": -0.08467388153076172,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.11010400950908661,
            "last_observed_heading_error_rad": -0.08467388153076172,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 8,
            "ever_position_goal": false,
            "ever_pose_goal": false,
            "success": false,
            "terminated": true,
            "timeout": false,
            "censored": false,
            "episode_length_steps": 269,
            "duration_seconds": 5.38,
            "minimum_goal_distance_m": 0.8605819344520569,
            "first_position_goal_step": null,
            "first_pose_goal_step": null,
            "terminal_goal_distance_m": 0.8689619898796082,
            "terminal_heading_error_rad": 0.8767836093902588,
            "terminal_position_goal": false,
            "terminal_pose_goal": false,
            "last_observed_goal_distance_m": 0.8689619898796082,
            "last_observed_heading_error_rad": 0.8767836093902588,
            "terminal_terms": [
              "early_gravity"
            ]
          },
          {
            "env_id": 9,
            "ever_position_goal": false,
            "ever_pose_goal": false,
            "success": false,
            "terminated": true,
            "timeout": false,
            "censored": false,
            "episode_length_steps": 260,
            "duration_seconds": 5.2,
            "minimum_goal_distance_m": 2.757270336151123,
            "first_position_goal_step": null,
            "first_pose_goal_step": null,
            "terminal_goal_distance_m": 2.757270336151123,
            "terminal_heading_error_rad": 2.153534173965454,
            "terminal_position_goal": false,
            "terminal_pose_goal": false,
            "last_observed_goal_distance_m": 2.757270336151123,
            "last_observed_heading_error_rad": 2.153534173965454,
            "terminal_terms": [
              "early_gravity"
            ]
          },
          {
            "env_id": 10,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.10439623147249222,
            "first_position_goal_step": 370,
            "first_pose_goal_step": 370,
            "terminal_goal_distance_m": 0.10456294566392899,
            "terminal_heading_error_rad": 0.002317190170288086,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.10456294566392899,
            "last_observed_heading_error_rad": 0.002317190170288086,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 11,
            "ever_position_goal": false,
            "ever_pose_goal": false,
            "success": false,
            "terminated": true,
            "timeout": false,
            "censored": false,
            "episode_length_steps": 163,
            "duration_seconds": 3.2600000000000002,
            "minimum_goal_distance_m": 2.6346912384033203,
            "first_position_goal_step": null,
            "first_pose_goal_step": null,
            "terminal_goal_distance_m": 2.6346912384033203,
            "terminal_heading_error_rad": 0.849694013595581,
            "terminal_position_goal": false,
            "terminal_pose_goal": false,
            "last_observed_goal_distance_m": 2.6346912384033203,
            "last_observed_heading_error_rad": 0.849694013595581,
            "terminal_terms": [
              "early_gravity"
            ]
          },
          {
            "env_id": 12,
            "ever_position_goal": false,
            "ever_pose_goal": false,
            "success": false,
            "terminated": true,
            "timeout": false,
            "censored": false,
            "episode_length_steps": 502,
            "duration_seconds": 10.040000000000001,
            "minimum_goal_distance_m": 3.2676780223846436,
            "first_position_goal_step": null,
            "first_pose_goal_step": null,
            "terminal_goal_distance_m": 3.417757987976074,
            "terminal_heading_error_rad": 0.29567503929138184,
            "terminal_position_goal": false,
            "terminal_pose_goal": false,
            "last_observed_goal_distance_m": 3.417757987976074,
            "last_observed_heading_error_rad": 0.29567503929138184,
            "terminal_terms": [
              "early_stagnation"
            ]
          },
          {
            "env_id": 13,
            "ever_position_goal": false,
            "ever_pose_goal": false,
            "success": false,
            "terminated": true,
            "timeout": false,
            "censored": false,
            "episode_length_steps": 220,
            "duration_seconds": 4.4,
            "minimum_goal_distance_m": 2.7793843746185303,
            "first_position_goal_step": null,
            "first_pose_goal_step": null,
            "terminal_goal_distance_m": 2.7793843746185303,
            "terminal_heading_error_rad": 0.15537524223327637,
            "terminal_position_goal": false,
            "terminal_pose_goal": false,
            "last_observed_goal_distance_m": 2.7793843746185303,
            "last_observed_heading_error_rad": 0.15537524223327637,
            "terminal_terms": [
              "early_gravity"
            ]
          },
          {
            "env_id": 14,
            "ever_position_goal": false,
            "ever_pose_goal": false,
            "success": false,
            "terminated": true,
            "timeout": false,
            "censored": false,
            "episode_length_steps": 234,
            "duration_seconds": 4.68,
            "minimum_goal_distance_m": 2.9621450901031494,
            "first_position_goal_step": null,
            "first_pose_goal_step": null,
            "terminal_goal_distance_m": 2.9621450901031494,
            "terminal_heading_error_rad": 2.391864061355591,
            "terminal_position_goal": false,
            "terminal_pose_goal": false,
            "last_observed_goal_distance_m": 2.9621450901031494,
            "last_observed_heading_error_rad": 2.391864061355591,
            "terminal_terms": [
              "early_gravity"
            ]
          },
          {
            "env_id": 15,
            "ever_position_goal": false,
            "ever_pose_goal": false,
            "success": false,
            "terminated": true,
            "timeout": false,
            "censored": false,
            "episode_length_steps": 198,
            "duration_seconds": 3.96,
            "minimum_goal_distance_m": 2.5526604652404785,
            "first_position_goal_step": null,
            "first_pose_goal_step": null,
            "terminal_goal_distance_m": 2.5526604652404785,
            "terminal_heading_error_rad": 3.000917673110962,
            "terminal_position_goal": false,
            "terminal_pose_goal": false,
            "last_observed_goal_distance_m": 2.5526604652404785,
            "last_observed_heading_error_rad": 3.000917673110962,
            "terminal_terms": [
              "early_gravity"
            ]
          }
        ],
        "summary": {
          "num_environments": 16,
          "ever_position_goal": 8,
          "ever_pose_goal": 8,
          "successes": 8,
          "terminated": 8,
          "timeouts": 8,
          "censored": 0
        }
      },
      "steps_completed": 800,
      "simulation_seconds": 16.0,
      "finite_checks_passed": true,
      "videos": [],
      "wall_seconds": 26.583675283007324,
      "path": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/native_seed42/result.json",
      "sha256": "ea1248c080d8cba68b71e3ab0b04c0091f634f83c97ae366215035219e9b39b9"
    },
    {
      "schema_version": 1,
      "started_utc": "2026-10-10T14:25:09.144810+00:00",
      "command": [
        "scripts/research/verify.py",
        "--headless",
        "--task",
        "Ame2-G1-Gaze-Play",
        "--terrain",
        "all",
        "--num_envs",
        "16",
        "--steps",
        "800",
        "--seed",
        "43",
        "--difficulty",
        "0.5",
        "--checkpoint",
        "/workspace/ame2-minimal/ame2/logs/rsl_rl/research_official_full/2026-10-10_04-38-09_full/model_4999.pt",
        "--policy",
        "native",
        "--first_episode",
        "--report",
        "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/native_seed43/result.json",
        "--export_jit"
      ],
      "arguments": {
        "task": "Ame2-G1-Gaze-Play",
        "terrain": "all",
        "difficulty": 0.5,
        "num_envs": 16,
        "steps": 800,
        "seed": 43,
        "checkpoint": "/workspace/ame2-minimal/ame2/logs/rsl_rl/research_official_full/2026-10-10_04-38-09_full/model_4999.pt",
        "policy": "native",
        "export_jit": true,
        "video": false,
        "attention": false,
        "mid360": false,
        "first_episode": true,
        "report": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/native_seed43/result.json",
        "enable_cameras": false,
        "xr": false,
        "device": "cuda:0",
        "cpu": false,
        "verbose": false,
        "info": false,
        "rendering_mode": null,
        "kit_args": "",
        "anim_recording_enabled": false,
        "anim_recording_start_time": 0,
        "anim_recording_stop_time": 10,
        "headless": true,
        "hide_ui": true,
        "create_new_stage": false,
        "physics_gpu": 0,
        "active_gpu": 0
      },
      "python": "3.11.13",
      "torch": "2.7.0+cu128",
      "cuda": "12.8",
      "passed": true,
      "packages": {
        "isaaclab": "0.54.2",
        "rsl-rl-lib": "5.0.0",
        "ame2": "0.1.0"
      },
      "combined_scene_patch_overrides": {
        "target": {
          "original_counts": [
            10,
            30
          ],
          "combined_scene_count": 10
        }
      },
      "terrain_names": [
        "rough",
        "stair_down",
        "stair_up",
        "boxes",
        "obstacles",
        "climb_up",
        "climb_down",
        "consecutive",
        "gap",
        "pallets",
        "beam",
        "stones",
        "pit",
        "peak",
        "test_1",
        "test_2"
      ],
      "registered_tasks": [
        "Ame2-G1",
        "Ame2-G1-Gaze",
        "Ame2-G1-Gaze-Play",
        "Ame2-G1-Gaze-Student",
        "Ame2-G1-Gaze-Student-Play",
        "Ame2-G1-Play"
      ],
      "terrain_grid": {
        "rows": 1,
        "columns": 16,
        "difficulty_range": [
          0.5,
          0.5
        ],
        "generator_curriculum": true,
        "environment_terrain_curriculum": false
      },
      "observation_shapes": {
        "teacher_mapping": [
          16,
          26,
          15,
          3
        ],
        "teacher_prop": [
          16,
          82
        ],
        "critic": [
          16,
          499
        ]
      },
      "actions": 23,
      "reward_terms": [
        "ame2_position_tracking",
        "ame2_heading_tracking",
        "ame2_move2goal",
        "ame2_standatgoal",
        "early_termination_penalty",
        "undesired_spinning",
        "undesired_leaping",
        "undesired_non_foot_contacts",
        "undesired_stumbling",
        "undesired_slippage",
        "undesired_self_col_knee",
        "undesired_self_col_torso",
        "undesired_self_col_ankle",
        "base_roll_rate",
        "joint_regularization",
        "action_smoothness",
        "link_contact_forces",
        "body_lin_acc_l1",
        "joint_pos_limits",
        "joint_vel_limits",
        "joint_torque_limits",
        "ame2_optional_uppershaping",
        "ame2_optional_foot_shaping"
      ],
      "termination_terms": [
        "time_out",
        "early_gravity",
        "early_hip_acc",
        "early_illegal_contact",
        "early_stagnation"
      ],
      "step_dt": 0.02,
      "policy_mode": "native",
      "checkpoint": {
        "path": "/workspace/ame2-minimal/ame2/logs/rsl_rl/research_official_full/2026-10-10_04-38-09_full/model_4999.pt",
        "sha256": "0d859f33e5e642961f01fc078bde64e73ee9dd5e4ff0fca014b9637c7ce8b80e",
        "iteration": 4999
      },
      "critic_heads": 23,
      "jit": {
        "path": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/native_seed43/result.jit",
        "sha256": "26d802167186aa49efaacd73a4c98907c5f42244994858318df63a30d54c42cb",
        "max_absolute_action_error": 4.76837158203125e-07,
        "passed": true
      },
      "environments": [
        {
          "env_id": 0,
          "terrain": "rough",
          "terrain_column": 0,
          "reward_sum": 281.3841247558594,
          "minimum_goal_distance_m": 0.13785985112190247,
          "final_goal_distance_m": 0.3744819164276123,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            0.07221521437168121,
            -90.16411590576172,
            0.9950000047683716
          ],
          "final_position": [
            -0.10876395553350449,
            -90.19979095458984,
            0.9950000047683716
          ]
        },
        {
          "env_id": 1,
          "terrain": "stair_down",
          "terrain_column": 1,
          "reward_sum": 227.34446716308594,
          "minimum_goal_distance_m": 0.12803056836128235,
          "final_goal_distance_m": 4.399068832397461,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            0.09019698202610016,
            -78.18133544921875,
            2.6999998092651367
          ],
          "final_position": [
            -0.11592092365026474,
            -78.12030792236328,
            2.6999998092651367
          ]
        },
        {
          "env_id": 2,
          "terrain": "stair_up",
          "terrain_column": 2,
          "reward_sum": 211.61123657226562,
          "minimum_goal_distance_m": 0.09284655749797821,
          "final_goal_distance_m": 5.8486857414245605,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            -0.007729724049568176,
            -66.0771484375,
            -0.8200000524520874
          ],
          "final_position": [
            -0.09254828840494156,
            -65.85631561279297,
            -0.8200000524520874
          ]
        },
        {
          "env_id": 3,
          "terrain": "boxes",
          "terrain_column": 3,
          "reward_sum": 237.73324584960938,
          "minimum_goal_distance_m": 0.041591156274080276,
          "final_goal_distance_m": 4.873740196228027,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            -0.09193650633096695,
            -53.97140884399414,
            0.7799999713897705
          ],
          "final_position": [
            -0.038112491369247437,
            -54.062931060791016,
            0.7799999713897705
          ]
        },
        {
          "env_id": 4,
          "terrain": "obstacles",
          "terrain_column": 4,
          "reward_sum": 259.3385314941406,
          "minimum_goal_distance_m": 0.15547491610050201,
          "final_goal_distance_m": 4.390007019042969,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            0.09105075895786285,
            -41.93056106567383,
            0.8899999856948853
          ],
          "final_position": [
            -0.03311599791049957,
            -41.88040542602539,
            0.8899999856948853
          ]
        },
        {
          "env_id": 5,
          "terrain": "climb_up",
          "terrain_column": 5,
          "reward_sum": 57.62971115112305,
          "minimum_goal_distance_m": 0.9584965109825134,
          "final_goal_distance_m": 5.815019607543945,
          "reached_goal": false,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            -0.1167679950594902,
            -30.050668716430664,
            0.7799999713897705
          ],
          "final_position": [
            -0.18228532373905182,
            -30.11431312561035,
            0.7799999713897705
          ]
        },
        {
          "env_id": 6,
          "terrain": "climb_down",
          "terrain_column": 6,
          "reward_sum": 251.42953491210938,
          "minimum_goal_distance_m": 0.02251240238547325,
          "final_goal_distance_m": 4.7961931228637695,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            0.047823742032051086,
            -17.821521759033203,
            1.3199999332427979
          ],
          "final_position": [
            0.01065722107887268,
            -18.18931007385254,
            1.3199999332427979
          ]
        },
        {
          "env_id": 7,
          "terrain": "consecutive",
          "terrain_column": 7,
          "reward_sum": 249.1424560546875,
          "minimum_goal_distance_m": 0.06989186257123947,
          "final_goal_distance_m": 4.08549690246582,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            0.0934344083070755,
            -6.070945739746094,
            0.7799999713897705
          ],
          "final_position": [
            0.008557245135307312,
            -5.889960289001465,
            0.7799999713897705
          ]
        },
        {
          "env_id": 8,
          "terrain": "gap",
          "terrain_column": 8,
          "reward_sum": 247.34414672851562,
          "minimum_goal_distance_m": 0.09679483622312546,
          "final_goal_distance_m": 3.8627431392669678,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            0.10856403410434723,
            6.01947021484375,
            0.7799999713897705
          ],
          "final_position": [
            0.199522003531456,
            5.8274736404418945,
            0.7799999713897705
          ]
        },
        {
          "env_id": 9,
          "terrain": "pallets",
          "terrain_column": 9,
          "reward_sum": 256.2838134765625,
          "minimum_goal_distance_m": 0.016761330887675285,
          "final_goal_distance_m": 7.2597527503967285,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            0.11453934013843536,
            18.039026260375977,
            0.8799999952316284
          ],
          "final_position": [
            0.10625730454921722,
            17.862592697143555,
            0.8799999952316284
          ]
        },
        {
          "env_id": 10,
          "terrain": "beam",
          "terrain_column": 10,
          "reward_sum": 250.48658752441406,
          "minimum_goal_distance_m": 0.03935496136546135,
          "final_goal_distance_m": 4.834992408752441,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            -0.1786508560180664,
            30.087026596069336,
            0.7799999713897705
          ],
          "final_position": [
            0.07135619223117828,
            30.15617561340332,
            0.7799999713897705
          ]
        },
        {
          "env_id": 11,
          "terrain": "stones",
          "terrain_column": 11,
          "reward_sum": 246.7825469970703,
          "minimum_goal_distance_m": 0.15971660614013672,
          "final_goal_distance_m": 5.822725296020508,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            0.03918829560279846,
            42.0072021484375,
            0.865821897983551
          ],
          "final_position": [
            -0.0312981903553009,
            41.835079193115234,
            0.865821897983551
          ]
        },
        {
          "env_id": 12,
          "terrain": "pit",
          "terrain_column": 12,
          "reward_sum": 15.01795768737793,
          "minimum_goal_distance_m": 2.8107450008392334,
          "final_goal_distance_m": 3.143935203552246,
          "reached_goal": false,
          "early_terminations": 3,
          "timeouts": 0,
          "initial_position": [
            -0.13570427894592285,
            53.81977081298828,
            0.2799999713897705
          ],
          "final_position": [
            0.5922284126281738,
            54.574462890625,
            0.24698799848556519
          ]
        },
        {
          "env_id": 13,
          "terrain": "peak",
          "terrain_column": 13,
          "reward_sum": 241.9747314453125,
          "minimum_goal_distance_m": 0.08560191839933395,
          "final_goal_distance_m": 2.5214428901672363,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            -0.1191510483622551,
            65.81900024414062,
            1.7799999713897705
          ],
          "final_position": [
            -0.014881879091262817,
            66.16260528564453,
            1.7799999713897705
          ]
        },
        {
          "env_id": 14,
          "terrain": "test_1",
          "terrain_column": 14,
          "reward_sum": 8.066851615905762,
          "minimum_goal_distance_m": 0.8589410781860352,
          "final_goal_distance_m": 5.4585418701171875,
          "reached_goal": false,
          "early_terminations": 3,
          "timeouts": 0,
          "initial_position": [
            0.028371259570121765,
            77.90396118164062,
            1.7799999713897705
          ],
          "final_position": [
            0.2350638508796692,
            78.07119750976562,
            1.775872826576233
          ]
        },
        {
          "env_id": 15,
          "terrain": "test_2",
          "terrain_column": 15,
          "reward_sum": -5.608950138092041,
          "minimum_goal_distance_m": 2.653618335723877,
          "final_goal_distance_m": 4.427814960479736,
          "reached_goal": false,
          "early_terminations": 5,
          "timeouts": 0,
          "initial_position": [
            0.1060502678155899,
            89.90774536132812,
            0.8799999952316284
          ],
          "final_position": [
            0.08146402984857559,
            89.86984252929688,
            0.8452178239822388
          ]
        }
      ],
      "first_episode": {
        "scope": "initial reset through first terminated-or-timeout state, inclusive",
        "sampling_phase": "after physics/reward computation and before automatic reset",
        "position_threshold_m": 0.5,
        "heading_threshold_rad": 0.5,
        "success_definition": "First episode ends with timeout=true and terminated=false, and its pre-reset terminal planar goal distance is <0.5m and absolute wrapped heading error is <0.5rad. Censored episodes are not successful. This tests the terminal pose, not a dwell-time requirement.",
        "duration_definition": "Elapsed first-episode simulation time; censored episodes show observed time only.",
        "environments": [
          {
            "env_id": 0,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.13785985112190247,
            "first_position_goal_step": 0,
            "first_pose_goal_step": 0,
            "terminal_goal_distance_m": 0.20160754024982452,
            "terminal_heading_error_rad": -0.015703916549682617,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.20160754024982452,
            "last_observed_heading_error_rad": -0.015703916549682617,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 1,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.12803056836128235,
            "first_position_goal_step": 276,
            "first_pose_goal_step": 276,
            "terminal_goal_distance_m": 0.47007739543914795,
            "terminal_heading_error_rad": 0.016423463821411133,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.47007739543914795,
            "last_observed_heading_error_rad": 0.016423463821411133,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 2,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.09284655749797821,
            "first_position_goal_step": 407,
            "first_pose_goal_step": 407,
            "terminal_goal_distance_m": 0.3252757489681244,
            "terminal_heading_error_rad": -0.3050384521484375,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.3252757489681244,
            "last_observed_heading_error_rad": -0.3050384521484375,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 3,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.041591156274080276,
            "first_position_goal_step": 455,
            "first_pose_goal_step": 474,
            "terminal_goal_distance_m": 0.3374820053577423,
            "terminal_heading_error_rad": -0.11656785011291504,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.3374820053577423,
            "last_observed_heading_error_rad": -0.11656785011291504,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 4,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.15547491610050201,
            "first_position_goal_step": 314,
            "first_pose_goal_step": 314,
            "terminal_goal_distance_m": 0.15734754502773285,
            "terminal_heading_error_rad": -0.02483344078063965,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.15734754502773285,
            "last_observed_heading_error_rad": -0.02483344078063965,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 5,
            "ever_position_goal": false,
            "ever_pose_goal": false,
            "success": false,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.9584965109825134,
            "first_position_goal_step": null,
            "first_pose_goal_step": null,
            "terminal_goal_distance_m": 0.9653195738792419,
            "terminal_heading_error_rad": 0.38466763496398926,
            "terminal_position_goal": false,
            "terminal_pose_goal": false,
            "last_observed_goal_distance_m": 0.9653195738792419,
            "last_observed_heading_error_rad": 0.38466763496398926,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 6,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.02251240238547325,
            "first_position_goal_step": 324,
            "first_pose_goal_step": 368,
            "terminal_goal_distance_m": 0.07871615141630173,
            "terminal_heading_error_rad": -0.11417222023010254,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.07871615141630173,
            "last_observed_heading_error_rad": -0.11417222023010254,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 7,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.06989186257123947,
            "first_position_goal_step": 344,
            "first_pose_goal_step": 344,
            "terminal_goal_distance_m": 0.10420515388250351,
            "terminal_heading_error_rad": -0.12771892547607422,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.10420515388250351,
            "last_observed_heading_error_rad": -0.12771892547607422,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 8,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.09679483622312546,
            "first_position_goal_step": 399,
            "first_pose_goal_step": 399,
            "terminal_goal_distance_m": 0.10419631749391556,
            "terminal_heading_error_rad": -0.1914691925048828,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.10419631749391556,
            "last_observed_heading_error_rad": -0.1914691925048828,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 9,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.016761330887675285,
            "first_position_goal_step": 326,
            "first_pose_goal_step": 326,
            "terminal_goal_distance_m": 0.06511154025793076,
            "terminal_heading_error_rad": -0.04387807846069336,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.06511154025793076,
            "last_observed_heading_error_rad": -0.04387807846069336,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 10,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.03935496136546135,
            "first_position_goal_step": 410,
            "first_pose_goal_step": 410,
            "terminal_goal_distance_m": 0.07577051967382431,
            "terminal_heading_error_rad": -0.1338973045349121,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.07577051967382431,
            "last_observed_heading_error_rad": -0.1338973045349121,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 11,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.15971660614013672,
            "first_position_goal_step": 417,
            "first_pose_goal_step": 417,
            "terminal_goal_distance_m": 0.1604611575603485,
            "terminal_heading_error_rad": 0.019789934158325195,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.1604611575603485,
            "last_observed_heading_error_rad": 0.019789934158325195,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 12,
            "ever_position_goal": false,
            "ever_pose_goal": false,
            "success": false,
            "terminated": true,
            "timeout": false,
            "censored": false,
            "episode_length_steps": 163,
            "duration_seconds": 3.2600000000000002,
            "minimum_goal_distance_m": 3.09253191947937,
            "first_position_goal_step": null,
            "first_pose_goal_step": null,
            "terminal_goal_distance_m": 3.09253191947937,
            "terminal_heading_error_rad": 0.4174220561981201,
            "terminal_position_goal": false,
            "terminal_pose_goal": false,
            "last_observed_goal_distance_m": 3.09253191947937,
            "last_observed_heading_error_rad": 0.4174220561981201,
            "terminal_terms": [
              "early_gravity"
            ]
          },
          {
            "env_id": 13,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.08560191839933395,
            "first_position_goal_step": 300,
            "first_pose_goal_step": 300,
            "terminal_goal_distance_m": 0.08570550382137299,
            "terminal_heading_error_rad": -0.020087480545043945,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.08570550382137299,
            "last_observed_heading_error_rad": -0.020087480545043945,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 14,
            "ever_position_goal": false,
            "ever_pose_goal": false,
            "success": false,
            "terminated": true,
            "timeout": false,
            "censored": false,
            "episode_length_steps": 192,
            "duration_seconds": 3.84,
            "minimum_goal_distance_m": 3.560265064239502,
            "first_position_goal_step": null,
            "first_pose_goal_step": null,
            "terminal_goal_distance_m": 3.560265064239502,
            "terminal_heading_error_rad": -0.9322667121887207,
            "terminal_position_goal": false,
            "terminal_pose_goal": false,
            "last_observed_goal_distance_m": 3.560265064239502,
            "last_observed_heading_error_rad": -0.9322667121887207,
            "terminal_terms": [
              "early_gravity"
            ]
          },
          {
            "env_id": 15,
            "ever_position_goal": false,
            "ever_pose_goal": false,
            "success": false,
            "terminated": true,
            "timeout": false,
            "censored": false,
            "episode_length_steps": 138,
            "duration_seconds": 2.7600000000000002,
            "minimum_goal_distance_m": 2.9234886169433594,
            "first_position_goal_step": null,
            "first_pose_goal_step": null,
            "terminal_goal_distance_m": 2.9234886169433594,
            "terminal_heading_error_rad": -0.587890625,
            "terminal_position_goal": false,
            "terminal_pose_goal": false,
            "last_observed_goal_distance_m": 2.9234886169433594,
            "last_observed_heading_error_rad": -0.587890625,
            "terminal_terms": [
              "early_gravity"
            ]
          }
        ],
        "summary": {
          "num_environments": 16,
          "ever_position_goal": 12,
          "ever_pose_goal": 12,
          "successes": 12,
          "terminated": 3,
          "timeouts": 13,
          "censored": 0
        }
      },
      "steps_completed": 800,
      "simulation_seconds": 16.0,
      "finite_checks_passed": true,
      "videos": [],
      "wall_seconds": 27.261480801040307,
      "path": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/native_seed43/result.json",
      "sha256": "3c91524bcd3104d15f879f5bbf98a822d928c91861f2d7f978a480b065c8d55d"
    },
    {
      "schema_version": 1,
      "started_utc": "2026-10-10T14:25:40.138701+00:00",
      "command": [
        "scripts/research/verify.py",
        "--headless",
        "--task",
        "Ame2-G1-Gaze-Play",
        "--terrain",
        "all",
        "--num_envs",
        "16",
        "--steps",
        "800",
        "--seed",
        "44",
        "--difficulty",
        "0.5",
        "--checkpoint",
        "/workspace/ame2-minimal/ame2/logs/rsl_rl/research_official_full/2026-10-10_04-38-09_full/model_4999.pt",
        "--policy",
        "native",
        "--first_episode",
        "--report",
        "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/native_seed44/result.json",
        "--export_jit"
      ],
      "arguments": {
        "task": "Ame2-G1-Gaze-Play",
        "terrain": "all",
        "difficulty": 0.5,
        "num_envs": 16,
        "steps": 800,
        "seed": 44,
        "checkpoint": "/workspace/ame2-minimal/ame2/logs/rsl_rl/research_official_full/2026-10-10_04-38-09_full/model_4999.pt",
        "policy": "native",
        "export_jit": true,
        "video": false,
        "attention": false,
        "mid360": false,
        "first_episode": true,
        "report": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/native_seed44/result.json",
        "enable_cameras": false,
        "xr": false,
        "device": "cuda:0",
        "cpu": false,
        "verbose": false,
        "info": false,
        "rendering_mode": null,
        "kit_args": "",
        "anim_recording_enabled": false,
        "anim_recording_start_time": 0,
        "anim_recording_stop_time": 10,
        "headless": true,
        "hide_ui": true,
        "create_new_stage": false,
        "physics_gpu": 0,
        "active_gpu": 0
      },
      "python": "3.11.13",
      "torch": "2.7.0+cu128",
      "cuda": "12.8",
      "passed": true,
      "packages": {
        "isaaclab": "0.54.2",
        "rsl-rl-lib": "5.0.0",
        "ame2": "0.1.0"
      },
      "combined_scene_patch_overrides": {
        "target": {
          "original_counts": [
            10,
            30
          ],
          "combined_scene_count": 10
        }
      },
      "terrain_names": [
        "rough",
        "stair_down",
        "stair_up",
        "boxes",
        "obstacles",
        "climb_up",
        "climb_down",
        "consecutive",
        "gap",
        "pallets",
        "beam",
        "stones",
        "pit",
        "peak",
        "test_1",
        "test_2"
      ],
      "registered_tasks": [
        "Ame2-G1",
        "Ame2-G1-Gaze",
        "Ame2-G1-Gaze-Play",
        "Ame2-G1-Gaze-Student",
        "Ame2-G1-Gaze-Student-Play",
        "Ame2-G1-Play"
      ],
      "terrain_grid": {
        "rows": 1,
        "columns": 16,
        "difficulty_range": [
          0.5,
          0.5
        ],
        "generator_curriculum": true,
        "environment_terrain_curriculum": false
      },
      "observation_shapes": {
        "teacher_mapping": [
          16,
          26,
          15,
          3
        ],
        "teacher_prop": [
          16,
          82
        ],
        "critic": [
          16,
          499
        ]
      },
      "actions": 23,
      "reward_terms": [
        "ame2_position_tracking",
        "ame2_heading_tracking",
        "ame2_move2goal",
        "ame2_standatgoal",
        "early_termination_penalty",
        "undesired_spinning",
        "undesired_leaping",
        "undesired_non_foot_contacts",
        "undesired_stumbling",
        "undesired_slippage",
        "undesired_self_col_knee",
        "undesired_self_col_torso",
        "undesired_self_col_ankle",
        "base_roll_rate",
        "joint_regularization",
        "action_smoothness",
        "link_contact_forces",
        "body_lin_acc_l1",
        "joint_pos_limits",
        "joint_vel_limits",
        "joint_torque_limits",
        "ame2_optional_uppershaping",
        "ame2_optional_foot_shaping"
      ],
      "termination_terms": [
        "time_out",
        "early_gravity",
        "early_hip_acc",
        "early_illegal_contact",
        "early_stagnation"
      ],
      "step_dt": 0.02,
      "policy_mode": "native",
      "checkpoint": {
        "path": "/workspace/ame2-minimal/ame2/logs/rsl_rl/research_official_full/2026-10-10_04-38-09_full/model_4999.pt",
        "sha256": "0d859f33e5e642961f01fc078bde64e73ee9dd5e4ff0fca014b9637c7ce8b80e",
        "iteration": 4999
      },
      "critic_heads": 23,
      "jit": {
        "path": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/native_seed44/result.jit",
        "sha256": "26d802167186aa49efaacd73a4c98907c5f42244994858318df63a30d54c42cb",
        "max_absolute_action_error": 4.76837158203125e-07,
        "passed": true
      },
      "environments": [
        {
          "env_id": 0,
          "terrain": "rough",
          "terrain_column": 0,
          "reward_sum": 233.10586547851562,
          "minimum_goal_distance_m": 0.14627332985401154,
          "final_goal_distance_m": 7.178036689758301,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            -0.03512878715991974,
            -90.11539459228516,
            0.9950000047683716
          ],
          "final_position": [
            -0.01100851595401764,
            -89.9298095703125,
            0.9950000047683716
          ]
        },
        {
          "env_id": 1,
          "terrain": "stair_down",
          "terrain_column": 1,
          "reward_sum": 250.00811767578125,
          "minimum_goal_distance_m": 0.1344423145055771,
          "final_goal_distance_m": 4.530325889587402,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            0.08333303034305573,
            -78.02534484863281,
            2.6999998092651367
          ],
          "final_position": [
            0.02419118583202362,
            -78.12246704101562,
            2.6999998092651367
          ]
        },
        {
          "env_id": 2,
          "terrain": "stair_up",
          "terrain_column": 2,
          "reward_sum": 221.453857421875,
          "minimum_goal_distance_m": 0.03812229633331299,
          "final_goal_distance_m": 4.135966777801514,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            -0.029792100191116333,
            -66.1978988647461,
            -0.8200000524520874
          ],
          "final_position": [
            -0.06969723105430603,
            -66.1585922241211,
            -0.8200000524520874
          ]
        },
        {
          "env_id": 3,
          "terrain": "boxes",
          "terrain_column": 3,
          "reward_sum": 205.9917449951172,
          "minimum_goal_distance_m": 0.18029381334781647,
          "final_goal_distance_m": 3.7645914554595947,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            0.056373074650764465,
            -54.0045280456543,
            0.7799999713897705
          ],
          "final_position": [
            0.043125659227371216,
            -53.8945426940918,
            0.7799999713897705
          ]
        },
        {
          "env_id": 4,
          "terrain": "obstacles",
          "terrain_column": 4,
          "reward_sum": 226.75265502929688,
          "minimum_goal_distance_m": 0.010912507772445679,
          "final_goal_distance_m": 4.4215006828308105,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            0.10713820159435272,
            -42.19662857055664,
            0.8299999833106995
          ],
          "final_position": [
            0.10992281138896942,
            -41.81016540527344,
            0.8299999833106995
          ]
        },
        {
          "env_id": 5,
          "terrain": "climb_up",
          "terrain_column": 5,
          "reward_sum": 27.90023422241211,
          "minimum_goal_distance_m": 1.8904485702514648,
          "final_goal_distance_m": 2.3897969722747803,
          "reached_goal": false,
          "early_terminations": 1,
          "timeouts": 0,
          "initial_position": [
            -0.16642874479293823,
            -30.078351974487305,
            0.7799999713897705
          ],
          "final_position": [
            1.3846241235733032,
            -30.95991325378418,
            0.7739886045455933
          ]
        },
        {
          "env_id": 6,
          "terrain": "climb_down",
          "terrain_column": 6,
          "reward_sum": 42.415428161621094,
          "minimum_goal_distance_m": 0.19932609796524048,
          "final_goal_distance_m": 0.19932609796524048,
          "reached_goal": true,
          "early_terminations": 2,
          "timeouts": 0,
          "initial_position": [
            0.015737682580947876,
            -17.960294723510742,
            1.3199999332427979
          ],
          "final_position": [
            4.667624473571777,
            -17.14088249206543,
            0.7549200057983398
          ]
        },
        {
          "env_id": 7,
          "terrain": "consecutive",
          "terrain_column": 7,
          "reward_sum": 231.19158935546875,
          "minimum_goal_distance_m": 0.1545497179031372,
          "final_goal_distance_m": 4.589009761810303,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            -0.013034135103225708,
            -5.9491658210754395,
            0.7799999713897705
          ],
          "final_position": [
            0.16069622337818146,
            -5.85952091217041,
            0.7799999713897705
          ]
        },
        {
          "env_id": 8,
          "terrain": "gap",
          "terrain_column": 8,
          "reward_sum": 47.50141906738281,
          "minimum_goal_distance_m": 0.09656437486410141,
          "final_goal_distance_m": 0.09656437486410141,
          "reached_goal": true,
          "early_terminations": 1,
          "timeouts": 0,
          "initial_position": [
            -0.04884529113769531,
            5.998293876647949,
            0.7799999713897705
          ],
          "final_position": [
            4.746001720428467,
            3.562419891357422,
            0.6207684874534607
          ]
        },
        {
          "env_id": 9,
          "terrain": "pallets",
          "terrain_column": 9,
          "reward_sum": 243.2205352783203,
          "minimum_goal_distance_m": 0.1989441215991974,
          "final_goal_distance_m": 5.425111293792725,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            -0.13225579261779785,
            18.126657485961914,
            0.8799999952316284
          ],
          "final_position": [
            -0.02239738404750824,
            18.065231323242188,
            0.8799999952316284
          ]
        },
        {
          "env_id": 10,
          "terrain": "beam",
          "terrain_column": 10,
          "reward_sum": 254.19049072265625,
          "minimum_goal_distance_m": 0.04807630926370621,
          "final_goal_distance_m": 5.491535186767578,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            -0.15389209985733032,
            30.02225685119629,
            0.7799999713897705
          ],
          "final_position": [
            -0.05400094389915466,
            30.161985397338867,
            0.7799999713897705
          ]
        },
        {
          "env_id": 11,
          "terrain": "stones",
          "terrain_column": 11,
          "reward_sum": 6.668004512786865,
          "minimum_goal_distance_m": 1.738918423652649,
          "final_goal_distance_m": 6.039992332458496,
          "reached_goal": false,
          "early_terminations": 4,
          "timeouts": 0,
          "initial_position": [
            -0.010292261838912964,
            42.10548400878906,
            0.9168549180030823
          ],
          "final_position": [
            0.027352165430784225,
            41.800575256347656,
            0.831328272819519
          ]
        },
        {
          "env_id": 12,
          "terrain": "pit",
          "terrain_column": 12,
          "reward_sum": -20.706253051757812,
          "minimum_goal_distance_m": 1.2835139036178589,
          "final_goal_distance_m": 4.560313701629639,
          "reached_goal": false,
          "early_terminations": 1,
          "timeouts": 0,
          "initial_position": [
            0.03312268853187561,
            53.829437255859375,
            0.2799999713897705
          ],
          "final_position": [
            0.9062635898590088,
            53.57688522338867,
            0.2561812400817871
          ]
        },
        {
          "env_id": 13,
          "terrain": "peak",
          "terrain_column": 13,
          "reward_sum": -3.3315248489379883,
          "minimum_goal_distance_m": 0.546901524066925,
          "final_goal_distance_m": 0.546901524066925,
          "reached_goal": false,
          "early_terminations": 2,
          "timeouts": 0,
          "initial_position": [
            -0.10630960762500763,
            65.91004180908203,
            1.7799999713897705
          ],
          "final_position": [
            3.9682533740997314,
            65.26190948486328,
            0.7578916549682617
          ]
        },
        {
          "env_id": 14,
          "terrain": "test_1",
          "terrain_column": 14,
          "reward_sum": 13.576262474060059,
          "minimum_goal_distance_m": 1.6953312158584595,
          "final_goal_distance_m": 3.1607272624969482,
          "reached_goal": false,
          "early_terminations": 3,
          "timeouts": 0,
          "initial_position": [
            0.16682077944278717,
            77.90584564208984,
            1.7799999713897705
          ],
          "final_position": [
            2.5043203830718994,
            78.43001556396484,
            1.7844737768173218
          ]
        },
        {
          "env_id": 15,
          "terrain": "test_2",
          "terrain_column": 15,
          "reward_sum": 5.8341383934021,
          "minimum_goal_distance_m": 1.8818849325180054,
          "final_goal_distance_m": 3.7554209232330322,
          "reached_goal": false,
          "early_terminations": 4,
          "timeouts": 0,
          "initial_position": [
            0.0853315144777298,
            90.02497863769531,
            0.8799999952316284
          ],
          "final_position": [
            0.7538996934890747,
            90.03038024902344,
            0.8562050461769104
          ]
        }
      ],
      "first_episode": {
        "scope": "initial reset through first terminated-or-timeout state, inclusive",
        "sampling_phase": "after physics/reward computation and before automatic reset",
        "position_threshold_m": 0.5,
        "heading_threshold_rad": 0.5,
        "success_definition": "First episode ends with timeout=true and terminated=false, and its pre-reset terminal planar goal distance is <0.5m and absolute wrapped heading error is <0.5rad. Censored episodes are not successful. This tests the terminal pose, not a dwell-time requirement.",
        "duration_definition": "Elapsed first-episode simulation time; censored episodes show observed time only.",
        "environments": [
          {
            "env_id": 0,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.14627332985401154,
            "first_position_goal_step": 409,
            "first_pose_goal_step": 409,
            "terminal_goal_distance_m": 0.1564059853553772,
            "terminal_heading_error_rad": -0.1062324047088623,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.1564059853553772,
            "last_observed_heading_error_rad": -0.1062324047088623,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 1,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.1344423145055771,
            "first_position_goal_step": 289,
            "first_pose_goal_step": 289,
            "terminal_goal_distance_m": 0.37627455592155457,
            "terminal_heading_error_rad": -0.12084412574768066,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.37627455592155457,
            "last_observed_heading_error_rad": -0.12084412574768066,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 2,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.03812229633331299,
            "first_position_goal_step": 152,
            "first_pose_goal_step": 152,
            "terminal_goal_distance_m": 0.49521511793136597,
            "terminal_heading_error_rad": -0.04657554626464844,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.49521511793136597,
            "last_observed_heading_error_rad": -0.04657554626464844,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 3,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.18029381334781647,
            "first_position_goal_step": 651,
            "first_pose_goal_step": 701,
            "terminal_goal_distance_m": 0.20208746194839478,
            "terminal_heading_error_rad": -0.3386855125427246,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.20208746194839478,
            "last_observed_heading_error_rad": -0.3386855125427246,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 4,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.010912507772445679,
            "first_position_goal_step": 621,
            "first_pose_goal_step": 656,
            "terminal_goal_distance_m": 0.13170704245567322,
            "terminal_heading_error_rad": -0.13593673706054688,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.13170704245567322,
            "last_observed_heading_error_rad": -0.13593673706054688,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 5,
            "ever_position_goal": false,
            "ever_pose_goal": false,
            "success": false,
            "terminated": true,
            "timeout": false,
            "censored": false,
            "episode_length_steps": 333,
            "duration_seconds": 6.66,
            "minimum_goal_distance_m": 1.8757965564727783,
            "first_position_goal_step": null,
            "first_pose_goal_step": null,
            "terminal_goal_distance_m": 1.8757965564727783,
            "terminal_heading_error_rad": -0.834233283996582,
            "terminal_position_goal": false,
            "terminal_pose_goal": false,
            "last_observed_goal_distance_m": 1.8757965564727783,
            "last_observed_heading_error_rad": -0.834233283996582,
            "terminal_terms": [
              "early_gravity"
            ]
          },
          {
            "env_id": 6,
            "ever_position_goal": false,
            "ever_pose_goal": false,
            "success": false,
            "terminated": true,
            "timeout": false,
            "censored": false,
            "episode_length_steps": 207,
            "duration_seconds": 4.14,
            "minimum_goal_distance_m": 1.4137933254241943,
            "first_position_goal_step": null,
            "first_pose_goal_step": null,
            "terminal_goal_distance_m": 1.4137933254241943,
            "terminal_heading_error_rad": -0.46486735343933105,
            "terminal_position_goal": false,
            "terminal_pose_goal": false,
            "last_observed_goal_distance_m": 1.4137933254241943,
            "last_observed_heading_error_rad": -0.46486735343933105,
            "terminal_terms": [
              "early_gravity"
            ]
          },
          {
            "env_id": 7,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.1545497179031372,
            "first_position_goal_step": 506,
            "first_pose_goal_step": 534,
            "terminal_goal_distance_m": 0.19573107361793518,
            "terminal_heading_error_rad": -0.11259198188781738,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.19573107361793518,
            "last_observed_heading_error_rad": -0.11259198188781738,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 8,
            "ever_position_goal": false,
            "ever_pose_goal": false,
            "success": false,
            "terminated": true,
            "timeout": false,
            "censored": false,
            "episode_length_steps": 237,
            "duration_seconds": 4.74,
            "minimum_goal_distance_m": 2.354112148284912,
            "first_position_goal_step": null,
            "first_pose_goal_step": null,
            "terminal_goal_distance_m": 2.354112148284912,
            "terminal_heading_error_rad": -0.019922494888305664,
            "terminal_position_goal": false,
            "terminal_pose_goal": false,
            "last_observed_goal_distance_m": 2.354112148284912,
            "last_observed_heading_error_rad": -0.019922494888305664,
            "terminal_terms": [
              "early_gravity"
            ]
          },
          {
            "env_id": 9,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.1989441215991974,
            "first_position_goal_step": 429,
            "first_pose_goal_step": 429,
            "terminal_goal_distance_m": 0.21256794035434723,
            "terminal_heading_error_rad": -0.0633854866027832,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.21256794035434723,
            "last_observed_heading_error_rad": -0.0633854866027832,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 10,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.04807630926370621,
            "first_position_goal_step": 376,
            "first_pose_goal_step": 376,
            "terminal_goal_distance_m": 0.0916799008846283,
            "terminal_heading_error_rad": -0.08971047401428223,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.0916799008846283,
            "last_observed_heading_error_rad": -0.08971047401428223,
            "terminal_terms": [
              "time_out"
            ]
          },
          {
            "env_id": 11,
            "ever_position_goal": false,
            "ever_pose_goal": false,
            "success": false,
            "terminated": true,
            "timeout": false,
            "censored": false,
            "episode_length_steps": 172,
            "duration_seconds": 3.44,
            "minimum_goal_distance_m": 3.876673460006714,
            "first_position_goal_step": null,
            "first_pose_goal_step": null,
            "terminal_goal_distance_m": 3.876673460006714,
            "terminal_heading_error_rad": -0.8128299713134766,
            "terminal_position_goal": false,
            "terminal_pose_goal": false,
            "last_observed_goal_distance_m": 3.876673460006714,
            "last_observed_heading_error_rad": -0.8128299713134766,
            "terminal_terms": [
              "early_gravity"
            ]
          },
          {
            "env_id": 12,
            "ever_position_goal": false,
            "ever_pose_goal": false,
            "success": false,
            "terminated": true,
            "timeout": false,
            "censored": false,
            "episode_length_steps": 502,
            "duration_seconds": 10.040000000000001,
            "minimum_goal_distance_m": 1.2835139036178589,
            "first_position_goal_step": null,
            "first_pose_goal_step": null,
            "terminal_goal_distance_m": 1.285999059677124,
            "terminal_heading_error_rad": 0.2408139705657959,
            "terminal_position_goal": false,
            "terminal_pose_goal": false,
            "last_observed_goal_distance_m": 1.285999059677124,
            "last_observed_heading_error_rad": 0.2408139705657959,
            "terminal_terms": [
              "early_stagnation"
            ]
          },
          {
            "env_id": 13,
            "ever_position_goal": false,
            "ever_pose_goal": false,
            "success": false,
            "terminated": true,
            "timeout": false,
            "censored": false,
            "episode_length_steps": 224,
            "duration_seconds": 4.48,
            "minimum_goal_distance_m": 2.533402681350708,
            "first_position_goal_step": null,
            "first_pose_goal_step": null,
            "terminal_goal_distance_m": 2.533402681350708,
            "terminal_heading_error_rad": 2.481924295425415,
            "terminal_position_goal": false,
            "terminal_pose_goal": false,
            "last_observed_goal_distance_m": 2.533402681350708,
            "last_observed_heading_error_rad": 2.481924295425415,
            "terminal_terms": [
              "early_gravity"
            ]
          },
          {
            "env_id": 14,
            "ever_position_goal": false,
            "ever_pose_goal": false,
            "success": false,
            "terminated": true,
            "timeout": false,
            "censored": false,
            "episode_length_steps": 253,
            "duration_seconds": 5.0600000000000005,
            "minimum_goal_distance_m": 1.6893771886825562,
            "first_position_goal_step": null,
            "first_pose_goal_step": null,
            "terminal_goal_distance_m": 1.6893771886825562,
            "terminal_heading_error_rad": 0.3845493793487549,
            "terminal_position_goal": false,
            "terminal_pose_goal": false,
            "last_observed_goal_distance_m": 1.6893771886825562,
            "last_observed_heading_error_rad": 0.3845493793487549,
            "terminal_terms": [
              "early_gravity"
            ]
          },
          {
            "env_id": 15,
            "ever_position_goal": false,
            "ever_pose_goal": false,
            "success": false,
            "terminated": true,
            "timeout": false,
            "censored": false,
            "episode_length_steps": 165,
            "duration_seconds": 3.3000000000000003,
            "minimum_goal_distance_m": 2.7623608112335205,
            "first_position_goal_step": null,
            "first_pose_goal_step": null,
            "terminal_goal_distance_m": 2.7623608112335205,
            "terminal_heading_error_rad": 0.615025520324707,
            "terminal_position_goal": false,
            "terminal_pose_goal": false,
            "last_observed_goal_distance_m": 2.7623608112335205,
            "last_observed_heading_error_rad": 0.615025520324707,
            "terminal_terms": [
              "early_gravity"
            ]
          }
        ],
        "summary": {
          "num_environments": 16,
          "ever_position_goal": 8,
          "ever_pose_goal": 8,
          "successes": 8,
          "terminated": 8,
          "timeouts": 8,
          "censored": 0
        }
      },
      "steps_completed": 800,
      "simulation_seconds": 16.0,
      "finite_checks_passed": true,
      "videos": [],
      "wall_seconds": 27.057191951898858,
      "path": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/native_seed44/result.json",
      "sha256": "90fa3d4dd90c27225ffbc74df470fc1043ccb386ba96e00ca746efe48e94d38f"
    },
    {
      "schema_version": 1,
      "started_utc": "2026-10-10T14:26:45.811762+00:00",
      "command": [
        "scripts/research/verify.py",
        "--headless",
        "--task",
        "Ame2-G1-Gaze-Play",
        "--terrain",
        "rough",
        "--num_envs",
        "1",
        "--steps",
        "800",
        "--seed",
        "42",
        "--difficulty",
        "0.35",
        "--checkpoint",
        "/workspace/ame2-minimal/ame2/logs/rsl_rl/research_official_full/2026-10-10_04-38-09_full/model_4999.pt",
        "--policy",
        "native",
        "--first_episode",
        "--report",
        "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/rough_video/result.json",
        "--export_jit",
        "--video"
      ],
      "arguments": {
        "task": "Ame2-G1-Gaze-Play",
        "terrain": "rough",
        "difficulty": 0.35,
        "num_envs": 1,
        "steps": 800,
        "seed": 42,
        "checkpoint": "/workspace/ame2-minimal/ame2/logs/rsl_rl/research_official_full/2026-10-10_04-38-09_full/model_4999.pt",
        "policy": "native",
        "export_jit": true,
        "video": true,
        "attention": false,
        "mid360": false,
        "first_episode": true,
        "report": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/rough_video/result.json",
        "enable_cameras": true,
        "xr": false,
        "device": "cuda:0",
        "cpu": false,
        "verbose": false,
        "info": false,
        "rendering_mode": null,
        "kit_args": "",
        "anim_recording_enabled": false,
        "anim_recording_start_time": 0,
        "anim_recording_stop_time": 10,
        "headless": true,
        "hide_ui": true,
        "create_new_stage": false,
        "physics_gpu": 0,
        "active_gpu": 0
      },
      "python": "3.11.13",
      "torch": "2.7.0+cu128",
      "cuda": "12.8",
      "passed": true,
      "packages": {
        "isaaclab": "0.54.2",
        "rsl-rl-lib": "5.0.0",
        "ame2": "0.1.0"
      },
      "terrain_names": [
        "rough"
      ],
      "registered_tasks": [
        "Ame2-G1",
        "Ame2-G1-Gaze",
        "Ame2-G1-Gaze-Play",
        "Ame2-G1-Gaze-Student",
        "Ame2-G1-Gaze-Student-Play",
        "Ame2-G1-Play"
      ],
      "terrain_grid": {
        "rows": 1,
        "columns": 1,
        "difficulty_range": [
          0.35,
          0.35
        ],
        "generator_curriculum": true,
        "environment_terrain_curriculum": false
      },
      "observation_shapes": {
        "teacher_mapping": [
          1,
          26,
          15,
          3
        ],
        "teacher_prop": [
          1,
          82
        ],
        "critic": [
          1,
          499
        ]
      },
      "actions": 23,
      "reward_terms": [
        "ame2_position_tracking",
        "ame2_heading_tracking",
        "ame2_move2goal",
        "ame2_standatgoal",
        "early_termination_penalty",
        "undesired_spinning",
        "undesired_leaping",
        "undesired_non_foot_contacts",
        "undesired_stumbling",
        "undesired_slippage",
        "undesired_self_col_knee",
        "undesired_self_col_torso",
        "undesired_self_col_ankle",
        "base_roll_rate",
        "joint_regularization",
        "action_smoothness",
        "link_contact_forces",
        "body_lin_acc_l1",
        "joint_pos_limits",
        "joint_vel_limits",
        "joint_torque_limits",
        "ame2_optional_uppershaping",
        "ame2_optional_foot_shaping"
      ],
      "termination_terms": [
        "time_out",
        "early_gravity",
        "early_hip_acc",
        "early_illegal_contact",
        "early_stagnation"
      ],
      "step_dt": 0.02,
      "policy_mode": "native",
      "checkpoint": {
        "path": "/workspace/ame2-minimal/ame2/logs/rsl_rl/research_official_full/2026-10-10_04-38-09_full/model_4999.pt",
        "sha256": "0d859f33e5e642961f01fc078bde64e73ee9dd5e4ff0fca014b9637c7ce8b80e",
        "iteration": 4999
      },
      "critic_heads": 23,
      "jit": {
        "path": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/rough_video/result.jit",
        "sha256": "26d802167186aa49efaacd73a4c98907c5f42244994858318df63a30d54c42cb",
        "max_absolute_action_error": 0.0,
        "passed": true
      },
      "environments": [
        {
          "env_id": 0,
          "terrain": "rough",
          "terrain_column": 0,
          "reward_sum": 260.93621826171875,
          "minimum_goal_distance_m": 0.12304555624723434,
          "final_goal_distance_m": 0.5262084603309631,
          "reached_goal": true,
          "early_terminations": 0,
          "timeouts": 1,
          "initial_position": [
            -0.06907656788825989,
            0.02582111954689026,
            0.7649999856948853
          ],
          "final_position": [
            -0.11447832733392715,
            -0.16163530945777893,
            0.7649999856948853
          ]
        }
      ],
      "first_episode": {
        "scope": "initial reset through first terminated-or-timeout state, inclusive",
        "sampling_phase": "after physics/reward computation and before automatic reset",
        "position_threshold_m": 0.5,
        "heading_threshold_rad": 0.5,
        "success_definition": "First episode ends with timeout=true and terminated=false, and its pre-reset terminal planar goal distance is <0.5m and absolute wrapped heading error is <0.5rad. Censored episodes are not successful. This tests the terminal pose, not a dwell-time requirement.",
        "duration_definition": "Elapsed first-episode simulation time; censored episodes show observed time only.",
        "environments": [
          {
            "env_id": 0,
            "ever_position_goal": true,
            "ever_pose_goal": true,
            "success": true,
            "terminated": false,
            "timeout": true,
            "censored": false,
            "episode_length_steps": 800,
            "duration_seconds": 16.0,
            "minimum_goal_distance_m": 0.12304555624723434,
            "first_position_goal_step": 235,
            "first_pose_goal_step": 235,
            "terminal_goal_distance_m": 0.14279316365718842,
            "terminal_heading_error_rad": -0.09385824203491211,
            "terminal_position_goal": true,
            "terminal_pose_goal": true,
            "last_observed_goal_distance_m": 0.14279316365718842,
            "last_observed_heading_error_rad": -0.09385824203491211,
            "terminal_terms": [
              "time_out"
            ]
          }
        ],
        "summary": {
          "num_environments": 1,
          "ever_position_goal": 1,
          "ever_pose_goal": 1,
          "successes": 1,
          "terminated": 0,
          "timeouts": 1,
          "censored": 0
        }
      },
      "steps_completed": 800,
      "simulation_seconds": 16.0,
      "finite_checks_passed": true,
      "videos": [
        "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/rough_video/videos/result-step-0.mp4"
      ],
      "wall_seconds": 37.798238393850625,
      "path": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/rough_video/result.json",
      "sha256": "e24de70d5ead379c7f1dac9f78591360d4e4e93d96565fe04126326f1e9e787d"
    },
    {
      "schema_version": 1,
      "kind": "official_5000_final_policy_evaluation",
      "started_utc": "2026-10-10T14:24:17.238881+00:00",
      "command": [
        "scripts/research/evaluate_final.py",
        "--training_report",
        "/workspace/ame2-minimal/outputs/research/reproduce-20261010/cloud_full",
        "--output",
        "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy"
      ],
      "passed": true,
      "execution_checks_passed": true,
      "evaluation_complete": true,
      "jobs": [
        {
          "command": [
            "/isaac-sim/python.sh",
            "scripts/research/checkpoint_audit.py",
            "/workspace/ame2-minimal/ame2/logs/rsl_rl/research_official_full/2026-10-10_04-38-09_full/model_0.pt",
            "/workspace/ame2-minimal/ame2/logs/rsl_rl/research_official_full/2026-10-10_04-38-09_full/model_4999.pt",
            "--tensorboard",
            "--require_updates",
            "--expected_heads",
            "23",
            "--output",
            "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/local_checkpoint_audit.json"
          ],
          "exit_code": 0,
          "timed_out": false,
          "wall_seconds": 5.522063008975238,
          "log": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/local_checkpoint_audit.log",
          "log_sha256": "7df804a0bcda5ea3b7cb2576665ab25a0aaac351a13731afa6392b07d5619b86",
          "passed": true,
          "name": "local_checkpoint_audit"
        },
        {
          "name": "training_curves",
          "command": [
            "/isaac-sim/python.sh",
            "scripts/research/plot_training.py",
            "--run",
            "/workspace/ame2-minimal/ame2/logs/rsl_rl/research_official_full/2026-10-10_04-38-09_full",
            "--output",
            "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/training_curves",
            "--expected_last_step",
            "4999"
          ],
          "report": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/training_curves/curves.json",
          "passed": true,
          "exit_code": 0,
          "timed_out": false,
          "wall_seconds": 7.174492601072416,
          "log": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/training_curves.log",
          "log_sha256": "d108068ebcf7c935cc37aa2f3820d79c7eb483796a2a6dc7ede3f1babe0527a9",
          "report_sha256": "0230e417acd43961dee93217266b86dc476cbf2cdabbe730e8c80269f20e3551"
        },
        {
          "name": "native_seed42",
          "report": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/native_seed42/result.json",
          "command": [
            "/isaac-sim/python.sh",
            "scripts/research/verify.py",
            "--headless",
            "--task",
            "Ame2-G1-Gaze-Play",
            "--terrain",
            "all",
            "--num_envs",
            "16",
            "--steps",
            "800",
            "--seed",
            "42",
            "--difficulty",
            "0.5",
            "--checkpoint",
            "/workspace/ame2-minimal/ame2/logs/rsl_rl/research_official_full/2026-10-10_04-38-09_full/model_4999.pt",
            "--policy",
            "native",
            "--first_episode",
            "--report",
            "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/native_seed42/result.json",
            "--export_jit"
          ],
          "log": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/native_seed42.log",
          "passed": true,
          "exit_code": 0,
          "timed_out": false,
          "wall_seconds": 33.616230426123366,
          "log_sha256": "f987063c66ae0442c9f9afcafcf52b98f32d146caa018dfcab04c82da7a9cf6a",
          "report_sha256": "ea1248c080d8cba68b71e3ab0b04c0091f634f83c97ae366215035219e9b39b9",
          "quality": {
            "environments": 16,
            "position_goal_ever": 8,
            "pose_goal_ever": 8,
            "pose_goal_at_timeout_without_early_termination": 8,
            "early_terminations": 8,
            "timeouts": 8,
            "censored": 0,
            "definition": "First episode ends with timeout=true and terminated=false, and its pre-reset terminal planar goal distance is <0.5m and absolute wrapped heading error is <0.5rad. Censored episodes are not successful. This tests the terminal pose, not a dwell-time requirement."
          },
          "jit_parity": {
            "path": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/native_seed42/result.jit",
            "sha256": "26d802167186aa49efaacd73a4c98907c5f42244994858318df63a30d54c42cb",
            "max_absolute_action_error": 4.76837158203125e-07,
            "passed": true
          }
        },
        {
          "name": "native_seed43",
          "report": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/native_seed43/result.json",
          "command": [
            "/isaac-sim/python.sh",
            "scripts/research/verify.py",
            "--headless",
            "--task",
            "Ame2-G1-Gaze-Play",
            "--terrain",
            "all",
            "--num_envs",
            "16",
            "--steps",
            "800",
            "--seed",
            "43",
            "--difficulty",
            "0.5",
            "--checkpoint",
            "/workspace/ame2-minimal/ame2/logs/rsl_rl/research_official_full/2026-10-10_04-38-09_full/model_4999.pt",
            "--policy",
            "native",
            "--first_episode",
            "--report",
            "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/native_seed43/result.json",
            "--export_jit"
          ],
          "log": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/native_seed43.log",
          "passed": true,
          "exit_code": 0,
          "timed_out": false,
          "wall_seconds": 31.967042229836807,
          "log_sha256": "bc0076f56280617f128975b95748a135261b974c036a957ce27d6fee5fa37617",
          "report_sha256": "3c91524bcd3104d15f879f5bbf98a822d928c91861f2d7f978a480b065c8d55d",
          "quality": {
            "environments": 16,
            "position_goal_ever": 12,
            "pose_goal_ever": 12,
            "pose_goal_at_timeout_without_early_termination": 12,
            "early_terminations": 3,
            "timeouts": 13,
            "censored": 0,
            "definition": "First episode ends with timeout=true and terminated=false, and its pre-reset terminal planar goal distance is <0.5m and absolute wrapped heading error is <0.5rad. Censored episodes are not successful. This tests the terminal pose, not a dwell-time requirement."
          },
          "jit_parity": {
            "path": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/native_seed43/result.jit",
            "sha256": "26d802167186aa49efaacd73a4c98907c5f42244994858318df63a30d54c42cb",
            "max_absolute_action_error": 4.76837158203125e-07,
            "passed": true
          }
        },
        {
          "name": "native_seed44",
          "report": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/native_seed44/result.json",
          "command": [
            "/isaac-sim/python.sh",
            "scripts/research/verify.py",
            "--headless",
            "--task",
            "Ame2-G1-Gaze-Play",
            "--terrain",
            "all",
            "--num_envs",
            "16",
            "--steps",
            "800",
            "--seed",
            "44",
            "--difficulty",
            "0.5",
            "--checkpoint",
            "/workspace/ame2-minimal/ame2/logs/rsl_rl/research_official_full/2026-10-10_04-38-09_full/model_4999.pt",
            "--policy",
            "native",
            "--first_episode",
            "--report",
            "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/native_seed44/result.json",
            "--export_jit"
          ],
          "log": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/native_seed44.log",
          "passed": true,
          "exit_code": 0,
          "timed_out": false,
          "wall_seconds": 30.81327179307118,
          "log_sha256": "3844e98cc514959a53a63820a5b9f2c10bda4d789173c0232c350de085f78807",
          "report_sha256": "90fa3d4dd90c27225ffbc74df470fc1043ccb386ba96e00ca746efe48e94d38f",
          "quality": {
            "environments": 16,
            "position_goal_ever": 8,
            "pose_goal_ever": 8,
            "pose_goal_at_timeout_without_early_termination": 8,
            "early_terminations": 8,
            "timeouts": 8,
            "censored": 0,
            "definition": "First episode ends with timeout=true and terminated=false, and its pre-reset terminal planar goal distance is <0.5m and absolute wrapped heading error is <0.5rad. Censored episodes are not successful. This tests the terminal pose, not a dwell-time requirement."
          },
          "jit_parity": {
            "path": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/native_seed44/result.jit",
            "sha256": "26d802167186aa49efaacd73a4c98907c5f42244994858318df63a30d54c42cb",
            "max_absolute_action_error": 4.76837158203125e-07,
            "passed": true
          }
        },
        {
          "name": "jit_seed42",
          "report": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/jit_seed42/result.json",
          "command": [
            "/isaac-sim/python.sh",
            "scripts/research/verify.py",
            "--headless",
            "--task",
            "Ame2-G1-Gaze-Play",
            "--terrain",
            "all",
            "--num_envs",
            "16",
            "--steps",
            "800",
            "--seed",
            "42",
            "--difficulty",
            "0.5",
            "--checkpoint",
            "/workspace/ame2-minimal/ame2/logs/rsl_rl/research_official_full/2026-10-10_04-38-09_full/model_4999.pt",
            "--policy",
            "jit",
            "--first_episode",
            "--report",
            "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/jit_seed42/result.json"
          ],
          "log": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/jit_seed42.log",
          "passed": true,
          "exit_code": 0,
          "timed_out": false,
          "wall_seconds": 29.910988681018353,
          "log_sha256": "24da0b6bb3db15839226dd7e343ee71e870f1cebd9047cab937b4bb4ff223dae",
          "report_sha256": "a0b187accdff65e2424e803295ec7512877777c1760c478c76dd60a0051a3876",
          "quality": {
            "environments": 16,
            "position_goal_ever": 10,
            "pose_goal_ever": 10,
            "pose_goal_at_timeout_without_early_termination": 9,
            "early_terminations": 7,
            "timeouts": 9,
            "censored": 0,
            "definition": "First episode ends with timeout=true and terminated=false, and its pre-reset terminal planar goal distance is <0.5m and absolute wrapped heading error is <0.5rad. Censored episodes are not successful. This tests the terminal pose, not a dwell-time requirement."
          },
          "jit_parity": {
            "path": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/jit_seed42/result.jit",
            "sha256": "26d802167186aa49efaacd73a4c98907c5f42244994858318df63a30d54c42cb",
            "max_absolute_action_error": 4.76837158203125e-07,
            "passed": true
          }
        },
        {
          "name": "rough_video",
          "report": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/rough_video/result.json",
          "command": [
            "/isaac-sim/python.sh",
            "scripts/research/verify.py",
            "--headless",
            "--task",
            "Ame2-G1-Gaze-Play",
            "--terrain",
            "rough",
            "--num_envs",
            "1",
            "--steps",
            "800",
            "--seed",
            "42",
            "--difficulty",
            "0.35",
            "--checkpoint",
            "/workspace/ame2-minimal/ame2/logs/rsl_rl/research_official_full/2026-10-10_04-38-09_full/model_4999.pt",
            "--policy",
            "native",
            "--first_episode",
            "--report",
            "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/rough_video/result.json",
            "--export_jit",
            "--video"
          ],
          "log": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/rough_video.log",
          "passed": true,
          "exit_code": 0,
          "timed_out": false,
          "wall_seconds": 47.912263195961714,
          "log_sha256": "f9f905c92337f361998a02a178918eee87cd2b4372c9e6c46c528c3e165b240d",
          "report_sha256": "e24de70d5ead379c7f1dac9f78591360d4e4e93d96565fe04126326f1e9e787d",
          "quality": {
            "environments": 1,
            "position_goal_ever": 1,
            "pose_goal_ever": 1,
            "pose_goal_at_timeout_without_early_termination": 1,
            "early_terminations": 0,
            "timeouts": 1,
            "censored": 0,
            "definition": "First episode ends with timeout=true and terminated=false, and its pre-reset terminal planar goal distance is <0.5m and absolute wrapped heading error is <0.5rad. Censored episodes are not successful. This tests the terminal pose, not a dwell-time requirement."
          },
          "jit_parity": {
            "path": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/rough_video/result.jit",
            "sha256": "26d802167186aa49efaacd73a4c98907c5f42244994858318df63a30d54c42cb",
            "max_absolute_action_error": 0.0,
            "passed": true
          }
        },
        {
          "name": "climb_up_attention_video",
          "report": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/climb_up_attention_video/result.json",
          "command": [
            "/isaac-sim/python.sh",
            "scripts/research/verify.py",
            "--headless",
            "--task",
            "Ame2-G1-Gaze-Play",
            "--terrain",
            "climb_up",
            "--num_envs",
            "1",
            "--steps",
            "800",
            "--seed",
            "42",
            "--difficulty",
            "0.35",
            "--checkpoint",
            "/workspace/ame2-minimal/ame2/logs/rsl_rl/research_official_full/2026-10-10_04-38-09_full/model_4999.pt",
            "--policy",
            "native",
            "--first_episode",
            "--report",
            "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/climb_up_attention_video/result.json",
            "--export_jit",
            "--video",
            "--attention"
          ],
          "log": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/climb_up_attention_video.log",
          "passed": true,
          "exit_code": 0,
          "timed_out": false,
          "wall_seconds": 45.188334290869534,
          "log_sha256": "670cb3255961df3d19b9b7b7b4dd9bc3bb9cb2d82087ef3d111f4d6d455ab15d",
          "report_sha256": "b9bd186ceeea4320e852ca436f509ce7b15a2736b5546e8a8cc98832af851c00",
          "quality": {
            "environments": 1,
            "position_goal_ever": 1,
            "pose_goal_ever": 1,
            "pose_goal_at_timeout_without_early_termination": 1,
            "early_terminations": 0,
            "timeouts": 1,
            "censored": 0,
            "definition": "First episode ends with timeout=true and terminated=false, and its pre-reset terminal planar goal distance is <0.5m and absolute wrapped heading error is <0.5rad. Censored episodes are not successful. This tests the terminal pose, not a dwell-time requirement."
          },
          "jit_parity": {
            "path": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/climb_up_attention_video/result.jit",
            "sha256": "26d802167186aa49efaacd73a4c98907c5f42244994858318df63a30d54c42cb",
            "max_absolute_action_error": 0.0,
            "passed": true
          }
        }
      ],
      "limitations": [
        "Execution and numeric checks do not imply reliable task performance.",
        "First-episode success uses the documented position/heading-at-timeout metric, not a paper benchmark.",
        "These teacher evaluations use privileged simulated mapping and do not validate real hardware."
      ],
      "training": {
        "report": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/cloud_full",
        "checkpoint": "/workspace/ame2-minimal/ame2/logs/rsl_rl/research_official_full/2026-10-10_04-38-09_full/model_4999.pt",
        "sha256": "0d859f33e5e642961f01fc078bde64e73ee9dd5e4ff0fca014b9637c7ce8b80e",
        "final_iteration": 4999,
        "iterations_completed": 5000,
        "task": "Ame2-G1-Gaze",
        "num_envs": 4096,
        "critic_heads": 23,
        "optimizer": "muon",
        "world_size": 1,
        "training_checkpoint_audit_sha256": "e52cdaf4a7d3afed4f29e8289ca32afad1362d59670f3aae1194d79cdb00cb38",
        "training_source_manifest_sha256": "54a8bbc6ab6fd492612d48be5dc8cc11c40aef119bbad3fabb5ee8fc04462cae",
        "saved_checkpoints_audited": 26
      },
      "evaluation_source_sha256": {
        "ame2/ame2/__init__.py": "171c11f515a0ce9599dbe88ae1437d40a191e1d9a60e62cc467ad0971cf9e99d",
        "ame2/ame2/assets/__init__.py": "58935c4d49e457380167bea55937b8b5405bd7b829f07dfedc681558c3472c78",
        "ame2/ame2/assets/unitree.py": "949a8f20c15cc62582460d631df868e1bea37997427baadccc20eb266590552d",
        "ame2/ame2/sensors/__init__.py": "f56efa829d56633afe7e19ce77b0e1ddb0eb9ba6bc45f2012837c2aa8d43e490",
        "ame2/ame2/sensors/livox_neural_map_sensor.py": "21a983dc7133d75df980bbbb08365bb67168d9300da75b77a46517e08d20884c",
        "ame2/ame2/sensors/mid360_lidar.py": "dec80abae24cde184badcaacc0a35b57330dca886e2951470092eb820a9fba3c",
        "ame2/ame2/sensors/neural_mapping_utils.py": "9f7d5bf293263bac1a580194b749602627046f197c9d23f085bf028e4f98465f",
        "ame2/ame2/tasks/__init__.py": "de698b10787e432dbea62d1fa4e46845805c88618ee135ab56f494b917ce9596",
        "ame2/ame2/tasks/agents/__init__.py": "e72b43071221e271f69574d1d5e6116c5d71b41727973bf00560cb667d766435",
        "ame2/ame2/tasks/agents/rsl_rl_ppo_cfg.py": "4d00900556c5f98b49b22102691212d7a2bdad55b5c181250499d559b28d08fa",
        "ame2/ame2/tasks/ame2_env_cfg.py": "b3a366c94d11c9e080ceb6d6d1469688ace8654f73f303e885ee18d061a35208",
        "ame2/ame2/tasks/custom_terrains.py": "d9ae500f1c421c9da85ffd0f4e5179ef095c1705ccdc756fb03591af619feb9b",
        "ame2/ame2/tasks/mdp/__init__.py": "bd3f00a7c3625aa2358da285ddddac59416cd3aac6ec15ccfe851166721a743f",
        "ame2/ame2/tasks/mdp/acceleration.py": "a12e4a7ffb5dd6501218f52bf19c70a30d3d0d1b2dfd9691b107906d287cd0ff",
        "ame2/ame2/tasks/mdp/actions.py": "c8f3aafd8c7ed8cb2295d0ab977764bbc1458b840e8e930baafddb1b73240599",
        "ame2/ame2/tasks/mdp/commands.py": "d1f35363e76839e5dd2387c313f6950033e644c4016c05a3e01924590286eb01",
        "ame2/ame2/tasks/mdp/curriculums.py": "fc3924f12ecd7b734af6de4a8122ecf42b59d73f82c1d4728e74fb4e80a0316c",
        "ame2/ame2/tasks/mdp/events.py": "114db19ce947c1622bf91d3fc2caad90c1aa6f02f98eac4e5dc6bf389276fd55",
        "ame2/ame2/tasks/mdp/observations.py": "3237984e07e32cdbd9b56a3c68dc7c57475191ce3901ac844142f03cba5f26e2",
        "ame2/ame2/tasks/mdp/rewards.py": "a5c2ac1c6839c1f241e9ad06155a09595c17501bab3e1015f8304448575ca5af",
        "ame2/ame2/tasks/mdp/symmetry.py": "399e127b739a33da25c451da23a60e64007fff9d4f6d49141f7c4443aed44b41",
        "ame2/ame2/tasks/mdp/terminations.py": "98477bf6db5a967b6b0878af5f22e9ff2cc7bb8d0d2ea33a5d673e89908a3d11",
        "ame2/ame2/tasks/terrains.py": "2d4e405f15998288a9ff1bb464ae73caadaa9892ca4eb4459336434a37ee05f0",
        "ame2/ame2/ui_extension_example.py": "8c577437131944c7e9644363556e459db5af546dda6f9b7fc1f6487feeaa4b80",
        "ame2/scripts/list_envs.py": "4b7cbef843fd5cfd4f2adce329a9cd6041c6bae026108666c9caab243ffb129b",
        "ame2/scripts/random_agent.py": "ecd9a7aa0621d738d1cb67eb294d5cea29e4b22406e723e31f73fc8afbecbbfb",
        "ame2/scripts/research/checkpoint_audit.py": "f1f0b06feb0666bf46b89f505048362d3437ad9b1a241c7974d1a662e1230b21",
        "ame2/scripts/research/collect_webagg.py": "54bdb6badc1c9f7d593f40d3c6082e807b7cc7530045cd31b6e649b5d4adc3df",
        "ame2/scripts/research/episode_metrics.py": "6a5555e7fc7488809e44855c64cc2ab8e1f597cdbdc4dfa88e00e17b200c5479",
        "ame2/scripts/research/evaluate_final.py": "d9cc4a389e28fb984ae1fa6a9133bfc3934eb387c5b92ab22eacbc3224bdfe13",
        "ame2/scripts/research/inventory.py": "eb2f5c7a543661670aadd946511b99c1c9b849dfa1808be7f49fa4f1d61ebc85",
        "ame2/scripts/research/model_checks.py": "614f20c51eb70387744f3841345c543c549a64e6e6d9de6ab96aa23f20ca7b70",
        "ame2/scripts/research/plot_training.py": "a54923002c56790278e120aa9f1ea1731911477636c50a8f2a278bc120584b1a",
        "ame2/scripts/research/run_suite.py": "855e0c55aa4623ef7a1fac89dca3b40be0af91dac84f988178270d0f3b9dd48a",
        "ame2/scripts/research/test_episode_metrics.py": "af14f98d00b1d634e116a581053db9422d3cfa99935fe345ba81ac719623512a",
        "ame2/scripts/research/verify.py": "36f7a485eb3b93af3c7d95a920cee49c4e6231ae23596a407406b534cfdc6bdf",
        "ame2/scripts/rsl_rl/_hip_acc_plotter.py": "04b69ce9cd39ea37d2849a7d38b73a0863de62e7e7a113fe84d972c3f4d571f8",
        "ame2/scripts/rsl_rl/cli_args.py": "a6d44cb8442a222e4d6c6167a86eddd83081eb1d420a7fd9ef67ae257885ff56",
        "ame2/scripts/rsl_rl/play.py": "d6ac451ee5b24537d17125b0c5cd3601c25514ec8d938d07c4474fafd4e41a94",
        "ame2/scripts/rsl_rl/train.py": "b3408e3a424eeddd812336f27ab9b1468c8f718bf69e81728e2eed4bafa296bd",
        "ame2/scripts/zero_agent.py": "e8f84e98c1c59ecd9e35824dd7924cfecf2f4cc4b99d62b787c7d1f4a128f30a",
        "container/test_training_monitor.py": "3af4470b6541ab928ef112418004674bc37cf9383b4deb07179eda64fc3699c5",
        "container/training_evidence.py": "2dfbd530b6f6cdf56daf15c3c5a985c66f43b68925017efa63a50c60107b573d",
        "container/training_monitor.py": "5945ece3b392480b03e833b64030a0e0d9511b19b7d3cd394e8cfbb1edbec645",
        "container/verify_tensorboard_close.py": "4407379d7baa368cb3a9a968833041558aada85e682ea6674a8d301a1c67483c",
        "rsl_rl/rsl_rl/__init__.py": "9b4c420fef3ae39683544833b6d2efbb26aecfc0583ec59be7f4eeb748fecf66",
        "rsl_rl/rsl_rl/algorithms/__init__.py": "e370271e689bada5cdf2b4623e0d16d75e8439864a2ae913b22215f7b2985843",
        "rsl_rl/rsl_rl/algorithms/distillation.py": "66bf70f1c4ca2f4c4cbb10339e2c8f337eef2ed79181855f6cf7f6c1a26aaaa5",
        "rsl_rl/rsl_rl/algorithms/ppo.py": "f1c4b73cb132078e5e594ed04690533b3c296178604f1b12657100f75bb622f9",
        "rsl_rl/rsl_rl/algorithms/ppo_il.py": "f05a477f40396663339e9209a2e8e87e79c5bcaa478ac77bb36fefc39ea8dd5d",
        "rsl_rl/rsl_rl/env/__init__.py": "33bfc9562580377c2ce6388c37b0df2b8e992c22ce46923443681cbbf1960d60",
        "rsl_rl/rsl_rl/env/vec_env.py": "4a72df2fbf9b3e162e0e4b10e0b473511f02ad8c3ebaab0b7993ddfd63a9fa43",
        "rsl_rl/rsl_rl/extensions/__init__.py": "595fd79b13fa6c64cce1f20adb7440660a4c5e5b78749db4794554a782a1ccfe",
        "rsl_rl/rsl_rl/extensions/rnd.py": "e8f25627c04f4cf478cbbf1ec4c362276e80566a1222c75ba55f7b8e0f8471af",
        "rsl_rl/rsl_rl/extensions/symmetry.py": "eb83c3f77e4cc3f3b3b18f7a592429761b7152c8ac1160c32e02562dc0987481",
        "rsl_rl/rsl_rl/models/AME2_models.py": "b15375054fe99e2014a6efc8f9eefed7a990a9a398f9d21bc2978ab8c7500b8f",
        "rsl_rl/rsl_rl/models/__init__.py": "3ee2113438171d743fe733dd97f4bb3c16965406b4713f1ead8ebd74faa3b7a2",
        "rsl_rl/rsl_rl/models/cnn_model.py": "be96851407e75efed08f8302ae05c28f6d917c3ee174e8c79a095e53d0b69e8e",
        "rsl_rl/rsl_rl/models/mlp_model.py": "6219ebb3ed4df036dae7ff1c30d0fbb169eaaa659e44a659dd757a292124476b",
        "rsl_rl/rsl_rl/models/rnn_model.py": "80c1d6452ef021e4d7b174231ed7abac1ed0db8de9604561f8060148d4333ccc",
        "rsl_rl/rsl_rl/modules/__init__.py": "842c65f27abfb9a9cf0ba913ed95aaafc9605dffa7ae72bf7a246a4f2893ec9a",
        "rsl_rl/rsl_rl/modules/ame2_modules.py": "b3fc6b38073b085299c9e622e1c1a6e86126d94ae488d5485e7853e7841a8a2c",
        "rsl_rl/rsl_rl/modules/cnn.py": "4f5bab5f192c42180125f32a4af350108dd1c247e1e84c81f6cf4ea560037ccf",
        "rsl_rl/rsl_rl/modules/distribution.py": "4631eae1939dcd6b065d79c3c0128a88ba2c6126d08f46944c8795682a208a1b",
        "rsl_rl/rsl_rl/modules/mlp.py": "bad934b364b26cd47b6d1612e00ace107a425ae4d272c0cd0c82cbfc57bbcdbc",
        "rsl_rl/rsl_rl/modules/normalization.py": "539e1193cebcc472585cd3df100946fb8d788c4aa0f9f5cbcb3387a64d312926",
        "rsl_rl/rsl_rl/modules/rnn.py": "07f0eec06c7f2638edbdbc3ba25f56122a7941cb0543138f4a6b04675b2a97e6",
        "rsl_rl/rsl_rl/runners/__init__.py": "26f4130a403414e13041b62a848d04da3fb0166757603950ea758b151d4b5aaa",
        "rsl_rl/rsl_rl/runners/distillation_runner.py": "7445cbaf3e1fa241d742447ab17d941a659c92b6f8365ef22c5d818923d9e275",
        "rsl_rl/rsl_rl/runners/on_policy_runner.py": "3af38d028c3a7778b84eded086971c6c5fd7f63d54b56e6da913e35f8ccc13a0",
        "rsl_rl/rsl_rl/storage/__init__.py": "7c9d96df3cad10aa27f34e77f7105a29f74e2d7dd10467b2919f99867a69298e",
        "rsl_rl/rsl_rl/storage/rollout_storage.py": "ab6c8439370d292c756f70984ee89f334c455969cd58ea2b764175135929f28a",
        "rsl_rl/rsl_rl/utils/__init__.py": "80a1f640c23169f47c949b85dfdfb3a1d356b3aba7988eb162177d2dfc7908ea",
        "rsl_rl/rsl_rl/utils/logger.py": "42b7b8b9bc8cc62c8c53110d261940ec1925bc080bca38f7c5c251e6a673b59a",
        "rsl_rl/rsl_rl/utils/muon.py": "8936a949518112baadfce19eb634553881c40f275756a51d29aa3b320b24d823",
        "rsl_rl/rsl_rl/utils/neptune_utils.py": "a3446faf8d655b75feb215ff4df8598bc91ff5aab446a6349e9ced31bf3cc495",
        "rsl_rl/rsl_rl/utils/utils.py": "5d364b9236c76e8d040d6e150c0d17f5fea1f44ffcd7f139b80a61af58e728c8",
        "rsl_rl/rsl_rl/utils/wandb_utils.py": "ed42325490f3bb15e6910bbe1496aa18709cf69e2db822cb76d98c8d80367a8d"
      },
      "ended_utc": "2026-10-10T14:28:10.603721+00:00",
      "wall_seconds": 233.9204599808436,
      "path": "/workspace/ame2-minimal/outputs/research/reproduce-20261010/full-final-policy/summary.json",
      "sha256": "21d3fa819454df995ed7ae88940b2dd7c9cfa692e6971bb8371584058cae2fdc"
    }
  ]
};
