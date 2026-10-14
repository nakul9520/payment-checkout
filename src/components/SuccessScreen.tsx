"use client";

import Link from "next/link";
import { formatINR } from "@/lib/formatCurrency";

interface SuccessScreenProps {
  paymentId: string;
  totalInPaise: number;
}

export function SuccessScreen({
  paymentId,
  totalInPaise,
}: SuccessScreenProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 shadow-lg text-center flex flex-col items-center"
    >
      {/* Success Animated Circle & Check */}
      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5">
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-white tracking-tight">
        Payment Successful
      </h2>
      <p className="text-2xl font-extrabold text-emerald-400 mt-2 tracking-tight">
        {formatINR(totalInPaise)}
      </p>
      <p className="text-xs text-zinc-400 mt-1">
        Your transaction has been securely confirmed.
      </p>

      {/* Receipt Info Card */}
      <div className="w-full my-6 p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2.5 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-zinc-400">Payment Reference</span>
          <span className="font-mono text-zinc-200 text-[11px] truncate max-w-[200px]">
            {paymentId}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-zinc-400">Status</span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-medium text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Confirmed
          </span>
        </div>
      </div>

      <Link
        href="/"
        className="w-full inline-flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium py-2.5 px-4 rounded-xl transition duration-150 cursor-pointer"
      >
        <span>Return to Orders</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </Link>
    </div>
  );
}
