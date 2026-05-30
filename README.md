# skills

再利用できる Claude Code skill を共有するためのカタログ。

## なぜ「いつ使うか」を見せるのか

skill は一覧があっても、第三者には「**いつ使うのか**」が伝わらないと使われない。SKILL.md を読めば分かるが、名前と説明が並んでいるだけでは「どの場面で出すのか」が掴みにくい。

このリポは、各 skill の「いつ使うか」を README とグラレコ（手書き風の図）で見えるようにすることを目的にする。視覚と言葉の両方で、使いどころの当たりがつくようにしている。

## 収録 skill（いつ使うか）

| skill | いつ使うか |
|---|---|
| [`grarec`](.claude/skills/grarec/) | 概念やワークフローを手書きグラレコ（sketchnote）風の画像にしたいとき。記事のアイキャッチ、資料、skill 一覧の視覚化など。Gemini の画像生成（Nano Banana Pro）を使う |
| [`fact-check`](.claude/skills/fact-check/) | ブログ記事や技術文書を公開する前に、URL・技術的主張・コマンド・コードスニペットの正確性を検証したいとき |
| [`sync-skills`](.claude/skills/sync-skills/) | 複数リポに散らばった Claude Code skill を 1 つのカタログ（`skills-catalog.md`）に集約して棚卸ししたいとき |
| [`check-updates`](.claude/skills/check-updates/) | Claude エコシステムの最新アップデートを確認して、あなたのリポジトリへの採用候補を提案してほしいとき |

少しずつ増やしていく。

## 使い方

各 skill ディレクトリを自分の環境の `.claude/skills/<name>/` にコピーする（または Claude Code から参照する）。skill 固有の前提（API キー・外部 CLI 等）は各 `SKILL.md` を参照。

## メモ

- `grarec` は画像生成 backend に Vertex AI（既定・鍵レス）または Gemini API キーを使う。GCP project 等は環境変数（`GOOGLE_CLOUD_PROJECT` 等）で指定する。
