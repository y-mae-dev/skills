import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSkill, getSkillNames } from "@/lib/skills";
import { SkillDetail } from "@/components/SkillDetail";
import { buildSkillMetadata } from "@/lib/skill-meta";

type Params = { name: string };

export function generateStaticParams(): Params[] {
  return getSkillNames().map((name) => ({ name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { name } = await params;
  return buildSkillMetadata(name, "en");
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { name } = await params;
  const skill = getSkill(name);
  if (!skill) notFound();
  return <SkillDetail skill={skill} lang="en" />;
}
