# AME-2 全功能复现与验证记录

先按 [note.md](note.md) 配置同一张本地与云端 Docker 镜像。这里按照实际任务注册、全部地形、teacher 训练、推理、导出与诊断功能组织复现，并把场景能运行、训练能更新、策略完成目标分开记录。除 Docker / SSH / Git / 文件传输外，所有运行命令均在 Docker 内执行。

![上游提供的 G1 地形总览](misc/all_terrains_4x3.webp)

这张图片来自原仓库，仅用于认识项目场景。下面只有带实际日志、报告或视频的条目才标记为通过。本次实验入口为 `scripts/research/run_suite.py`，产物位于 `outputs/research/reproduce-20261010/`；修复后的重跑使用新的目录，失败试次保留。图文预览对应的原始报告和 SHA-256 见 [视频来源清单](usage_assets/manifest.json)，可直接打开[离线播放器](usage_assets/playback.html)。

下面是本分支首次真实录像：官方 gaze checkpoint 在 `rough`、difficulty 0.5、seed 42 下运行 400 步（8 秒仿真时间），最小目标距离 0.132 m，期间没有提前终止。GIF 为整段均匀采样预览；点击进入播放器查看完整时长 MP4。这是独立的首轮录像，后文 16 地形矩阵使用各自明确记录的条件。

