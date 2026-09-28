import { NextResponse } from "next/server";

import { getFapshiApiBase } from "@/lib/api-base";

const API_BASE = getFapshiApiBase();

const CHECKOUT_ORIGIN =
  process.env.CHECKOUT_ORIGIN || "https://checkout.fapshi.com";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(`${API_BASE}/merchantpay/sms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: CHECKOUT_ORIGIN,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: "Could not verify code" },
      { status: 500 }
    );
  }
}
