"use client";

export function CheckoutInlineAlert({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss?: () => void;
}) {
  return (
    <div
      role="alert"
      className="fixed bottom-24 left-4 right-4 z-50 cursor-pointer rounded-lg border border-[#f0d4d2] bg-[#fff5f5] px-4 py-3 text-sm font-medium text-[#46505F] shadow-lg transition-opacity hover:opacity-95 sm:left-auto sm:right-4 sm:max-w-sm"
      onClick={onDismiss}
      onKeyDown={(e) => {
        if (onDismiss && (e.key === "Enter" || e.key === " ")) onDismiss();
      }}
      tabIndex={onDismiss ? 0 : undefined}
    >
      {message}
    </div>
  );
}
