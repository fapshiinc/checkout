"use client";

import type { MerchantPaymentReceipt } from "@/lib/merchant-receipt";
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

  const rows: { label: string; value: string }[] = [
    { label: t("receiptTransferId"), value: receipt.transferId },
  ];
  if (receipt.serviceName) {
    rows.push({ label: t("receiptMerchantLabel"), value: receipt.serviceName });
  }
  if (receipt.payerName) {
    rows.push({ label: t("receiptBillTo"), value: receipt.payerName });
  }
  if (receipt.dateConfirmed) {
    rows.push({ label: t("receiptPaidOn"), value: receipt.dateConfirmed });
  } else if (receipt.dateInitiated) {
    rows.push({ label: t("receiptCreated"), value: receipt.dateInitiated });
  }
  if (receipt.medium) {
    rows.push({ label: t("receiptMedium"), value: receipt.medium });
  }
  if (receipt.email) {
    rows.push({ label: t("receiptEmail"), value: receipt.email });
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
        <header className="merchant-receipt__letterhead">
          <Image
            src="/logos/logoBlack.svg"
            alt="Fapshi"
            width={88}
            height={20}
            className="merchant-receipt__logo"
            priority
          />
          <p className="merchant-receipt__doc-title">{t("receiptDocTitle")}</p>
          {receipt.dateInitiated ? (
            <p className="merchant-receipt__issued">
              {t("receiptCreated")}{" "}
              <time dateTime={receipt.dateInitiated}>
                {receipt.dateInitiated}
              </time>
            </p>
          ) : null}
        </header>

        <div className="merchant-receipt__summary">
          <div className="merchant-receipt__summary-main">
            <p className="merchant-receipt__summary-label">{t("receiptTotal")}</p>
            <p className="merchant-receipt__summary-amount">{amountDisplay}</p>
            {receipt.serviceName ? (
              <p className="merchant-receipt__summary-merchant">
                {t("receiptPaidTo", { merchant: receipt.serviceName })}
              </p>
            ) : null}
          </div>
          <span className="merchant-receipt__status">{t("receiptStatusPaid")}</span>
        </div>

        <table className="merchant-receipt__table">
          <caption className="merchant-receipt__table-caption">
            {t("receiptHeading")}
          </caption>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                <td>{row.value}</td>
              </tr>
            ))}
            <tr className="merchant-receipt__table-total">
              <th scope="row">{t("receiptTotal")}</th>
              <td>{amountDisplay}</td>
            </tr>
          </tbody>
        </table>

        <footer className="merchant-receipt__footnote">
          <p>{t("receiptFootnote")}</p>
        </footer>
      </article>
    </div>
  );
}
