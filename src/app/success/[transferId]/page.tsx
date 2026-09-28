import Link from "next/link";
import { CheckoutFooter } from "@/components/checkout/checkout-footer";
import { CheckoutStatusIcon } from "@/components/checkout/checkout-status-icon";
import { CheckoutTerminalPageMark } from "@/components/checkout/checkout-terminal-page-mark";

export default async function CheckoutSuccessPage({
  params,
}: {
  params: Promise<{ transferId: string }>;
}) {
  await params;

  return (
    <div className="checkout-shell checkout-shell--hug checkout-experience flex flex-col bg-[#f6f7f9] text-[#1a1a1a]">
      <CheckoutTerminalPageMark />
      <div className="checkout-shell__stack w-full">
        <main className="mx-auto w-full max-w-[420px] px-4 pb-4 pt-4">
          <div className="overflow-hidden rounded-xl border border-[#eef0f3] bg-white px-5 py-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <CheckoutStatusIcon variant="success" />
            <p className="mt-4 text-base font-semibold text-emerald-700">
              Payment successful
            </p>
            <h1 className="mt-2 text-xl font-semibold">Thank you!</h1>
            <p className="mt-2 text-sm text-[#72747c]">
              Your payment has been confirmed.
            </p>
            <Link
              href="https://fapshi.com"
              className="checkout-outline-btn mt-6 inline-flex w-full justify-center no-underline"
            >
              Done
            </Link>
          </div>
        </main>
        <CheckoutFooter />
      </div>
    </div>
  );
}
