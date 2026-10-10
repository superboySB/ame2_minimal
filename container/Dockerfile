# AME2 image: official Isaac Lab 2.3.2 (Isaac Sim 5.1) + this repo's rsl_rl and ame2.
# Build context is the repo root (see build.sh). Both packages are installed editable;
# run.sh bind-mounts the host checkouts over the same paths, so code edits need no rebuild.
ARG BASE_IMAGE=nvcr.io/nvidia/isaac-lab:2.3.2@sha256:388dbc806f48359a964cb9f807feb226da95d0a107f470fdcad9780ea10fe6f2
FROM ${BASE_IMAGE}

USER root
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

ENV AME2_ROOT=/workspace/ame2-minimal \
    ACCEPT_EULA=Y \
    PRIVACY_CONSENT=Y \
    OMNI_KIT_ALLOW_ROOT=1 \
    OMNI_KIT_ACCEPT_EULA=YES \
    PYTHONUNBUFFERED=1 \
    WANDB_MODE=disabled

# Only the image installs software. Host and remote machines need no Python environment.
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg \
    && rm -rf /var/lib/apt/lists/*

COPY rsl_rl/ ${AME2_ROOT}/rsl_rl
COPY ame2/ ${AME2_ROOT}/ame2
COPY modelzoo/ ${AME2_ROOT}/modelzoo
COPY container/ ${AME2_ROOT}/container

# the bundled rsl_rl replaces the image's stock rsl-rl-lib
RUN test "$(cat /workspace/isaaclab/VERSION)" = 2.3.2 \
    # Isaac's bundled packaging RECORD overlaps pip vendored files: do not uninstall it.
    && /isaac-sim/python.sh -m pip install --no-deps --ignore-installed 'packaging==25.0' \
    && /isaac-sim/python.sh -m pip uninstall -y rsl-rl-lib \
    && /isaac-sim/python.sh -m pip install --no-deps --no-build-isolation -e ${AME2_ROOT}/rsl_rl -e ${AME2_ROOT}/ame2 \
    && /isaac-sim/python.sh -c "import torch,tensordict,onnx,onnxscript,toml,psutil,git,imageio,matplotlib,rsl_rl; from importlib.metadata import version; print('rsl-rl-lib', version('rsl-rl-lib'), '| ame2', version('ame2'), '| torch', torch.__version__)" \
    && /isaac-sim/python.sh -m pip freeze > /workspace/ame2-minimal/image-packages.txt

ARG SOURCE_REVISION=unknown
ARG SOURCE_DIRTY=unknown
ARG SOURCE_TREE_SHA256=unknown
LABEL org.opencontainers.image.title="AME-2 research" \
      org.opencontainers.image.revision=${SOURCE_REVISION} \
      org.ame2.source.dirty=${SOURCE_DIRTY} \
      org.ame2.source.tree-sha256=${SOURCE_TREE_SHA256} \
      org.ame2.isaaclab.version="2.3.2"

WORKDIR ${AME2_ROOT}/ame2
ENTRYPOINT []
CMD ["/bin/bash"]
