/** Normalize payer phone for merchantpay/momo (live + sandbox). */
export function normalizeMerchantPayPhone(value: unknown): string {
  return String(value ?? "")
    .replace(/\D/g, "")
    .slice(-9);
}
