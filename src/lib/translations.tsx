"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import enMessages from "../../messages/en.json";
import frMessages from "../../messages/fr.json";

type Messages = typeof enMessages;
export type Locale = "en" | "fr";

const messageMap: Record<Locale, Messages> = {
  en: enMessages,
  fr: frMessages,
};

interface TranslationContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (
    namespace: keyof Messages,
    key: string,
    vars?: Record<string, string | number>
  ) => string;
}

const TranslationContext = createContext<TranslationContextValue | null>(null);

function interpolate(
  template: string,
  vars?: Record<string, string | number>
): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    vars[key] !== undefined ? String(vars[key]) : `{${key}}`
  );
}

export function TranslationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = localStorage.getItem("fapshi-products-locale");
    if (stored === "en" || stored === "fr") {
      setLocaleState(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    localStorage.setItem("fapshi-products-locale", next);
    setLocaleState(next);
  }, []);

  const messages = messageMap[locale];

  const t = useCallback(
    (
      namespace: keyof Messages,
      key: string,
      vars?: Record<string, string | number>
    ) => {
      const section = messages[namespace] as Record<string, string>;
      const value = section?.[key];
      if (!value) return key;
      return interpolate(value, vars);
    },
    [messages]
  );

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  );

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslations(namespace: keyof Messages) {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error("useTranslations must be used within TranslationProvider");

  return useCallback(
    (key: string, vars?: Record<string, string | number>) =>
      ctx.t(namespace, key, vars),
    [ctx, namespace]
  );
}

export function useLocale() {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error("useLocale must be used within TranslationProvider");
  return { locale: ctx.locale, setLocale: ctx.setLocale };
}
