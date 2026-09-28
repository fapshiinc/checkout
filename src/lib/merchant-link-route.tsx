import { redirect } from "next/navigation";
import { CheckoutLinkError } from "@/components/checkout/checkout-link-error";
import { MerchantCheckoutPage } from "@/components/checkout/merchant-checkout-page";
import type { CheckoutApiEnvironment } from "@/lib/checkout-api-environment";
import { defaultSuccessPath } from "@/lib/checkout-api-environment";
import { resolveMerchantSuccessRedirect } from "@/lib/merchant-redirect";
import {
  fetchMerchantCheckoutSession,
  isValidMerchantCheckoutId,
} from "@/lib/api";
import { isTerminalCheckoutStatus } from "@/lib/checkout-closed-link";

export async function MerchantLinkRoute({
  linkId,
  environment,
}: {
  linkId: string;
  environment: CheckoutApiEnvironment;
}) {
  if (!isValidMerchantCheckoutId(linkId)) {
    return (
      <CheckoutLinkError
        closedReason="unavailable"
        description="This payment link is invalid or unavailable."
      />
    );
  }

  const result = await fetchMerchantCheckoutSession(linkId, environment);

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
      const merchantSuccess = resolveMerchantSuccessRedirect(
        result.session,
        result.session.transferId
      );
      const target =
        merchantSuccess ||
        defaultSuccessPath(result.session.transferId, environment);
      redirect(target);
    }
    return (
      <CheckoutLinkError
        closedReason="expired"
        description="This payment link has expired."
        redirectUrl={result.session.redirect ?? undefined}
      />
    );
  }

  return (
    <MerchantCheckoutPage session={result.session} apiEnvironment={environment} />
  );
}
