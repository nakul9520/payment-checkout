"use client";

import Link from "next/link";
import { formatINR } from "@/lib/formatCurrency";
import type { Order } from "@/types";

interface OrderSummaryProps {
  order: Order;
}

export function OrderSummary({ order }: OrderSummaryProps) {
  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 shadow-sm">
      {/* Back to Orders Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition duration-150 mb-5 py-1 px-2.5 rounded-lg bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-700/50 w-fit"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span>All Orders</span>
      </Link>

      {/* Merchant Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center font-bold text-violet-300 text-sm">
          {order.merchant.charAt(0).toUpperCase()}
        </div>
        <div>
          <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
            Paying to
          </span>
          <h2 className="text-sm font-semibold text-white leading-tight">
            {order.merchant}
          </h2>
        </div>
      </div>

      <div className="border-t border-zinc-800/80 my-4" />

      {/* Items Breakdown */}
      <div className="space-y-3 mb-5">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-baseline justify-between gap-3 text-xs">
            <div className="truncate text-zinc-300">
              <span>{item.name}</span>
              {item.quantity > 1 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono text-[11px]">
                  ×{item.quantity}
                </span>
              )}
            </div>
            <span className="text-zinc-400 font-medium shrink-0">
              {formatINR(item.priceInPaise * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-zinc-800/80 my-4" />

      {/* Total */}
      <div className="flex items-baseline justify-between mb-4">
        <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
          Total Amount
        </span>
        <span className="text-2xl font-bold text-white tracking-tight">
          {formatINR(order.totalInPaise)}
        </span>
      </div>

      {/* Order Badge */}
      <div className="text-center py-1.5 px-3 rounded-lg bg-zinc-950 border border-zinc-800/70 text-xs font-mono text-zinc-400">
        Order Reference: <span className="text-zinc-200">{order.orderId}</span>
      </div>
    </div>
  );
}
