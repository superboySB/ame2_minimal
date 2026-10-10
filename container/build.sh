#!/bin/bash
# Build the one image used locally and in the cloud. No host packages are installed.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"
IMAGE=${IMAGE:-ame2:research}
BASE_IMAGE=${BASE_IMAGE:-nvcr.io/nvidia/isaac-lab:2.3.2@sha256:388dbc806f48359a964cb9f807feb226da95d0a107f470fdcad9780ea10fe6f2}
REVISION=$(git -C "$ROOT" rev-parse HEAD)
SOURCE_DIRTY=false
[[ -z "$(git -C "$ROOT" status --porcelain -- ame2 rsl_rl container modelzoo)" ]] || SOURCE_DIRTY=true
SOURCE_TREE_SHA256=$(cd "$ROOT"; git ls-files --cached --others --exclude-standard -- ame2 rsl_rl container modelzoo \
    | LC_ALL=C sort -u | while IFS= read -r source; do if [[ -f "$source" ]]; then sha256sum "$source"; fi; done \
    | sha256sum | cut -d ' ' -f 1)
DOCKER_BUILDKIT=1 docker build -f "$HERE/Dockerfile" --build-arg BASE_IMAGE="$BASE_IMAGE" \
    --build-arg SOURCE_REVISION="$REVISION" --build-arg SOURCE_DIRTY="$SOURCE_DIRTY" \
    --build-arg SOURCE_TREE_SHA256="$SOURCE_TREE_SHA256" -t "$IMAGE" "$@" "$ROOT"
docker image inspect "$IMAGE" --format 'id={{.Id}} size={{.Size}} bytes'
echo "[build] done -> $IMAGE"
