import type { Metadata } from "next";
import type { CheckoutApiEnvironment } from "@/lib/checkout-api-environment";
import {
  buildReceiptPageMetadata,
  receiptMetaFromTransferId,
  receiptPaidOnForMeta,
} from "@/lib/receipt-metadata";
import {
  fetchMerchantPaymentReceipt,
  normalizeReceiptMerchantHint,
} from "@/lib/merchant-receipt";
import { formatAmount } from "@/lib/utils";

export async function generateReceiptMetadata({
  transferId,
  environment,
  merchantHint,
}: {
  transferId: string;
  environment: CheckoutApiEnvironment;
  merchantHint?: string | null;
}): Promise<Metadata> {
  const { receiptNumber } = receiptMetaFromTransferId(transferId);
  const receipt = await fetchMerchantPaymentReceipt(transferId, environment);
  const merchantName =
    receipt?.serviceName?.trim() ||
    normalizeReceiptMerchantHint(merchantHint) ||
    "Merchant";

  if (!receipt || receipt.status !== "SUCCESSFUL") {
    return buildReceiptPageMetadata({
      merchantName,
      receiptNumber,
      available: false,
    });
  }

  const paidOn = receiptPaidOnForMeta(
    receipt.dateConfirmed,
    receipt.dateInitiated
  );
  const amountLabel =
    receipt.amount != null ? formatAmount(receipt.amount, "en") : undefined;

  return buildReceiptPageMetadata({
    merchantName,
    receiptNumber,
    amountLabel,
    paidOn,
    available: true,
  });
}
