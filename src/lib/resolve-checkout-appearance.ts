import type {
  MerchantCheckoutAppearance,
  MerchantCheckoutSession,
} from "./types";

/** Raw merchant-link payload (current + upcoming optional branding fields). */
export type MerchantLinkPayload = Partial<MerchantCheckoutSession> & {
  appearance?: Partial<MerchantCheckoutAppearance>;
  checkoutTitle?: string;
  checkoutLogo?: string;
  primaryColor?: string;
  payerName?: string;
  /** Alternate keys from initiate-pay / future API shapes */
  email?: string;
  clientName?: string;
  name?: string;
};

/** Payer fields sent when the merchant created the payment link. */
export function resolveMerchantLinkPayer(data: MerchantLinkPayload): {
  payerEmail?: string;
  payerName?: string;
} {
  const payerEmail =
    data.payerEmail?.trim() ||
    data.email?.trim() ||
    undefined;
  const payerName =
    data.payerName?.trim() ||
    data.clientName?.trim() ||
    data.name?.trim() ||
    undefined;
  return { payerEmail, payerName };
}

export function resolveCheckoutAppearance(
  data: MerchantLinkPayload
): MerchantCheckoutAppearance {
  const fromAppearance: Partial<MerchantCheckoutAppearance> = data.appearance ?? {};

  const title =
    fromAppearance.title?.trim() ||
    data.checkoutTitle?.trim() ||
    data.serviceName?.trim() ||
    "Merchant";

  const message =
    fromAppearance.message?.trim() || data.message?.trim() || undefined;

  const logo =
    fromAppearance.logo?.trim() ||
    data.checkoutLogo?.trim() ||
    data.logo?.trim() ||
    undefined;

  const primaryColor =
    fromAppearance.primaryColor?.trim() ||
    data.primaryColor?.trim() ||
    undefined;

  return {
    title,
    message,
    logo,
    primaryColor,
  };
}
