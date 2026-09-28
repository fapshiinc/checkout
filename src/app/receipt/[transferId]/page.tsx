import { generateReceiptMetadata } from "@/lib/generate-receipt-metadata";
import { MerchantReceiptRoute } from "@/lib/merchant-receipt-route";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ transferId: string }>;
  searchParams: Promise<{ merchant?: string }>;
}): Promise<Metadata> {
  const { transferId } = await params;
  const { merchant } = await searchParams;
  return generateReceiptMetadata({
    transferId,
    environment: "live",
    merchantHint: merchant,
  });
}

export default async function MerchantReceiptPage({
  params,
  searchParams,
}: {
  params: Promise<{ transferId: string }>;
  searchParams: Promise<{ logo?: string; merchant?: string }>;
}) {
  const { transferId } = await params;
  const { logo, merchant } = await searchParams;
  return (
    <MerchantReceiptRoute
      transferId={transferId}
      environment="live"
      logoHint={logo}
      merchantHint={merchant}
    />
  );
}
