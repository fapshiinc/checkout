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
  cardAllowed?: boolean;
  message?: string;
  logo?: string;
  createdAt?: string;
  appearance: MerchantCheckoutAppearance;
}

export interface MerchantPayMomoPayload {
  transferId: string;
  phone: number;
  clientName: string;
  email?: string;
}

export interface MerchantPayMomoResponse {
  message?: string;
  transferId?: string;
  medium?: string;
}
