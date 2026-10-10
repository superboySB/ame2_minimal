#!/bin/bash
# Build the one image used locally and in the cloud. No host packages are installed.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"
IMAGE=${IMAGE:-ame2:research}
BASE_IMAGE=${BASE_IMAGE:-nvcr.io/nvidia/isaac-lab:2.3.2@sha256:388dbc806f48359a964cb9f807feb226da95d0a107f470fdcad9780ea10fe6f2}
REVISION=$(git -C "$ROOT" rev-parse HEAD)
DOCKER_BUILDKIT=1 docker build -f "$HERE/Dockerfile" --build-arg BASE_IMAGE="$BASE_IMAGE" \
    --build-arg SOURCE_REVISION="$REVISION" -t "$IMAGE" "$@" "$ROOT"
docker image inspect "$IMAGE" --format 'id={{.Id}} size={{.Size}} bytes'
echo "[build] done -> $IMAGE"
