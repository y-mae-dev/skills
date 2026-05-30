#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "google-genai>=1.0",
#     "Pillow>=10.4",
#     "google-cloud-secret-manager>=2.20",
# ]
# ///
"""汎用グラレコ（graphic recording / sketchnote）画像生成の「正本」.

任意の concept/テキストから手書きグラレコ風の正方 PNG を Gemini Image API で
生成する。スタイル定義（手書き風・monochrome + sky blue accent・サムネは文字なし /
詳細は日本語ラベル）をここに一元化し、他の用途からも再利用しやすいよう、
純関数を副作用なしで公開する。

backend は既定 Vertex AI（ADC/IAM・鍵不要）。`GRAREC_BACKEND=gemini-api` または
`GOOGLE_API_KEY` 明示で Gemini API キー方式（Secret Manager 経由）に切替。

2 モード:
- 既定（サムネ）: 文字なしアイコン。256 に縮小保存。
- --detail: 工程図。日本語ラベル可。1024 で保存。

Usage:
  uv run .claude/skills/grarec/scripts/grarec.py --concept "<concept>"
  uv run .claude/skills/grarec/scripts/grarec.py --concept "..." --detail --sections "入力" "生成" "保存"
  uv run .claude/skills/grarec/scripts/grarec.py --concept "..." --dry-run   # API を呼ばず prompt のみ
  uv run .claude/skills/grarec/scripts/grarec.py --concept "..." --out path.png --force
  GRAREC_BACKEND=gemini-api uv run .claude/skills/grarec/scripts/grarec.py --concept "..."

出力: 生成 or スキップした PNG の絶対パスを stdout に 1 行で返す（ログは stderr）。
"""
from __future__ import annotations

import argparse
import datetime
import io
import os
import re
import sys
from pathlib import Path

# 出力先は GRAREC_OUT_DIR で指定（既定はカレント配下 grarec-out/）
DEFAULT_OUTPUT_DIR = Path(os.environ.get("GRAREC_OUT_DIR", "grarec-out")).expanduser()

# GCP project / Secret 名は環境変数で指定（固有値はハードコードしない）
DEFAULT_LOCATION = os.environ.get("GOOGLE_CLOUD_LOCATION", "global")
SECRET_NAME = os.environ.get("GRAREC_SECRET_NAME", "google-api-key")
# Nano Banana Pro (GA). env override 可。将来 Flash に下げるなら gemini-3.1-flash-image。
IMAGE_MODEL = os.environ.get("GEMINI_IMAGE_MODEL", "gemini-3-pro-image")
DEFAULT_ACCENT = "#38bdf8"  # sky blue

# サムネ用: 画像内に文字を出さない
THUMB_PROMPT = (
    "A hand-drawn sketchnote (graphic recording / グラレコ) style icon for: {concept}.\n"
    "Style: marker on white paper, minimal lines, monochrome with one accent "
    "color ({accent}). Square aspect ratio.\n"
    "Important: NO text or letters in the image — visual icon only."
)

# 詳細用: 工程を icon + 矢印で可視化。画像内ラベルは日本語。
DETAIL_PROMPT = (
    "A detailed graphic recording (グラレコ) infographic for: {concept}\n\n"
    "可視化したい工程 (各項目を icon + 矢印で表現):\n{sections}\n\n"
    "Style requirements:\n"
    "- Hand-drawn sketchnote / グラレコ, marker on white paper\n"
    "- 4-7 connected visual elements (icons, figures, arrows) showing the flow\n"
    "- {accent} accent on monochrome black ink\n"
    "- Square 1:1\n"
    "- **All handwritten text labels in the image MUST be in Japanese** "
    "(ひらがな・カタカナ・漢字 OK)\n"
    "- 文字は手書き風で読みやすく。難しい漢字はカタカナでも可\n"
    "- Visual metaphors over written explanations — keep text labels concise"
)


def build_prompt(
    concept: str,
    *,
    detail: bool = False,
    sections: list[str] | None = None,
    accent: str = DEFAULT_ACCENT,
) -> str:
    """concept から生成プロンプトを組む（スタイル一元化の唯一の入口）。"""
    if detail:
        sec = "\n".join(f"- {s}" for s in (sections or [])) or "- (工程指定なし)"
        return DETAIL_PROMPT.format(concept=concept, sections=sec, accent=accent)
    return THUMB_PROMPT.format(concept=concept, accent=accent)


def get_api_key() -> str:
    """Gemini API キー方式の鍵解決: GOOGLE_API_KEY env → Secret Manager。"""
    direct = os.environ.get("GOOGLE_API_KEY")
    if direct:
        return direct
    from google.cloud import secretmanager

    project = os.environ.get("GOOGLE_CLOUD_PROJECT")
    if not project:
        raise RuntimeError("GOOGLE_CLOUD_PROJECT を設定してください")
    client = secretmanager.SecretManagerServiceClient()
    path = f"projects/{project}/secrets/{SECRET_NAME}/versions/latest"
    return client.access_secret_version(name=path).payload.data.decode("utf-8")


