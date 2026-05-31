import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";
import { getDict } from "@/lib/i18n";

const t = getDict("ja");

export const metadata: Metadata = {
  title: t.siteTitle,
  description: t.metaDescription,
  alternates: {
    canonical: "/",
    languages: { ja: "/", en: "/en", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    locale: t.ogLocale,
    url: "/",
    title: t.siteTitle,
    description: t.metaDescription,
  },
};

export default function Page() {
  return <HomePage lang="ja" />;
}
