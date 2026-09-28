import Link from "next/link";
import { CheckoutFooter } from "@/components/checkout/checkout-footer";
import { MerchantPaymentReceiptView } from "@/components/checkout/merchant-payment-receipt-view";
import type { CheckoutApiEnvironment } from "@/lib/checkout-api-environment";
import { fetchMerchantPaymentReceipt } from "@/lib/merchant-receipt";

export async function MerchantReceiptRoute({
  transferId,
  environment,
}: {
  transferId: string;
  environment: CheckoutApiEnvironment;
}) {
  const receipt = await fetchMerchantPaymentReceipt(transferId, environment);

  if (!receipt || receipt.status !== "SUCCESSFUL") {
    return (
      <div className="checkout-shell checkout-shell--document checkout-experience flex flex-col bg-white text-[#1a1a1a]">
        <main className="checkout-main mx-auto w-full max-w-[420px] flex-1 px-4 pt-10 text-center">
          <h1 className="text-lg font-semibold">Receipt unavailable</h1>
          <p className="mt-2 text-sm text-[#72747c]">
            This receipt is not available yet or the payment was not successful.
          </p>
          <Link
            href="https://fapshi.com"
            className="checkout-outline-btn mt-6 inline-flex justify-center no-underline"
          >
            Done
          </Link>
        </main>
        <CheckoutFooter />
      </div>
    );
  }

  return (
    <div className="checkout-shell checkout-shell--document checkout-experience flex flex-col bg-white text-[#1a1a1a]">
      <main className="checkout-main mx-auto w-full max-w-[680px] flex-1 px-4 pt-6 sm:px-8">
        <MerchantPaymentReceiptView receipt={receipt} />
      </main>
      <CheckoutFooter />
    </div>
  );
}
