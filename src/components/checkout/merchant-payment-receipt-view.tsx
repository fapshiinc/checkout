"use client";

import type { MerchantPaymentReceipt } from "@/lib/merchant-receipt";
import { useTranslations } from "@/lib/translations";

export function MerchantPaymentReceiptView({
  receipt,
}: {
  receipt: MerchantPaymentReceipt;
}) {
  const t = useTranslations("merchantCheckout");

  return (
    <div className="merchant-receipt">
      <header className="merchant-receipt__toolbar no-print">
        <p className="merchant-receipt__brand">{t("receiptTitle")}</p>
        <button
          type="button"
          className="merchant-receipt__print"
          onClick={() => window.print()}
        >
          {t("printReceipt")}
        </button>
      </header>
      <article className="merchant-receipt__body">
        <h1 className="merchant-receipt__heading">{t("receiptHeading")}</h1>
        {receipt.dateInitiated ? (
          <p className="merchant-receipt__meta">
            {t("receiptCreated")}{" "}
            <span>{receipt.dateInitiated}</span>
          </p>
        ) : null}
        {receipt.payerName ? (
          <p className="merchant-receipt__dear">
            {t("receiptDear", { name: receipt.payerName })}
          </p>
        ) : null}
        <p className="merchant-receipt__intro">
          {t("receiptIntro", {
            amount: receipt.amount ?? "—",
            merchant: receipt.serviceName ?? "—",
          })}
        </p>
        <dl className="merchant-receipt__details">
          <div>
            <dt>{t("receiptTransferId")}</dt>
            <dd>{receipt.transferId}</dd>
          </div>
          {receipt.dateConfirmed ? (
            <div>
              <dt>{t("receiptPaidOn")}</dt>
              <dd>{receipt.dateConfirmed}</dd>
            </div>
          ) : null}
          {receipt.medium ? (
            <div>
              <dt>{t("receiptMedium")}</dt>
              <dd>{receipt.medium}</dd>
            </div>
          ) : null}
          {receipt.email ? (
            <div>
              <dt>{t("receiptEmail")}</dt>
              <dd>{receipt.email}</dd>
            </div>
          ) : null}
          <div>
            <dt>{t("receiptTotal")}</dt>
            <dd>
              {receipt.amount != null ? `${receipt.amount} XAF` : "—"}
            </dd>
          </div>
        </dl>
      </article>
    </div>
  );
}
