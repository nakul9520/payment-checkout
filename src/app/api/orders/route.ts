import { getAllOrders } from "@/lib/mockStore";
import { NextResponse } from "next/server";

export async function GET() {
  const orders = getAllOrders();
  return NextResponse.json(orders);
}