[![G1 在 rough 地形真实运行并到达目标](usage_assets/animations/video-first-result.gif)](usage_assets/playback.html#video-first-result)

## 0. 验收层级

| 层级 | 通过条件 | 能说明什么 |
| --- | --- | --- |
| 镜像与注册 | 镜像内包版本正确，Isaac 启动，列出全部 6 个任务 ID | 环境安装与入口可用 |
| 场景 smoke | 实际构造、reset、执行固定步数，状态与奖励有限，报告正常退出 | 机器人、场景和 MDP 可以运行 |
| 训练 smoke | 完成 rollout、PPO 更新，写出有效 checkpoint 和实际参数 | 优化与保存链路可用 |
| checkpoint rollout | 匹配的真实权重在固定 seed / 地形 / 难度下运行完整试次 | 该权重在这些条件下的实际表现 |
| 任务达成 | 依据目标距离、episode termination 和试次定义统计 | 该次 rollout 是否完成目标 |
| 完整训练 | 达到指定迭代并保存产物，另做匹配 checkpoint 的独立评估 | 本次训练按计划完成及其评估结果 |

不能把注册成功当作 student 已能运行，不能把两次 PPO 更新当作训练收敛，也不能把视频正常生成当作越障成功。重复录制同一个试次的不同视角只算一次实验。每段视频应保留 task、terrain、difficulty、seed、checkpoint 来源、步数、最终目标距离、提前终止及文件哈希。

## 1. 全部机器人与任务入口

本项目只发布了 **Unitree G1**，没有飞机。G1 模型位于 `ame2/ame2/assets/g1_lidar/`；普通 teacher 与 gaze teacher 共用物理环境，actor 编码结构不同。

| 注册 ID | actor / 用途 | 公开依赖 | 本分支验收 |
| --- | --- | --- | --- |
| `Ame2-G1` | AME-2 dense attention teacher 训练 | 齐全 | 16 地形构造 / reset / 32 步通过；训练另列 |
| `Ame2-G1-Play` | 普通 teacher 推理 | 需要同结构训练 checkpoint | 16 地形构造 / reset / 32 步通过；新训练权重另列 |
| `Ame2-G1-Gaze` | TAGA 风格 active gaze teacher 训练 | 齐全 | 16 地形构造 / reset / 32 步通过；训练另列 |
| `Ame2-G1-Gaze-Play` | gaze teacher 推理、官方 checkpoint | 齐全 | 16 地形 smoke、官方 native / JIT 各 800 步通过 |
| `Ame2-G1-Gaze-Student` | LSIO，teacher 蒸馏 + RL | 缺 neural mapping 权重 | 上游依赖未发布 |
| `Ame2-G1-Gaze-Student-Play` | student 推理、LiDAR/map 可视化 | 缺 neural mapping / student 权重 | 上游依赖未发布 |

容器内运行注册检查：

```bash
/isaac-sim/python.sh scripts/list_envs.py
```

G1 teacher 的 actor 观察 `teacher_mapping` 和 `teacher_prop`，critic 使用额外的 privileged 状态。实测单环境张量为 `teacher_mapping (1,26,15,3)`、`teacher_prop (1,82)`、`critic (1,499)`，动作维数 23。普通 AME-2 直接处理地图 attention；gaze 先生成全局上下文并选取 12 × 10 地图 crop，再做 dense attention。每个控制步长 0.02 秒，默认 episode 16 秒；动作是所有关节的 delayed position target。默认上身、足部 shaping 在源码中有权重，上游注明尚未专门调优。

## 2. 全部 16 种地形

`play.py --terrain` 从完整训练 generator 重新选地形，不受默认 Play 只选择 `stones` 的限制。训练权重为 0 的四种地形也需要显式验证；“未参与默认采样”和“没有场景代码”是不同情况。

| CLI 名称 | 场景 | 默认训练比例 | 本分支场景 / 官方策略记录 |
| --- | --- | ---: | --- |
| `rough` | 坡度、起伏与粗糙地面 | 0.05 | 待实测 |
| `stair_down` | 下行金字塔台阶 | 0.05 | 待实测 |
| `stair_up` | 上行金字塔台阶 | 0.05 | 待实测 |
| `boxes` | 方箱障碍 | 0.05 | 待实测 |
| `obstacles` | 稀疏高障碍与起伏 | 0.05 | 待实测 |
| `climb_up` | 上爬高台 | 0.20 | 待实测 |
| `climb_down` | 下落高台 | 0.05 | 待实测 |
| `consecutive` | 连续高台 | 0.05 | 待实测 |
| `gap` | 裂隙 | 0.05 | 待实测 |
| `pallets` | 托盘阵列 | 0.05 | 待实测 |
| `beam` | 平衡梁 | 0.05 | 待实测 |
| `stones` | 石块踏点 | 0.30 | 待实测 |
| `pit` | 凹坑 | 0 | 待实测 |
| `peak` | 凸峰 | 0 | 待实测 |
| `test_1` | 圆柱踏石混合测试 | 0 | 待实测 |
| `test_2` | 稀疏混合攀爬测试 | 0 | 待实测 |

比例配置总和为 1.10，Isaac Lab generator 根据相对权重归一化采样。原始定义见 [terrains.py](ame2/ame2/tasks/terrains.py) 和 [custom_terrains.py](ame2/ame2/tasks/custom_terrains.py)。默认完整训练地形为 10 行 × 60 列，每 tile 12 m × 12 m；Play 为 2 × 2。

### 2.1 单地形运行与独立试次

下列示例在容器内执行。checkpoint 保持只读；每个地形使用独立报告目录，避免覆盖前一个视频：

```bash
/isaac-sim/python.sh scripts/research/verify.py \
  --task Ame2-G1-Gaze-Play --num_envs 1 --seed 42 --headless \
  --checkpoint ../modelzoo/g1_gaze_64000env_10h/model_2400.pt \
  --terrain stones --difficulty 0.35 --video --steps 800 \
  --report ../outputs/research/manual-stones-seed42/result.json
```

替换 `--terrain` 并为其建立独立日志目录，即可逐项复现上表。`--difficulty d` 将 difficulty range 固定为 `(d, d)`；不同地形对难度的几何解释不同。原始 `play.py` 另支持 `--terrain_height 0.3` 固定 `climb_up` 或 `climb_down` 高度，以及 `--goal_x_range 2.6 5.5` 调整目标在 tile 中的采样区间，需要同时指定 `--terrain`。将目标放在障碍另一侧才能检验越障，不应把障碍前的短距离到达称作跨越成功。

默认 `play.py` 的 `[PLAY_RESULT]` 记录 env 0 在整段录像中是否进入 0.5 m 目标半径以及是否提前终止。这个指标是单次录像的结果，不能代替多 seed、多 episode 的论文成功率；超过一个 episode 的长视频还可能包含重置后的轨迹，应保留 episode 级报告。

### 2.2 全量矩阵

研究脚本遍历真实 registry 与完整 terrain dictionary，写出每项的参数、退出状态、有限值检查与完整日志。容器内执行以下命令；输出目录必须不存在或为空，脚本拒绝覆盖已有证据：

```bash
/isaac-sim/python.sh scripts/research/run_suite.py \
  --phase tasks --output ../outputs/research/new-trial/tasks --steps 800
/isaac-sim/python.sh scripts/research/run_suite.py \
  --phase terrains --output ../outputs/research/new-trial/terrains --steps 800
```

`tasks` 检查四个 teacher ID、native/JIT 官方策略在 16 个地形并行运行，以及独立 raw Mid360 raycast。`terrains` 为 16 个地形分别录制 env 0 的完整 800 步视频，再录制 attention。全地形并行报告和单地形录像分别保留；一段 env 0 视频不代表其他 15 个环境的可见过程。

只需检查全部地形时可以在同一个 Isaac App 中执行：

```bash
/isaac-sim/python.sh scripts/research/verify.py --headless \
  --task Ame2-G1-Gaze-Play --terrain all --num_envs 16 --steps 800 \
  --checkpoint ../modelzoo/g1_gaze_64000env_10h/model_2400.pt --export_jit \
  --report ../outputs/research/new-trial/all-terrains.json
```

`--policy zero`、`random`、`native` 或 `jit` 明确策略路径；不传 checkpoint 默认 zero。JIT 路径先比较 native/exported actions，再实际执行 JIT rollout。`--mid360` 为 teacher 环境单独增加 raw LiDAR，避免把缺失 neural mapping 权重误当作原始 raycast 缺失。

2026-10-10 的 `tasks-final/summary.json` 共 8 项全部通过。四个 teacher ID 各在全部 16 种地形执行 32 步随机动作；官方 native 和 JIT 各执行 800 步，观测、动作、奖励和机器人状态均有限，JIT 动作比较最大绝对误差为 `4.77e-7`。Native 的 16 个环境都曾进入目标半径，其中 `test_1` 发生 1 次提前终止；JIT 的 `peak` 与 `test_1` 各发生 1 次。环境会自动 reset，因此这些记录不能写作“16/16 无跌倒”或论文成功率。逐环境数值与原始报告哈希保存在[验收快照](usage_assets/validation_snapshot.json)。

## 3. 两种 teacher 训练

容器内分别执行短训练，检查普通 actor 与 gaze actor 两条路径：

```bash
/isaac-sim/python.sh scripts/rsl_rl/train.py \
  --task Ame2-G1 --headless --num_envs 64 --max_iterations 2 \
  --seed 42 --logger tensorboard --run_name smoke-ame2
/isaac-sim/python.sh scripts/rsl_rl/train.py \
  --task Ame2-G1-Gaze --headless --num_envs 64 --max_iterations 2 \
  --seed 42 --logger tensorboard --run_name smoke-gaze
```

两个输出目录分别为 `logs/rsl_rl/ame2/` 和 `logs/rsl_rl/ame2_gaze/`。验收应检查保存的 checkpoint、actor 参数与 optimizer state 均有限，随后用匹配的 `-Play` task 加载新权重完成有界 rollout。2 iterations 的新策略通常不能稳定走路；它只用于确认训练端到端可执行。

| 功能 | 配置位置 / 命令 | 验收证据 |
| --- | --- | --- |
| AME-2 teacher / 32 attention heads | `Ame2-G1` | 待实测 |
| Gaze teacher / crop / ROI penalty | `Ame2-G1-Gaze`，默认 crop 12 × 10、roi 0.01 | 待实测 |
| 多 critic heads | 每个 reward 项独立 value head，当前共 23 个；critic 为 16 experts `MoEModel` | 待实测 |
| Muon optimizer | `agent.algorithm.optimizer=muon`（默认） | 待实测 |
| bf16 前向更新 | `agent.algorithm.use_mixed_precision=True`（默认） | 待实测 |
| Adam / fp32 覆盖 | `agent.algorithm.optimizer=adam agent.algorithm.use_mixed_precision=False` | 待实测 |
| symmetry augmentation | 默认仅 critic 数据增强 | 待实测 |
| 地形 / 目标 / 观测噪声 curriculum | 默认 teacher training env | 待实测 |
| torso / arm / foot shaping | 默认 reward 配置及覆盖 | 待实测 |
| checkpoint 保存与恢复 | `--resume --load_run ... --checkpoint ...` | 待实测 |
| 多 GPU | `container/run.sh -g 0,1 train ...` | 待实测 |
| 云端完整默认训练 | 4096 env / 5000 iterations / 最小空闲 GPU | 待实测 |

原始 checkpoint 的 64000 环境配置与当前默认 4096 环境配置分别见 note.md 第 4 节。完整训练必须保留实际 YAML、checkpoint iteration、GPU 型号、镜像 ID 与代码版本；“已启动”与“已完成 5000 次更新”应分别标注。

批量训练检查覆盖普通 / gaze teacher 与 Muon+bf16 / Adam+fp32，以及单 value head 对照：

```bash
/isaac-sim/python.sh scripts/research/run_suite.py \
  --phase training --output ../outputs/research/new-trial/training --num_envs 64
```

## 4. 推理、导出和诊断功能

以下命令在容器内使用只读官方权重；固定 1 个环境和 seed 42。新增 `--output_dir` 为每项指定独立可写目录。批量执行本节原始 CLI 功能可使用：

```bash
/isaac-sim/python.sh scripts/research/run_suite.py \
  --phase cli --output ../outputs/research/new-trial/cli --steps 800
```

### 4.1 Attention、纯净画面与 TorchScript

```bash
/isaac-sim/python.sh scripts/rsl_rl/play.py \
  --task Ame2-G1-Gaze-Play --num_envs 1 --headless --seed 42 \
  --checkpoint ../modelzoo/g1_gaze_64000env_10h/model_2400.pt \
  --output_dir ../outputs/research/manual-attention \
  --terrain rough --difficulty 0.3 --video --video_length 800
/isaac-sim/python.sh scripts/rsl_rl/play.py \
  --task Ame2-G1-Gaze-Play --num_envs 1 --headless --seed 42 \
  --checkpoint ../modelzoo/g1_gaze_64000env_10h/model_2400.pt \
  --output_dir ../outputs/research/manual-export \
  --terrain rough --difficulty 0.3 --export --video --video_length 800 --no_markers
```

第一段显示 actor/critic 高度扫描与 attention；第二段关闭 overlay 并导出 `ame2_exported_2400.jit`，随后重新加载该 JIT 执行 rollout。标准 gaze export 返回 actions、crop attention latent、global context。导出成功还应检查重新加载后的动作数值；普通 AME-2 同样有 JIT 入口，ONNX 在当前模型代码中明确未实现。

### 4.2 奖励、关节与加速度

```bash
/isaac-sim/python.sh scripts/rsl_rl/play.py \
  --task Ame2-G1-Gaze-Play --num_envs 1 --headless --seed 42 \
  --checkpoint ../modelzoo/g1_gaze_64000env_10h/model_2400.pt \
  --output_dir ../outputs/research/manual-plots \
  --terrain rough --difficulty 0.3 --plot --log_rewards \
  --video --video_length 810 --no_markers
```

`--plot` 在仿真时间到 10 s 后保存 `debug_plots.pdf`，包含 body frame 基座速度和各关节 torque–velocity 图。`--log_rewards` 在 env 0 首次结束时保存 `reward_curves.pdf`，记录全部 active reward 项及累计贡献；16 秒 episode 需要运行到终止，提前跌倒则记录其实际短 episode。`--vizacc` 的 WebAgg 实时图需要 GUI，headless 跳过不能计为 GUI 验收。

### 4.3 往返与外力飞行调试

```bash
/isaac-sim/python.sh scripts/rsl_rl/play.py \
  --task Ame2-G1-Gaze-Play --num_envs 1 --headless --seed 42 \
  --checkpoint ../modelzoo/g1_gaze_64000env_10h/model_2400.pt \
  --output_dir ../outputs/research/manual-return-home \
  --terrain rough --difficulty 0.1 --return_home --video --video_length 800
/isaac-sim/python.sh scripts/rsl_rl/play.py \
  --task Ame2-G1-Gaze-Play --num_envs 1 --headless --seed 42 \
  --checkpoint ../modelzoo/g1_gaze_64000env_10h/model_2400.pt \
  --output_dir ../outputs/research/manual-fly \
  --terrain climb_up --difficulty 0.3 --fly --video --video_length 800
```

`--return_home` 达到目标 0.5 m 内并停留 1 s 后，先转向出生点，再重定向回程。teacher 路径能检查命令状态机，但不会验证尚未发布的 neural map memory。`--fly` 对 G1 base 施加外力和力矩，并清零策略动作，用于调试地形与感知；这不是飞行器模型，也不能作为机器人自主越障的成功证据。

### 4.4 其他入口

`scripts/zero_agent.py` 和 `scripts/random_agent.py` 分别发送零动作与随机动作，适合观察环境基本行为，默认持续运行。`scripts/list_envs.py --keyword Gaze` 可过滤任务。研究验收使用有步数上限的入口并明确正常退出，避免用外部 timeout 掩盖初始化失败。

## 5. 未发布依赖的核验

| 项目 | 已有内容 | 缺失内容 | 当前可复现结论 |
| --- | --- | --- | --- |
| Mid360 raw LiDAR | raycaster、扫描模式与 robot sensor USD | student 完整环境受 neural map 初始化阻挡 | 独立 raw raycast 已通过；不能记作 neural mapping 复现 |
| Neural mapping | pipeline / sensor / visualization 源码 | `g1LivoxMapping_perframe.pt` | 完整闭环不可执行 |
| LSIO student | actor、imitation+representation+RL 代码与配置 | neural mapping checkpoint，现成 student checkpoint | 完整训练/推理不可执行 |
| Teacher JIT | 官方 gaze checkpoint + exporter | 本分支实际导出生成 | native 数值比较与全 16 地形 JIT rollout 已通过 |
| Tron1 / depth map | 上游 release plan | 环境、资产与模型 | 尚未发布 |
| Neural map training | 上游 release plan | 训练代码与训练数据 | 尚未发布 |

teacher JIT 路径与 mapping checkpoint 路径见 note.md 第 7 节。核验 missing-dependency 路径时应保留明确缺失文件错误；不要把它统计成项目已有功能正常运行，也不要把预期失败隐藏在一个全部通过的数量里。

## 6. 图文、视频与复现实验记录

本分支视频应由真实 Isaac Sim rollout 录制，原始 MP4 与大日志留在忽略目录，仓库中保留可查看预览与机器可读来源清单。离线播放器应同时展示成功、未到达和提前终止，并支持播放、暂停、拖动与调速。没有录制完成的条目先保留“待实测”，不用静态上游图片冒充本次结果。

在容器内从真实报告导出图文资产；导出使用镜像内 ffmpeg，不启动 Isaac Sim：

```bash
/isaac-sim/python.sh ../usage_assets/export.py \
  --report-root ../outputs/research/reproduce-20261010 \
  --output ../usage_assets --gif
```

`manifest.json` 保留 source MP4、原始 JSON、压缩 MP4、poster 和 GIF 的 SHA-256；`manifest.js` 让离线 HTML 可以直接读取清单，无需宿主机 Python HTTP 服务。压缩 MP4 保留完整原始时长，GIF 对整段均匀采样并加速循环，不用于计时。

最终结果表将在实验完成后填入：

| 检查项 | 结果 | 原始证据 / 复现命令 |
| --- | --- | --- |
| 本地单镜像构建与版本 | 通过 | 本地 `ame2:research`；Python 3.11.13、Torch 2.7.0+cu128、Isaac Lab VERSION 2.3.2 |
| 六个任务注册 | 通过 | runtime registry；两个 student 单列未发布依赖 |
| 四个 teacher ID reset / step | 通过 | `tasks-final`：每 ID 16 地形 × 32 步 |
| 全部 16 个地形 | 并行场景通过；逐地形视频待完成 | 第 2 节 |
| 官方 gaze checkpoint 16 地形 rollout | native / JIT 执行通过，提前终止如实记录 | 两路径各 800 步；不是 16/16 无跌倒 |
| 两种 actor 训练 / 保存 / 再加载 | 待实测 | 第 3 节 |
| 导出 JIT 与独立加载 | 通过 | 全 16 地形 JIT 800 步；两 actor 训练分布初始化后的 CPU 导出回归 |
| 奖励 / 关节诊断 PDF | 待实测 | 第 4.2 节 |
| 往返 / fly 状态机 | 待实测 | 第 4.3 节 |
| 云端同镜像与代码同步 | 待实测 | note.md 第 5 节 |
| 云端官方默认训练完成 | 待实测 | checkpoint iteration + YAML |
| Student / neural mapping / Tron1 | 上游依赖未发布 | 第 5 节 |

[验收快照](usage_assets/validation_snapshot.json)保存采集时间、Docker image ID、GPU、seed、原始报告路径与 SHA-256；suite 的每个 job 记录实际代码文件 SHA。新的实验写入新目录和独立 trial ID，避免把失败重跑覆盖成一次从未失败过的实验。

## 7. 本分支为复现修复的入口

- **容器构建**：修复 NVIDIA 预打包环境中 setuptools / packaging 的兼容性，固定基础镜像 digest；依赖修复只发生在 Docker 层。
- **有界运行与可写产物**：`play.py` 支持 `--max_steps`、`--output_dir` 和 `play_result.json`；官方 checkpoint 保持只读，录像、JIT 和 PDF 写入独立目录。
- **训练配置与恢复**：修复 `--experiment_name` 未实际作用于输出目录，以及绝对 checkpoint 路径的 resume 解析。
- **训练后 JIT 导出**：随机 actor 已创建 `torch.distributions.Normal` 后，导出包装器清除其深拷贝中的训练分布状态，使两个 teacher actor 都能再次 script/freeze；推理 actor 和训练权重保持原逻辑。
- **全地形场景**：held-out `test_1/test_2` 原有 10 个 target patches，其他地形 30 个，Isaac Lab 的同名 patch tensor 不能直接拼接。仅在组合验证场景统一为 10 个并写入 `combined_scene_patch_overrides`；单地形录像和默认官方训练保留原参数。
- **真实覆盖**：组合场景使用 generator 的确定性列分配，每种地形一列、难度固定；环境的 terrain-level curriculum 关闭。随机生成 16 列不能保证覆盖 16 种类型，旧随机组合的结果保留为早期试次，不作为逐地形验收。

第一轮失败报告保存在 `outputs/research/reproduce-20261010/tasks/`；最终通过目录及逐项证据以第 6 节验收快照为准。这些修复解决安装与验证入口的可执行性，策略未完成的试次仍按真实结果展示。
