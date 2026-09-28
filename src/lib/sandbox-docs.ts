import type { Locale } from "@/lib/translations";

/** Fapshi sandbox test phone numbers and environment details. */
export function sandboxEnvironmentDocsUrl(locale: Locale): string {
  const lang = locale === "fr" ? "fr" : "en";
  return `https://docs.fapshi.com/${lang}/api-reference/preliminary-knowledge/environment`;
}
