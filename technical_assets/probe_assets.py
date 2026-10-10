#!/usr/bin/env python3
"""Read the bundled G1 USD and Mid360 NPY contract using CPU only.

Run from the repository root, using the existing research image (no --gpus):

    docker run --rm --network none -e NVIDIA_VISIBLE_DEVICES=void \
      -v "$PWD:/repo:ro" -v "$PWD/technical_assets:/result:rw" \
      --entrypoint /isaac-sim/python.sh ame2:research \
      /repo/technical_assets/probe_assets.py --repo-root /repo \
      --output /result/asset_contracts.json

Append --check to compare with the existing JSON without writing it.
No SimulationApp, Isaac sensor initialization, or GPU computation is used.
"""

from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import sys


def prepare_usd() -> None:
    """Use the OpenUSD libraries already present in the Isaac Sim image."""
    if os.environ.get("AME2_ASSET_PROBE_USD_READY") == "1":
        return
    if importlib.util.find_spec("pxr") is not None:
        return
    candidates = sorted(Path("/isaac-sim/extscache").glob("omni.usd.libs-*"))
    for candidate in candidates:
        if not (candidate / "pxr" / "Usd").is_dir():
            continue
        if not (candidate / "bin" / "libusd_tf.so").is_file():
            continue
        # The ELF loader reads LD_LIBRARY_PATH at process startup. Re-exec the
        # same CPU Python with the image's USD library directory, preserving
        # the environment already prepared by /isaac-sim/python.sh.
        env = os.environ.copy()
        for key, value in (
            ("PYTHONPATH", str(candidate)),
            ("LD_LIBRARY_PATH", str(candidate / "bin")),
        ):
            env[key] = value + (os.pathsep + env[key] if env.get(key) else "")
        env["AME2_ASSET_PROBE_USD_READY"] = "1"
        os.execve(sys.executable, [sys.executable, *sys.argv], env)
    raise RuntimeError("OpenUSD is unavailable; run this script inside ame2:research.")


def digest(path: Path) -> str:
    value = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            value.update(chunk)
    return value.hexdigest()


