import { notFound } from "next/navigation";
import { MarkdownStudio } from "@/components/MarkdownStudio";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, locales, type Locale } from "@/i18n/config";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocalePage({ params }: Props) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  const locale = value as Locale;
  const dictionary = getDictionary(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Markdownit Online",
        applicationCategory: "ProductivityApplication",
        operatingSystem: "Web",
        url: `https://markdownit.online/${locale}`,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD"
        },
        featureList: [
          "Markdown editing",
          "Live preview",
          "Word export",
          "PDF export",
          "Local browser storage",
          "Multilingual interface"
        ]
      },
      {
        "@type": "FAQPage",
        mainEntity: dictionary.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer
          }
        }))
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MarkdownStudio locale={locale} dictionary={dictionary} />
    </>
  );
}
