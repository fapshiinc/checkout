export type TransactionStatus =
  | "CREATED"
  | "PENDING"
  | "SUCCESSFUL"
  | "FAILED"
  | "EXPIRED";

export interface TransactionStatusResponse {
  status: TransactionStatus;
  transferId?: string;
  phone?: number | string;
  paid?: number;
  medium?: string;
  requestTime?: string;
  /** Post-payment merchant return URL (when API includes it). */
  redirect?: string | null;
  redirectUrl?: string | null;
}

export interface MerchantCheckoutAppearance {
  title: string;
  message?: string;
  logo?: string;
  primaryColor?: string;
}

export interface MerchantCheckoutSession {
  transferId: string;
  status: string;
  serviceName: string;
  amount: number;
  payerEmail?: string;
  payerName?: string;
  redirect?: string | null;
  successRedirect?: string | null;
  successRedirectUrl?: string | null;
  redirectOnSuccess?: string | null;
  cardAllowed?: boolean;
  message?: string;
  logo?: string;
  createdAt?: string;
  appearance: MerchantCheckoutAppearance;
}

export interface MerchantPayMomoPayload {
  transferId: string;
  phone: string;
  clientName: string;
  email?: string;
}

export interface MerchantPayMomoResponse {
  message?: string;
  transferId?: string;
  medium?: string;
}
