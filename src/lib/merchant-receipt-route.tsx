import Link from "next/link";
import { MerchantPaymentReceiptView } from "@/components/checkout/merchant-payment-receipt-view";
import type { CheckoutApiEnvironment } from "@/lib/checkout-api-environment";
import {
  fetchMerchantPaymentReceipt,
  normalizeReceiptLogoHint,
  normalizeReceiptMerchantHint,
  resolveMerchantImageUrl,
  resolveReceiptLogo,
} from "@/lib/merchant-receipt";

export async function MerchantReceiptRoute({
  transferId,
  environment,
  logoHint,
  merchantHint,
}: {
  transferId: string;
  environment: CheckoutApiEnvironment;
  logoHint?: string | null;
  merchantHint?: string | null;
}) {
  const receipt = await fetchMerchantPaymentReceipt(transferId, environment);
  const safeLogoHint = normalizeReceiptLogoHint(logoHint);
  const safeMerchantHint = normalizeReceiptMerchantHint(merchantHint);

  if (!receipt || receipt.status !== "SUCCESSFUL") {
    return (
      <div className="checkout-shell checkout-shell--document checkout-shell--receipt checkout-experience flex flex-col bg-white text-[#1a1a1a]">
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
      </div>
    );
  }

  const logoPath = resolveReceiptLogo(receipt, safeLogoHint);
  const logoUrl = resolveMerchantImageUrl(logoPath, environment);
  const serviceName =
    receipt.serviceName?.trim() || safeMerchantHint || receipt.serviceName;

  return (
    <div className="checkout-shell checkout-shell--document checkout-shell--receipt checkout-experience flex flex-col overflow-x-hidden bg-white text-[#1a1a1a]">
      <main className="checkout-main mx-auto w-full min-w-0 max-w-[720px] flex-1 px-4 pt-6 sm:px-6">
        <MerchantPaymentReceiptView
          receipt={{
            ...receipt,
            serviceName,
            logoUrl,
          }}
          environment={environment}
        />
      </main>
    </div>
  );
}
