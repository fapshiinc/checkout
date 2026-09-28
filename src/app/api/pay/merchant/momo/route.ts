import {
  getMerchantApiBase,
  resolveCheckoutEnvFromRequest,
} from "@/lib/checkout-api-environment";
import { getCheckoutOrigin } from "@/lib/checkout-origin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    if (body.phone != null && body.phone !== "") {
      body.phone = String(body.phone).replace(/\D/g, "").slice(-9);
    }
    const apiBase = getMerchantApiBase(resolveCheckoutEnvFromRequest(request));

    const response = await fetch(`${apiBase}/merchantpay/momo`, {
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
      { message: "Could not initiate payment" },
      { status: 500 }
    );
  }
}
