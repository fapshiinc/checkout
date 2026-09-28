export type CheckoutClosedReason = "paid" | "expired" | "unavailable";

export function statusFromMerchantRedirect(
  redirect?: string | null
): string | null {
  if (!redirect?.trim()) return null;
  try {
    return new URL(redirect.trim()).searchParams.get("status");
  } catch {
    return null;
  }
}

export function resolveCheckoutClosedReason(opts: {
  redirect?: string | null;
  message?: string | null;
}): CheckoutClosedReason {
  const status = statusFromMerchantRedirect(opts.redirect)?.toUpperCase();
  if (status === "SUCCESSFUL") return "paid";
  if (status === "EXPIRED") return "expired";
  const msg = opts.message?.toLowerCase() ?? "";
  if (msg.includes("link expired")) return "expired";
  return "unavailable";
}

/** Terminal merchant-link statuses — must not show the pay form. */
export function isTerminalCheckoutStatus(status: string): boolean {
  return status === "SUCCESSFUL" || status === "EXPIRED";
}
