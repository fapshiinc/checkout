import { MerchantReceiptRoute } from "@/lib/merchant-receipt-route";

export default async function MerchantReceiptPage({
  params,
}: {
  params: Promise<{ transferId: string }>;
}) {
  const { transferId } = await params;
  return <MerchantReceiptRoute transferId={transferId} environment="live" />;
}
