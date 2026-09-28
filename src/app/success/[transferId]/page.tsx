import Link from "next/link";
import { CheckoutFooter } from "@/components/checkout/checkout-footer";

export default async function CheckoutSuccessPage({
  params,
}: {
  params: Promise<{ transferId: string }>;
}) {
  await params;

  return (
    <div className="checkout-shell checkout-shell--hug checkout-experience flex flex-col bg-[#f6f7f9] text-[#1a1a1a]">
      <div className="checkout-shell__stack w-full">
        <main className="mx-auto w-full max-w-[420px] px-4 py-6">
          <div className="overflow-hidden rounded-xl border border-[#eef0f3] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <section className="checkout-success checkout-phase-enter">
              <div className="checkout-success__hero">
                <div className="checkout-success__icon" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      className="stroke-[#22c55e]"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M8 12.5l2.5 2.5L16 9.5"
                      className="stroke-[#16a34a]"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h1 className="checkout-success__title">Thanks for your payment</h1>
                <p className="checkout-success__greeting">
                  Your payment has been confirmed.
                </p>
              </div>
              <div className="checkout-success__actions">
                <Link
                  href="https://fapshi.com"
                  className="checkout-success__secondary block no-underline"
                >
                  Done
                </Link>
              </div>
            </section>
          </div>
        </main>
        <CheckoutFooter />
      </div>
    </div>
  );
}
