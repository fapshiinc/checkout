import { redirect } from "next/navigation";

/** Legacy sandbox links used /test/payment/:id (old-checkout). */
export default async function LegacySandboxCheckoutRedirect({
  params,
}: {
  params: Promise<{ checkoutId: string }>;
}) {
  const { checkoutId } = await params;
  redirect(`/test/${checkoutId}`);
}
