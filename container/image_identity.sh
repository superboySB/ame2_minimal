#!/usr/bin/env bash
# Print the stable image CONFIG digest across Docker legacy and containerd stores.
# Docker containerd stores expose the OCI manifest digest as .Id; it is not the config digest.
set -euo pipefail
IMAGE=${1:-ame2:research}
ID=$(docker image inspect "$IMAGE" --format '{{.Id}}')
DESCRIPTOR=$(docker image inspect "$IMAGE" --format '{{json .Descriptor}}')
if [[ "$DESCRIPTOR" == null || "$DESCRIPTOR" == '<no value>' ]]; then echo "$ID"; exit 0; fi
MEDIA=$(docker image inspect "$IMAGE" --format '{{.Descriptor.MediaType}}')
case "$MEDIA" in
    application/vnd.oci.image.manifest.v1+json|application/vnd.docker.distribution.manifest.v2+json) ;;
    *) echo "Unsupported manifest type for exact configuration verification: $MEDIA" >&2; exit 1 ;;
esac
DOCKER_ROOT=$(docker info --format '{{.DockerRootDir}}')
CONTENT_ROOT=${CONTAINERD_ROOT:-}
if [[ -z "$CONTENT_ROOT" && -r /etc/containerd/config.toml ]]; then
    CONTENT_ROOT=$(sed -n 's/^root[[:space:]]*=[[:space:]]*"\([^"]*\)".*/\1/p' /etc/containerd/config.toml | head -1)
fi
BLOB="io.containerd.content.v1.content/blobs/sha256/${ID#sha256:}"
for candidate in "${CONTENT_ROOT:-/var/lib/containerd}/$BLOB" "$DOCKER_ROOT/containerd/daemon/$BLOB" "/var/lib/containerd/$BLOB"; do
    # Mount only this known image's manifest blob, read-only. No host packages or GPU are used.
    if CONFIG=$(docker run --rm --entrypoint /isaac-sim/python.sh \
        --mount "type=bind,src=$candidate,dst=/ame2-image-manifest.json,readonly" "$IMAGE" \
        -c 'import json; print(json.load(open("/ame2-image-manifest.json"))["config"]["digest"])' 2>/dev/null); then
        [[ "$CONFIG" =~ ^sha256:[0-9a-f]{64}$ ]] || { echo 'Invalid OCI config digest' >&2; exit 1; }
        config_blob="${candidate%/*}/${CONFIG#sha256:}"
        actual=$(docker run --rm --entrypoint /isaac-sim/python.sh \
            --mount "type=bind,src=$config_blob,dst=/ame2-image-config.json,readonly" "$IMAGE" \
            -c 'import hashlib; print("sha256:" + hashlib.sha256(open("/ame2-image-config.json", "rb").read()).hexdigest())')
        [[ "$actual" == "$CONFIG" ]] || { echo 'OCI config blob checksum mismatch' >&2; exit 1; }
        echo "$CONFIG"; exit 0
    fi
done
echo 'Cannot read this image manifest; set CONTAINERD_ROOT to the existing containerd content root' >&2
exit 1
