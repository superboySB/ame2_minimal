#!/usr/bin/env python3
"""Collect rendered WebAgg evidence from an already running --vizacc plotter.

This script starts no simulator, GPU work, browser, or server. Run it in the
same network namespace as the existing plotter, while the GUI play process is
still producing samples:

  /isaac-sim/python.sh scripts/research/collect_webagg.py \
    --url http://127.0.0.1:8988 --seconds 8 \
    --output ../outputs/research/gui/vizacc_capture

WebAgg sends incremental PNG updates. Raw websocket messages are identified
as full/diff in the report; independent /download.png snapshots preserve
complete figures suitable for inspection and documentation.
"""

import argparse
import asyncio
import hashlib
import json
from pathlib import Path
import sys
import time
from datetime import datetime, timezone
from urllib.parse import urlsplit, urlunsplit
from urllib.request import urlopen

from tornado.websocket import websocket_connect


def utc_now():
    return datetime.now(timezone.utc).isoformat()


def fetch(url):
    with urlopen(url, timeout=3) as response:
        if response.status != 200:
            raise RuntimeError(f"Unexpected HTTP status {response.status}")
        return response.read()


async def collect(args, report):
    parsed = urlsplit(args.url)
    if parsed.scheme not in ("http", "https") or not parsed.netloc:
        raise ValueError("--url must be an HTTP(S) WebAgg base URL")
    base_path = parsed.path.rstrip("/")
    base = urlunsplit((parsed.scheme, parsed.netloc, base_path, "", ""))
    ws_url = urlunsplit(("wss" if parsed.scheme == "https" else "ws", parsed.netloc,
                       f"{base_path}/{args.figure}/ws", "", ""))
    download_url = f"{base}/{args.figure}/download.png"
    report.update(base_url=base, websocket_url=ws_url, figure=args.figure)
    deadline = time.monotonic() + args.startup_timeout
    connection = None
    while connection is None:
        try:
            page = await asyncio.to_thread(fetch, base + "/")
            connection = await websocket_connect(ws_url, connect_timeout=3)
        except (OSError, RuntimeError) as error:
            if time.monotonic() >= deadline:
                raise TimeoutError(f"WebAgg was unavailable: {error}") from error
            await asyncio.sleep(0.2)
    report["http_root_bytes"] = len(page)
    report["connected_utc"] = utc_now()
    connection.write_message({"type": "supports_binary", "value": True})
    connection.write_message({"type": "refresh"})
    connection.write_message({"type": "draw"})
    state = {"image_mode": "unknown", "reader_error": None}
    report["websocket_frames"] = []
    report["snapshots"] = []
    websocket_hashes = set()
    snapshot_hashes = set()

    async def reader():
        try:
            while True:
                message = await connection.read_message()
                if message is None:
                    raise RuntimeError("WebAgg closed its websocket during collection")
                if isinstance(message, bytes):
                    if not message.startswith(b"\x89PNG"):
                        raise ValueError("WebAgg returned a non-PNG binary frame")
                    checksum = hashlib.sha256(message).hexdigest()
                    item = {"received_utc": utc_now(), "sha256": checksum,
                            "bytes": len(message), "image_mode": state["image_mode"]}
                    if checksum not in websocket_hashes and len(websocket_hashes) < args.save_ws_frames:
                        path = args.output / f"websocket_{len(websocket_hashes):03d}_{state['image_mode']}.png"
                        path.write_bytes(message)
                        item["path"] = str(path)
                    websocket_hashes.add(checksum)
                    report["websocket_frames"].append(item)
                else:
                    event = json.loads(message)
                    if event.get("type") == "image_mode":
                        state["image_mode"] = event["mode"]
                    elif event.get("type") == "draw":
                        # This is the acknowledgement the browser normally
                        # sends; without it WebAgg animations cannot redraw.
                        connection.write_message({"type": "draw"})
        except asyncio.CancelledError:
            raise
        except BaseException as error:
            state["reader_error"] = error

    reader_task = asyncio.create_task(reader())
    started = time.monotonic()
    try:
        index = 0
        while time.monotonic() - started < args.seconds:
            if state["reader_error"] is not None:
                raise state["reader_error"]
            snapshot = await asyncio.to_thread(fetch, download_url)
            if not snapshot.startswith(b"\x89PNG"):
                raise ValueError("WebAgg download was not a complete PNG figure")
            checksum = hashlib.sha256(snapshot).hexdigest()
            path = args.output / f"curve_{index:03d}.png"
            path.write_bytes(snapshot)
            snapshot_hashes.add(checksum)
            report["snapshots"].append({"captured_utc": utc_now(), "sha256": checksum,
                                        "bytes": len(snapshot), "path": str(path)})
            index += 1
            await asyncio.sleep(args.snapshot_interval)
        report["distinct_websocket_pngs"] = len(websocket_hashes)
        report["distinct_complete_figures"] = len(snapshot_hashes)
        if len(websocket_hashes) < args.min_distinct or len(snapshot_hashes) < args.min_distinct:
            raise AssertionError(f"Need {args.min_distinct} distinct websocket PNGs and complete figures; "
                                 f"got {len(websocket_hashes)} / {len(snapshot_hashes)}")
        report["passed"] = True
    finally:
        reader_task.cancel()
        await asyncio.gather(reader_task, return_exceptions=True)
        connection.close()
        report["collector_websocket_closed"] = True


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--url", default="http://127.0.0.1:8988")
    parser.add_argument("--figure", type=int, default=1)
    parser.add_argument("--seconds", type=float, default=8)
    parser.add_argument("--snapshot_interval", type=float, default=0.5)
    parser.add_argument("--startup_timeout", type=float, default=30)
    parser.add_argument("--min_distinct", type=int, default=2)
    parser.add_argument("--save_ws_frames", type=int, default=8)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    if args.seconds <= 0 or args.snapshot_interval <= 0 or args.startup_timeout <= 0:
        parser.error("Durations must be positive")
    if args.figure < 1 or args.min_distinct < 1 or args.save_ws_frames < 0:
        parser.error("Figure/min_distinct must be positive; save_ws_frames cannot be negative")
    args.output = args.output.resolve()
    if args.output.exists() and any(args.output.iterdir()):
        parser.error("--output must be empty; previous evidence is never overwritten")
    args.output.mkdir(parents=True, exist_ok=True)
    started = time.monotonic()
    report = {"schema_version": 1, "command": sys.argv, "started_utc": utc_now(),
              "evidence_kind": "rendered_WebAgg_capture", "passed": False,
              "limits": ["The collector records a running plotter; it does not start or modify the simulator.",
                         "PNG changes establish rendered activity; numeric sensor samples are not independently decoded."]}
    try:
        asyncio.run(collect(args, report))
    except BaseException as error:
        report["error"] = {"type": type(error).__name__, "message": str(error)}
        raise
    finally:
        report["wall_seconds"] = time.monotonic() - started
        destination = args.output / "capture.json"
        destination.write_text(json.dumps(report, indent=2) + "\n")
        print(f"[WEBAGG_CAPTURE] passed={report['passed']} report={destination}")
