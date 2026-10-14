import Link from "next/link";
import { getAllOrders } from "@/lib/mockStore";
import { formatINR } from "@/lib/formatCurrency";

export const metadata = {
  title: "Available Orders — FastCheckout",
  description: "Select an order to test the idempotent payment checkout flow.",
};

export default function HomePage() {
  const orders = getAllOrders();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-violet-950/60 text-violet-300 border border-violet-800/60">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Interactive Checkout Demo</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Select an Order to Checkout
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
            Choose any mock order below to test Card OTP verification, UPI instant payments, state recovery, and idempotency guarantees.
          </p>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {orders.map((order) => {
            const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0);

            return (
              <div
                key={order.orderId}
                className="flex flex-col justify-between bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 transition-all duration-200 shadow-sm hover:shadow-lg hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center font-bold text-violet-300 text-sm">
                        {order.merchant.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-sm font-semibold text-white leading-tight">
                          {order.merchant}
                        </h2>
                        <span className="text-xs font-mono text-zinc-400">
                          {order.orderId}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 font-medium border border-zinc-700/50">
                      {itemCount} {itemCount === 1 ? "item" : "items"}
                    </span>
                  </div>

                  <div className="border-t border-zinc-800/80 my-4" />

                  <div className="space-y-2.5 mb-6 text-xs text-zinc-300">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-baseline gap-2">
                        <span className="truncate text-zinc-300">
                          {item.name} {item.quantity > 1 ? `× ${item.quantity}` : ""}
                        </span>
                        <span className="font-medium text-zinc-400 shrink-0">
                          {formatINR(item.priceInPaise * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="border-t border-zinc-800/80 pt-4 mb-4 flex items-baseline justify-between">
                    <span className="text-xs uppercase tracking-wider text-zinc-400">
                      Total
                    </span>
                    <span className="text-xl font-bold text-white">
                      {formatINR(order.totalInPaise)}
                    </span>
                  </div>

                  <Link
                    href={`/checkout/${order.orderId}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium py-2.5 px-4 rounded-xl transition duration-150 shadow-sm"
                  >
                    <span>Proceed to Pay</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/70 text-xs">
          <div className="space-y-1">
            <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
              <span>⚡</span> Idempotency Protection
            </span>
            <p className="text-zinc-400 leading-relaxed">
              Submissions use deterministic idempotency keys to ensure banks never double-charge.
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
              <span>💳</span> Simulated OTP Verification
            </span>
            <p className="text-zinc-400 leading-relaxed">
              Card checkouts dynamically generate and validate a one-time passcode.
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
              <span>🔄</span> Tab / Reload Recovery
            </span>
            <p className="text-zinc-400 leading-relaxed">
              In-flight payments persist across browser refreshes until final settlement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
