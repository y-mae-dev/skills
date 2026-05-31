export type Lang = "ja" | "en";

export const LOCALES: Lang[] = ["ja", "en"];
export const DEFAULT_LANG: Lang = "ja";

/** サイトの UI 文字列。ロケールごとに 1 オブジェクトを持つ。 */
export type Dict = {
  htmlLang: string;
  ogLocale: string;
  siteTitle: string;
  metaDescription: string;
  subtitle: string;
  searchPlaceholder: string;
  resultCount: (shown: number, total: number) => string;
  emptyTitle: string;
  emptyDesc: string;
  cardHint: string;
  skillMdLabel: string;
  footerRepo: string;
  toLangLabel: string;
  whenToUse: string;
  backToList: string;
  viewOnGitHub: string;
  detailNotGenerated: string;
};

import { ja } from "./ja";
import { en } from "./en";

const DICTS: Record<Lang, Dict> = { ja, en };

export function getDict(lang: Lang): Dict {
  return DICTS[lang] ?? DICTS[DEFAULT_LANG];
}

/** ロケールごとのパス接頭辞。ja はルート、en は /en。 */
export function localePrefix(lang: Lang): string {
  return lang === "ja" ? "" : "/en";
}
