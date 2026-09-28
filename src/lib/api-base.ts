/**
 * Fapshi API base URLs.
 *
 * Hosted checkout (merchant-link, merchantpay) uses **api.fapshi.com** in
 * production — same as legacy `old-checkout` Merchant/Checkout.js.
 *
 * Sandbox: https://sandbox.fapshi.com (old-checkout Merchant/test/Checkout.js)
 *
 * Docs also reference live.fapshi.com for merchant API keys; override with
 * NEXT_PUBLIC_API_URL when your service is on that host.
 */
export const FAPSHI_PRODUCTION_API_BASE = "https://api.fapshi.com";
export const FAPSHI_SANDBOX_API_BASE = "https://sandbox.fapshi.com";
export const FAPSHI_LIVE_API_BASE = "https://live.fapshi.com";

export type FapshiApiEnvironment = "live" | "sandbox";

export function resolveFapshiApiEnvironment(): FapshiApiEnvironment {
  const explicit = process.env.NEXT_PUBLIC_FAPSHI_ENV?.toLowerCase();
  if (explicit === "sandbox" || explicit === "live") return explicit;

  const checkoutEnv = process.env.NEXT_PUBLIC_CHECKOUT_ENV?.toLowerCase();
  if (checkoutEnv === "sandbox") return "sandbox";
  if (checkoutEnv === "live") return "live";

  const url = process.env.NEXT_PUBLIC_API_URL?.toLowerCase() ?? "";
  if (url.includes("sandbox.fapshi.com")) return "sandbox";

  return "live";
}

export function getFapshiApiBase(): string {
  if (process.env.NEXT_PUBLIC_API_URL?.trim()) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  if (resolveFapshiApiEnvironment() === "sandbox") {
    return FAPSHI_SANDBOX_API_BASE;
  }
  return FAPSHI_PRODUCTION_API_BASE;
}

export function getPublicApiBase(): string {
  return getFapshiApiBase();
}

export function getMerchantPayApiBase(): string {
  return getFapshiApiBase();
}

/** @deprecated use getFapshiApiBase */
export function getApiBase(): string {
  return getFapshiApiBase();
}

export function isSandboxFapshiApiBase(base: string): boolean {
  return base.includes("sandbox.fapshi.com");
}
