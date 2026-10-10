#!/usr/bin/env bash
# Synchronize the same source and Docker image to a remote Docker host; install nothing there.
set -euo pipefail
HERE=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
ROOT=$(cd "$HERE/.." && pwd)
HOST=${CLOUD_HOST:-tencent-231}; PORT=${CLOUD_PORT:-22}
REMOTE_ROOT=${CLOUD_ROOT:-/diff/dzp_is_sb/ame2-research}
IMAGE=${IMAGE:-ame2:research}; DRY_RUN=0
usage() {
    cat <<'HELP'
Usage: container/cloud.sh [--dry-run] push|pull|image|deploy|gpu|status|run [run.sh arguments...]
  push     rsync source + modelzoo to the cloud (no deletion; excludes generated logs/caches)
  pull     retrieve logs/checkpoints, outputs, artifacts and usage_assets (no deletion)
  image    docker save -> gzip -> rsync -> SHA256 verification -> docker load; verify image ID
  deploy   push source and synchronize image
  gpu      print the smallest GPU with no process and no running-container reservation
  status   show remote GPU processes and ame2 containers
  run      invoke remote run.sh; default GPU is auto, and source is not synchronized implicitly
           Example: cloud.sh run -d --name ame2-official train --task Ame2-G1-Gaze --num_envs 4096
Environment: CLOUD_HOST=tencent-231 CLOUD_PORT=22 CLOUD_ROOT=/diff/dzp_is_sb/ame2-research
             IMAGE=ame2:research CLOUD_SHM_SIZE=32g CLOUD_CPUS CLOUD_MEMORY_LIMIT
Requires existing Docker, NVIDIA Container Toolkit, SSH key login, rsync, gzip, sha256sum.
Passwords and API keys are never written to this script or sent in command-line arguments.
HELP
}
if [[ "${1:-}" == --dry-run ]]; then DRY_RUN=1; shift; fi
MODE=${1:-}; [[ -z "$MODE" ]] || shift
[[ "$REMOTE_ROOT" =~ ^/[a-zA-Z0-9_./-]+$ && "$REMOTE_ROOT" != / && "$REMOTE_ROOT" != *..* ]] || { echo 'CLOUD_ROOT must be a safe absolute directory' >&2; exit 2; }
[[ "$PORT" =~ ^[0-9]+$ ]] || { echo 'Invalid SSH port' >&2; exit 2; }
SSH=(ssh -p "$PORT" -o BatchMode=yes -o ConnectTimeout=15)
RSYNC=(rsync -a --partial --protect-args -e "ssh -p $PORT -o BatchMode=yes -o ConnectTimeout=15")
show() { printf '%q ' "$@"; printf '\n'; }
remote() {
    local script quoted
    printf -v script '%q ' "$@"
    printf -v quoted '%q' "$script"
    if (( DRY_RUN )); then show "${SSH[@]}" "$HOST" "bash -lc $quoted"
    else "${SSH[@]}" "$HOST" "bash -lc $quoted"; fi
}
run() { if (( DRY_RUN )); then show "$@"; else "$@"; fi; }
push_source() {
    remote mkdir -p "$REMOTE_ROOT"
    run "${RSYNC[@]}" --exclude=.git --exclude=.transfer --exclude=.cache \
        --exclude=.env --exclude='.env.*' --exclude=outputs --exclude=artifacts \
        --exclude=usage_assets --exclude=logs --exclude=__pycache__ --exclude='*.egg-info' \
        --exclude='*.log' "$ROOT/" "$HOST:$REMOTE_ROOT/"
}
pull_results() {
    local path
    for path in ame2/logs outputs artifacts usage_assets; do
        # run.sh creates all directories before work starts; a missing directory means no run yet.
        if (( DRY_RUN )) || remote test -d "$REMOTE_ROOT/$path"; then
            run mkdir -p "$ROOT/$path"
            run "${RSYNC[@]}" "$HOST:$REMOTE_ROOT/$path/" "$ROOT/$path/"
        fi
    done
}
transfer_image() {
    local image_id remote_id key archive checksum
    if (( DRY_RUN )); then
        echo '# Inspect local and remote image IDs; skip when they match.'
        show docker image inspect "$IMAGE" --format '{{.Id}}'
        remote docker image inspect "$IMAGE" --format '{{.Id}}'
        echo '# Otherwise save to .transfer/IMAGE_ID.tar.gz, rsync archive + checksum, verify SHA256, load, verify image ID.'
        return
    fi
    image_id=$(docker image inspect "$IMAGE" --format '{{.Id}}')
    remote_id=$(remote docker image inspect "$IMAGE" --format '{{.Id}}' 2>/dev/null || true)
    if [[ "$remote_id" == "$image_id" ]]; then echo "[cloud] exact image already loaded: $image_id"; return; fi
    key=${image_id#sha256:}; archive="$ROOT/.transfer/ame2-$key.tar.gz"; checksum="$archive.sha256"
    mkdir -p "$ROOT/.transfer"
    if [[ ! -f "$archive" || ! -f "$checksum" ]] || ! (cd "$ROOT/.transfer" && sha256sum -c "$(basename "$checksum")" >/dev/null 2>&1); then
        echo "[cloud] saving $IMAGE ($image_id) to $archive"
        docker save "$IMAGE" | gzip -1 > "$archive.partial"
        mv "$archive.partial" "$archive"
        (cd "$ROOT/.transfer" && sha256sum "$(basename "$archive")" > "$(basename "$checksum")")
    fi
    remote mkdir -p "$REMOTE_ROOT/.transfer"
    "${RSYNC[@]}" --info=progress2 "$archive" "$checksum" "$HOST:$REMOTE_ROOT/.transfer/"
    # sha256sum paths are local to the transfer directory; use one safely quoted remote shell script.
    local script quoted
    printf -v script 'cd %q && sha256sum -c %q && gzip -dc %q | docker load' \
        "$REMOTE_ROOT/.transfer" "$(basename "$checksum")" "$(basename "$archive")"
    printf -v quoted '%q' "$script"
    "${SSH[@]}" "$HOST" "bash -o pipefail -lc $quoted"
    remote_id=$(remote docker image inspect "$IMAGE" --format '{{.Id}}')
    [[ "$image_id" == "$remote_id" ]] || { echo "Image ID mismatch: local=$image_id remote=$remote_id" >&2; exit 1; }
    echo "[cloud] verified identical image: $image_id"
}
case "$MODE" in
    push) push_source ;;
    pull) pull_results ;;
    image) transfer_image ;;
    deploy) push_source; transfer_image ;;
    gpu) remote "$REMOTE_ROOT/container/select_gpu.sh" ;;
    status)
        remote nvidia-smi
        remote docker ps --filter name=ame2 --format 'table {{.Names}}\t{{.Status}}\t{{.Image}}' ;;
    run)
        (( $# )) || { echo 'run requires run.sh arguments' >&2; exit 2; }
        # Explicit user -g overrides the automatic default. Check/start happens under a short lease
        # shared by this project's cloud launches, so two launches cannot select the same GPU.
        REMOTE_RUN=(env "IMAGE=$IMAGE" "SHM_SIZE=${CLOUD_SHM_SIZE:-32g}")
        [[ -z "${CLOUD_CPUS:-}" ]] || REMOTE_RUN+=("CPUS=$CLOUD_CPUS")
        [[ -z "${CLOUD_MEMORY_LIMIT:-}" ]] || REMOTE_RUN+=("MEMORY_LIMIT=$CLOUD_MEMORY_LIMIT")
        remote mkdir -p "$REMOTE_ROOT/.cache"
        remote flock -w 30 "$REMOTE_ROOT/.cache/gpu-launch.lock" "${REMOTE_RUN[@]}" \
            "$REMOTE_ROOT/container/run.sh" -g auto "$@" ;;
    -h|--help|'') usage ;;
    *) echo "Unknown mode: $MODE" >&2; usage; exit 2 ;;
esac
