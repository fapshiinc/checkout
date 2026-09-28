import { MerchantLinkRoute } from "@/lib/merchant-link-route";

export default async function MerchantCheckoutRoute({
  params,
}: {
  params: Promise<{ linkId: string }>;
}) {
  const { linkId } = await params;
  return <MerchantLinkRoute linkId={linkId} environment="live" />;
}
