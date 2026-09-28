import { CheckoutFooter } from "@/components/checkout/checkout-footer";
import { Skeleton } from "@/components/ui/skeleton";

/** Mirrors idle-state CheckoutExperience while merchant-link loads. */
export function CheckoutPageSkeleton() {
  return (
    <div
      className="checkout-shell checkout-root flex flex-col bg-[#f6f7f9] text-[#1a1a1a]"
      aria-busy
      aria-label="Loading checkout"
    >
      <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col px-4 pb-4 pt-4">
        <div className="mb-3 flex justify-end">
          <Skeleton className="h-7 w-[4.5rem] rounded-md" />
        </div>

        <div className="overflow-hidden rounded-xl border border-[#eef0f3] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          <div className="flex items-center gap-3 border-b border-[#eef0f3] bg-[#fafbfc] px-5 py-3.5">
            <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-[9rem] max-w-full" />
              <Skeleton className="h-3 w-[6.5rem]" />
            </div>
          </div>

          <div className="border-b border-[#eef0f3] bg-[#fafbfc] px-5 py-5">
            <Skeleton className="mx-auto h-9 w-[10rem]" />
            <Skeleton className="mx-auto mt-3 h-4 w-[12rem]" />
            <Skeleton className="mx-auto mt-3 h-3 w-[5.5rem]" />
          </div>

          <div className="space-y-4 px-5 py-5">
            <div>
              <Skeleton className="mb-1.5 h-4 w-36" />
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="mt-1.5 h-3 w-[14rem]" />
            </div>
            <div>
              <Skeleton className="mb-1.5 h-4 w-24" />
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="mb-1.5 h-4 w-28" />
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
            <Skeleton className="h-[3.25rem] w-full rounded-lg" />
          </div>
        </div>
      </div>

      <CheckoutFooter />
    </div>
  );
}
