import { NextRequest, NextResponse } from "next/server";
import { getOrCreatePayment, getOrder } from "@/lib/mockStore";

export async function POST(req: NextRequest) {
  const idempotencyKey = req.headers.get("Idempotency-Key");

  if (!idempotencyKey) {
    return NextResponse.json(
      { error: "Missing Idempotency-Key header." },
      { status: 400 }
    );
  }

  let body: { orderId?: string; method?: "upi" | "card" };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body." },
      { status: 400 }
    );
  }

  const { orderId, method } = body;

  if (!orderId || !method || (method !== "upi" && method !== "card")) {
    return NextResponse.json(
      { error: "Invalid or missing orderId or method ('upi' | 'card')." },
      { status: 400 }
    );
  }

  const order = getOrder(orderId);
  if (!order) {
    return NextResponse.json(
      { error: `Order ${orderId} not found.` },
      { status: 404 }
    );
  }

  // Create or return existing payment record idempotently
  const payment = await getOrCreatePayment(idempotencyKey, orderId, method);

  return NextResponse.json(payment);
}
