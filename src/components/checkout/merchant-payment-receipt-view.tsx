"use client";

import type { MerchantPaymentReceipt } from "@/lib/merchant-receipt";
import {
  formatReceiptNumber,
  formatReceiptPaidDate,
} from "@/lib/receipt-format";
import { useLocale, useTranslations } from "@/lib/translations";
import { formatAmount } from "@/lib/utils";
import Image from "next/image";

export function MerchantPaymentReceiptView({
  receipt,
}: {
  receipt: MerchantPaymentReceipt;
}) {
  const t = useTranslations("merchantCheckout");
  const { locale } = useLocale();

  const amountDisplay =
    receipt.amount != null ? formatAmount(receipt.amount, locale) : "—";
  const paidOn =
    formatReceiptPaidDate(receipt.dateConfirmed, locale) ??
    formatReceiptPaidDate(receipt.dateInitiated, locale);
  const receiptNumber = formatReceiptNumber(receipt.transferId);
  const merchantName =
    receipt.serviceName?.trim() || t("receiptMerchantFallback");

  const detailRows: { label: string; value: string }[] = [
    { label: t("receiptNumberLabel"), value: receiptNumber },
    { label: t("receiptTransferId"), value: receipt.transferId },
  ];
  if (paidOn) {
    detailRows.push({ label: t("receiptPaidOn"), value: paidOn });
  }
  if (receipt.medium) {
    detailRows.push({ label: t("receiptMedium"), value: receipt.medium });
  }
  if (receipt.payerName) {
    detailRows.push({ label: t("receiptPaidBy"), value: receipt.payerName });
  }
  if (receipt.email) {
    detailRows.push({ label: t("receiptEmail"), value: receipt.email });
  }

  return (
    <div className="merchant-receipt">
      <div className="merchant-receipt__actions no-print">
        <button
          type="button"
          className="merchant-receipt__print"
          onClick={() => window.print()}
        >
          {t("printReceipt")}
        </button>
      </div>

      <article className="merchant-receipt__sheet">
        <header className="merchant-receipt__header">
          <div className="merchant-receipt__title-row">
            <h1 className="merchant-receipt__title">{t("receiptPageTitle")}</h1>
            <Image
              src="/logos/logoBlack.svg"
              alt="Fapshi"
              width={88}
              height={20}
              className="merchant-receipt__logo"
              priority
            />
          </div>

          <div className="merchant-receipt__parties">
            <div>
              <h2 className="merchant-receipt__party-heading">
                {t("receiptFromHeading")}
              </h2>
              <p className="merchant-receipt__party-name">{merchantName}</p>
            </div>
            <div>
              <h2 className="merchant-receipt__party-heading">
                {t("receiptBillToHeading")}
              </h2>
              {receipt.payerName ? (
                <p className="merchant-receipt__party-name">
                  {receipt.payerName}
                </p>
              ) : null}
              {receipt.email ? (
                <p className="merchant-receipt__party-line">{receipt.email}</p>
              ) : null}
              {!receipt.payerName && !receipt.email ? (
                <p className="merchant-receipt__party-line">—</p>
              ) : null}
            </div>
          </div>
        </header>

        <div className="merchant-receipt__summary">
          <div className="merchant-receipt__summary-main">
            {paidOn ? (
              <p className="merchant-receipt__headline">
                {t("receiptPaidHeadline", {
                  amount: amountDisplay,
                  date: paidOn,
                })}
              </p>
            ) : (
              <p className="merchant-receipt__summary-amount">
                {amountDisplay}
              </p>
            )}
            <p className="merchant-receipt__summary-merchant">
              {t("receiptPaidTo", { merchant: merchantName })}
            </p>
          </div>
          <span className="merchant-receipt__status">
            {t("receiptStatusPaid")}
          </span>
        </div>

        <section className="merchant-receipt__details">
          <h2 className="merchant-receipt__details-title">
            {t("receiptHeading")}
          </h2>
          <dl className="merchant-receipt__details-list">
            {detailRows.map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
            <div className="merchant-receipt__details-total">
              <dt>{t("receiptTotal")}</dt>
              <dd>{amountDisplay}</dd>
            </div>
          </dl>
        </section>

        <footer className="merchant-receipt__footnote">
          <p>{t("receiptFootnote", { merchant: merchantName })}</p>
        </footer>
      </article>
    </div>
  );
}
