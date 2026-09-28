import { MerchantReceiptRoute } from "@/lib/merchant-receipt-route";

export default async function MerchantReceiptPage({
  params,
  searchParams,
}: {
  params: Promise<{ transferId: string }>;
  searchParams: Promise<{ logo?: string }>;
}) {
  const { transferId } = await params;
  const { logo } = await searchParams;
  return (
    <MerchantReceiptRoute
      transferId={transferId}
      environment="live"
      logoHint={logo}
    />
  );
}
