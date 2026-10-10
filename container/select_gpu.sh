#!/usr/bin/env bash
# Print the smallest idle GPU index. Explicit Docker DeviceIDs are reservations.
# Containers exposing all GPUs are filtered by actual processes, rather than reserving all cards.
# No processes (compute or graphics), <= IDLE_GPU_MEMORY_MB MiB used, no explicit reservation.
set -euo pipefail
command -v nvidia-smi >/dev/null || { echo 'nvidia-smi is required' >&2; exit 1; }
command -v docker >/dev/null || { echo 'docker is required to check GPU reservations' >&2; exit 1; }
LIMIT=${IDLE_GPU_MEMORY_MB:-512}
[[ "$LIMIT" =~ ^[0-9]+$ ]] || { echo 'IDLE_GPU_MEMORY_MB must be an integer' >&2; exit 2; }
GPU_ROWS=$(nvidia-smi --query-gpu=index,uuid,memory.used --format=csv,noheader,nounits)
COMPUTE=$(nvidia-smi --query-compute-apps=gpu_uuid --format=csv,noheader)
PMON=$(nvidia-smi pmon -c 1 -s um)
if [[ "$PMON" == *'Not Supported'* || "$PMON" == *'not supported'* ]]; then
    echo 'Cannot verify all GPU processes: nvidia-smi pmon is unsupported' >&2; exit 1
fi
BUSY_INDICES=$(awk '$1 ~ /^[0-9]+$/ && $2 ~ /^[0-9]+$/ && $2 > 0 {print $1}' <<< "$PMON")
CONTAINERS=$(docker ps -q)
RESERVED=''
for cid in $CONTAINERS; do
    reservation=$(docker inspect --format '{{range .HostConfig.DeviceRequests}}{{range .DeviceIDs}}{{.}},{{end}}{{end}}' "$cid")
    RESERVED+=",$reservation"
done
IFS=',' read -ra EXCLUDED <<< "${EXCLUDE_GPUS:-}"
while IFS=',' read -r index uuid memory; do
    index=${index//[[:space:]]/}; uuid=${uuid//[[:space:]]/}; memory=${memory//[[:space:]]/}
    [[ "$index" =~ ^[0-9]+$ && "$memory" =~ ^[0-9]+$ ]] || continue
    (( memory <= LIMIT )) || continue
    [[ ",$RESERVED," != *',all,'* && ",$RESERVED," != *",$index,"* && ",$RESERVED," != *",$uuid,"* ]] || continue
    [[ "$COMPUTE" != *"$uuid"* ]] || continue
    [[ $'\n'"$BUSY_INDICES"$'\n' != *$'\n'"$index"$'\n'* ]] || continue
    skip=0
    for item in "${EXCLUDED[@]}"; do [[ "$item" != "$index" && "$item" != "$uuid" ]] || skip=1; done
    (( skip == 0 )) || continue
    echo "$index"; exit 0
# nvidia-smi lists GPU indices in ascending order; sort explicitly for other drivers.
done < <(sort -t, -k1,1n <<< "$GPU_ROWS")
echo 'No idle, unreserved GPU found (no work was started)' >&2
exit 1
