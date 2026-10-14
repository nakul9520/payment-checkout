import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CheckoutForm } from "@/components/CheckoutForm";
import { getOrder } from "@/lib/mockStore";
import type { Order } from "@/types";

interface PageProps {
  params: Promise<{ orderId: string }>;
}

async function fetchOrder(orderId: string): Promise<Order | null> {
  // Direct server-side data access for zero latency & robustness
  const directOrder = getOrder(orderId);
  if (directOrder) return directOrder;

  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    const res = await fetch(`${baseUrl}/api/orders/${orderId}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { orderId } = await params;
  return {
    title: `Checkout — Order ${orderId}`,
    description: "Complete your payment securely",
  };
}

export default async function CheckoutPage({ params }: PageProps) {
  const { orderId } = await params;
  const order = await fetchOrder(orderId);

  if (!order) {
    notFound();
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-zinc-950 text-zinc-100">
      <div className="w-full max-w-4xl">
        <CheckoutForm order={order} />
      </div>
    </main>
  );
}
