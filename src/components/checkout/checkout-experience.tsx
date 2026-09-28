"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { CheckoutBackLink } from "@/components/checkout/checkout-back-link";
import { CheckoutBrandHeader } from "@/components/checkout/checkout-brand-header";
import { CheckoutFooter } from "@/components/checkout/checkout-footer";
import { CheckoutPayButton } from "@/components/checkout/checkout-pay-button";
import { CheckoutStatusIcon } from "@/components/checkout/checkout-status-icon";
import { formatCheckoutAmountValue } from "@/components/checkout/checkout-summary";
import { PaymentProviderBadge } from "@/components/payment-provider-badge";
import { Spinner } from "@/components/ui/spinner";
import {
  parseWebBackUrl,
  webBackUrlHost,
} from "@/lib/checkout-back-url";
import { checkoutPayButtonStyle } from "@/lib/checkout-button-style";
import {
  isCheckoutFormReady,
  resolveCheckoutFormMode,
} from "@/lib/checkout-form-mode";
import {
  formatCheckoutPhoneInput,
  getMobileMoneyProvider,
} from "@/lib/phone";
import { useLocale, useTranslations, type Locale } from "@/lib/translations";
import type { MerchantCheckoutAppearance } from "@/lib/types";
import { cn } from "@/lib/utils";

export type CheckoutPhase =
  | "idle"
  | "initiating"
  | "sms"
  | "prompt"
  | "success"
  | "failed";

function formatAmountPlain(amount: number, locale: Locale): string {
  return (
    new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", {
      maximumFractionDigits: 0,
    }).format(amount) + " XAF"
  );
}

function maskPhone(digits: string): string {
  if (digits.length >= 9) {
    return `+237 ${digits.slice(0, 3)} ** ** ${digits.slice(-2)}`;
  }
  return "+237 …";
}

function ussdCode(provider: "mtn" | "orange" | null): string {
  return provider === "orange" ? "#150*50#" : "*126#";
}

export interface CheckoutExperienceProps {
  appearance: MerchantCheckoutAppearance;
  primaryColor: string;
  environment?: "sandbox" | "live";
  amount: number;
  displayTitle: string;
  message?: string;
  payerEmail?: string;
  payerName?: string;
  redirectUrl?: string | null;
  createdAt?: string;
  cardAllowed?: boolean;
  phase: CheckoutPhase;
  name: string;
  email: string;
  phone: string;
  smsCode: string;
  redirectCountdown: number;
  pollWalletLabel?: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onSmsCodeChange: (value: string) => void;
  onPay: () => void;
  onCancel: () => void;
  onSmsSubmit: () => void;
  onConfirmed: () => void;
  onReset: () => void;
  onPayWithCard?: () => void;
  cardLoading?: boolean;
  smsSubmitting?: boolean;
  confirmChecking?: boolean;
  showLocaleToggle?: boolean;
  /** Dashboard embed: same UI, no payment actions. */
  previewMode?: boolean;
  /** iframe embed: avoid min-h-screen clipping. */
  embed?: boolean;
}

