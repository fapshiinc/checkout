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
  const lineDescription = receipt.serviceName
    ? t("receiptLineItemDesc", { merchant: receipt.serviceName })
    : t("receiptLineItemDefault");

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
        <div className="merchant-receipt__title-row">
          <h1 className="merchant-receipt__title">{t("receiptPageTitle")}</h1>
          <Image
            src="/logos/logoBlack.svg"
            alt="Fapshi"
            width={72}
            height={16}
            className="merchant-receipt__logo"
            priority
          />
        </div>

        <dl className="merchant-receipt__meta">
          <div>
            <dt>{t("receiptNumberLabel")}</dt>
            <dd>{receiptNumber}</dd>
          </div>
          <div>
            <dt>{t("receiptTransferId")}</dt>
            <dd className="merchant-receipt__mono">{receipt.transferId}</dd>
          </div>
          {paidOn ? (
            <div>
              <dt>{t("receiptPaidOn")}</dt>
              <dd>{paidOn}</dd>
            </div>
          ) : null}
        </dl>

        <div className="merchant-receipt__parties">
          <div>
            <h2 className="merchant-receipt__party-heading">
              {t("receiptFromHeading")}
            </h2>
            <p className="merchant-receipt__party-name">{t("receiptFromName")}</p>
            <p className="merchant-receipt__party-line">{t("receiptFromTagline")}</p>
            <p className="merchant-receipt__party-line">fapshi.com</p>
          </div>
          <div>
            <h2 className="merchant-receipt__party-heading">
              {t("receiptBillToHeading")}
            </h2>
            {receipt.payerName ? (
              <p className="merchant-receipt__party-name">{receipt.payerName}</p>
            ) : null}
            {receipt.email ? (
              <p className="merchant-receipt__party-line">{receipt.email}</p>
            ) : null}
            {!receipt.payerName && !receipt.email ? (
              <p className="merchant-receipt__party-line">—</p>
            ) : null}
          </div>
        </div>

        {paidOn ? (
          <p className="merchant-receipt__headline">
            {t("receiptPaidHeadline", { amount: amountDisplay, date: paidOn })}
          </p>
        ) : null}

        <div className="merchant-receipt__table-wrap">
          <table className="merchant-receipt__line-items">
            <thead>
              <tr>
                <th scope="col">{t("receiptColDescription")}</th>
                <th scope="col">{t("receiptColQty")}</th>
                <th scope="col">{t("receiptColUnitPrice")}</th>
                <th scope="col">{t("receiptColAmount")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span className="merchant-receipt__line-primary">
                    {lineDescription}
                  </span>
                </td>
                <td>1</td>
                <td>{amountDisplay}</td>
                <td>{amountDisplay}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="merchant-receipt__totals">
          <dl>
            <div>
              <dt>{t("receiptSubtotal")}</dt>
              <dd>{amountDisplay}</dd>
            </div>
            <div>
              <dt>{t("receiptTotalLabel")}</dt>
              <dd>{amountDisplay}</dd>
            </div>
            <div className="merchant-receipt__totals-paid">
              <dt>{t("receiptAmountPaid")}</dt>
              <dd>{amountDisplay}</dd>
            </div>
          </dl>
        </div>

        <section className="merchant-receipt__history">
          <h3 className="merchant-receipt__history-title">
            {t("receiptPaymentHistory")}
          </h3>
          <table className="merchant-receipt__history-table">
            <thead>
              <tr>
                <th scope="col">{t("receiptMedium")}</th>
                <th scope="col">{t("receiptDateCol")}</th>
                <th scope="col">{t("receiptAmountPaid")}</th>
                <th scope="col">{t("receiptNumberLabel")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{receipt.medium ?? "—"}</td>
                <td>{paidOn ?? "—"}</td>
                <td>{amountDisplay}</td>
                <td>{receiptNumber}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <footer className="merchant-receipt__legal">
          <p>{t("receiptLegalEntity")}</p>
          <p className="merchant-receipt__page">{t("receiptPageOf")}</p>
        </footer>
      </article>
    </div>
  );
}
