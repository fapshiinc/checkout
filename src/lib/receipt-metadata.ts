import type { Metadata } from "next";
import {
  formatReceiptNumber,
  formatReceiptPaidDate,
} from "@/lib/receipt-format";

export function receiptDocumentTitle(input: {
  merchantName: string;
  receiptNumber: string;
}): string {
  const merchant = input.merchantName.trim() || "Merchant";
  return `Receipt ${input.receiptNumber} · ${merchant}`;
}

export function receiptMetaDescription(input: {
  merchantName: string;
  receiptNumber: string;
  amountLabel?: string;
  paidOn?: string;
}): string {
  const merchant = input.merchantName.trim() || "Merchant";
  const parts = [
    `Payment receipt ${input.receiptNumber} from ${merchant}.`,
  ];
  if (input.amountLabel) {
    parts.push(`${input.amountLabel} paid.`);
  }
  if (input.paidOn) {
    parts.push(`Date paid: ${input.paidOn}.`);
  }
  return parts.join(" ");
}

export function buildReceiptPageMetadata(input: {
  merchantName: string;
  receiptNumber: string;
  amountLabel?: string;
  paidOn?: string;
  available: boolean;
}): Metadata {
  if (!input.available) {
    return {
      title: { absolute: "Receipt unavailable" },
      description: "This payment receipt is not available or the payment was not successful.",
      robots: { index: false, follow: false },
    };
  }

  const title = receiptDocumentTitle({
    merchantName: input.merchantName,
    receiptNumber: input.receiptNumber,
  });
  const description = receiptMetaDescription({
    merchantName: input.merchantName,
    receiptNumber: input.receiptNumber,
    amountLabel: input.amountLabel,
    paidOn: input.paidOn,
  });

  return {
    title: { absolute: title },
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export function receiptMetaFromTransferId(transferId: string): {
  receiptNumber: string;
} {
  return { receiptNumber: formatReceiptNumber(transferId) };
}

export function receiptPaidOnForMeta(
  dateConfirmed?: string,
  dateInitiated?: string
): string | undefined {
  return (
    formatReceiptPaidDate(dateConfirmed, "en") ??
    formatReceiptPaidDate(dateInitiated, "en")
  );
}
