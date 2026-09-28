import { redirect } from "next/navigation";

/** Legacy initiate-pay links used /payment/:id — keep a permanent redirect to /:id */
export default async function LegacyCheckoutPaymentRedirect({
  params,
}: {
  params: Promise<{ checkoutId: string }>;
}) {
  const { checkoutId } = await params;
  redirect(`/${checkoutId}`);
}
