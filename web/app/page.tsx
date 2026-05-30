import { Terminal } from "lucide-react";
import { getSkills } from "@/lib/skills";
import { SkillsCatalog } from "@/components/SkillsCatalog";

export default function Home() {
  const skills = getSkills();
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <header className="mb-6">
        <div className="flex items-center gap-2">
          <Terminal className="h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Claude Code Skills
          </h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          再利用できる Claude Code skill のカタログ。「いつ使うか」をグラレコと説明で見せる。
        </p>
      </header>
      <SkillsCatalog skills={skills} />
    </main>
  );
}
