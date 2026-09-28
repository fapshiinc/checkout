"use client";

import Image from "next/image";
import Link from "next/link";

const linkClass =
  "inline-flex items-center whitespace-nowrap underline-offset-2 hover:text-[#72747c] hover:underline";

export function CheckoutFooter() {
  return (
    <footer className="checkout-footer">
      <div className="checkout-footer__inner">
        <span className="inline-flex items-center whitespace-nowrap">
          Powered by
        </span>
        <Image
          src="/logos/logoBlack.svg"
          alt="Fapshi"
          width={56}
          height={13}
          className="block h-3 w-auto shrink-0 opacity-50"
        />
        <span aria-hidden className="inline-flex items-center text-[#e5e7eb]">
          |
        </span>
        <Link href="https://fapshi.com" className={linkClass}>
          Home
        </Link>
        <span aria-hidden className="inline-flex items-center text-[#e5e7eb]">
          |
        </span>
        <Link href="https://dashboard.fapshi.com" className={linkClass}>
          Register
        </Link>
        <span aria-hidden className="inline-flex items-center text-[#e5e7eb]">
          |
        </span>
        <Link href="https://fapshi.com/privacy-policy" className={linkClass}>
          Policy
        </Link>
      </div>
    </footer>
  );
}
