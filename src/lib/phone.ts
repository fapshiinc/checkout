export function normalizeCameroonPhone(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("237")) {
    digits = digits.slice(3);
  }
  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  return digits.slice(0, 9);
}

/** Use for controlled checkout/product phone inputs. */
export function formatCheckoutPhoneInput(raw: string): string {
  return normalizeCameroonPhone(raw);
}

export function isMTNPhone(p: string | number): boolean {
  if (p === "" || p === null || p === undefined) return false;
  return /^[6](7[\d]{7}|(5[0-4]|8[0-3])[\d]{6})$/.test(String(p));
}

export function isOrangePhone(p: string | number): boolean {
  if (p === "" || p === null || p === undefined) return false;
  return /^[6](9[\d]{7}|(8[6-9]|5[5-9])[\d]{6}|40[\d]{6})$/.test(String(p));
}

export function getMobileMoneyProvider(
  raw: string
): "mtn" | "orange" | null {
  const phone = normalizeCameroonPhone(raw);
  if (isMTNPhone(phone)) return "mtn";
  if (isOrangePhone(phone)) return "orange";
  return null;
}

export function isValidPayerPhone(raw: string): boolean {
  return getMobileMoneyProvider(raw) !== null;
}

/** 9-digit Cameroon MSISDN as integer for order/payment APIs */
export function toPaymentPhone(raw: string): number {
  return parseInt(normalizeCameroonPhone(raw), 10);
}
