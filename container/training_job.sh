#!/usr/bin/env bash
# Bounded acceptance and official training jobs. Run INSIDE the research Docker.
# docker exec -d ame2-cloud-research /workspace/ame2-minimal/container/training_job.sh matrix
set -euo pipefail
[[ -x /isaac-sim/python.sh ]] || { echo 'Run this script inside the AME-2 Docker' >&2; exit 2; }
cd /workspace/ame2-minimal/ame2
PHASE=${1:-}; TAG=${2:-$PHASE}
case "$PHASE" in matrix|resume|benchmark|full|ddp|audit) ;; *) echo 'Phase: matrix|resume|benchmark|full|ddp|audit [unique-report-tag]' >&2; exit 2;; esac
[[ "$TAG" =~ ^[A-Za-z0-9_.-]+$ ]] || { echo 'Invalid report tag' >&2; exit 2; }
BASE=${RESEARCH_OUTPUT:-/workspace/ame2-minimal/outputs/research/reproduce-20261010}
REPORT="$BASE/cloud_$TAG"
[[ ! -e "$REPORT" ]] || { echo "Evidence exists; choose a fresh tag: $REPORT" >&2; exit 2; }
mkdir -p "$REPORT"
exec > >(tee -a "$REPORT/driver.log") 2>&1
export OMP_NUM_THREADS=${OMP_NUM_THREADS:-8} MKL_NUM_THREADS=${MKL_NUM_THREADS:-8}
export OPENBLAS_NUM_THREADS=${OPENBLAS_NUM_THREADS:-8} MPLBACKEND=Agg
START=$(date -u +%FT%TZ)
SAMPLER=''
finish() {
    result=$?
    [[ -z "$SAMPLER" ]] || kill "$SAMPLER" 2>/dev/null || true
    printf '%s\n' "$result" > "$REPORT/exit_code.txt"
    printf '{"phase":"%s","started_utc":"%s","ended_utc":"%s","exit_code":%s}\n' \
        "$PHASE" "$START" "$(date -u +%FT%TZ)" "$result" > "$REPORT/job.json"
    exit "$result"
}
trap finish EXIT
nvidia-smi --query-gpu=timestamp,index,uuid,memory.used,utilization.gpu --format=csv -l 2 > "$REPORT/gpu.csv" &
SAMPLER=$!
while IFS= read -r -d '' source; do sha256sum "$source"; done < <(
    find ame2 scripts /workspace/ame2-minimal/rsl_rl/rsl_rl /workspace/ame2-minimal/container -type f \( -name '*.py' -o -name '*.toml' -o -name '*.sh' \) -print0 | sort -z
) > "$REPORT/source-sha256.txt"
execute() {
    printf '%q ' "$@" | tee -a "$REPORT/commands.txt"
    printf '\n' | tee -a "$REPORT/commands.txt"
    "$@"
}
PY=/isaac-sim/python.sh
EVIDENCE=/workspace/ame2-minimal/container/training_evidence.py
capture() { execute "$PY" "$EVIDENCE" capture --experiment "$1" --report "$REPORT/runs_before.json"; }
audit_current() { execute "$PY" "$EVIDENCE" audit --experiment "$1" --before "$REPORT/runs_before.json" --iteration "$2" --train_result "$REPORT/train_result.json" --report "$REPORT/validation.json"; }
case "$PHASE" in
    matrix)
        execute "$PY" scripts/research/run_suite.py --phase training --output "$REPORT/matrix" --num_envs 64
        execute "$PY" "$EVIDENCE" matrix --summary "$REPORT/matrix/summary.json" --report "$REPORT/validation.json" ;;
    resume)
        CHECKPOINT=$("$PY" "$EVIDENCE" resume-source --summary "${MATRIX_SUMMARY:-$BASE/cloud_matrix/matrix/summary.json}")
        capture research_resume
        execute "$PY" scripts/rsl_rl/train.py --headless --task Ame2-G1-Gaze --num_envs 64 --max_iterations 2 \
            --seed 42 --resume --checkpoint "$CHECKPOINT" --experiment_name research_resume --run_name "$TAG" \
            --logger tensorboard --result_json "$REPORT/train_result.json" agent.save_interval=1
        audit_current research_resume 4 ;;
    benchmark)
        capture research_official_benchmark
        execute "$PY" scripts/rsl_rl/train.py --headless --task Ame2-G1-Gaze --num_envs 4096 --max_iterations 10 \
            --seed 42 --experiment_name research_official_benchmark --run_name "$TAG" --logger tensorboard --result_json "$REPORT/train_result.json" agent.save_interval=5
        audit_current research_official_benchmark 9 ;;
    full)
        capture research_official_full
        execute "$PY" scripts/rsl_rl/train.py --headless --task Ame2-G1-Gaze --num_envs 4096 --max_iterations 5000 \
            --seed 42 --experiment_name research_official_full --run_name "$TAG" --logger tensorboard --result_json "$REPORT/train_result.json" agent.save_interval=200
        audit_current research_official_full 4999 ;;
    ddp)
        capture research_ddp
        execute "$PY" -m torch.distributed.run --nnodes=1 --nproc_per_node=2 --master_port "${MASTER_PORT:-29501}" \
            scripts/rsl_rl/train.py --distributed --headless --task Ame2-G1-Gaze --num_envs 64 --max_iterations 3 \
            --seed 42 --experiment_name research_ddp --run_name "$TAG" --logger tensorboard --result_json "$REPORT/train_result.json" agent.save_interval=1
        audit_current research_ddp 2 ;;
    audit)
        execute "$PY" "$EVIDENCE" matrix --summary "${MATRIX_SUMMARY:-$BASE/cloud_matrix/matrix/summary.json}" --report "$REPORT/validation.json" ;;
esac
