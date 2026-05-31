import type { Dict } from "./index";

export const ja: Dict = {
  htmlLang: "ja",
  ogLocale: "ja_JP",
  siteTitle: "Claude Code Skills",
  metaDescription: "再利用できる Claude Code skill のカタログ",
  subtitle: "Claude Code skill のユースケースを、手書きグラレコで見える化する。",
  searchPlaceholder: "skill 名 / 説明 / tag で絞り込み",
  resultCount: (shown, total) => `${shown} / ${total} skill`,
  emptyTitle: "該当 skill なし",
  emptyDesc: "検索条件を変えてみてください",
  cardHint: "クリックで詳細を表示",
  skillMdLabel: "SKILL.md",
  footerRepo: "GitHub: y-mae-dev/skills",
  toLangLabel: "English",
  whenToUse: "いつ使うか",
  backToList: "一覧へ戻る",
  viewOnGitHub: "GitHub で SKILL.md を開く",
  detailNotGenerated: "詳細グラレコは未生成です",
};
