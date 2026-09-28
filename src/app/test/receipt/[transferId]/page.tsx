import { MerchantReceiptRoute } from "@/lib/merchant-receipt-route";

export default async function SandboxMerchantReceiptPage({
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
      environment="sandbox"
      logoHint={logo}
      merchantHint={merchant}
    />
  );
}
