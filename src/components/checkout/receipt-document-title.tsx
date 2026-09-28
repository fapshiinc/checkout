"use client";

import { receiptDocumentTitle } from "@/lib/receipt-metadata";
import { useEffect } from "react";

export function ReceiptDocumentTitle({
  merchantName,
  receiptNumber,
}: {
  merchantName: string;
  receiptNumber: string;
}) {
  useEffect(() => {
    const next = receiptDocumentTitle({ merchantName, receiptNumber });
    const previous = document.title;
    document.title = next;
    return () => {
      document.title = previous;
    };
  }, [merchantName, receiptNumber]);

  return null;
}
