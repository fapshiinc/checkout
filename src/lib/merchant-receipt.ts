import type { CheckoutApiEnvironment } from "@/lib/checkout-api-environment";
import { getMerchantApiBase } from "@/lib/checkout-api-environment";
import { merchantApiRequestHeaders } from "@/lib/checkout-origin";

export type MerchantPaymentReceipt = {
  transferId: string;
  status: string;
  serviceName?: string;
  amount?: number;
  payerName?: string;
  email?: string;
  medium?: string;
  dateInitiated?: string;
  dateConfirmed?: string;
  logoUrl?: string;
};

export function normalizeReceiptLogoHint(
  value: string | undefined | null
): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const url = new URL(trimmed);
      if (url.protocol === "http:" || url.protocol === "https:") {
        return url.href;
      }
    } catch {
      return undefined;
    }
  }
  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }
  if (trimmed.startsWith("/")) return trimmed;
  if (!trimmed.includes("://")) {
    return `/${trimmed.replace(/^\/+/, "")}`;
  }
  return undefined;
}

export function resolveMerchantImageUrl(
  value: string | undefined,
  environment: CheckoutApiEnvironment = "live"
): string | undefined {
  const normalized = normalizeReceiptLogoHint(value);
  if (!normalized) return undefined;
  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return normalized;
  }
  const base = getMerchantApiBase(environment).replace(/\/$/, "");
  return `${base}${normalized}`;
}

export function normalizeReceiptMerchantHint(
  value: string | undefined | null
): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim().slice(0, 120);
  return trimmed || undefined;
}

export function merchantReceiptPagePath(
  transferId: string,
  environment: CheckoutApiEnvironment = "live",
  options?: { logo?: string | null; merchantName?: string | null }
): string {
  const id = encodeURIComponent(transferId);
  const base =
    environment === "sandbox" ? `/test/receipt/${id}` : `/receipt/${id}`;
  const params = new URLSearchParams();
  const logo = normalizeReceiptLogoHint(options?.logo);
  const merchant = normalizeReceiptMerchantHint(options?.merchantName);
  if (logo) params.set("logo", logo);
  if (merchant) params.set("merchant", merchant);
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

export function resolveReceiptLogo(
  receipt: MerchantPaymentReceipt,
  logoHint?: string | null
): string | undefined {
  return (
    normalizeReceiptLogoHint(receipt.logoUrl) ??
    normalizeReceiptLogoHint(logoHint)
  );
}

const RECEIPT_LOGO_KEYS = [
  "logo",
  "checkoutLogo",
  "vendorLogo",
  "serviceLogo",
  "merchantLogo",
] as const;

function pickReceiptLogoFromPayload(
  data: Record<string, unknown>
): string | undefined {
  for (const key of RECEIPT_LOGO_KEYS) {
    const value = data[key];
    if (typeof value === "string") {
      const normalized = normalizeReceiptLogoHint(value);
      if (normalized) return normalized;
    }
  }
  return undefined;
}

export async function fetchMerchantPaymentReceipt(
  transferId: string,
  environment: CheckoutApiEnvironment = "live"
): Promise<MerchantPaymentReceipt | null> {
  const apiBase = getMerchantApiBase(environment);
  const response = await fetch(
    `${apiBase}/transPayDetails/${encodeURIComponent(transferId)}`,
    {
      cache: "no-store",
      headers: merchantApiRequestHeaders(environment),
    }
  );

  if (!response.ok) return null;

  const data = (await response.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;

  const id =
    (typeof data.transferId === "string" && data.transferId) ||
    (typeof data.transId === "string" && data.transId) ||
    transferId;

  return {
    transferId: id,
    status: String(data.status ?? ""),
    serviceName:
      typeof data.serviceName === "string" ? data.serviceName : undefined,
    amount: typeof data.amount === "number" ? data.amount : undefined,
    payerName:
      typeof data.payerName === "string"
        ? data.payerName
        : typeof data.clientName === "string"
          ? data.clientName
          : undefined,
    email:
      typeof data.email === "string"
        ? data.email
        : typeof data.payerEmail === "string"
          ? data.payerEmail
          : undefined,
    medium: typeof data.medium === "string" ? data.medium : undefined,
    dateInitiated: formatReceiptDate(data.dateInitiated),
    dateConfirmed: formatReceiptDate(data.dateConfirmed),
    logoUrl: pickReceiptLogoFromPayload(data),
  };
}

function formatReceiptDate(value: unknown): string | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value.toLocaleString("en-GB");
  if (typeof value === "string") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? value : d.toLocaleString("en-GB");
  }
  return undefined;
}
