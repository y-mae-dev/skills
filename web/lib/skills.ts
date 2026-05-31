import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Skill = {
  name: string;
  description: string;
  /** SKILL.md frontmatter の description_en。未設定なら undefined。 */
  descriptionEn?: string;
  /** "[a, b, c]" 形式（コンポーネントの parseTags と整合） */
  tags: string;
};

export type SkillDetail = Skill & {
  /** SKILL.md の frontmatter を除いた本文 markdown。 */
  content: string;
};

const SKILLS_ROOT = path.join(process.cwd(), "..", ".claude", "skills");

function normalize(value: unknown): string {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseSkill(dir: string): SkillDetail | null {
  const mdPath = path.join(SKILLS_ROOT, dir, "SKILL.md");
  if (!fs.existsSync(mdPath)) return null;
  const { data, content } = matter(fs.readFileSync(mdPath, "utf8"));
  const descriptionEn = data.description_en
    ? normalize(data.description_en)
    : undefined;
  return {
    name: String(data.name ?? dir),
    description: normalize(data.description),
    descriptionEn,
    tags: Array.isArray(data.tags) ? `[${data.tags.join(", ")}]` : "",
    content: content.trim(),
  };
}

/** `.claude/skills/<name>/SKILL.md` をビルド時にパースして skill 一覧を返す。 */
export function getSkills(): Skill[] {
  if (!fs.existsSync(SKILLS_ROOT)) return [];
  const skills: Skill[] = [];
  for (const dirent of fs.readdirSync(SKILLS_ROOT, { withFileTypes: true })) {
    if (!dirent.isDirectory()) continue;
    const s = parseSkill(dirent.name);
    if (!s) continue;
    const { content: _content, ...lite } = s;
    skills.push(lite);
  }
  skills.sort((a, b) => a.name.localeCompare(b.name));
  return skills;
}

/** ルートのディレクトリ名一覧（generateStaticParams 用）。 */
export function getSkillNames(): string[] {
  if (!fs.existsSync(SKILLS_ROOT)) return [];
  return fs
    .readdirSync(SKILLS_ROOT, { withFileTypes: true })
    .filter(
      (d) =>
        d.isDirectory() &&
        fs.existsSync(path.join(SKILLS_ROOT, d.name, "SKILL.md")),
    )
    .map((d) => d.name);
}

/** 単一 skill を本文込みで返す。存在しなければ null。 */
export function getSkill(name: string): SkillDetail | null {
  return parseSkill(name);
}
