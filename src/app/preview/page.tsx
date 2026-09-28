import { Suspense } from "react";
import { CheckoutDashboardPreview } from "@/components/checkout/checkout-dashboard-preview";

export default function CheckoutPreviewPage() {
  return (
    <div className="checkout-root min-h-[100dvh] bg-[#f6f7f9]">
      <Suspense
        fallback={
          <div className="flex min-h-[480px] items-center justify-center text-sm text-[#72747c]">
            Loading preview…
          </div>
        }
      >
        <CheckoutDashboardPreview />
      </Suspense>
    </div>
  );
}
