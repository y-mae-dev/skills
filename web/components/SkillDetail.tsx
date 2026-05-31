import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DetailGrarec } from "@/components/DetailGrarec";
import { SkillTags } from "@/components/SkillTags";
import { LangToggle } from "@/components/LangToggle";
import { getDict, localePrefix, type Lang } from "@/lib/i18n";
import type { SkillDetail as SkillDetailType } from "@/lib/skills";

const REPO_SKILL_BASE =
  "https://github.com/y-mae-dev/skills/blob/main/.claude/skills";

export function SkillDetail({
  skill,
  lang,
}: {
  skill: SkillDetailType;
  lang: Lang;
}) {
  const t = getDict(lang);
  const prefix = localePrefix(lang);
  const description =
    lang === "en" && skill.descriptionEn
      ? skill.descriptionEn
      : skill.description;
  const otherSkillHref =
    lang === "ja"
      ? `/en/skills/${skill.name}`
      : `/skills/${skill.name}`;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between gap-2">
        <Link
          href={`${prefix}/`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.backToList}
        </Link>
        <LangToggle lang={lang} otherHref={otherSkillHref} />
      </div>

      <header className="mt-5 mb-5">
        <h1 className="text-2xl font-semibold tracking-tight">
          <code className="font-mono">/{skill.name}</code>
        </h1>
        <div className="mt-3">
          <SkillTags tags={skill.tags} />
        </div>
      </header>

      <section className="mb-6 rounded-md border border-border bg-card px-4 py-3">
        <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1.5">
          {t.whenToUse}
        </h2>
        <p className="text-sm leading-relaxed">{description}</p>
      </section>

      <DetailGrarec name={skill.name} notGeneratedLabel={t.detailNotGenerated} />

      {skill.content && (
        <article className="prose prose-sm dark:prose-invert max-w-none mt-8">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {skill.content}
          </ReactMarkdown>
        </article>
      )}

      <footer className="mt-10 border-t border-border pt-5">
        <a
          href={`${REPO_SKILL_BASE}/${skill.name}/SKILL.md`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          {t.viewOnGitHub}
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </footer>
    </main>
  );
}