def make_client():
    """backend 切替: 既定 Vertex AI（ADC/IAM）。gemini-api 指定で API キー方式。"""
    from google import genai

    backend = os.environ.get("GRAREC_BACKEND", "").lower()
    use_gemini_api = backend == "gemini-api" or bool(os.environ.get("GOOGLE_API_KEY"))
    if use_gemini_api:
        return genai.Client(api_key=get_api_key())
    project = os.environ.get("GOOGLE_CLOUD_PROJECT")
    if not project:
        raise RuntimeError("Vertex backend には GOOGLE_CLOUD_PROJECT が必要です")
    return genai.Client(vertexai=True, project=project, location=DEFAULT_LOCATION)


def generate_image(client, prompt: str) -> bytes:
    from google.genai import types as genai_types

    res = client.models.generate_content(
        model=IMAGE_MODEL,
        contents=prompt,
        config=genai_types.GenerateContentConfig(response_modalities=["IMAGE"]),
    )
    candidate = res.candidates[0] if res.candidates else None
    if not candidate or not candidate.content or not candidate.content.parts:
        raise RuntimeError("no candidate parts in response")
    for part in candidate.content.parts:
        if part.inline_data and part.inline_data.data:
            return part.inline_data.data
    raise RuntimeError("no inline image data in response")


def save_resized(png_bytes: bytes, dst: Path, size: int) -> int:
    from PIL import Image

    img = Image.open(io.BytesIO(png_bytes)).convert("RGB")
    if img.size != (size, size):
        # center-crop して正方にしてから resize
        w, h = img.size
        side = min(w, h)
        left = (w - side) // 2
        top = (h - side) // 2
        img = img.crop((left, top, left + side, top + side))
        img = img.resize((size, size), Image.LANCZOS)
    dst.parent.mkdir(parents=True, exist_ok=True)
    img.save(dst, format="PNG", optimize=True)
    return dst.stat().st_size


def slugify(text: str) -> str:
    """concept をファイル名 slug に正規化（英数とハイフン、最大 40 字）。"""
    s = text.strip().lower()
    s = re.sub(r"[^\w\s-]", "", s, flags=re.UNICODE)
    s = re.sub(r"[\s_]+", "-", s).strip("-")
    return (s[:40] or "grarec")


def default_out_path(slug: str) -> Path:
    today = datetime.date.today().isoformat()
    return DEFAULT_OUTPUT_DIR / f"{today}-{slug}.png"


def main() -> int:
    ap = argparse.ArgumentParser(description="手書きグラレコ画像生成（正本）")
    ap.add_argument("--concept", required=True, help="生成プロンプトの核 (1 行〜数行)")
    ap.add_argument("--out", help="出力 PNG パス。未指定なら GRAREC_OUT_DIR/<date>-<slug>.png")
    ap.add_argument("--size", type=int, help="出力正方サイズ px (既定: サムネ256 / 詳細1024)")
    ap.add_argument("--detail", action="store_true", help="詳細モード (日本語ラベル・工程図)")
    ap.add_argument("--sections", nargs="*", default=[], help="詳細モードの工程ラベル (日本語可)")
    ap.add_argument("--accent", default=DEFAULT_ACCENT, help=f"アクセント色 (既定 {DEFAULT_ACCENT})")
    ap.add_argument("--slug", help="出力ファイル名の識別子 (未指定は concept から生成)")
    ap.add_argument("--force", action="store_true", help="既存 PNG も再生成 (課金あり)")
    ap.add_argument("--dry-run", action="store_true", help="prompt のみ表示。API を呼ばない")
    args = ap.parse_args()

    size = args.size if args.size else (1024 if args.detail else 256)
    prompt = build_prompt(
        args.concept, detail=args.detail, sections=args.sections, accent=args.accent
    )

    # dry-run は存在チェックより前。課金ゼロ。
    if args.dry_run:
        print(f"[dry-run] model={IMAGE_MODEL} size={size} detail={args.detail}", file=sys.stderr)
        print(prompt, file=sys.stderr)
        return 0

    slug = args.slug or slugify(args.concept)
    dst = Path(args.out).expanduser().resolve() if args.out else default_out_path(slug)

    # 既存スキップで再課金回避
    if dst.exists() and not args.force:
        print(f"skip (exists): {dst}", file=sys.stderr)
        print(dst, flush=True)
        return 0

    client = make_client()
    png = generate_image(client, prompt)
    written = save_resized(png, dst, size)
    print(f"generated: {dst} ({written // 1024} KB, {size}px, {IMAGE_MODEL})", file=sys.stderr)
    print(dst, flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