def probe(repo_root: Path) -> dict:
    # Import only after prepare_usd: no Isaac application or torch is imported.
    import numpy as np
    from pxr import Usd, UsdGeom, UsdPhysics

    usd_file = repo_root / "ame2/ame2/assets/g1_lidar/g1_lidar.usd"
    directions_file = repo_root / "ame2/ame2/sensors/mid360_raydirs.npy"
    stage = Usd.Stage.Open(str(usd_file))
    if stage is None:
        raise RuntimeError(f"Could not read USD: {usd_file}")

    def relative(path: Path) -> str:
        return path.resolve().relative_to(repo_root).as_posix()

    source_files = {usd_file.resolve(), directions_file.resolve()}
    layers = []
    for layer in stage.GetUsedLayers():
        # Anonymous session-layer identifiers include process-specific IDs.
        if layer.realPath:
            path = Path(layer.realPath).resolve()
            layers.append(relative(path))
            source_files.add(path)

    revolute = []
    sensor_frames = []
    mount = None
    sensor_names = {"imu_in_pelvis", "imu_in_torso", "d435_link", "mid360_link"}

    def position(prim, name: str) -> list[float]:
        return [float(value) for value in prim.GetAttribute(name).Get()]

    def quaternion(prim, name: str) -> list[float]:
        value = prim.GetAttribute(name).Get()
        return [float(value.GetReal()), *(float(v) for v in value.GetImaginary())]

    for prim in stage.Traverse():
        if prim.IsA(UsdPhysics.RevoluteJoint):
            revolute.append({"name": prim.GetName(), "prim_path": str(prim.GetPath())})
        if prim.GetName() in sensor_names:
            sensor_frames.append({
                "name": prim.GetName(),
                "prim_path": str(prim.GetPath()),
                "usd_type": prim.GetTypeName(),
            })
        if prim.GetName() == "mid360_joint":
            mount = {
                "prim_path": str(prim.GetPath()),
                "usd_type": prim.GetTypeName(),
                "body0": [str(path) for path in prim.GetRelationship("physics:body0").GetTargets()],
                "body1": [str(path) for path in prim.GetRelationship("physics:body1").GetTargets()],
                "joint_frame0_position_m": position(prim, "physics:localPos0"),
                "joint_frame0_orientation_wxyz": quaternion(prim, "physics:localRot0"),
                "joint_frame1_position_m": position(prim, "physics:localPos1"),
                "joint_frame1_orientation_wxyz": quaternion(prim, "physics:localRot1"),
                "convention": "Joint-frame transforms in body0/body1, not a complete hardware calibration.",
            }

    if mount is None:
        raise RuntimeError("The bundled USD has no mid360_joint.")
    if {frame["name"] for frame in sensor_frames} != sensor_names:
        raise RuntimeError("Expected sensor frame names were not found in the bundled USD.")

    directions = np.load(directions_file, allow_pickle=False)
    if directions.ndim != 2 or directions.shape[1] != 3:
        raise RuntimeError(f"Unexpected Mid360 direction shape: {directions.shape}")
    norms = np.linalg.norm(directions, axis=1)
    return {
        "schema_version": 1,
        "probe": {
            "implementation": "technical_assets/probe_assets.py",
            "mode": "CPU-only direct OpenUSD and NumPy reads; no SimulationApp",
            "usd_library_version": ".".join(map(str, Usd.GetVersion())),
        },
        "source_files": [
            {"path": relative(path), "bytes": path.stat().st_size, "sha256": digest(path)}
            for path in sorted(source_files)
        ],
        "robot_usd": {
            "path": relative(usd_file),
            "default_prim": str(stage.GetDefaultPrim().GetPath()),
            "meters_per_unit": float(UsdGeom.GetStageMetersPerUnit(stage)),
            "up_axis": str(UsdGeom.GetStageUpAxis(stage)),
            "used_file_layers": sorted(set(layers)),
            "revolute_joint_count": len(revolute),
            "revolute_joint_names_usd_traversal": [joint["name"] for joint in revolute],
            "revolute_joints_usd_traversal": revolute,
            "joint_order_note": "USD traversal order; policy/action order must be obtained from the instantiated Articulation/IO descriptors.",
            "mid360_fixed_joint": mount,
            "sensor_frames": sorted(sensor_frames, key=lambda frame: frame["prim_path"]),
            "sensor_frame_note": "USD Xform frame names do not demonstrate a real sensor driver, IMU estimator, or hardware deployment.",
        },
        "mid360_direction_table": {
            "path": relative(directions_file),
            "shape": list(directions.shape),
            "dtype": str(directions.dtype),
            "all_finite": bool(np.isfinite(directions).all()),
            "unit_norm_min": float(norms.min()),
            "unit_norm_max": float(norms.max()),
            "unit_norm_allclose_atol_1e_6": bool(np.allclose(norms, 1.0, rtol=0, atol=1e-6)),
            "frame_contract_source": "ame2/ame2/sensors/mid360_lidar.py:30",
            "data_contract": "Unit ray directions in sensor frame, ordered scan sequence; no measured range, intensity, timestamp, pose, or supervised label columns.",
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo-root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--output", type=Path, default=None)
    parser.add_argument("--check", action="store_true", help="Compare against the existing JSON; do not write.")
    args = parser.parse_args()
    repo_root = args.repo_root.resolve()
    output = args.output or repo_root / "technical_assets/asset_contracts.json"
    prepare_usd()
    encoded = json.dumps(probe(repo_root), indent=2, ensure_ascii=False, allow_nan=False) + "\n"
    if args.check:
        if not output.is_file() or output.read_text() != encoded:
            print(f"Asset contract mismatch: {output}", file=sys.stderr)
            return 1
        print(f"Asset contracts match: {output}")
        return 0
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(encoded)
    print(f"Wrote asset contracts: {output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
