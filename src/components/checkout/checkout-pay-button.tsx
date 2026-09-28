"use client";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type { CSSProperties, ReactNode } from "react";

export function CheckoutPayButton({
  children,
  loading = false,
  loadingLabel,
  disabled,
  onClick,
  style,
  className,
  type = "button",
}: {
  children: ReactNode;
  loading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
  className?: string;
  type?: "button" | "submit";
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={cn("checkout-pay-minimal w-full", className)}
      style={disabled && !loading ? undefined : style}
      aria-busy={loading}
    >
      {loading ? (
        <>
          <Spinner size="sm" className="text-white" label={loadingLabel ?? ""} />
          <span>{loadingLabel ?? children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
