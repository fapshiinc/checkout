const RECEIPT_LOGO_KEY_PREFIX = "checkout-receipt-logo:";

export function stashReceiptLogo(transferId: string, logo: string | undefined) {
  if (typeof window === "undefined" || !logo?.trim()) return;
  try {
    sessionStorage.setItem(
      `${RECEIPT_LOGO_KEY_PREFIX}${transferId}`,
      logo.trim()
    );
  } catch {
    /* ignore quota / private mode */
  }
}

export function readStashedReceiptLogo(
  transferId: string
): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    return sessionStorage.getItem(`${RECEIPT_LOGO_KEY_PREFIX}${transferId}`) ?? undefined;
  } catch {
    return undefined;
  }
}
