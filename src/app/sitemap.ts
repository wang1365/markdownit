import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return locales.map((locale) => ({
    url: `https://markdownit.online/${locale}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: locale === "zh-CN" ? 1 : 0.9,
    alternates: {
      languages: Object.fromEntries(locales.map((item) => [item, `https://markdownit.online/${item}`]))
    }
  }));
}
