import { cn } from "@/lib/utils";

export function CheckoutStatusIcon({
  variant,
}: {
  variant: "success" | "error";
}) {
  const isSuccess = variant === "success";

  return (
    <div
      className={cn(
        "mx-auto flex h-11 w-11 items-center justify-center rounded-full",
        isSuccess ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
      )}
      aria-hidden
    >
      {isSuccess ? (
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      )}
    </div>
  );
}
