/** Query params added for payment completion — not part of the merchant page origin. */
const PAYMENT_CALLBACK_PARAMS = ["status", "transId", "transferId"] as const;

const FAPSHI_INTERNAL_HOSTS = new Set([
  "checkout.fapshi.com",
  "dashboard.fapshi.com",
  "sandbox.fapshi.com",
  "api.fapshi.com",
  "live.fapshi.com",
]);

function normalizeHost(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, "");
}

/** True when redirect points at a merchant site (not Fapshi checkout/API hosts). */
export function isMerchantWebOrigin(url: URL): boolean {
  const host = normalizeHost(url.hostname);
  if (FAPSHI_INTERNAL_HOSTS.has(host)) return false;
  if (host.endsWith(".fapshi.com")) return false;
  return true;
}

/**
 * initiate-pay `redirectUrl` — show “Back to {host}” only when the payer started on
 * a normal merchant webpage. Strips payment callback query params from merchant-link
 * `redirect` (genRedirect) so the link returns to the page that opened checkout.
 */
export function parseWebBackUrl(raw?: string | null): URL | null {
  const value = raw?.trim();
  if (!value) return null;

  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!isMerchantWebOrigin(url)) return null;

    for (const key of PAYMENT_CALLBACK_PARAMS) {
      url.searchParams.delete(key);
    }

    return url;
  } catch {
    return null;
  }
}

export function webBackUrlHost(url: URL): string {
  return url.hostname.replace(/^www\./i, "");
}
