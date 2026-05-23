import { locales } from "@/i18n/config";

export function GET() {
  const lines = [
    "# Markdownit Online",
    "",
    "Markdownit Online is a multilingual browser-based Markdown editor with live preview, local storage, Word export, and PDF export.",
    "",
    "## Localized entry points",
    ...locales.map((locale) => `- https://markdownit.online/${locale}`),
    "",
    "## Notes",
    "- User documents are stored locally in the browser by default.",
    "- The public website is optimized for Google SEO and multilingual discovery."
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8"
    }
  });
}
