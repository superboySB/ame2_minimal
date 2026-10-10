#!/usr/bin/env python3
"""Check the real offline player through an independently started Chrome CDP port.

Run this CPU-only client in Docker. The caller must start a dedicated Chrome
profile first; --close-browser closes only the browser on the supplied CDP port.
"""

from __future__ import annotations

import argparse
import asyncio
import base64
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import time
import traceback
from urllib.request import urlopen

from tornado.websocket import websocket_connect


def get_json(url: str):
    with urlopen(url, timeout=5) as response:
        return json.load(response)


class CDP:
    def __init__(self, connection):
        self.connection = connection
        self.sequence = 0

    async def call(self, method: str, **params):
        self.sequence += 1
        sequence = self.sequence
        await self.connection.write_message(json.dumps({"id": sequence, "method": method, "params": params}))
        while message := await self.connection.read_message():
            response = json.loads(message)
            if response.get("id") != sequence:
                continue
            if "error" in response:
                raise RuntimeError(response["error"])
            return response.get("result", {})
        raise RuntimeError("Chrome closed the CDP connection")

    async def evaluate(self, expression: str):
        result = await self.call("Runtime.evaluate", expression=expression, returnByValue=True,
                                 awaitPromise=True, timeout=15000)
        if "exceptionDetails" in result:
            raise RuntimeError(result["exceptionDetails"])
        return result["result"].get("value")


