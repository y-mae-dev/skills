import { Terminal } from "lucide-react";
import { getSkills } from "@/lib/skills";
import { SkillsCatalog } from "@/components/SkillsCatalog";
import { LangToggle } from "@/components/LangToggle";
import { getDict, type Lang } from "@/lib/i18n";

const REPO_URL = "https://github.com/y-mae-dev/skills";

export function HomePage({ lang }: { lang: Lang }) {
  const skills = getSkills();
  const t = getDict(lang);
  const otherHref = lang === "ja" ? "/en" : "/";
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <header className="mb-6">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Terminal className="h-6 w-6" />
            <h1 className="text-2xl font-semibold tracking-tight">
              {t.siteTitle}
            </h1>
          </div>
          <LangToggle lang={lang} otherHref={otherHref} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{t.subtitle}</p>
      </header>

      <SkillsCatalog skills={skills} lang={lang} />

      <footer className="mt-12 border-t border-border pt-5 text-xs text-muted-foreground">
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 underline-offset-2 hover:text-foreground hover:underline"
        >
          <Terminal className="h-3.5 w-3.5" />
          {t.footerRepo}
        </a>
      </footer>
    </main>
  );
}
