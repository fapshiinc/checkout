"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckoutExperience,
  type CheckoutPhase,
} from "@/components/checkout/checkout-experience";
import { applyCheckoutBranding } from "@/lib/checkout-branding";
import { resolveCheckoutPrimary } from "@/lib/checkout-theme";
import type { MerchantCheckoutAppearance } from "@/lib/types";

const PREVIEW_AMOUNT = 500;
const PREVIEW_TRANSFER_ID = "PREVIEW01";

function readParam(
  params: URLSearchParams,
  key: string
): string | undefined {
  const value = params.get(key)?.trim();
  return value || undefined;
}

export function CheckoutDashboardPreview() {
  const searchParams = useSearchParams();
  const embed = searchParams.get("embed") === "1";
  const sandbox = searchParams.get("sandbox") === "1";

  const serviceName =
    readParam(searchParams, "name") ||
    readParam(searchParams, "serviceName") ||
    "Your business";
  const logoUrl = readParam(searchParams, "logo");
  const primaryColorRaw = readParam(searchParams, "color");

  const appearance: MerchantCheckoutAppearance = useMemo(
    () => ({
      title: serviceName,
      logo: logoUrl,
      primaryColor: primaryColorRaw,
    }),
    [serviceName, logoUrl, primaryColorRaw]
  );

  const primaryColor = resolveCheckoutPrimary(appearance.primaryColor);
  const displayTitle = appearance.title.trim() || serviceName;

  const [phase] = useState<CheckoutPhase>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [smsCode, setSmsCode] = useState("");

  useEffect(() => {
    return applyCheckoutBranding(appearance);
  }, [appearance]);

  useEffect(() => {
    if (!embed) return;
    const root = document.documentElement;
    root.classList.remove("dark");
    root.classList.add("checkout-preview-embed");
    root.style.colorScheme = "light";
    return () => {
      root.classList.remove("checkout-preview-embed");
      root.style.colorScheme = "";
    };
  }, [embed]);

  useEffect(() => {
    if (!embed || typeof window === "undefined") return;

    const targetOrigin = document.referrer
      ? new URL(document.referrer).origin
      : "*";

    const postHeight = () => {
      const height = Math.ceil(
        document.documentElement.scrollHeight ||
          document.body.scrollHeight ||
          640
      );
      window.parent.postMessage(
        { type: "fapshi-checkout-preview-height", height },
        targetOrigin === "null" ? "*" : targetOrigin
      );
    };

    postHeight();
    const observer = new ResizeObserver(postHeight);
    observer.observe(document.body);
    window.addEventListener("load", postHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("load", postHeight);
    };
  }, [embed, phase]);

  return (
    <CheckoutExperience
      appearance={appearance}
      primaryColor={primaryColor}
      environment={sandbox ? "sandbox" : "live"}
      amount={PREVIEW_AMOUNT}
      transferId={PREVIEW_TRANSFER_ID}
      displayTitle={displayTitle}
      phase={phase}
      name={name}
      email={email}
      phone={phone}
      smsCode={smsCode}
      redirectCountdown={5}
      onNameChange={setName}
      onEmailChange={setEmail}
      onPhoneChange={setPhone}
      onSmsCodeChange={setSmsCode}
      onPay={() => {}}
      onCancel={() => {}}
      onSmsSubmit={() => {}}
      onConfirmed={() => {}}
      onReset={() => {}}
      previewMode
      embed={embed}
      showLocaleToggle
    />
  );
}
