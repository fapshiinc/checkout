"use client";

import { useEffect } from "react";

/** Shrinks html/body to content height on standalone success pages. */
export function CheckoutTerminalPageMark() {
  useEffect(() => {
    document.documentElement.classList.add("checkout-terminal-page");
    return () => {
      document.documentElement.classList.remove("checkout-terminal-page");
    };
  }, []);

  return null;
}
