import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Analytics, GoogleTagManagerNoScript } from "@/components/Analytics";
import { getDictionary } from "@/i18n/dictionaries";
import { getDirection, isLocale, localePath, locales, type Locale } from "@/i18n/config";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: value } = await params;
  if (!isLocale(value)) return {};
  const dictionary = getDictionary(value);
  const url = `https://markdownit.online${localePath(value)}`;
  const languages = Object.fromEntries(locales.map((locale) => [locale, `https://markdownit.online${localePath(locale)}`]));

  return {
    title: dictionary.meta.title,
    description: dictionary.meta.description,
    keywords: dictionary.meta.keywords,
    alternates: {
      canonical: url,
      languages: {
        ...languages,
        "x-default": `https://markdownit.online/zh-CN`
      }
    },
    openGraph: {
      type: "website",
      url,
      siteName: "Markdownit Online",
      title: dictionary.meta.title,
      description: dictionary.meta.description,
      locale: value.replace("-", "_"),
      images: [
        {
          url: "/og-markdownit.svg",
          width: 1200,
          height: 630,
          alt: "Markdownit Online editor workspace"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: dictionary.meta.title,
      description: dictionary.meta.description,
      images: ["/og-markdownit.svg"]
    }
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  const locale = value as Locale;

  return (
    <html lang={locale} dir={getDirection(locale)} suppressHydrationWarning>
      <body>
        <GoogleTagManagerNoScript />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
