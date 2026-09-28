import type {
  MerchantCheckoutAppearance,
  MerchantCheckoutSession,
} from "./types";

/** Populated service on merchant-link (same source as logo). */
type MerchantLinkServiceRef = {
  logo?: string | null;
  color?: string | null;
};

/** Raw merchant-link payload (current + upcoming optional branding fields). */
export type MerchantLinkPayload = Partial<MerchantCheckoutSession> & {
  appearance?: Partial<MerchantCheckoutAppearance>;
  checkoutTitle?: string;
  checkoutLogo?: string;
  primaryColor?: string;
  /** Service checkout customization (`POST /checkout-customization`) */
  color?: string | null;
  checkoutColor?: string | null;
  serviceId?: string | MerchantLinkServiceRef | null;
  payerName?: string;
  /** Alternate keys from initiate-pay / future API shapes */
  email?: string;
  clientName?: string;
  name?: string;
  successRedirect?: string | null;
  successRedirectUrl?: string | null;
  redirectOnSuccess?: string | null;
};

function serviceBrandingFromLink(
  data: MerchantLinkPayload
): MerchantLinkServiceRef {
  const raw = data.serviceId;
  if (!raw || typeof raw !== "object") return {};
  return raw;
}

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
  const fromService = serviceBrandingFromLink(data);

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
    fromService.logo?.trim() ||
    undefined;

  const primaryColor =
    fromAppearance.primaryColor?.trim() ||
    (fromAppearance as { color?: string }).color?.trim() ||
    data.primaryColor?.trim() ||
    data.color?.trim() ||
    data.checkoutColor?.trim() ||
    fromService.color?.trim() ||
    undefined;

  return {
    title,
    message,
    logo,
    primaryColor,
  };
}
