const TAG_COLOR: Record<string, string> = {
  blog: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20",
  writing: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/20",
  zenn: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
  review: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
  "fact-check": "bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-500/20",
  meta: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20",
  image: "bg-pink-500/10 text-pink-700 dark:text-pink-300 border-pink-500/20",
  grarec: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20",
  gemini: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20",
};

const DEFAULT_TAG_COLOR = "bg-muted text-muted-foreground border-border";

/** "[a, b]" 形式の tags 文字列を配列に分解する。 */
export function parseTags(raw: string): string[] {
  if (!raw) return [];
  const cleaned = raw.replace(/^\[|\]$/g, "").trim();
  if (!cleaned) return [];
  return cleaned
    .split(/[,\s]+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

export function tagColor(tag: string): string {
  return TAG_COLOR[tag] ?? DEFAULT_TAG_COLOR;
}
