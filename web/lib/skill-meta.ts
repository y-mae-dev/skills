import type { Metadata } from "next";
import { getSkill } from "@/lib/skills";
import { getDict, localePrefix, type Lang } from "@/lib/i18n";

/** 個別 skill ページの metadata（OGP / hreflang）を生成する。 */
export function buildSkillMetadata(name: string, lang: Lang): Metadata {
  const skill = getSkill(name);
  const t = getDict(lang);
  if (!skill) return { title: t.siteTitle };

  const description =
    lang === "en" && skill.descriptionEn
      ? skill.descriptionEn
      : skill.description;
  const path = `${localePrefix(lang)}/skills/${name}`;
  const jaPath = `/skills/${name}`;
  const enPath = `/en/skills/${name}`;
  const ogImage = `/images/cc-grarec-detail/${name}.png`;
  const title = `/${skill.name} — ${t.siteTitle}`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: { ja: jaPath, en: enPath, "x-default": jaPath },
    },
    openGraph: {
      type: "article",
      locale: t.ogLocale,
      url: path,
      title,
      description,
      images: [{ url: ogImage, width: 1024, height: 1024 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
