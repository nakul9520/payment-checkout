import { NextRequest, NextResponse } from "next/server";
import { getPaymentStatus } from "@/lib/mockStore";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  const { paymentId } = await params;

  const payment = getPaymentStatus(paymentId);
  if (!payment) {
    return NextResponse.json(
      { error: `Payment ${paymentId} not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json(payment);
}
