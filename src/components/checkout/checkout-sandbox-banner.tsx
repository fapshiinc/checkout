"use client";

import { sandboxEnvironmentDocsUrl } from "@/lib/sandbox-docs";
import { useLocale, useTranslations } from "@/lib/translations";

export function CheckoutSandboxBanner() {
  const t = useTranslations("merchantCheckout");
  const { locale } = useLocale();
  const docsUrl = sandboxEnvironmentDocsUrl(locale);

  return (
    <div className="border-b border-amber-200/80 bg-amber-50 px-4 py-2.5 text-center text-xs font-medium leading-relaxed text-amber-950/90">
      <p>
        {t("sandbox")} — {t("sandboxNote")}
      </p>
      <p className="mt-1">
        <a
          href={docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-amber-950 underline underline-offset-2 hover:text-amber-900"
        >
          {t("sandboxTestNumbersDocs")}
        </a>
      </p>
    </div>
  );
}
