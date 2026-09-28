"use client";

import { cn, resolveImageUrl } from "@/lib/utils";

export function CheckoutBrandHeader({
  displayTitle,
  logoUrl,
  primaryColor,
  secureLabel,
  className,
}: {
  displayTitle: string;
  logoUrl?: string | null;
  primaryColor: string;
  secureLabel: string;
  className?: string;
}) {
  const initial = (displayTitle || "M").slice(0, 1).toUpperCase();
  const resolvedLogo = resolveImageUrl(logoUrl ?? undefined);

  return (
    <header
      className={cn(
        "flex items-center justify-between gap-3 border-b border-[#eef0f3] px-5 py-3.5",
        className
      )}
      style={{
        background: `color-mix(in oklab, ${primaryColor} 3%, white)`,
      }}
    >
      <div className="flex min-w-0 items-center gap-3">
        {resolvedLogo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resolvedLogo}
            alt=""
            className="h-8 max-w-[120px] shrink-0 object-contain object-left"
          />
        ) : (
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold"
            style={{
              color: primaryColor,
              background: `color-mix(in oklab, ${primaryColor} 12%, white)`,
            }}
          >
            {initial}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold leading-tight text-[#1a1a1a]">
            {displayTitle}
          </p>
          <p className="text-[11px] font-medium text-[#72747c]">{secureLabel}</p>
        </div>
      </div>
    </header>
  );
}
