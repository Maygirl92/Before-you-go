"""Run local Chinese OCR over extracted video frames."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import cv2
from rapidocr_onnxruntime import RapidOCR


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("frames", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--max-frame", type=int, default=230)
    parser.add_argument("--stride", type=int, default=2)
    args = parser.parse_args()

    engine = RapidOCR()
    frame_paths = sorted(args.frames.glob("frame_*.jpg"))
    with args.output.open("w", encoding="utf-8") as handle:
        for index, path in enumerate(frame_paths, start=1):
            if index > args.max_frame:
                break
            if (index - 1) % args.stride != 0:
                continue
            image = cv2.imread(str(path))
            if image is None:
                continue
            height, width = image.shape[:2]
            # The opened Xiaohongshu post occupies the central modal. Cropping
            # removes most background search results so they are not counted.
            left = int(width * 0.48)
            right = int(width * 0.94)
            top = int(height * 0.02)
            bottom = int(height * 0.98)
            crop = image[top:bottom, left:right]
            result, _ = engine(crop)
            items = []
            for box, text, confidence in result or []:
                items.append(
                    {
                        "text": text,
                        "confidence": round(float(confidence), 4),
                        "box": [[round(float(x), 1), round(float(y), 1)] for x, y in box],
                    }
                )
            record = {"frame": path.name, "time_seconds": (index - 1) / 2, "texts": items}
            handle.write(json.dumps(record, ensure_ascii=False) + "\n")
            if index % 20 == 1:
                print(f"processed {index}/{min(len(frame_paths), args.max_frame)}", flush=True)


if __name__ == "__main__":
    main()
