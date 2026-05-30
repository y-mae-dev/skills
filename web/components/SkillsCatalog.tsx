"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ExternalLink, ImageIcon, Search, Terminal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import type { Skill } from "@/lib/skills";

const BUILD_ID = process.env.NEXT_PUBLIC_BUILD_ID || "dev";
const REPO_SKILL_BASE =
  "https://github.com/y-mae-dev/skills/blob/main/.claude/skills";

/** グラレコサムネ。PNG 不在時は Terminal アイコンにフォールバック。 */
function SkillThumbnailButton({
  skill,
  onOpenDetail,
}: {
  skill: Skill;
  onOpenDetail: (s: Skill) => void;
}) {
  const [errored, setErrored] = useState(false);
  return (
    <button
      type="button"
      onClick={() => onOpenDetail(skill)}
      title="クリックで詳細グラレコを表示"
      className="group relative w-16 h-16 rounded-md border border-border bg-card shrink-0 overflow-hidden cursor-pointer hover:ring-2 hover:ring-sky-500/50 hover:border-sky-500/40 transition-all"
    >
      {errored ? (
        <div className="w-full h-full bg-muted flex items-center justify-center">
          <Terminal className="h-7 w-7 text-muted-foreground/60" />
        </div>
      ) : (
        <Image
          src={`/images/cc-grarec/${skill.name}.png?v=${BUILD_ID}`}
          alt={`/${skill.name} thumbnail`}
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
    </button>
  );
}

/** 詳細グラレコ (1024)。PNG 不在時は説明メッセージ。 */
function DetailGrarecImage({ name }: { name: string }) {
  const [errored, setErrored] = useState(false);
  if (errored) {
    return (
      <div className="w-full aspect-square rounded-md border border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-2 p-6 text-center text-sm text-muted-foreground">
        <ImageIcon className="h-8 w-8 opacity-50" />
        <p>詳細グラレコは未生成です</p>
      </div>
    );
  }
  return (
    <Image
      src={`/images/cc-grarec-detail/${name}.png?v=${BUILD_ID}`}
      alt={`/${name} detail graphic recording`}
      width={1024}
      height={1024}
      unoptimized
      className="w-full h-auto rounded-md border border-border bg-white"
      onError={() => setErrored(true)}
    />
  );
}

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

function parseTags(raw: string): string[] {
  if (!raw) return [];
  const cleaned = raw.replace(/^\[|\]$/g, "").trim();
  if (!cleaned) return [];
  return cleaned
    .split(/[,\s]+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function tagColor(tag: string): string {
  return TAG_COLOR[tag] ?? DEFAULT_TAG_COLOR;
}

export function SkillsCatalog({ skills }: { skills: Skill[] }) {
  const [query, setQuery] = useState("");
  const [detailSkill, setDetailSkill] = useState<Skill | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return skills;
    return skills.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.toLowerCase().includes(q),
    );
  }, [skills, query]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end text-xs text-muted-foreground">
        {filtered.length} / {skills.length} skill
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="skill 名 / 説明 / tag で絞り込み"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          tone="info"
          title="該当 skill なし"
          description="検索条件を変えてみてください"
        />
      ) : (
        <ul className="space-y-2">
          {filtered.map((skill) => (
            <li
              key={skill.name}
              className="flex gap-3 rounded-md border border-border bg-card hover:bg-accent/30 transition-colors px-4 py-3"
            >
              <SkillThumbnailButton skill={skill} onOpenDetail={setDetailSkill} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap mb-1.5">
                  <a
                    href={`${REPO_SKILL_BASE}/${skill.name}/SKILL.md`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="SKILL.md を開く"
                    className="group/skill inline-flex items-baseline gap-1.5 underline-offset-2 hover:underline decoration-sky-500/40"
                  >
                    <code className="text-base font-mono font-semibold text-foreground transition-colors group-hover/skill:text-sky-600 dark:group-hover/skill:text-sky-400">
                      /{skill.name}
                    </code>
                    <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground/70">
                      SKILL.md
                      <ExternalLink className="h-3 w-3" />
                    </span>
                  </a>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {skill.description}
                </p>
                {parseTags(skill.tags).length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {parseTags(skill.tags).map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className={`text-xs font-normal ${tagColor(tag)}`}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog
        open={!!detailSkill}
        onOpenChange={(open) => !open && setDetailSkill(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {detailSkill && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-baseline gap-2 flex-wrap">
                  <code className="text-lg font-mono font-semibold">
                    /{detailSkill.name}
                  </code>
                </DialogTitle>
                <DialogDescription className="text-sm leading-relaxed">
                  {detailSkill.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3">
                <DetailGrarecImage name={detailSkill.name} />
                {parseTags(detailSkill.tags).length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {parseTags(detailSkill.tags).map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className={`text-xs font-normal ${tagColor(tag)}`}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
