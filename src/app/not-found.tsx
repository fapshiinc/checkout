import Link from "next/link";
import { CheckoutFooter } from "@/components/checkout/checkout-footer";

export default function NotFound() {
  return (
    <div className="checkout-shell checkout-experience flex flex-col bg-[#f6f7f9] text-[#1a1a1a]">
      <main className="mx-auto flex w-full max-w-[420px] flex-1 flex-col items-center justify-center px-4 py-8 text-center">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 max-w-sm text-sm text-[#72747c]">
          This payment link may be invalid or no longer available.
        </p>
        <Link
          href="https://fapshi.com"
          className="checkout-pay-minimal mt-8 inline-flex h-11 items-center justify-center px-5 text-sm font-semibold no-underline"
        >
          Go to Fapshi
        </Link>
      </main>
      <CheckoutFooter />
    </div>
  );
}
