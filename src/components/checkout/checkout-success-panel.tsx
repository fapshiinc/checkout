"use client";

import type { CSSProperties } from "react";
import { useTranslations } from "@/lib/translations";

export interface CheckoutSuccessPanelProps {
  firstName: string;
  amountLabel: string;
  merchantName: string;
  email: string;
  merchantReturnUrl?: string | null;
  redirectHost?: string;
  redirectCountdown?: number;
  payButtonStyle?: CSSProperties;
  onDone?: () => void;
}

export function CheckoutSuccessPanel({
  firstName,
  amountLabel,
  merchantName,
  email,
  merchantReturnUrl,
  redirectHost,
  redirectCountdown = 0,
  payButtonStyle,
  onDone,
}: CheckoutSuccessPanelProps) {
  const t = useTranslations("merchantCheckout");

  return (
    <section className="checkout-success checkout-phase-enter">
      <div className="checkout-success__hero">
        <div className="checkout-success__icon" aria-hidden>
          <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
            <circle cx="12" cy="12" r="10" className="stroke-[#22c55e]" strokeWidth="1.5" />
            <path
              d="M8 12.5l2.5 2.5L16 9.5"
              className="stroke-[#16a34a]"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="checkout-success__title">{t("successTitle")}</h2>
        <p className="checkout-success__greeting">
          {t("successHeading", { name: firstName })}
        </p>
      </div>

      <dl className="checkout-success__receipt">
        <div className="checkout-success__row">
          <dt>{t("successAmountLabel")}</dt>
          <dd>{amountLabel}</dd>
        </div>
        <div className="checkout-success__row">
          <dt>{t("successMerchantLabel")}</dt>
          <dd className="truncate text-right">{merchantName}</dd>
        </div>
        <div className="checkout-success__row checkout-success__row--last">
          <dt>{t("successEmailLabel")}</dt>
          <dd className="truncate text-right">{email}</dd>
        </div>
      </dl>

      <div className="checkout-success__actions">
        {merchantReturnUrl ? (
          <>
            <a
              href={merchantReturnUrl}
              className="checkout-success__primary block no-underline"
              style={payButtonStyle}
            >
              {redirectCountdown > 0
                ? t("returnMerchantCountdown", { seconds: redirectCountdown })
                : t("returnMerchant")}
            </a>
            {redirectHost ? (
              <p className="checkout-success__redirect-hint">
                {t("redirectingTo", { host: redirectHost })}
              </p>
            ) : null}
          </>
        ) : (
          <button
            type="button"
            onClick={onDone}
            className="checkout-success__secondary w-full"
          >
            {t("done")}
          </button>
        )}
      </div>
    </section>
  );
}
