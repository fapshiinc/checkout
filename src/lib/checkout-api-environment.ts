import {
  FAPSHI_SANDBOX_API_BASE,
  getFapshiApiBase,
  type FapshiApiEnvironment,
} from "@/lib/api-base";

export type CheckoutApiEnvironment = FapshiApiEnvironment;

/** Client → Next pay proxy: select sandbox vs live API base. */
export const CHECKOUT_ENV_HEADER = "x-fapshi-checkout-env";

/**
 * Merchant API host for checkout.
 * Sandbox checkout URLs (`/test/{id}`) always use https://sandbox.fapshi.com —
 * never staging, production, or NEXT_PUBLIC_API_URL overrides.
 */
export function getMerchantApiBase(
  environment: CheckoutApiEnvironment = "live"
): string {
  if (environment === "sandbox") {
    return FAPSHI_SANDBOX_API_BASE;
  }
  return getFapshiApiBase();
}

export function isSandboxCheckoutPathname(pathname: string): boolean {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return path === "/test" || path.startsWith("/test/");
}

export function checkoutEnvRequestHeaders(
  environment: CheckoutApiEnvironment
): Record<string, string> {
  if (environment === "sandbox") {
    return { [CHECKOUT_ENV_HEADER]: "sandbox" };
  }
  return {};
}

export function resolveCheckoutEnvFromRequest(
  request: Request
): CheckoutApiEnvironment {
  if (request.headers.get(CHECKOUT_ENV_HEADER) === "sandbox") {
    return "sandbox";
  }

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      if (isSandboxCheckoutPathname(new URL(referer).pathname)) {
        return "sandbox";
      }
    } catch {
      /* ignore malformed referer */
    }
  }

  return "live";
}

export function defaultSuccessPath(
  transferId: string,
  environment: CheckoutApiEnvironment
): string {
  const id = encodeURIComponent(transferId);
  return environment === "sandbox" ? `/test/success/${id}` : `/success/${id}`;
}
