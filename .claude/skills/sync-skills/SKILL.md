---
name: sync-skills
description: >
  複数リポジトリからClaude Codeのskillsを収集し、skills-catalog.mdを生成・更新するスキル。
  スキル一覧の更新、カタログ同期、スキルの棚卸し、どんなスキルがあるか確認したいとき、
  スキル情報を最新にしたいときに使う。
tags: [meta]
---
# Sync Skills

複数リポジトリから Claude Code の skills を収集し、カタログを生成するスキル。

## Skills

### /sync-skills

設定ファイルに登録されたリポジトリから skills を収集し、`skills-catalog.md` を生成・更新する。

**使い方**: `/sync-skills`

**手順**:

1. `.claude/skills-sources.json` を Read ツールで読み込み、対象リポジトリ一覧を取得する
2. 各リポジトリについて、`gh api` でファイルツリーを取得し `.claude/skills/**/SKILL.md` を探す:
   ```bash
   gh api "repos/{owner}/{repo}/git/trees/main?recursive=1" --jq '.tree[] | select(.path | test("\\.claude/skills/.*/SKILL\\.md$")) | .path'
   ```
   - `main` ブランチが存在しない場合は `master` で再試行する
3. 見つかった各 SKILL.md の内容を取得する:
   ```bash
   gh api "repos/{owner}/{repo}/contents/{path}" --jq '.content' | base64 -d
   ```
4. 各 SKILL.md の最終更新日を取得する:
   ```bash
   gh api "repos/{owner}/{repo}/commits?path={path}&per_page=1" --jq '.[0].commit.committer.date'
   ```
5. SKILL.md の内容をパースする:
   - `### /スキル名` の見出しを探す
   - 見出し直後の行を説明として抽出する（次の `###` 見出しまたは `---` まで）
   - 説明は最初の1文（句点まで）を要約として使う
6. 収集した情報から `skills-catalog.md` を以下のフォーマットで生成する:

#### カタログ出力フォーマット

```markdown
# Skills Catalog

最終同期: YYYY-MM-DD

## サマリー

| スキル名 | 説明 | ソースリポジトリ | 最終更新 |
|----------|------|-----------------|----------|
| /skill-name | 説明の要約 | owner/repo | YYYY-MM-DD |

## 詳細

### /skill-name
- **ソース**: `owner/repo` / `.claude/skills/dir/SKILL.md`
- **最終更新**: YYYY-MM-DD
- **説明**: 説明の全文。
```

7. `skills-catalog.md` を Write ツールで出力する
8. 結果のサマリーを表示する（収集したリポジトリ数、スキル数）

**注意事項**:
- `gh api` の認証が必要。`gh auth status` で確認する
- プライベートリポジトリへのアクセスには適切なスコープが必要
- API レート制限に注意し、不要なリクエストを避ける
- SKILL.md が見つからないリポジトリはスキップする
- `scan_user_skills` が true の場合、`~/.claude/skills/` もスキャンする（ローカルのみ）
