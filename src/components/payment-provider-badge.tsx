import { cn } from "@/lib/utils";

const PROVIDERS = {
  mtn: {
    logo: "/momo-logo.png",
    alt: "MTN MoMo",
  },
  orange: {
    logo: "/om-logo.png",
    alt: "Orange Money",
  },
} as const;

export function PaymentProviderBadge({
  provider,
  label,
  size = "md",
  className,
}: {
  provider: "mtn" | "orange";
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const { logo, alt } = PROVIDERS[provider];
  const iconSize =
    size === "sm" ? "h-7 w-7" : size === "lg" ? "h-11 w-11" : "h-9 w-9";

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo}
        alt={alt}
        className={cn(iconSize, "shrink-0 rounded-md object-contain")}
      />
      {label ? (
        <span className="text-sm font-medium text-foreground">{label}</span>
      ) : null}
    </div>
  );
}
