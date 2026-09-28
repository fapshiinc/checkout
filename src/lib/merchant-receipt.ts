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
};

export function merchantReceiptPagePath(
  transferId: string,
  environment: CheckoutApiEnvironment = "live"
): string {
  const id = encodeURIComponent(transferId);
  return environment === "sandbox" ? `/test/receipt/${id}` : `/receipt/${id}`;
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
