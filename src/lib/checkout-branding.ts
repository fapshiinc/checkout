import type { MerchantCheckoutAppearance } from "./types";
import { resolveCheckoutPrimary } from "./checkout-theme";

export function applyCheckoutBranding(
  appearance?: MerchantCheckoutAppearance | null
): () => void {
  const root = document.documentElement;
  const previousPrimary = root.style.getPropertyValue("--checkout-primary");
  const previousAppPrimary = root.style.getPropertyValue("--primary");

  const color = resolveCheckoutPrimary(appearance?.primaryColor);
  root.style.setProperty("--checkout-primary", color);
  root.style.setProperty("--primary", color);
  root.style.setProperty("--store-cta", color);

  return () => {
    if (previousPrimary) root.style.setProperty("--checkout-primary", previousPrimary);
    else root.style.removeProperty("--checkout-primary");
    if (previousAppPrimary) root.style.setProperty("--primary", previousAppPrimary);
    else root.style.removeProperty("--primary");
    root.style.removeProperty("--store-cta");
  };
}
