"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";

export type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Hosted checkout is always light — no store theme / dark mode on this app. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const setTheme = useCallback((_next: Theme) => {}, []);
  const toggleTheme = useCallback(() => {}, []);

  const value = useMemo(
    () => ({ theme: "light" as const, setTheme, toggleTheme }),
    [setTheme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme requires ThemeProvider");
  return ctx;
}
