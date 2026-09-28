import {
  getMerchantApiBase,
  resolveCheckoutEnvFromRequest,
} from "@/lib/checkout-api-environment";
import { getCheckoutOrigin } from "@/lib/checkout-origin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const apiBase = getMerchantApiBase(resolveCheckoutEnvFromRequest(request));

    const response = await fetch(`${apiBase}/merchantpay/sms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: getCheckoutOrigin(),
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
