import {
  FAPSHI_SANDBOX_API_BASE,
  getFapshiApiBase,
  type FapshiApiEnvironment,
} from "@/lib/api-base";

export type CheckoutApiEnvironment = FapshiApiEnvironment;

/** Client → Next pay proxy: select sandbox vs live API base. */
export const CHECKOUT_ENV_HEADER = "x-fapshi-checkout-env";

export function getMerchantApiBase(
  environment: CheckoutApiEnvironment = "live"
): string {
  if (environment === "sandbox") {
    return FAPSHI_SANDBOX_API_BASE;
  }
  return getFapshiApiBase();
}

export function checkoutEnvRequestHeaders(
  environment: CheckoutApiEnvironment
): Record<string, string> {
  if (environment === "sandbox") {
    return { [CHECKOUT_ENV_HEADER]: "sandbox" };
  }
  return {};
}

export function resolveCheckoutEnvFromRequest(request: Request): CheckoutApiEnvironment {
  return request.headers.get(CHECKOUT_ENV_HEADER) === "sandbox"
    ? "sandbox"
    : "live";
}

export function defaultSuccessPath(
  transferId: string,
  environment: CheckoutApiEnvironment
): string {
  const id = encodeURIComponent(transferId);
  return environment === "sandbox" ? `/test/success/${id}` : `/success/${id}`;
}
