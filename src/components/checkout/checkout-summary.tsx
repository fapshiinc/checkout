import type { Locale } from "@/lib/translations";

export function formatCheckoutAmountValue(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", {
    maximumFractionDigits: 0,
  }).format(amount);
}
