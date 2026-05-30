import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Skill = {
  name: string;
  description: string;
  /** "[a, b, c]" 形式（コンポーネントの parseTags と整合） */
  tags: string;
};

/**
 * `.claude/skills/<name>/SKILL.md` の frontmatter をビルド時にパースして
 * skill 一覧を返す。
 */
export function getSkills(): Skill[] {
  const root = path.join(process.cwd(), "..", ".claude", "skills");
  if (!fs.existsSync(root)) return [];
  const skills: Skill[] = [];
  for (const dirent of fs.readdirSync(root, { withFileTypes: true })) {
    if (!dirent.isDirectory()) continue;
    const mdPath = path.join(root, dirent.name, "SKILL.md");
    if (!fs.existsSync(mdPath)) continue;
    const { data } = matter(fs.readFileSync(mdPath, "utf8"));
    const name = String(data.name ?? dirent.name);
    const description = String(data.description ?? "")
      .replace(/\s+/g, " ")
      .trim();
    const tags = Array.isArray(data.tags) ? `[${data.tags.join(", ")}]` : "";
    skills.push({ name, description, tags });
  }
  skills.sort((a, b) => a.name.localeCompare(b.name));
  return skills;
}
