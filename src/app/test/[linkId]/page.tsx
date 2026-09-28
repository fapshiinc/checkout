import { MerchantLinkRoute } from "@/lib/merchant-link-route";

/** Sandbox initiate-pay links: checkout.fapshi.com/test/{mongoId} */
export default async function SandboxMerchantCheckoutRoute({
  params,
}: {
  params: Promise<{ linkId: string }>;
}) {
  const { linkId } = await params;
  return <MerchantLinkRoute linkId={linkId} environment="sandbox" />;
}
