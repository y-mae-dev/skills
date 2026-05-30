---
name: grarec
description: >
  任意の concept/テキストから手書きグラレコ (graphic recording / sketchnote) 風の
  正方画像を生成する skill。「グラレコ作って」「この概念を手書き風の図に」
  「sketchnote 生成」「/grarec」と言ったら使う。サムネ(256・文字なし)と
  詳細(1024・日本語ラベル + 工程図)の 2 モード。
tags: [meta, image, grarec, gemini]
---

# grarec

手書きグラレコ（graphic recording / sketchnote）風の画像を生成する skill。スタイル定義（手書き風・marker on white paper・モノクロ + sky blue アクセント・サムネは文字なし / 詳細は日本語ラベル）を `scripts/grarec.py` に一元化した「正本」。画像生成が要る他の用途も、この土台に寄せて共通化できる。

**いつ使う**: 概念やワークフローを手書き風アイコン / 工程図にしたいとき。`/grarec <concept>`、他 skill から画像が要るときの共通土台。

## 使い方

```bash
# サムネ（256・文字なしアイコン）
uv run .claude/skills/grarec/scripts/grarec.py --concept "<concept>"

# 詳細（1024・日本語ラベル + 工程図）。--sections で工程を渡す
uv run .claude/skills/grarec/scripts/grarec.py --concept "<concept>" \
  --detail --sections "入力" "生成" "保存"

# プロンプトだけ確認（API を呼ばない・課金ゼロ）
uv run .claude/skills/grarec/scripts/grarec.py --concept "<concept>" --dry-run

# 出力先を明示 / 既存を上書き再生成
uv run .claude/skills/grarec/scripts/grarec.py --concept "<concept>" --out path.png --force
```

- 生成（またはスキップ）した PNG の**絶対パスを stdout に 1 行**で返す。そのまま `![](...)` 埋め込みに使える。
- 主な引数: `--concept`(必須) / `--out` / `--size`(既定 サムネ256・詳細1024) / `--detail` / `--sections ...` / `--accent`(既定 `#38bdf8`) / `--slug` / `--force` / `--dry-run`。

## スタイル仕様

marker on white paper・minimal lines・モノクロ + アクセント 1 色（既定 sky blue `#38bdf8`、`--accent` で変更可）。**サムネは画像内に文字を出さない**（NO-text）。**詳細は画像内ラベルを日本語**にして工程を icon + 矢印で可視化する。

## backend とコスト

- backend は既定 **Vertex AI**（ADC / IAM 認証・API キー不要）。`GOOGLE_CLOUD_PROJECT` を環境変数で指定する。`GRAREC_BACKEND=gemini-api` または `GOOGLE_API_KEY` 明示で Gemini API キー方式（Secret Manager、シークレット名は `GRAREC_SECRET_NAME`・既定 `google-api-key`）に切替。
- モデルは `gemini-3-pro-image`（Nano Banana Pro / GA）。`GEMINI_IMAGE_MODEL` env で上書き可（将来 Flash に下げる場合 `gemini-3.1-flash-image`）。
- 1 枚 約 **$0.134**（Pro は最小 1K 生成のためサムネも同額）。**既存 PNG は `--force` なしなら自動スキップで再課金なし**。`--dry-run` は無料。

## 保存先

`--out` 未指定なら `GRAREC_OUT_DIR`（既定 `grarec-out/`）配下に `<YYYY-MM-DD>-<slug>.png`。`--slug` 未指定は concept から生成。

## 注意

- 生成画像は出力先（`GRAREC_OUT_DIR`）に保存される。必要に応じて `.gitignore` で除外し commit しない運用を推奨。
- 画像生成を行う他の skill / スクリプトは、この `grarec.py` をサブプロセス呼び出しすることで共通化できる（GA モデル id + Vertex backend をそのまま継承させる）。
