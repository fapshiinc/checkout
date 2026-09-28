import { getFapshiApiBase } from "@/lib/api-base";
import { NextResponse } from "next/server";

const API_BASE = getFapshiApiBase();

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(`${API_BASE}/merchantpay/momo`, {
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
