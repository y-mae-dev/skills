import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";
import { getDict } from "@/lib/i18n";

const t = getDict("en");

export const metadata: Metadata = {
  title: t.siteTitle,
  description: t.metaDescription,
  alternates: {
    canonical: "/en",
    languages: { ja: "/", en: "/en", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    locale: t.ogLocale,
    url: "/en",
    title: t.siteTitle,
    description: t.metaDescription,
  },
};

export default function Page() {
  return <HomePage lang="en" />;
}