export function CheckoutExperience({
  appearance,
  primaryColor,
  environment = "live",
  amount,
  displayTitle,
  message,
  payerEmail,
  payerName,
  redirectUrl,
  phase,
  name,
  email,
  phone,
  smsCode,
  redirectCountdown,
  pollWalletLabel,
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onSmsCodeChange,
  onPay,
  onCancel,
  onSmsSubmit,
  onConfirmed,
  onReset,
  onPayWithCard,
  cardLoading,
  smsSubmitting = false,
  confirmChecking = false,
  showLocaleToggle = true,
  previewMode = false,
  embed = false,
}: CheckoutExperienceProps) {
  const t = useTranslations("merchantCheckout");
  const { locale: activeLocale, setLocale } = useLocale();
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const isSandbox = environment === "sandbox";
  const payButtonBg = appearance.primaryColor?.trim() ? primaryColor : "#111111";
  const payBtnStyle = checkoutPayButtonStyle(payButtonBg);

  const formMode = resolveCheckoutFormMode({ payerEmail, payerName });
  const emailLocked = !!payerEmail?.trim();
  const nameLocked = !!payerName?.trim();
  const effectiveEmail = emailLocked ? payerEmail!.trim() : email.trim();
  const effectiveName = nameLocked ? payerName!.trim() : name.trim();

  const digits = formatCheckoutPhoneInput(phone);
  const provider = getMobileMoneyProvider(digits);
  const phoneComplete = digits.length === 9;
  const unknownNum = phoneComplete && !provider;

  const emailTrimmed = effectiveEmail.trim();
  const emailFormatOk =
    emailTrimmed.length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed);

  const ready = isCheckoutFormReady({
    email: effectiveEmail,
    phoneDigits: digits,
    phoneValid: !!provider,
  });

  const walletName =
    provider === "orange"
      ? t("walletOrange")
      : provider === "mtn"
        ? t("walletMtn")
        : "mobile money";

  const masked = maskPhone(digits);
  const amountValue = formatCheckoutAmountValue(amount, activeLocale);
  const amountLabel = formatAmountPlain(amount, activeLocale);

  const payLabel = ready
    ? t("payNow")
    : !emailTrimmed || !emailFormatOk
      ? t("payEnterEmail")
      : unknownNum
        ? t("phoneUnknown")
        : t("payEnterPhone");

  const firstName =
    effectiveName.split(/\s+/)[0] || (activeLocale === "fr" ? "à vous" : "friend");

  const redirectHost = redirectUrl
    ? redirectUrl.replace(/^https?:\/\//, "").split("/")[0]
    : "";

  const webBack = parseWebBackUrl(redirectUrl);
  const showMerchantBack = !!webBack && phase !== "success";

  useEffect(() => {
    if (phase === "idle") {
      phoneInputRef.current?.focus();
    }
  }, [phase]);

  const showSummary =
    phase === "idle" || phase === "initiating" || phase === "sms";

  const hugFooter = phase === "success" || phase === "failed";

  return (
    <div
      className={cn(
        "checkout-shell checkout-experience flex flex-col bg-[#f6f7f9] font-sans text-[#1a1a1a]",
        !hugFooter && "min-h-[100dvh]",
        hugFooter && "checkout-shell--hug"
      )}
      style={{ ["--checkout-primary" as string]: payButtonBg }}
    >
      {isSandbox ? (
        <p className="bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-900/80">
          {t("sandbox")} — {t("sandboxNote")}
        </p>
      ) : null}

      <div
        className={cn(
          "flex w-full flex-col",
          hugFooter
            ? "checkout-shell__stack shrink-0"
            : "min-h-0 flex-1"
        )}
      >
        <div
          className={cn(
            "mx-auto flex w-full max-w-[420px] flex-col px-4 pt-4",
            hugFooter ? "pb-0" : "flex-1 pb-4"
          )}
        >
        {showMerchantBack || showLocaleToggle ? (
          <div className="mb-3 flex items-center justify-between gap-3">
            {showMerchantBack && webBack ? (
              <CheckoutBackLink
                href={webBack.href}
                label={t("backTo", { host: webBackUrlHost(webBack) })}
              />
            ) : (
              <span aria-hidden className="shrink-0" />
            )}
            {showLocaleToggle ? (
              <div className="ml-auto inline-flex rounded-md border border-[#e5e7eb] bg-white p-0.5 text-xs font-semibold">
                {(["en", "fr"] as const).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setLocale(code)}
                    className={cn(
                      "rounded px-2.5 py-1 uppercase",
                      activeLocale === code
                        ? "bg-[#111] text-white"
                        : "text-[#72747c]"
                    )}
                  >
                    {code}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="overflow-hidden rounded-xl border border-[#eef0f3] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          <CheckoutBrandHeader
            displayTitle={displayTitle}
            logoUrl={appearance.logo}
            primaryColor={payButtonBg}
            secureLabel={t("secureCheckout")}
          />

          {showSummary ? (
            <div
              className="border-b border-[#eef0f3] px-5 py-5 text-center"
              style={{
                background: `color-mix(in oklab, ${payButtonBg} 4%, white)`,
              }}
            >
              <p className="text-[1.75rem] font-semibold leading-none tracking-tight tabular-nums sm:text-[2rem]">
                <span className="text-base font-medium text-[#72747c]">FCFA </span>
                {amountValue}
              </p>
              <p className="mt-2 text-sm text-[#72747c]">
                {t("paymentTo", { name: displayTitle })}
              </p>
              {message?.trim() ? (
                <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[#46505F]">
                  {message.trim()}
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="px-5 py-5">
            {phase === "initiating" && (
              <div className="checkout-phase-enter flex flex-col items-center gap-3 py-8 text-center">
                <Spinner size="lg" className="text-[#72747c]" label={t("initiating")} />
                <p className="text-sm font-semibold text-[#1a1a1a]">{t("initiating")}</p>
                <p className="max-w-xs text-sm text-[#72747c]">
                  {t("initiatingNote", {
                    amount: amountLabel,
                    phone: masked,
                  })}
                </p>
              </div>
            )}

            {phase === "idle" && (
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (previewMode) return;
                  if (ready) onPay();
                }}
              >
                <Field label={t("emailLabel")}>
                  <input
                    type="email"
                    placeholder={t("emailPh")}
                    value={emailLocked ? effectiveEmail : email}
                    onChange={(e) => onEmailChange(e.target.value)}
                    className={cn(
                      "checkout-field",
                      emailLocked && "checkout-field--locked"
                    )}
                    autoComplete="email"
                    readOnly={emailLocked}
                    required
                  />
                  {emailLocked ? (
                    <p className="mt-1.5 text-xs text-[#72747c]">
                      {t("providedByMerchant")}
                    </p>
                  ) : null}
                </Field>

                <Field label={t("nameOptional")}>
                  <input
                    type="text"
                    placeholder={t("namePh")}
                    value={nameLocked ? effectiveName : name}
                    onChange={(e) => onNameChange(e.target.value)}
                    className={cn(
                      "checkout-field",
                      nameLocked && "checkout-field--locked"
                    )}
                    autoComplete="name"
                    readOnly={nameLocked}
                  />
                  {nameLocked ? (
                    <p className="mt-1.5 text-xs text-[#72747c]">
                      {t("providedByMerchant")}
                    </p>
                  ) : null}
                </Field>

                <Field
                  label={
                    formMode === "phone_only"
                      ? t("phoneOnlyLabel")
                      : t("phoneLabel")
                  }
                >
                  <div
                    className={cn(
                      "checkout-phone-row flex h-11 overflow-hidden rounded-lg border bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)]",
                      unknownNum ? "border-[#eb6558]" : "border-[#d6d8dd]"
                    )}
                  >
                    <span className="flex h-full items-center border-r border-[#d6d8dd] bg-[#fafbfc] px-3 text-sm font-semibold text-[#72747c]">
                      +237
                    </span>
                    <input
                      ref={phoneInputRef}
                      type="tel"
                      inputMode="numeric"
                      placeholder="6xxxxxxxx"
                      value={phone}
                      onChange={(e) =>
                        onPhoneChange(formatCheckoutPhoneInput(e.target.value))
                      }
                      className="min-w-0 flex-1 border-none bg-transparent px-3 text-base font-semibold tabular-nums outline-none"
                      autoComplete="tel"
                    />
                    {provider ? (
                      <span className="flex h-full items-center border-l border-[#eef0f3] bg-[#fafbfc] px-2">
                        <PaymentProviderBadge provider={provider} size="sm" />
                      </span>
                    ) : null}
                  </div>
                  {unknownNum ? (
                    <p className="mt-1.5 text-xs font-medium text-[#eb6558]">
                      {t("phoneUnknown")}
                    </p>
                  ) : provider ? (
                    <p className="mt-1.5 text-xs text-[#72747c]">
                      {t("phoneDetected", { wallet: walletName })}
                    </p>
                  ) : phoneComplete ? null : (
                    <p className="mt-1.5 text-xs leading-snug text-[#72747c]">
                      {formMode === "phone_only"
                        ? t("phoneOnlyHint")
                        : t("phoneHint")}
                    </p>
                  )}
                </Field>

                {onPayWithCard ? (
                  <>
                    <div className="flex items-center gap-3 py-1">
                      <div className="h-px flex-1 bg-[#e8eaed]" />
                      <span className="text-xs text-[#72747c]">OR</span>
                      <div className="h-px flex-1 bg-[#e8eaed]" />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (previewMode) return;
                        onPayWithCard?.();
                      }}
                      disabled={
                        previewMode ||
                        cardLoading ||
                        !emailFormatOk ||
                        !emailTrimmed
                      }
                      className="checkout-outline-btn w-full"
                    >
                      {cardLoading ? (
                        <span className="inline-flex items-center gap-2">
                          <Spinner size="sm" label="" />
                          {t("payWithCard")}
                        </span>
                      ) : (
                        t("payWithCard")
                      )}
                    </button>
                  </>
                ) : null}

                <CheckoutPayButton
                  type="submit"
                  disabled={!ready}
                  style={payBtnStyle}
                >
                  {payLabel}
                </CheckoutPayButton>
              </form>
            )}

            {phase === "sms" && (
              <section className="checkout-phase-enter space-y-4">
                <h2 className="text-lg font-semibold">{t("smsTitle")}</h2>
                <p className="text-sm text-[#72747c]">
                  {t("smsDesc", { phone: masked })}
                </p>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder={t("smsPh")}
                  value={smsCode}
                  onChange={(e) => onSmsCodeChange(e.target.value)}
                  className="checkout-field text-center tracking-widest"
                />
                <button
                  type="button"
                  onClick={onCancel}
                  className="cursor-pointer text-sm text-[#c10e0e] underline"
                >
                  {t("cancel")}
                </button>
                <CheckoutPayButton
                  loading={smsSubmitting}
                  loadingLabel={t("smsSubmit")}
                  disabled={!smsCode.trim()}
                  onClick={onSmsSubmit}
                  style={payBtnStyle}
                >
                  {t("confirm")}
                </CheckoutPayButton>
              </section>
            )}

            {phase === "prompt" && (
              <section className="checkout-phase-enter space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#72747c]">
                  {t("awaiting")}
                </p>
                <h2 className="text-lg font-semibold leading-snug">
                  {t("promptHeading", { amount: amountLabel, phone: masked })}
                </h2>
                <ol className="list-decimal space-y-2 pl-5 text-sm text-[#46505F]">
                  <li>{t("step1")}</li>
                  <li>{t("ussdStep", { code: ussdCode(provider) })}</li>
                  <li>{t("step3")}</li>
                </ol>
                <div className="flex items-center gap-2 rounded-lg bg-[#f6f7f9] px-3 py-2.5 text-xs text-[#72747c]">
                  <Spinner size="sm" label="" />
                  {t("pollNote", { wallet: pollWalletLabel || walletName })}
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="checkout-outline-btn flex-1"
                  >
                    {t("cancel")}
                  </button>
                  <CheckoutPayButton
                    loading={confirmChecking}
                    loadingLabel={t("checkingPayment")}
                    onClick={onConfirmed}
                    style={payBtnStyle}
                    className="flex-1"
                  >
                    {t("confirmed")}
                  </CheckoutPayButton>
                </div>
              </section>
            )}

            {phase === "success" && (
              <section className="checkout-phase-enter space-y-4 text-center">
                <CheckoutStatusIcon variant="success" />
                <p className="text-base font-semibold text-emerald-700">
                  {t("successful")}
                </p>
                <h2 className="text-xl font-semibold">
                  {t("successHeading", { name: firstName })}
                </h2>
                <p className="text-sm text-[#72747c]">
                  {t("successNote", {
                    amount: amountLabel,
                    merchant: displayTitle,
                    email: emailTrimmed || "your email",
                  })}
                </p>
                {redirectUrl ? (
                  <a
                    href={redirectUrl}
                    className="checkout-pay-minimal block no-underline"
                    style={payBtnStyle}
                  >
                    {redirectCountdown > 0
                      ? t("returnMerchantCountdown", {
                          seconds: redirectCountdown,
                        })
                      : t("returnMerchant")}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={onReset}
                    className="checkout-outline-btn w-full"
                  >
                    {t("done")}
                  </button>
                )}
                {redirectUrl ? (
                  <p className="text-xs text-[#8b8b95]">
                    {t("redirectingTo", { host: redirectHost })}
                  </p>
                ) : null}
              </section>
            )}

            {phase === "failed" && (
              <section className="checkout-phase-enter space-y-4 text-center">
                <CheckoutStatusIcon variant="error" />
                <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
                  {t("failed")}
                </p>
                <h2 className="text-xl font-semibold">{t("failedHeading")}</h2>
                <p className="text-sm text-[#72747c]">
                  {t("failNote", { phone: masked })}
                </p>
                <p className="text-sm text-[#72747c]">{t("failHelp")}</p>
                <CheckoutPayButton onClick={onReset} style={payBtnStyle}>
                  {t("tryAgain")}
                </CheckoutPayButton>
              </section>
            )}
          </div>
        </div>
        </div>

        <CheckoutFooter />
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-[#1a1a1a]">
        {label}
      </span>
      {children}
    </label>
  );
}
