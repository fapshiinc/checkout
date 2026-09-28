import type { Locale } from "@/lib/translations";

function parseReceiptDate(value: string): Date | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const direct = new Date(trimmed);
  if (!Number.isNaN(direct.getTime())) return direct;

  const gbMatch = trimmed.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:,\s*(\d{1,2}):(\d{2})(?::(\d{2}))?)?/
  );
  if (gbMatch) {
    const [, day, month, year, hour = "0", minute = "0", second = "0"] = gbMatch;
    const d = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second)
    );
    if (!Number.isNaN(d.getTime())) return d;
  }

  return undefined;
}

export function formatReceiptPaidDate(
  value: string | undefined,
  locale: Locale
): string | undefined {
  if (!value) return undefined;
  const parsed = parseReceiptDate(value);
  if (!parsed) return value;
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
