import type { Locale } from "@/lib/translations";

export function formatReceiptPaidDate(
  value: string | undefined,
  locale: Locale
): string | undefined {
  if (!value) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Short display id similar to Stripe receipt numbers (e.g. ABCD-6054). */
export function formatReceiptNumber(transferId: string): string {
  const clean = transferId.replace(/\s/g, "");
  if (clean.length >= 8) {
    return `${clean.slice(0, 4)}-${clean.slice(-4)}`.toUpperCase();
  }
  return clean.toUpperCase();
}
