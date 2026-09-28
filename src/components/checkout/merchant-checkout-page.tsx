"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CheckoutExperience,
  type CheckoutPhase,
} from "@/components/checkout/checkout-experience";
import { applyCheckoutBranding } from "@/lib/checkout-branding";
import { resolveCheckoutPrimary } from "@/lib/checkout-theme";
import {
  fetchMerchantPaymentStatus,
  payMerchantWithMomo,
  submitMerchantSmsCode,
} from "@/lib/api";
import type { CheckoutApiEnvironment } from "@/lib/checkout-api-environment";
import { toPaymentPhone } from "@/lib/phone";
import { CheckoutInlineAlert } from "@/components/checkout/checkout-inline-alert";
import type { MerchantCheckoutSession } from "@/lib/types";
import { merchantReceiptPagePath } from "@/lib/merchant-receipt";
import { resolveMerchantSuccessRedirect } from "@/lib/merchant-redirect";
import { useTranslations } from "@/lib/translations";

function initialPhase(status: string): CheckoutPhase {
  if (status === "PENDING") return "prompt";
  return "idle";
}

export function MerchantCheckoutPage({
  session,
  apiEnvironment = "live",
}: {
  session: MerchantCheckoutSession;
  apiEnvironment?: CheckoutApiEnvironment;
}) {
  const t = useTranslations("merchantCheckout");
  const appearance = session.appearance;
  const primaryColor = resolveCheckoutPrimary(appearance.primaryColor);
  const displayTitle = appearance.title?.trim() || session.serviceName;

  const [phase, setPhase] = useState<CheckoutPhase>(() =>
    initialPhase(session.status)
  );
  const [name, setName] = useState(session.payerName?.trim() || "");
  const [email, setEmail] = useState(session.payerEmail?.trim() || "");

  useEffect(() => {
    if (session.payerEmail?.trim()) {
      setEmail(session.payerEmail.trim());
    }
    if (session.payerName?.trim()) {
      setName(session.payerName.trim());
    }
  }, [session.payerEmail, session.payerName]);
  const [phone, setPhone] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [pollWallet, setPollWallet] = useState<string | undefined>();
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const [error, setError] = useState<string | null>(null);
  const [smsSubmitting, setSmsSubmitting] = useState(false);
  const [successRedirect, setSuccessRedirect] = useState<string | null>(() =>
    resolveMerchantSuccessRedirect(session, session.transferId)
  );

  /** Raw redirect from merchant-link (for webpage “back” only — not success return). */
  const merchantWebRedirect = session.redirect ?? null;

  useEffect(() => {
    return applyCheckoutBranding(appearance);
  }, [appearance]);

  useEffect(() => {
    if (phase !== "success" || !successRedirect) return;
    setRedirectCountdown(5);
    const interval = setInterval(() => {
      setRedirectCountdown((n) => {
        if (n <= 1) {
          clearInterval(interval);
          if (successRedirect) window.location.href = successRedirect;
          return 0;
        }
        return n - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, successRedirect]);

  const pollStatus = useCallback(async () => {
    try {
      const status = await fetchMerchantPaymentStatus(
        session.transferId,
        apiEnvironment
      );
      if (status.status === "SUCCESSFUL") {
        const fromStatus =
          status.redirect?.trim() ||
          status.redirectUrl?.trim() ||
          null;
        if (fromStatus) {
          setSuccessRedirect(
            resolveMerchantSuccessRedirect(
              { redirect: fromStatus, successRedirect: fromStatus },
              session.transferId
            )
          );
        }
        setPhase("success");
        return true;
      }
      if (status.status === "FAILED" || status.status === "EXPIRED") {
        setPhase("failed");
        return true;
      }
    } catch {
      /* keep polling until timeout */
    }
    return false;
  }, [session.transferId, session.redirect, apiEnvironment]);

  useEffect(() => {
    if (phase !== "prompt") return;

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 72;

    const tick = async () => {
      if (cancelled) return;
      attempts += 1;
      const done = await pollStatus();
      if (done || attempts >= maxAttempts) {
        if (!done && !cancelled) setPhase("failed");
        return;
      }
      timer = window.setTimeout(tick, 5000);
    };

    let timer = window.setTimeout(tick, 2000);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [phase, pollStatus]);

  const resetFlow = () => {
    setPhase("idle");
    setSmsCode("");
    setError(null);
  };

  const handlePay = async () => {
    setError(null);
    setPhase("initiating");

    try {
      const payerEmail = session.payerEmail?.trim() || email.trim();
      const clientName = session.payerName?.trim() || name.trim() || "Customer";
      const res = await payMerchantWithMomo(
        {
          transferId: session.transferId,
          phone: toPaymentPhone(phone),
          clientName,
          email: payerEmail,
        },
        apiEnvironment
      );

      const msg = (res.message || "").toLowerCase();
      if (msg.includes("sms") || msg.includes("code")) {
        setPhase("sms");
        return;
      }

      setPollWallet(
        res.medium === "orange money"
          ? "Orange Money"
          : res.medium === "mobile money"
            ? "MTN MoMo"
            : undefined
      );
      setPhase("prompt");
    } catch (err) {
      setPhase("idle");
      setError(err instanceof Error ? err.message : "Payment failed");
    }
  };

  const handleSmsSubmit = async () => {
    setError(null);
    setSmsSubmitting(true);
    try {
      await submitMerchantSmsCode(
        session.transferId,
        smsCode.trim(),
        apiEnvironment
      );
      setPhase("prompt");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setSmsSubmitting(false);
    }
  };

  const receiptHref = merchantReceiptPagePath(
    session.transferId,
    apiEnvironment
  );

  return (
    <>
      {error ? (
        <CheckoutInlineAlert message={error} onDismiss={() => setError(null)} />
      ) : null}
      <CheckoutExperience
        appearance={appearance}
        primaryColor={primaryColor}
        environment={apiEnvironment}
        amount={session.amount}
        displayTitle={displayTitle}
        message={appearance.message || session.message}
        payerEmail={session.payerEmail}
        payerName={session.payerName}
        redirectUrl={merchantWebRedirect}
        successRedirectUrl={successRedirect}
        createdAt={session.createdAt}
        phase={phase}
        name={name}
        email={email}
        phone={phone}
        smsCode={smsCode}
        redirectCountdown={redirectCountdown}
        pollWalletLabel={pollWallet}
        onNameChange={setName}
        onEmailChange={setEmail}
        onPhoneChange={setPhone}
        onSmsCodeChange={setSmsCode}
        onPay={handlePay}
        onCancel={resetFlow}
        onSmsSubmit={handleSmsSubmit}
        onReset={resetFlow}
        receiptHref={receiptHref}
        smsSubmitting={smsSubmitting}
      />
    </>
  );
}
