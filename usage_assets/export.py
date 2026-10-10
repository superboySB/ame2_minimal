#!/usr/bin/env python3
"""Export real verify.py videos for Markdown and an offline file:// player.

Run inside ame2:research; this script uses only stdlib and image-provided ffmpeg.
It retains the full source duration in MP4, and records hashes and source reports.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import re
import subprocess
from datetime import datetime, timezone


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def run(arguments: list[str]) -> str:
    return subprocess.run(arguments, check=True, text=True, capture_output=True).stdout


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--report-root", type=Path, default=Path("logs/research"))
    parser.add_argument("--output", type=Path, default=Path("../usage_assets"))
    parser.add_argument("--gif", action="store_true", help="Also export fixed-duration full-clip GIF previews")
    args = parser.parse_args()
    output = args.output.resolve()
    media = output / "animations"
    media.mkdir(parents=True, exist_ok=True)
    transcode = {"video": "full duration; scale=640:-2; fps=15; libx264 preset=fast crf=27 yuv420p",
                 "poster": "source time=35% duration; scale=640:-2; JPEG",
                 "gif": "48 evenly sampled frames over full source; width=400; 96 colors; 8 fps; loop"}
    previous = {}
    manifest_path = output / "manifest.json"
    if manifest_path.is_file():
        old_manifest = json.loads(manifest_path.read_text())
        if old_manifest.get("transcode") == transcode:
            previous = {entry["id"]: entry for entry in old_manifest.get("videos", [])}
    entries = []
    reports = []
    report_root = args.report_root.resolve()
    if not report_root.is_dir():
        raise FileNotFoundError(f"Real report directory does not exist: {report_root}")
    for report_path in sorted(report_root.rglob("*.json")):
        try:
            report = json.loads(report_path.read_text())
        except (OSError, ValueError):
            continue
        if not isinstance(report, dict):
            continue
        original_report = report
        if report_path.name == "train_result.json" and report.get("passed") is True:
            training_videos = sorted((Path(report["log_dir"]) / "videos" / "train").glob("*.mp4"))
            if training_videos:
                final_checkpoint = Path(report["final_checkpoint"])
                report = dict(report, videos=[str(path) for path in training_videos],
                              arguments={"task": report["task"], "terrain": "训练课程", "seed": report["seed"]},
                              policy_mode="training", checkpoint={"training_final_checkpoint": str(final_checkpoint),
                              "sha256": sha256(final_checkpoint),
                              "note": "Training video uses the evolving stochastic policy, not this final checkpoint."})
        if report_path.name == "play_result.json" and report.get("video"):
            command = report.get("command", [])

            def option(name, default=None):
                return command[command.index(name) + 1] if name in command else default

            # Preserve which checks were actually recorded by the original CLI.
            # play.py does not perform verify.py's complete finite-tensor assertions.
            report = dict(report, videos=[str(p) for p in sorted((report_path.parent / "videos").rglob("*.mp4"))],
                          arguments={"task": report.get("task"), "terrain": report.get("terrain"),
                                     "difficulty": report.get("difficulty"), "seed": int(option("--seed", 42))},
                          policy_mode="jit" if report.get("export") else "native",
                          assisted="--fly" in command,
                          environments=[{"env_id": 0, "terrain": report.get("terrain"),
                                         "reached_goal": report.get("reached_goal"),
                                         "early_termination_observed": report.get("early_termination")}])
            checkpoint = Path(report["checkpoint"])
            report["checkpoint"] = {"path": str(checkpoint), "sha256": sha256(checkpoint)}
        if (isinstance(report.get("passed"), bool) or "videos" in report or "evidence_kind" in report
                or ("state" in report and "completed" in report)):
            # Keep the complete source record: training iterations, TensorBoard
            # audits and stable image config digests must survive offline export.
            reports.append(dict(original_report, path=str(report_path), sha256=sha256(report_path)))
        if "videos" not in report:
            continue
        for index, source_text in enumerate(report.get("videos", [])):
            source = Path(source_text)
            if not source.is_absolute():
                source = report_path.parent / source
            if not source.is_file():
                raise FileNotFoundError(f"Report references a missing video: {source}")
            relative = report_path.relative_to(report_root).with_suffix("")
            key = re.sub(r"[^a-zA-Z0-9_-]", "-", "-".join(relative.parts))
            key += f"-{index + 1}" if len(report["videos"]) > 1 else ""
            if any(entry["id"] == key for entry in entries):
                key += "-" + sha256(report_path)[:8]
            preview = media / f"{key}.mp4"
            poster = media / f"{key}.jpg"
            source_hash = sha256(source)
            cached = previous.get(key, {})
            source_unchanged = cached.get("source", {}).get("sha256") == source_hash

            def current(path: Path, hash_key: str) -> bool:
                return source_unchanged and path.is_file() and sha256(path) == cached.get(hash_key)

            duration = float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                  "-of", "default=noprint_wrappers=1:nokey=1", str(source)]).strip())
            if not current(preview, "video_sha256"):
                run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(source),
                     "-vf", "scale=640:-2,fps=15", "-an", "-c:v", "libx264", "-preset", "fast",
                     "-crf", "27", "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(preview)])
            if not current(poster, "poster_sha256"):
                run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-ss", str(duration * 0.35),
                     "-i", str(source), "-frames:v", "1", "-vf", "scale=640:-2", str(poster)])
            env = next((item for item in report.get("environments", []) if item.get("env_id") == 0), {})
            arguments = report.get("arguments", {})
            reached = env.get("reached_goal")
            early = env.get("early_terminations") or env.get("early_termination_observed")
            outcome = ("提前终止" if early else "进入目标半径" if reached is True
                       else "录像期间未到达" if reached is False else "目标指标未记录")
            entry = {"id": key, "task": arguments.get("task"),
                     "terrain": env.get("terrain", arguments.get("terrain", "unknown")),
                     "difficulty": arguments.get("difficulty"), "seed": arguments.get("seed"),
                     "policy": report.get("policy_mode"), "outcome": outcome,
                     "assisted": report.get("assisted", False),
                     "finite_checks_passed": report.get("finite_checks_passed"),
                     "simulation_seconds": report.get("simulation_seconds"), "duration_seconds": duration,
                     "steps_completed": report.get("steps_completed"), "started_utc": report.get("started_utc"),
                     "environment": env, "checkpoint": report.get("checkpoint"), "jit": report.get("jit"),
                     "source": {"path": str(source), "sha256": source_hash},
                     "report": {"path": str(report_path), "sha256": sha256(report_path)},
                     "video": f"animations/{preview.name}", "video_sha256": sha256(preview),
                     "poster": f"animations/{poster.name}", "poster_sha256": sha256(poster)}
            if args.gif:
                gif = media / f"{key}.gif"
                # Sample the complete clip. GIF time is fixed; MP4 keeps source time.
                sample_fps = 48 / max(duration, 0.1)
                graph = (f"fps={sample_fps:.8f},scale=400:-2:flags=lanczos,setpts=N/(8*TB),"
                         "split[a][b];[a]palettegen=max_colors=96[p];[b][p]paletteuse=dither=bayer")
                if not current(gif, "gif_sha256"):
                    run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(source),
                         "-filter_complex", graph, "-loop", "0", str(gif)])
                entry.update(gif=f"animations/{gif.name}", gif_sha256=sha256(gif),
                             gif_note=f"完整片段均匀采样 48 帧、400 像素宽、96 色，8 fps 约 6 秒循环；源视频 {duration:.2f} 秒；MP4 保留源视频时间")
            entries.append(entry)
    if not reports:
        raise ValueError(f"No supported real reports under {report_root}; refusing to replace evidence")
    images = []
    for image_path in sorted(report_root.rglob("*image*.json")):
        try:
            info = json.loads(image_path.read_text())
        except (OSError, ValueError):
            continue
        if isinstance(info, dict) and "Id" in info:
            images.append({"path": str(image_path), "sha256": sha256(image_path), "id": info["Id"],
                           "tags": info.get("RepoTags"), "bytes": info.get("Size"),
                           "created": info.get("Created"), "labels": info.get("Config", {}).get("Labels")})
    hardware_paths = set(report_root.glob("*-gpu.csv")) | set(report_root.rglob("gpu.csv"))
    hardware = [{"path": str(path), "sha256": sha256(path), "csv": path.read_text()}
                for path in sorted(hardware_paths)]
    snapshot = {"schema_version": 1, "captured_utc": datetime.now(timezone.utc).isoformat(),
                "images": images, "hardware": hardware, "reports": reports}
    (output / "validation_snapshot.json").write_text(json.dumps(snapshot, ensure_ascii=False, indent=2) + "\n")
    manifest = {"schema_version": 1,
                "evidence_snapshot": "validation_snapshot.json",
                "transcode": transcode,
                "notes": ["MP4 保留完整源视频时长，压缩至 640 像素宽与 15 fps。",
                          "每段录像显示 env 0；同一 report 中其他环境的数值结果单独保留。",
                          "目标半径为 0.5 m；进入半径、提前终止和有限值检查是不同指标。",
                          "自动重置可能发生，单段汇总不代表论文成功率。",
                          "训练录像使用持续更新的随机策略，最终 checkpoint 仅供追溯，不是该录像的固定策略。"],
                "videos": entries, "reports": reports}
    output.mkdir(parents=True, exist_ok=True)
    encoded = json.dumps(manifest, ensure_ascii=False, indent=2)
    (output / "manifest.json").write_text(encoded + "\n")
    # A normal script tag works without a local HTTP server, unlike fetch(file://...).
    (output / "manifest.js").write_text("window.AME2_VIDEO_MANIFEST = " + encoded + ";\n")
    print(f"Exported {len(entries)} real video(s) from {len(reports)} report(s) to {output}")


if __name__ == "__main__":
    main()
