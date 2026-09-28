export type CheckoutFormMode = "phone_only" | "standard";

/** Phone-only when merchant already sent email and name on the payment link. */
export function resolveCheckoutFormMode(opts: {
  payerEmail?: string;
  payerName?: string;
}): CheckoutFormMode {
  const hasEmail = !!opts.payerEmail?.trim();
  const hasName = !!opts.payerName?.trim();
  if (hasEmail && hasName) return "phone_only";
  return "standard";
}

export function isCheckoutFormReady(opts: {
  email: string;
  /** Normalized 9-digit MSISDN (6xxxxxxxx) */
  phoneDigits: string;
  phoneValid: boolean;
}): boolean {
  const phoneOk =
    opts.phoneDigits.length === 9 &&
    opts.phoneValid &&
    opts.phoneDigits.startsWith("6");
  const emailTrim = opts.email.trim();
  const emailOk =
    emailTrim.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim);
  return phoneOk && emailOk;
}
