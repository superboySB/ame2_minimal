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
  image    docker save -> gzip -> rsync -> SHA256 verification -> docker load; verify stable config digest
  deploy   push source and synchronize image
  gpu      print the smallest GPU with no process and no running-container reservation
  status   show remote GPU processes and ame2 containers
  run      invoke remote run.sh; default GPU is auto, and source is not synchronized implicitly
           Example: cloud.sh run -d --name ame2-official train --task Ame2-G1-Gaze --num_envs 4096
Environment: CLOUD_HOST=tencent-231 CLOUD_PORT=22 CLOUD_ROOT=/diff/dzp_is_sb/ame2-research
             IMAGE=ame2:research CLOUD_SHM_SIZE=32g CLOUD_CPUS CLOUD_MEMORY_LIMIT AME2_NCCL_COMPAT=1
             Explicit NCCL_CUMEM_HOST_ENABLE, NCCL_P2P_DISABLE, NCCL_IB_DISABLE,
             NCCL_SOCKET_IFNAME, NCCL_DEBUG, NCCL_DEBUG_SUBSYS are forwarded to run.sh.
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
    local image_id remote_id key archive checksum transfer_tag
    if (( DRY_RUN )); then
        echo '# Compare stable complete image config digests; Docker store .Id semantics differ.'
        show "$HERE/image_identity.sh" "$IMAGE"
        remote "$REMOTE_ROOT/container/image_identity.sh" "$IMAGE"
        echo '# Otherwise save to .transfer/IMAGE_ID.tar.gz, rsync archive + checksum, verify SHA256, load, verify stable config digest.'
        return
    fi
    image_id=$("$HERE/image_identity.sh" "$IMAGE")
    key=${image_id#sha256:}; transfer_tag="ame2:transfer-$key"
    docker tag "$IMAGE" "$transfer_tag"
    [[ $("$HERE/image_identity.sh" "$transfer_tag") == "$image_id" ]] || { echo 'Image tag changed during snapshot; retry' >&2; exit 1; }
    remote mkdir -p "$REMOTE_ROOT/container"
    "${RSYNC[@]}" "$HERE/image_identity.sh" "$HOST:$REMOTE_ROOT/container/"
    remote_id=$(remote "$REMOTE_ROOT/container/image_identity.sh" "$IMAGE" 2>/dev/null || true)
    if [[ "$remote_id" == "$image_id" ]]; then local local_layers remote_layers
        local_layers=$(docker image inspect "$transfer_tag" --format '{{json .RootFS.Layers}}')
        remote_layers=$(remote docker image inspect "$IMAGE" --format '{{json .RootFS.Layers}}')
        [[ "$local_layers" == "$remote_layers" ]] || { echo 'Image filesystem layers differ' >&2; exit 1; }
        echo "[cloud] exact image config and filesystem layers already loaded: $image_id"; return; fi
    archive="$ROOT/.transfer/ame2-$key.tar.gz"; checksum="$archive.sha256"
    mkdir -p "$ROOT/.transfer"
    if [[ ! -f "$archive" || ! -f "$checksum" || ! -f "$archive.tag" ]] || [[ $(cat "$archive.tag" 2>/dev/null || true) != "$transfer_tag" ]] || ! (cd "$ROOT/.transfer" && sha256sum -c "$(basename "$checksum")" >/dev/null 2>&1); then
        echo "[cloud] saving $IMAGE ($image_id) to $archive"
        docker save "$transfer_tag" | gzip -1 > "$archive.partial"
        mv "$archive.partial" "$archive"
        (cd "$ROOT/.transfer" && sha256sum "$(basename "$archive")" > "$(basename "$checksum")")
        printf '%s\n' "$transfer_tag" > "$archive.tag"
    fi
    remote mkdir -p "$REMOTE_ROOT/.transfer"
    "${RSYNC[@]}" --fuzzy --stats --info=progress2 "$archive" "$checksum" "$HOST:$REMOTE_ROOT/.transfer/"
    # sha256sum paths are local to the transfer directory; use one safely quoted remote shell script.
    local script quoted
    printf -v script 'cd %q && sha256sum -c %q && gzip -dc %q | docker load' \
        "$REMOTE_ROOT/.transfer" "$(basename "$checksum")" "$(basename "$archive")"
    printf -v quoted '%q' "$script"
    "${SSH[@]}" "$HOST" "bash -o pipefail -lc $quoted"
    remote_id=$(remote "$REMOTE_ROOT/container/image_identity.sh" "$transfer_tag")
    [[ "$image_id" == "$remote_id" ]] || { echo "Image configuration mismatch: local=$image_id remote=$remote_id" >&2; exit 1; }
    local local_layers remote_layers
    local_layers=$(docker image inspect "$transfer_tag" --format '{{json .RootFS.Layers}}')
    remote_layers=$(remote docker image inspect "$transfer_tag" --format '{{json .RootFS.Layers}}')
    [[ "$local_layers" == "$remote_layers" ]] || { echo 'Image filesystem layers differ' >&2; exit 1; }
    remote docker tag "$transfer_tag" "$IMAGE"
    echo "[cloud] verified identical image config and filesystem layers: $image_id"
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
        [[ -z "${AME2_NCCL_COMPAT:-}" ]] || REMOTE_RUN+=("AME2_NCCL_COMPAT=$AME2_NCCL_COMPAT")
        for option in NCCL_CUMEM_HOST_ENABLE NCCL_P2P_DISABLE NCCL_IB_DISABLE NCCL_SOCKET_IFNAME NCCL_DEBUG NCCL_DEBUG_SUBSYS; do
            [[ -z "${!option:-}" ]] || REMOTE_RUN+=("$option=${!option}")
        done
        remote mkdir -p "$REMOTE_ROOT/.cache"
        remote flock -w 30 "$REMOTE_ROOT/.cache/gpu-launch.lock" "${REMOTE_RUN[@]}" \
            "$REMOTE_ROOT/container/run.sh" -g auto "$@" ;;
    -h|--help|'') usage ;;
    *) echo "Unknown mode: $MODE" >&2; usage; exit 2 ;;
esac
