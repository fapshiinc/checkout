import type { CheckoutApiEnvironment } from "@/lib/checkout-api-environment";
import { checkoutEnvRequestHeaders } from "@/lib/checkout-api-environment";

/** Public checkout host — sandbox API requires this as the `Origin` header. */
export function getCheckoutOrigin(): string {
  const fromEnv =
    process.env.CHECKOUT_ORIGIN?.trim() ||
    process.env.NEXT_PUBLIC_CHECKOUT_ORIGIN?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return "https://checkout.fapshi.com";
}

export function merchantApiRequestHeaders(
  environment: CheckoutApiEnvironment = "live"
): Record<string, string> {
  return {
    Origin: getCheckoutOrigin(),
    ...checkoutEnvRequestHeaders(environment),
  };
}