async def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, required=True)
    parser.add_argument("--url", required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--close-browser", action="store_true")
    args = parser.parse_args()
    report = {"schema_version": 1, "started_utc": datetime.now(timezone.utc).isoformat(),
              "evidence_kind": "Chrome_CDP_actual_interaction", "url": args.url,
              "passed": False, "checks": [],
              "limits": ["One real MP4 is exercised interactively; this does not re-evaluate robot policy quality."]}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    client = None

    def check(name, passed, evidence):
        report["checks"].append({"name": name, "passed": bool(passed), "evidence": evidence})
        if not passed:
            raise AssertionError(f"Browser check failed: {name}: {evidence}")

    try:
        endpoint = f"http://127.0.0.1:{args.port}"
        report["browser"] = get_json(endpoint + "/json/version")
        target = next(target for target in get_json(endpoint + "/json/list") if target["type"] == "page")
        connection = await websocket_connect(target["webSocketDebuggerUrl"], max_message_size=16 * 1024 * 1024)
        client = CDP(connection)
        await client.call("Page.enable")
        await client.call("Runtime.enable")
        await client.call("Page.navigate", url=args.url)
        for _ in range(100):
            ready = await client.evaluate("document.readyState==='complete' && !!window.AME2_VIDEO_MANIFEST && !!document.getElementById('count')")
            if ready:
                break
            await asyncio.sleep(0.1)
        data = await client.evaluate("({protocol:location.protocol,manifest:!!window.AME2_VIDEO_MANIFEST,videos:window.AME2_VIDEO_MANIFEST?.videos.length,cards:document.querySelectorAll('#cards .card').length})")
        check("file_manifest_and_cards", data["protocol"] == "file:" and data["manifest"] and data["videos"] == data["cards"] and data["cards"] >= 16, data)

        filtered = await client.evaluate("(()=>{const s=document.getElementById('terrain');s.value='stones';s.dispatchEvent(new Event('change'));return {count:document.querySelectorAll('#cards .card').length,expected:window.AME2_VIDEO_MANIFEST.videos.filter(v=>v.terrain==='stones').length,id:document.querySelector('#cards .card')?.id}})()")
        check("terrain_filter", filtered["count"] == filtered["expected"] and filtered["count"] > 0, filtered)
        metadata = await client.evaluate("new Promise((resolve,reject)=>{const v=window.__ame2TestVideo=document.querySelector('#cards video');v.preload='auto';v.addEventListener('loadedmetadata',()=>resolve({duration:v.duration,readyState:v.readyState,src:v.currentSrc,error:v.error?.message||null}),{once:true});v.addEventListener('error',()=>reject(new Error(v.error?.message||'video error')),{once:true});setTimeout(()=>reject(new Error('metadata timeout')),10000);v.load()})")
        check("mp4_loadedmetadata", metadata["duration"] > 0 and metadata["readyState"] >= 1 and metadata["error"] is None, metadata)

        first = await client.evaluate("(async()=>{const v=window.__ame2TestVideo;await v.play();return {time:v.currentTime,paused:v.paused}})()")
        started = time.monotonic()
        await asyncio.sleep(0.65)
        playing = await client.evaluate("({time:window.__ame2TestVideo.currentTime,paused:window.__ame2TestVideo.paused})")
        elapsed = time.monotonic() - started
        delta = playing["time"] - first["time"]
        check("play_advances_current_time", not playing["paused"] and delta > 0.3,
              {"before": first, "after": playing, "wall_seconds": elapsed, "video_seconds_advanced": delta})
        paused = await client.evaluate("(()=>{const v=window.__ame2TestVideo;v.pause();return {time:v.currentTime,paused:v.paused}})()")
        await asyncio.sleep(0.4)
        held = await client.evaluate("({time:window.__ame2TestVideo.currentTime,paused:window.__ame2TestVideo.paused})")
        check("pause_holds_current_time", paused["paused"] and held["paused"] and abs(held["time"] - paused["time"]) < 0.05,
              {"before": paused, "after": held})
        seek = await client.evaluate("new Promise((resolve,reject)=>{const v=window.__ame2TestVideo,target=v.duration*0.6;v.addEventListener('seeked',()=>resolve({target,time:v.currentTime,seeking:v.seeking,paused:v.paused}),{once:true});setTimeout(()=>reject(new Error('seek timeout')),10000);v.currentTime=target})")
        check("seek_to_60_percent", not seek["seeking"] and seek["paused"] and abs(seek["time"] - seek["target"]) < 0.1, seek)
        fast = await client.evaluate("(async()=>{const s=document.getElementById('speed');s.value='2';s.dispatchEvent(new Event('change'));const v=window.__ame2TestVideo;await v.play();return {time:v.currentTime,rate:v.playbackRate}})()")
        started = time.monotonic()
        await asyncio.sleep(0.65)
        after_fast = await client.evaluate("({time:window.__ame2TestVideo.currentTime,rate:window.__ame2TestVideo.playbackRate,paused:window.__ame2TestVideo.paused})")
        check("speed_control_and_actual_progress", after_fast["rate"] == 2 and not after_fast["paused"] and after_fast["time"] - fast["time"] > 0.7,
              {"before": fast, "after": after_fast, "wall_seconds": time.monotonic() - started})
        all_paused = await client.evaluate("(()=>{document.getElementById('pause').click();return [...document.querySelectorAll('video')].every(v=>v.paused)})()")
        check("pause_all_button", all_paused, {"all_visible_videos_paused": all_paused})
        screenshot = await client.call("Page.captureScreenshot", format="png", captureBeyondViewport=False)
        screenshot_path = args.output.parent / "player_checked.png"
        screenshot_path.write_bytes(base64.b64decode(screenshot["data"]))
        report["screenshot"] = {"path": str(screenshot_path), "sha256": hashlib.sha256(screenshot_path.read_bytes()).hexdigest()}
        outcome = await client.evaluate("(()=>{const t=document.getElementById('terrain'),o=document.getElementById('outcome');t.value='';o.value='提前终止';o.dispatchEvent(new Event('change'));return {count:document.querySelectorAll('#cards .card').length,expected:window.AME2_VIDEO_MANIFEST.videos.filter(v=>v.outcome==='提前终止').length,tags:[...document.querySelectorAll('#cards .tag')].map(e=>e.textContent)}})()")
        check("outcome_filter", outcome["count"] == outcome["expected"] and outcome["count"] > 0 and all(tag == "提前终止" for tag in outcome["tags"]), outcome)
        restored = await client.evaluate("(()=>{const o=document.getElementById('outcome');o.value='';o.dispatchEvent(new Event('change'));return {count:document.querySelectorAll('#cards .card').length,expected:window.AME2_VIDEO_MANIFEST.videos.length}})()")
        check("clear_filters", restored["count"] == restored["expected"], restored)
        report["passed"] = True
    except Exception:
        report["error"] = traceback.format_exc()
    finally:
        if client and args.close_browser:
            try:
                await client.call("Browser.close")
                report["dedicated_browser_close_requested"] = True
            except Exception:
                report["dedicated_browser_close_requested"] = True
            client.connection.close()
        report["ended_utc"] = datetime.now(timezone.utc).isoformat()
        args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"passed": report["passed"], "checks": [(row["name"], row["passed"]) for row in report["checks"]], "report": str(args.output)}, ensure_ascii=False))
    if not report["passed"]:
        raise SystemExit(1)


if __name__ == "__main__":
    asyncio.run(main())
