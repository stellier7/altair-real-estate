#!/usr/bin/env python3
"""Detect white side letterboxing in listing photos and write crop metadata."""

from __future__ import annotations

import argparse
import io
import json
import statistics
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent.parent
CATALOG = ROOT / "src" / "data" / "properties.json"
OUT = ROOT / "src" / "data" / "image-crops.json"

WHITE_THRESHOLD = 240
MIN_PAD_PCT = 6.0
MIN_EDGE_BRIGHTNESS = 228.0


def fetch_image(url: str) -> bytes | None:
    try:
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "AltairBorderAnalyzer/1.0"},
        )
        with urllib.request.urlopen(req, timeout=45) as resp:
            return resp.read()
    except (urllib.error.URLError, TimeoutError, OSError):
        return None


def analyze_jpeg(data: bytes) -> dict[str, Any] | None:
    try:
        from PIL import Image
    except ImportError:
        raise SystemExit("Pillow required: pip install pillow")

    im = Image.open(io.BytesIO(data)).convert("RGB")
    width, height = im.size
    if width < 40 or height < 40:
        return None

    def strip_mean(x0: int, x1: int) -> float:
        values: list[float] = []
        step_y = max(1, height // 50)
        step_x = max(1, (x1 - x0) // 20)
        for y in range(0, height, step_y):
            for x in range(x0, x1, step_x):
                values.append(sum(im.getpixel((x, y))) / 3)
        return statistics.mean(values) if values else 255.0

    left_brightness = strip_mean(0, max(1, int(width * 0.1)))
    right_brightness = strip_mean(int(width * 0.9), width)

    col_brightness: list[float] = []
    for x in range(width):
        column = [
            sum(im.getpixel((x, y))) / 3
            for y in range(0, height, max(1, height // 45))
        ]
        col_brightness.append(statistics.mean(column))

    content_cols = [i for i, b in enumerate(col_brightness) if b < WHITE_THRESHOLD]
    if not content_cols:
        return {
            "hasLetterboxing": False,
            "scale": 1.0,
            "contentWidthRatio": 1.0,
            "width": width,
            "height": height,
        }

    x0, x1 = content_cols[0], content_cols[-1]
    content_width = x1 - x0 + 1
    pad_left = x0
    pad_right = width - x1 - 1
    pad_left_pct = 100.0 * pad_left / width
    pad_right_pct = 100.0 * pad_right / width
    content_ratio = content_width / width

    has_letterboxing = (
        pad_left_pct >= MIN_PAD_PCT
        and pad_right_pct >= MIN_PAD_PCT
        and left_brightness >= MIN_EDGE_BRIGHTNESS
        and right_brightness >= MIN_EDGE_BRIGHTNESS
        and content_ratio < 0.92
    )

    if not has_letterboxing:
        return {
            "hasLetterboxing": False,
            "scale": 1.0,
            "contentWidthRatio": round(content_ratio, 4),
            "width": width,
            "height": height,
        }

    scale = min(2.35, max(1.0, 1.0 / content_ratio))

    return {
        "hasLetterboxing": True,
        "scale": round(scale, 4),
        "contentWidthRatio": round(content_ratio, 4),
        "padLeftPct": round(pad_left_pct, 2),
        "padRightPct": round(pad_right_pct, 2),
        "width": width,
        "height": height,
    }


def collect_urls(catalog_path: Path, covers_only: bool) -> list[str]:
    data = json.loads(catalog_path.read_text(encoding="utf-8"))
    urls: set[str] = set()
    for prop in data.get("properties", []):
        cover = prop.get("coverImage")
        if cover:
            urls.add(cover)
        if not covers_only:
            for src in prop.get("images") or []:
                if src:
                    urls.add(src)
    return sorted(urls)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--covers-only", action="store_true", help="Analyze cover images only")
    parser.add_argument("--workers", type=int, default=12)
    parser.add_argument("--limit", type=int, default=0)
    args = parser.parse_args()

    urls = collect_urls(CATALOG, args.covers_only)
    if args.limit > 0:
        urls = urls[: args.limit]

    print(f"Analyzing {len(urls)} image URLs…")
    crops: dict[str, dict[str, Any]] = {}
    letterboxed = 0

    def task(url: str) -> tuple[str, dict[str, Any] | None]:
        data = fetch_image(url)
        if not data:
            return url, None
        return url, analyze_jpeg(data)

    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = {pool.submit(task, url): url for url in urls}
        done = 0
        for future in as_completed(futures):
            done += 1
            if done % 100 == 0:
                print(f"  {done}/{len(urls)}")
            url, result = future.result()
            if result:
                crops[url] = result
                if result.get("hasLetterboxing"):
                    letterboxed += 1

    existing: dict[str, Any] = {}
    if OUT.exists():
        try:
            existing = json.loads(OUT.read_text(encoding="utf-8")).get("crops", {})
        except json.JSONDecodeError:
            existing = {}
    merged = {**existing, **crops}
    letterboxed_total = sum(
        1 for meta in merged.values() if meta.get("hasLetterboxing")
    )

    payload = {
        "generatedAt": __import__("time").strftime("%Y-%m-%dT%H:%M:%SZ", __import__("time").gmtime()),
        "analyzed": len(merged),
        "letterboxed": letterboxed_total,
        "crops": merged,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT} ({letterboxed} letterboxed / {len(crops)} analyzed)")


if __name__ == "__main__":
    main()
