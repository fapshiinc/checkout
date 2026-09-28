"use client";

import Image from "next/image";
import Link from "next/link";

export function CheckoutFooter() {
  return (
    <footer className="checkout-footer safe-area-pb">
      <div className="mx-auto flex max-w-[420px] flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 py-2.5 text-[11px] font-bold text-[#9ca3af]">
        <span className="whitespace-nowrap">Powered by</span>
        <Image
          src="/logos/logoBlack.svg"
          alt="Fapshi"
          width={56}
          height={13}
          className="h-3 w-auto opacity-50"
        />
        <span aria-hidden className="text-[#e5e7eb]">
          |
        </span>
        <Link
          href="https://fapshi.com"
          className="whitespace-nowrap underline-offset-2 hover:text-[#72747c] hover:underline"
        >
          Home
        </Link>
        <span aria-hidden className="text-[#e5e7eb]">
          |
        </span>
        <Link
          href="https://dashboard.fapshi.com"
          className="whitespace-nowrap underline-offset-2 hover:text-[#72747c] hover:underline"
        >
          Register
        </Link>
        <span aria-hidden className="text-[#e5e7eb]">
          |
        </span>
        <Link
          href="https://fapshi.com/privacy-policy"
          className="whitespace-nowrap underline-offset-2 hover:text-[#72747c] hover:underline"
        >
          Policy
        </Link>
      </div>
    </footer>
  );
}
