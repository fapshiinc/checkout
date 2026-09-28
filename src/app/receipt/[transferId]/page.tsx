import { MerchantReceiptRoute } from "@/lib/merchant-receipt-route";

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
