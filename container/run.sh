#!/usr/bin/env bash
# One image for local simulation/inference and cloud training. All dependencies stay in Docker.
set -euo pipefail
HERE=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
ROOT=$(cd "$HERE/.." && pwd)
usage() {
    cat <<'HELP'
Usage: container/run.sh [options] train|play|shell|cmd [arguments...]
       container/run.sh exec [container-name] [command...]
Options:
  -g, --gpus IDS   GPU index/UUID list; "auto" selects smallest idle, unreserved GPU (default 0)
  --gui           Forward X11; requires DISPLAY and authorized root X11 access
  -d, --detach    Keep a named background container (docker logs -f NAME)
  --name NAME     Set container name; existing containers are never replaced
  --dry-run       Print the shell-escaped Docker command without running it
Environment: IMAGE=ame2:research, SHM_SIZE=8g, CPUS, MEMORY_LIMIT, MASTER_PORT=29500,
 CACHE_PREFIX=ame2, WANDB_MODE=disabled, WANDB_API_KEY, AME2_LOCAL_ASSET_ROOT.
Examples:
  container/run.sh -g 0 play --task Ame2-G1-Gaze-Play --checkpoint /workspace/ame2-minimal/modelzoo/g1/gaze/model.pt
  container/run.sh -g auto -d --name ame2-train train --task Ame2-G1-Gaze --num_envs 4096
  container/run.sh cmd /isaac-sim/python.sh scripts/list_envs.py
HELP
}
IMAGE=${IMAGE:-ame2:research}; GPUS=0; GUI=0; DETACH=0; DRY_RUN=0; NAME=''
while (( $# )); do
    case "$1" in
        -g|--gpus|--name)
            (( $# >= 2 )) || { echo "Missing value for $1" >&2; exit 2; }
            if [[ "$1" == --name ]]; then NAME=$2; else GPUS=$2; fi; shift 2 ;;
        --gui) GUI=1; shift ;;
        -d|--detach) DETACH=1; shift ;;
        --dry-run) DRY_RUN=1; shift ;;
        -h|--help) usage; exit 0 ;;
        *) break ;;
    esac
