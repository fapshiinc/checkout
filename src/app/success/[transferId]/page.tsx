import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { CheckoutFooter } from "@/components/checkout/checkout-footer";
import { Button } from "@/components/ui/button";

export default async function CheckoutSuccessPage({
  params,
}: {
  params: Promise<{ transferId: string }>;
}) {
  await params;

  return (
    <div className="checkout-shell checkout-shell--hug checkout-experience flex flex-col bg-[#f6f7f9] text-[#1a1a1a]">
      <main className="mx-auto w-full max-w-[420px] px-4 py-8 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-8 w-8 text-green-600" strokeWidth={2} />
        </div>
        <h1 className="text-2xl font-semibold">Payment successful!</h1>
        <p className="mt-2 text-sm text-[#72747c]">
          Thank you — your payment has been confirmed.
        </p>
        <Button size="lg" className="mt-8" asChild>
          <Link href="https://fapshi.com">Done</Link>
        </Button>
      </main>
      <CheckoutFooter />
    </div>
  );
}
