import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { CheckoutFooter } from "@/components/checkout/checkout-footer";
import { Button } from "@/components/ui/button";

export default async function CheckoutSuccessPage({
  params,
}: {
  params: Promise<{ transferId: string }>;
}) {
  const { transferId } = await params;

  return (
    <div className="checkout-experience flex min-h-screen flex-col bg-[#f6f7f9] text-[#1a1a1a]">
      <main className="mx-auto flex w-full max-w-[420px] flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-8 w-8 text-green-600" strokeWidth={2} />
        </div>
        <h1 className="text-2xl font-semibold">Payment successful!</h1>
        <p className="mt-2 text-sm text-[#72747c]">
          Thank you — your payment has been confirmed.
        </p>
        <p className="mt-4 text-sm">
          Transaction ID:{" "}
          <span className="font-mono font-medium">{transferId}</span>
        </p>
        <Button size="lg" className="mt-8" asChild>
          <Link href="https://fapshi.com">Done</Link>
        </Button>
      </main>
      <CheckoutFooter />
    </div>
  );
}
