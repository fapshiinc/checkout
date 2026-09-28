import type { CheckoutApiEnvironment } from "./checkout-api-environment";
import {
  checkoutEnvRequestHeaders,
  getMerchantApiBase,
} from "./checkout-api-environment";
import { merchantApiRequestHeaders } from "./checkout-origin";
import {
  resolveCheckoutClosedReason,
  type CheckoutClosedReason,
} from "./checkout-closed-link";
import {
  resolveCheckoutAppearance,
  resolveMerchantLinkPayer,
  type MerchantLinkPayload,
} from "./resolve-checkout-appearance";
import { normalizeMerchantPayPhone } from "@/lib/merchant-pay-phone";
import type {
  MerchantCheckoutSession,
  MerchantPayMomoPayload,
  MerchantPayMomoResponse,
  TransactionStatusResponse,
} from "./types";

export function isValidMerchantCheckoutId(id: string): boolean {
  return /^[a-f\d]{24}$/i.test(id);
}

export type MerchantCheckoutFetchResult =
  | { ok: true; session: MerchantCheckoutSession }
  | {
      ok: false;
      message: string;
      redirect?: string;
      cardRedirect?: string;
      closedReason?: CheckoutClosedReason;
    };

export async function fetchMerchantCheckoutSession(
  mongoId: string,
  environment: CheckoutApiEnvironment = "live"
): Promise<MerchantCheckoutFetchResult> {
  const apiBase = getMerchantApiBase(environment);
  const response = await fetch(
    `${apiBase}/merchant-link/${encodeURIComponent(mongoId)}`,
    {
      cache: "no-store",
      headers: merchantApiRequestHeaders(environment),
    }
  );

  const data = (await response.json().catch(() => ({}))) as MerchantLinkPayload & {
    message?: string;
    redirect?: string;
  };

  if (response.status === 418 && data.redirect) {
    return {
      ok: false,
      message: data.message || "Card payment",
      cardRedirect: data.redirect,
    };
  }

  if (!response.ok) {
    const redirect = data.redirect;
    return {
      ok: false,
      message: data.message || "This payment link is invalid or unavailable.",
      redirect,
      closedReason: resolveCheckoutClosedReason({
        redirect,
        message: data.message,
      }),
    };
  }

  const appearance = resolveCheckoutAppearance(data);
  const payer = resolveMerchantLinkPayer(data);

  return {
    ok: true,
    session: {
      ...(data as MerchantCheckoutSession),
      ...payer,
      appearance,
    },
  };
}

export async function payMerchantWithMomo(
  payload: MerchantPayMomoPayload,
  environment: CheckoutApiEnvironment = "live"
): Promise<MerchantPayMomoResponse> {
  const body: MerchantPayMomoPayload = {
    ...payload,
    phone: normalizeMerchantPayPhone(payload.phone),
  };
  const response = await fetch("/api/pay/merchant/momo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...checkoutEnvRequestHeaders(environment),
    },
    body: JSON.stringify(body),
  });

  const data = (await response.json().catch(() => ({}))) as MerchantPayMomoResponse & {
    message?: string;
  };

  if (!response.ok) {
    throw new Error(data.message || `Payment failed (${response.status})`);
  }

  return data;
}

export async function submitMerchantSmsCode(
  transferId: string,
  code: string,
  environment: CheckoutApiEnvironment = "live"
): Promise<void> {
  const response = await fetch("/api/pay/merchant/sms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...checkoutEnvRequestHeaders(environment),
    },
    body: JSON.stringify({ transferId, code }),
  });

  const data = (await response.json().catch(() => ({}))) as { message?: string };
  if (!response.ok) {
    throw new Error(data.message || "Invalid verification code");
  }
}

/** Merchant MoMo payment status (polled while user approves on phone). */
export async function fetchMerchantPaymentStatus(
  transferId: string,
  environment: CheckoutApiEnvironment = "live"
): Promise<TransactionStatusResponse> {
  const apiBase = getMerchantApiBase(environment);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45 * 1000);

  try {
    const response = await fetch(
      `${apiBase}/merchantpay/status/${encodeURIComponent(transferId)}`,
      {
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        signal: controller.signal,
      }
    );
    const data = (await response.json().catch(() => ({}))) as TransactionStatusResponse & {
      message?: string;
    };
    if (!response.ok) {
      throw new Error(data.message || `Status check failed (${response.status})`);
    }
    return data as TransactionStatusResponse;
  } finally {
    clearTimeout(timeout);
  }
}