done
(( $# )) || { usage; exit 2; }
MODE=$1; shift
if [[ "$MODE" == exec ]]; then
    NAME=${1:-$(docker ps --filter 'name=^ame2_' --format '{{.Names}}' | head -1)}
    [[ -n "$NAME" ]] || { echo 'No running ame2_* container' >&2; exit 1; }
    (( $# == 0 )) || shift
    RUN=(docker exec); [[ ! -t 0 ]] || RUN+=(-it)
    RUN+=(-w /workspace/ame2-minimal/ame2 "$NAME")
    if (( $# )); then RUN+=("$@"); else RUN+=(bash); fi
    if (( DRY_RUN )); then printf '%q ' "${RUN[@]}"; printf '\n'; exit 0; fi
    exec "${RUN[@]}"
fi
[[ "$GPUS" != auto ]] || GPUS=$("$HERE/select_gpu.sh")
[[ "$GPUS" =~ ^[a-zA-Z0-9,./_-]+$ ]] || { echo 'Invalid GPU IDs' >&2; exit 2; }
IFS=',' read -ra GPU_ARR <<< "$GPUS"; NGPU=${#GPU_ARR[@]}
PY=/isaac-sim/python.sh
HEADLESS=(--headless); (( ! GUI )) || HEADLESS=()
case "$MODE" in
    train)
        CMD=("$PY")
        (( NGPU == 1 )) || CMD+=(-m torch.distributed.run --nnodes=1 "--nproc_per_node=$NGPU" "--master_port=${MASTER_PORT:-29500}")
        CMD+=(scripts/rsl_rl/train.py "${HEADLESS[@]}")
        (( NGPU == 1 )) || CMD+=(--distributed)
        CMD+=("$@") ;;
    play)
        (( NGPU == 1 )) || { echo 'play requires exactly one GPU' >&2; exit 2; }
        CMD=("$PY" scripts/rsl_rl/play.py "${HEADLESS[@]}" "$@") ;;
    shell)
        (( $# == 0 )) || { echo 'Use cmd to run a command' >&2; exit 2; }
        if (( DETACH )); then CMD=(sleep infinity); else CMD=(bash); fi ;;
    cmd)
        (( $# )) || { echo 'cmd requires a command' >&2; exit 2; }
        CMD=("$@") ;;
    *) echo "Unknown mode: $MODE" >&2; usage; exit 2 ;;
esac
NAME=${NAME:-ame2_${MODE}_$(date +%Y%m%d_%H%M%S)_$$}
[[ "$NAME" =~ ^[a-zA-Z0-9][a-zA-Z0-9_.-]*$ ]] || { echo 'Invalid container name' >&2; exit 2; }
CACHE_PREFIX=${CACHE_PREFIX:-ame2}
RUN=(docker run --name "$NAME" --gpus "\"device=$GPUS\"" --network host
    --shm-size "${SHM_SIZE:-8g}" --ulimit memlock=-1 --ulimit stack=67108864
    -e ACCEPT_EULA=Y -e PRIVACY_CONSENT=Y -e OMNI_KIT_ACCEPT_EULA=YES -e OMNI_KIT_ALLOW_ROOT=1
    -e PYTHONUNBUFFERED=1 -e PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True
    -e "WANDB_MODE=${WANDB_MODE:-disabled}"
    -v "$ROOT/ame2:/workspace/ame2-minimal/ame2:rw"
    -v "$ROOT/rsl_rl:/workspace/ame2-minimal/rsl_rl:rw"
    -v "$ROOT/container:/workspace/ame2-minimal/container:ro"
    -v "$ROOT/modelzoo:/workspace/ame2-minimal/modelzoo:ro"
    -v "$ROOT/artifacts:/workspace/ame2-minimal/artifacts:rw"
    -v "$ROOT/outputs:/workspace/ame2-minimal/outputs:rw"
    -v "$ROOT/usage_assets:/workspace/ame2-minimal/usage_assets:rw"
    -v "${CACHE_PREFIX}-cache-kit:/isaac-sim/kit/cache"
    -v "${CACHE_PREFIX}-cache-ov:/root/.cache/ov"
    -v "${CACHE_PREFIX}-cache-pip:/root/.cache/pip"
    -v "${CACHE_PREFIX}-cache-gl:/root/.cache/nvidia/GLCache"
    -v "${CACHE_PREFIX}-cache-compute:/root/.nv/ComputeCache"
    -v "${CACHE_PREFIX}-omni-logs:/root/.nvidia-omniverse/logs"
    -v "${CACHE_PREFIX}-omni-data:/root/.local/share/ov/data"
    -w /workspace/ame2-minimal/ame2)
[[ -z "${CPUS:-}" ]] || RUN+=(--cpus "$CPUS")
[[ -z "${MEMORY_LIMIT:-}" ]] || RUN+=(--memory "$MEMORY_LIMIT")
[[ -z "${WANDB_API_KEY:-}" ]] || RUN+=(-e WANDB_API_KEY)
if [[ -n "${AME2_LOCAL_ASSET_ROOT:-}" ]]; then
    [[ -d "$AME2_LOCAL_ASSET_ROOT" ]] || { echo 'AME2_LOCAL_ASSET_ROOT is not a directory' >&2; exit 2; }
    RUN+=(-e AME2_ASSET_ROOT=/opt/ame2-assets -v "$AME2_LOCAL_ASSET_ROOT:/opt/ame2-assets:ro")
fi
if (( GUI )); then
    [[ -n "${DISPLAY:-}" ]] || { echo '--gui requires DISPLAY' >&2; exit 2; }
    RUN+=(-e "DISPLAY=$DISPLAY" -e QT_X11_NO_MITSHM=1 -v /tmp/.X11-unix:/tmp/.X11-unix:rw)
    if [[ -n "${XAUTHORITY:-}" && -f "$XAUTHORITY" ]]; then
        RUN+=(-e XAUTHORITY=/tmp/ame2.xauth -v "$XAUTHORITY:/tmp/ame2.xauth:ro")
    fi
fi
if (( DETACH )); then RUN+=(-d)
elif [[ -t 0 ]]; then RUN+=(--rm -it)
else RUN+=(--rm -i); fi
RUN+=("$IMAGE" "${CMD[@]}")
if (( DRY_RUN )); then printf '%q ' "${RUN[@]}"; printf '\n'; exit 0; fi
mkdir -p "$ROOT/ame2/logs" "$ROOT/artifacts" "$ROOT/outputs" "$ROOT/usage_assets"
echo "[run] GPU $GPUS -> $NAME ($IMAGE)" >&2
exec "${RUN[@]}"
