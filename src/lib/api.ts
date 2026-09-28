import { getFapshiApiBase } from "./api-base";
import {
  resolveCheckoutClosedReason,
  type CheckoutClosedReason,
} from "./checkout-closed-link";
import {
  resolveCheckoutAppearance,
  resolveMerchantLinkPayer,
  type MerchantLinkPayload,
} from "./resolve-checkout-appearance";
import type {
  MerchantCheckoutSession,
  MerchantPayMomoPayload,
  MerchantPayMomoResponse,
  TransactionStatusResponse,
} from "./types";

const API_BASE = getFapshiApiBase();

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
  mongoId: string
): Promise<MerchantCheckoutFetchResult> {
  const response = await fetch(
    `${API_BASE}/merchant-link/${encodeURIComponent(mongoId)}`,
    { cache: "no-store" }
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
  payload: MerchantPayMomoPayload
): Promise<MerchantPayMomoResponse> {
  const response = await fetch("/api/pay/merchant/momo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
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
  code: string
): Promise<void> {
  const response = await fetch("/api/pay/merchant/sms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transferId, code }),
  });

  const data = (await response.json().catch(() => ({}))) as { message?: string };
  if (!response.ok) {
    throw new Error(data.message || "Invalid verification code");
  }
}

/** Merchant MoMo payment status (polled while user approves on phone). */
export async function fetchMerchantPaymentStatus(
  transferId: string
): Promise<TransactionStatusResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45 * 1000);

  try {
    const response = await fetch(
      `${API_BASE}/merchant-pay-status/${encodeURIComponent(transferId)}`,
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
