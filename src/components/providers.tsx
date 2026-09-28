"use client";

import { ThemeProvider } from "@/lib/theme";
import { TranslationProvider } from "@/lib/translations";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TranslationProvider>
        {children}
        <Toaster position="top-center" richColors closeButton />
      </TranslationProvider>
    </ThemeProvider>
  );
}
