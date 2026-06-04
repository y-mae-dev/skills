[English](./README.md) | **日本語**

# skills

再利用できる Claude Code skill のカタログ。各 skill の「いつ使うか」をグラレコ（手書き風の図）と説明で見せる。

🔗 https://cc-skills.maeno.dev

## Skill一覧とユースケース

| skill | いつ使うか |
|---|---|
| [`grarec`](.claude/skills/grarec/) | 概念やワークフローを手書きグラレコ（sketchnote）風の画像にしたいとき。記事のアイキャッチ、資料、skill 一覧の視覚化など。Gemini の画像生成（Nano Banana Pro）を使う |
| [`fact-check`](.claude/skills/fact-check/) | ブログ記事や技術文書を公開する前に、URL・技術的主張・コマンド・コードスニペットの正確性を検証したいとき |
| [`sync-skills`](.claude/skills/sync-skills/) | 複数リポに散らばった Claude Code skill を 1 つのカタログ（`skills-catalog.md`）に集約して棚卸ししたいとき |
| [`check-updates`](.claude/skills/check-updates/) | Claude エコシステムの最新アップデートを確認して、あなたのリポジトリへの採用候補を提案してほしいとき |
| [`activity-report`](.claude/skills/activity-report/) | GitHub API からリポジトリ横断の活動レポート（コミット・Issue・PR をリポ別に集計）が欲しいとき。日次ログや週次・月次の振り返りの素材集めにも |

## 使い方

各 skill ディレクトリを自分の環境の `.claude/skills/<name>/` にコピーする（または Claude Code から参照する）。skill 固有の前提（API キー・外部 CLI 等）は各 `SKILL.md` を参照。
