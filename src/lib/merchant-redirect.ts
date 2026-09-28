/**
 * Mirrors backend `genRedirect(trans, 'SUCCESSFUL')` for merchant initiate-pay return URLs.
 * Checkout loads `redirect` while status is CREATED; after payment, merchants expect
 * the same URL with `status=SUCCESSFUL` (and `transId`).
 */
export function buildMerchantSuccessRedirect(
  redirect: string | null | undefined,
  transferId: string,
  status: "SUCCESSFUL" | "FAILED" | "EXPIRED" = "SUCCESSFUL"
): string | null {
  const raw = redirect?.trim();
  if (!raw || !transferId.trim()) return null;

  try {
    const url = new URL(raw);
    if (!url.searchParams.has("transId")) {
      url.searchParams.set("transId", transferId);
    }
    url.searchParams.set("status", status);
    return url.toString();
  } catch {
    return null;
  }
}

/** Prefer explicit post-payment redirect from API when present. */
export function resolveMerchantSuccessRedirect(
  data: {
    redirect?: string | null;
    successRedirect?: string | null;
    successRedirectUrl?: string | null;
    redirectOnSuccess?: string | null;
  },
  transferId: string
): string | null {
  const explicit =
    data.successRedirect?.trim() ||
    data.successRedirectUrl?.trim() ||
    data.redirectOnSuccess?.trim();

  if (explicit) {
    return buildMerchantSuccessRedirect(explicit, transferId) ?? explicit;
  }

  return buildMerchantSuccessRedirect(data.redirect, transferId);
}
