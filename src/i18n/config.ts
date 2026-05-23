export const locales = ["en", "fr", "de", "ja", "ko", "zh-CN", "zh-TW", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "zh-CN";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  de: "Deutsch",
  ja: "日本語",
  ko: "한국어",
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文",
  ar: "العربية"
};

export const rtlLocales = new Set<Locale>(["ar"]);

export function isLocale(value: string | undefined): value is Locale {
  return Boolean(value && locales.includes(value as Locale));
}

export function getDirection(locale: Locale) {
  return rtlLocales.has(locale) ? "rtl" : "ltr";
}

export function localePath(locale: Locale) {
  return `/${locale}`;
}

export function detectLocaleFromHeader(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;

  const requested = acceptLanguage
    .split(",")
    .map((part) => part.split(";")[0]?.trim())
    .filter(Boolean);

  for (const language of requested) {
    if (isLocale(language)) return language;
    const base = language.split("-")[0];
    if (base === "zh") return defaultLocale;
    const match = locales.find((locale) => locale.toLowerCase().startsWith(base.toLowerCase()));
    if (match) return match;
  }

  return defaultLocale;
}
