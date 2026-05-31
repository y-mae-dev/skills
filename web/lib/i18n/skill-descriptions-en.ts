/**
 * skill 説明の英訳（Web 表示専用のサイドカー）。
 * SKILL.md の frontmatter は Claude Code が読み込むため、表示用の英訳はここに分離する。
 * キーは skill のディレクトリ名。未登録なら日本語 description にフォールバックする。
 */
export const SKILL_DESCRIPTIONS_EN: Record<string, string> = {
  grarec:
    "Generate a square, hand-drawn graphic-recording (sketchnote) style image from any concept or text. Two modes: a text-free thumbnail (256px) and a detailed version (1024px) with labels and a process diagram.",
  "fact-check":
    "Fact-check a blog post or technical document before publishing — verify the accuracy of URLs, technical claims, commands, and code snippets, and report each as OK / warning / NG.",
  "sync-skills":
    "Collect Claude Code skills across multiple repositories and generate or update a single skills-catalog.md. Use it to take inventory of your skills and keep the catalog current.",
  "check-updates":
    "Check the latest updates across the Claude ecosystem via web search and propose adoption candidates for your repository. Use it to catch up on new features and changes.",
};
