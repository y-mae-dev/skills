**English** | [日本語](./README.ja.md)

# skills

A catalog of reusable Claude Code skills. Each skill shows *when to use it* through a hand-drawn sketchnote and a short description.

🔗 https://cc-skills.maeno.dev

## Skills & use cases

| skill | When to use |
|---|---|
| [`grarec`](.claude/skills/grarec/) | When you want to turn a concept or workflow into a hand-drawn graphic-recording (sketchnote) style image — article thumbnails, slides, or visualizing a skill catalog. Uses Gemini image generation (Nano Banana Pro). |
| [`fact-check`](.claude/skills/fact-check/) | When you want to verify the accuracy of URLs, technical claims, commands, and code snippets before publishing a blog post or technical document. |
| [`sync-skills`](.claude/skills/sync-skills/) | When you want to collect Claude Code skills scattered across multiple repos into a single catalog (`skills-catalog.md`) and take inventory. |
| [`check-updates`](.claude/skills/check-updates/) | When you want to check the latest updates across the Claude ecosystem and get adoption candidates proposed for your repository. |
| [`activity-report`](.claude/skills/activity-report/) | When you want a cross-repository activity report from the GitHub API — commits, issues, and PRs summarized per repo. Handy for daily logs and weekly or monthly retrospectives. |

## Usage

Copy each skill directory into your environment's `.claude/skills/<name>/` (or reference it from Claude Code). For skill-specific prerequisites (API keys, external CLIs, etc.), see each `SKILL.md`.
