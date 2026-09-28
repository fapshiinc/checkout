import {
  getMerchantApiBase,
  resolveCheckoutEnvFromRequest,
} from "@/lib/checkout-api-environment";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const apiBase = getMerchantApiBase(resolveCheckoutEnvFromRequest(request));

    const response = await fetch(`${apiBase}/merchantpay/momo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: "Could not initiate payment" },
      { status: 500 }
    );
  }
}
