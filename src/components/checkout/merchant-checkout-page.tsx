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
import { resolveFapshiApiEnvironment } from "@/lib/api-base";
import { toPaymentPhone } from "@/lib/phone";
import { CheckoutInlineAlert } from "@/components/checkout/checkout-inline-alert";
import type { MerchantCheckoutSession } from "@/lib/types";
import { useTranslations } from "@/lib/translations";

function checkoutEnvironment(): "sandbox" | "live" {
  return resolveFapshiApiEnvironment() === "sandbox" ? "sandbox" : "live";
}

function initialPhase(status: string): CheckoutPhase {
  if (status === "PENDING") return "prompt";
  return "idle";
}

export function MerchantCheckoutPage({
  session,
}: {
  session: MerchantCheckoutSession;
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
  const [confirmChecking, setConfirmChecking] = useState(false);

  useEffect(() => {
    return applyCheckoutBranding(appearance);
  }, [appearance]);

  useEffect(() => {
    if (phase !== "success" || !session.redirect) return;
    setRedirectCountdown(5);
    const interval = setInterval(() => {
      setRedirectCountdown((n) => {
        if (n <= 1) {
          clearInterval(interval);
          if (session.redirect) window.location.href = session.redirect;
          return 0;
        }
        return n - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, session.redirect]);

  const pollStatus = useCallback(async () => {
    try {
      const status = await fetchMerchantPaymentStatus(session.transferId);
      if (status.status === "SUCCESSFUL") {
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
  }, [session.transferId]);

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
      const res = await payMerchantWithMomo({
        transferId: session.transferId,
        phone: toPaymentPhone(phone),
        clientName,
        email: payerEmail,
      });

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
      await submitMerchantSmsCode(session.transferId, smsCode.trim());
      setPhase("prompt");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setSmsSubmitting(false);
    }
  };

  const handleConfirmed = async () => {
    setError(null);
    setConfirmChecking(true);
    try {
      /** One status call can return PENDING while the wallet is still processing. */
      const maxChecks = 8;
      for (let i = 0; i < maxChecks; i++) {
        const done = await pollStatus();
        if (done) return;
        if (i < maxChecks - 1) {
          await new Promise((resolve) => setTimeout(resolve, 4000));
        }
      }
      setError(t("stillPendingConfirm"));
    } finally {
      setConfirmChecking(false);
    }
  };

  return (
    <>
      {error ? (
        <CheckoutInlineAlert message={error} onDismiss={() => setError(null)} />
      ) : null}
      <CheckoutExperience
        appearance={appearance}
        primaryColor={primaryColor}
        environment={checkoutEnvironment()}
        amount={session.amount}
        transferId={session.transferId}
        displayTitle={displayTitle}
        message={appearance.message || session.message}
        payerEmail={session.payerEmail}
        payerName={session.payerName}
        redirectUrl={session.redirect}
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
        onConfirmed={handleConfirmed}
        onReset={resetFlow}
        smsSubmitting={smsSubmitting}
        confirmChecking={confirmChecking}
      />
    </>
  );
}
