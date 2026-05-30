---
name: check-updates
description: >
  Claude エコシステムの最新アップデートを WebSearch でチェックし、
  あなたのリポジトリへの採用候補を提案するスキル。Claude の更新確認、
  新機能チェック、最新情報のキャッチアップについて言及したら使う。
tags: [meta]
context: fork
agent: general-purpose
---

# Check Updates

Claude エコシステムの最新アップデートを確認し、採用候補を提案する。

**使い方**: `/check-updates`

## 手順

### Step 1: 前回チェック日の確認

`updates/claude-updates.md` を Read で読み込み、最後の日付見出し（`## YYYY-MM-DD`）を確認する。
この日付以降の新情報を対象とする。ファイルに日付見出しがなければ直近7日間を対象とする。

### Step 2: 公式 Changelog の直接取得 + WebSearch で情報収集

#### Step 2a: 公式 Changelog を WebFetch で取得（最も信頼性が高い）

以下の URL を WebFetch で直接取得し、前回チェック日以降のエントリを抽出する:

| # | URL | 目的 |
|---|-----|------|
| 1 | `https://code.claude.com/docs/en/changelog` | Claude Code 公式 changelog |
| 2 | `https://platform.claude.com/docs/en/release-notes/overview` | Claude Platform / API リリースノート |

WebFetch の prompt には「Extract all changelog entries since YYYY-MM-DD（前回チェック日）. For each entry, list: version number, date, and all notable changes.」を指定する。

#### Step 2b: WebSearch で補完情報を収集

以下の検索クエリを実行し、Step 2a で拾えなかった情報を補完する:

| # | クエリ | 目的 |
|---|--------|------|
| 1 | `site:anthropic.com/changelog` | Claude.ai / API の公式 changelog |
| 2 | `site:docs.anthropic.com changelog OR "release notes"` | ドキュメント・Claude Code の更新 |
| 3 | `anthropic claude new feature OR release OR announcement` | 公式アナウンス（ニュース・ブログ） |
| 4 | `"Claude Code" update OR changelog OR new` | Claude Code 固有の更新 |
| 5 | `anthropic sdk python OR typescript release` | SDK リリース情報 |

各クエリの結果から、前回チェック日以降の新しい情報のみを抽出する。
ただし、検索結果の日付が不明な場合は内容から判断し、既に `claude-updates.md` に記録済みの内容は除外する。

### Step 3: 関連度スコアの評価

検出した各更新に関連度スコアを付与する:

| スコア | 基準 | 例 |
|--------|------|-----|
| ★★★ | Claude Code 本体、スキル、フック、MCP、cron に直接影響する変更 | 新コマンド、新ツール、破壊的変更 |
| ★★ | API、SDK、モデル変更。既存プロジェクトに影響しうるもの | 新パラメータ、モデル追加、価格変更 |
| ★ | ドキュメント更新、コース、ブログ記事、リサーチ | 新チュートリアル、技術レポート |

さらに、あなたのリポジトリの既存設定（CLAUDE.md、.claude/skills/、.github/workflows/）に
関連するキーワードが含まれていればスコアを1段階上げる。

### Step 4: 採用候補アクションの提案

各更新について、以下のルーティング表に基づいて具体的なアクションを提案する:

| 更新種類 | 採用先 | アクション例 |
|----------|--------|-------------|
| Claude Code 新機能 | CLAUDE.md, .claude/settings.json | 「CLAUDE.md の○○セクションにルールを追加」 |
| 新スキルパターン | .claude/skills/ | 「新スキル ○○ を作成」 |
| API/SDK 変更 | 該当プロジェクト | 「使っているプロジェクトで影響を確認」 |
| 学習コンテンツ | 学習メモ | 「学習計画に追加」 |
| ブログ向き更新 | ブログ下書き置き場 | 「記事ネタとして下書きを作成」 |

### Step 5: updates/claude-updates.md に追記

新しい情報がある場合、以下のフォーマットで `updates/claude-updates.md` の末尾に追記する:

```markdown
## YYYY-MM-DD

### ★★★ タイトル（例: Claude Code v1.x.x リリース）
- **ソース**: URL
- **概要**: 変更内容の要約
- **採用候補**:
  - [ ] 具体的なアクション1
  - [ ] 具体的なアクション2

### ★★ タイトル
- **ソース**: URL
- **概要**: 変更内容の要約
- **採用候補**:
  - [ ] 具体的なアクション
```

### Step 6: 記録の保存（任意・環境による）

`updates/claude-updates.md` の更新を保存する。git 管理しているリポなら commit する:

```bash
git add updates/claude-updates.md
git commit -m "docs: Claude エコシステム更新チェック (YYYY-MM-DD)"
```

remote があり自動 push したい運用なら `git push` まで行う。git 管理でないリポでは、ファイルの更新だけで十分。更新ゼロの場合もチェック日の記録だけは残す。

### Step 7: GitHub Issue 作成（破壊的変更時のみ）

通常は `updates/claude-updates.md` へのログ追記のみで十分。
GitHub Issue（label: `claude-update`）を作成するのは以下の場合のみ:
- **廃止・非互換変更**で期限が迫っているもの（例: モデル廃止、API 破壊的変更）
- ユーザーが明示的に Issue 化を求めた場合

### Step 8: サマリー出力

最後に、今回のチェック結果のサマリーを出力する:

```
## チェック結果サマリー
- チェック日: YYYY-MM-DD
- 新規検出: N件（★★★: n件、★★: n件、★: n件）
- 採用候補アクション: N件
- 前回チェック: YYYY-MM-DD
```

## 注意事項

- WebSearch の結果は必ずしも最新とは限らない。日付が確認できない情報は「要確認」と明記する
- 既に `claude-updates.md` に記録済みの内容は重複追記しない
- 検索結果がゼロの場合は「新しい更新はありませんでした」と報告し、チェック日だけ記録する
- Issue 作成はユーザーの確認を取ってから行う（自動作成しない）

## 更新ゼロの場合

新しい情報が見つからなかった場合は、`claude-updates.md` には以下のみ追記する:

```markdown
## YYYY-MM-DD

チェック済み — 新しい更新なし
```
