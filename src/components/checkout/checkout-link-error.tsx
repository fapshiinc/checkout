"use client";

import { CheckoutBackLink } from "@/components/checkout/checkout-back-link";
import { CheckoutStatusIcon } from "@/components/checkout/checkout-status-icon";
import { CheckoutFooter } from "@/components/checkout/checkout-footer";
import type { CheckoutClosedReason } from "@/lib/checkout-closed-link";
import {
  parseWebBackUrl,
  webBackUrlHost,
} from "@/lib/checkout-back-url";
import { useTranslations } from "@/lib/translations";

export function CheckoutLinkError({
  closedReason = "unavailable",
  description,
  redirectUrl,
}: {
  closedReason?: CheckoutClosedReason;
  description: string;
  redirectUrl?: string;
}) {
  const t = useTranslations("merchantCheckout");
  const webBack = parseWebBackUrl(redirectUrl);

  const paid = closedReason === "paid";
  const expired = closedReason === "expired";

  const title = paid
    ? t("linkAlreadyPaidTitle")
    : expired
      ? t("linkExpiredTitle")
      : t("linkUnavailableTitle");

  const help = paid
    ? t("linkAlreadyPaidHelp")
    : expired
      ? t("linkExpiredHelp")
      : t("linkUnavailableHelp");

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f7f9] px-4 pb-32 pt-6 text-[#1a1a1a]">
      <div className="mx-auto w-full max-w-[420px]">
        {webBack ? (
          <CheckoutBackLink
            href={webBack.href}
            label={t("backTo", { host: webBackUrlHost(webBack) })}
          />
        ) : null}
        <div className="checkout-phase-enter mt-10 text-center">
          <CheckoutStatusIcon variant={paid ? "success" : "error"} />
          <h1 className="mt-4 text-xl font-semibold">{title}</h1>
          <p className="mt-3 text-sm text-[#72747c]">{description}</p>
          <p className="mt-2 text-sm text-[#8b8b95]">{help}</p>
          {webBack ? (
            <a
              href={webBack.href}
              className="checkout-pay-minimal mt-6 inline-flex w-full items-center justify-center no-underline"
            >
              {t("returnMerchant")}
            </a>
          ) : null}
        </div>
      </div>
      <CheckoutFooter />
    </div>
  );
}
