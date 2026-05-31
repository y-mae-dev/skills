import Link from "next/link";
import { Globe } from "lucide-react";
import { getDict, type Lang } from "@/lib/i18n";

/** 相手ロケールへのリンク。ラベルは切替先の言語名を表示する。 */
export function LangToggle({ lang, otherHref }: { lang: Lang; otherHref: string }) {
  const t = getDict(lang);
  return (
    <Link
      href={otherHref}
      className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors"
    >
      <Globe className="h-3.5 w-3.5" />
      {t.toLangLabel}
    </Link>
  );
}
