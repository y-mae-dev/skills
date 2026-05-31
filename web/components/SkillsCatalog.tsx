"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ImageIcon, Search, Terminal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { SkillTags } from "@/components/SkillTags";
import type { Skill } from "@/lib/skills";
import { getDict, localePrefix, type Lang } from "@/lib/i18n";

const BUILD_ID = process.env.NEXT_PUBLIC_BUILD_ID || "dev";

/** グラレコサムネ。PNG 不在時は Terminal アイコンにフォールバック。 */
function SkillThumbnail({ name }: { name: string }) {
  const [errored, setErrored] = useState(false);
  return (
    <span className="relative w-16 h-16 rounded-md border border-border bg-card shrink-0 overflow-hidden block">
      {errored ? (
        <span className="w-full h-full bg-muted flex items-center justify-center">
          <Terminal className="h-7 w-7 text-muted-foreground/60" />
        </span>
      ) : (
        <Image
          src={`/images/cc-grarec/${name}.png?v=${BUILD_ID}`}
          alt={`/${name} thumbnail`}
          width={64}
          height={64}
          unoptimized
          className="w-16 h-16 object-cover"
          onError={() => setErrored(true)}
        />
      )}
      <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
        <ImageIcon className="h-5 w-5 text-white" />
      </span>
    </span>
  );
}

function skillText(skill: Skill, lang: Lang): string {
  return lang === "en" && skill.descriptionEn
    ? skill.descriptionEn
    : skill.description;
}

export function SkillsCatalog({
  skills,
  lang,
}: {
  skills: Skill[];
  lang: Lang;
}) {
  const t = getDict(lang);
  const prefix = localePrefix(lang);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return skills;
    return skills.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        (s.descriptionEn?.toLowerCase().includes(q) ?? false) ||
        s.tags.toLowerCase().includes(q),
    );
  }, [skills, query]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end text-xs text-muted-foreground">
        {t.resultCount(filtered.length, skills.length)}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t.searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState tone="info" title={t.emptyTitle} description={t.emptyDesc} />
      ) : (
        <ul className="space-y-2">
          {filtered.map((skill) => (
            <li key={skill.name}>
              <Link
                href={`${prefix}/skills/${skill.name}`}
                title={t.cardHint}
                className="group flex gap-3 rounded-md border border-border bg-card hover:bg-accent/30 hover:border-sky-500/40 transition-colors px-4 py-3"
              >
                <SkillThumbnail name={skill.name} />
                <div className="flex-1 min-w-0">
                  <code className="text-base font-mono font-semibold text-foreground transition-colors group-hover:text-sky-600 dark:group-hover:text-sky-400">
                    /{skill.name}
                  </code>
                  <p className="mt-1.5 mb-3 text-sm text-muted-foreground leading-relaxed">
                    {skillText(skill, lang)}
                  </p>
                  <SkillTags tags={skill.tags} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
