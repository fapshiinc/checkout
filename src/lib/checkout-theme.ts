/** Fapshi blue — matches design handoff default */
export const DEFAULT_CHECKOUT_PRIMARY = "oklch(0.52 0.19 262)";

export function resolveCheckoutPrimary(color?: string | null): string {
  const trimmed = color?.trim();
  if (!trimmed) return DEFAULT_CHECKOUT_PRIMARY;
  return trimmed;
}
