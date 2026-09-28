import { redirect } from "next/navigation";
import { CheckoutLinkError } from "@/components/checkout/checkout-link-error";
import { MerchantCheckoutPage } from "@/components/checkout/merchant-checkout-page";
import {
  fetchMerchantCheckoutSession,
  isValidMerchantCheckoutId,
} from "@/lib/api";
import { isTerminalCheckoutStatus } from "@/lib/checkout-closed-link";

export default async function MerchantCheckoutRoute({
  params,
}: {
  params: Promise<{ linkId: string }>;
}) {
  const { linkId } = await params;

  if (!isValidMerchantCheckoutId(linkId)) {
    return (
      <CheckoutLinkError
        closedReason="unavailable"
        description="This payment link is invalid or unavailable."
      />
    );
  }

  const result = await fetchMerchantCheckoutSession(linkId);

  if (!result.ok) {
    if (result.cardRedirect) {
      redirect(result.cardRedirect);
    }
    return (
      <CheckoutLinkError
        closedReason={result.closedReason ?? "unavailable"}
        description={
          result.message || "This payment link is invalid or unavailable."
        }
        redirectUrl={result.redirect}
      />
    );
  }

  if (isTerminalCheckoutStatus(result.session.status)) {
    if (result.session.status === "SUCCESSFUL") {
      const target =
        result.session.redirect ||
        `/success/${encodeURIComponent(result.session.transferId)}`;
      redirect(target.startsWith("http") ? target : target);
    }
    return (
      <CheckoutLinkError
        closedReason="expired"
        description="This payment link has expired."
        redirectUrl={result.session.redirect ?? undefined}
      />
    );
  }

  return <MerchantCheckoutPage session={result.session} />;
}
