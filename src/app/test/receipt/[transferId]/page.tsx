import { MerchantReceiptRoute } from "@/lib/merchant-receipt-route";

export default async function SandboxMerchantReceiptPage({
  params,
}: {
  params: Promise<{ transferId: string }>;
}) {
  const { transferId } = await params;
  return <MerchantReceiptRoute transferId={transferId} environment="sandbox" />;
}
