"use client";

import Link from "next/link";

interface FailureScreenProps {
  reason: string;
  paymentId?: string;
  onRetry: () => void;
}

export function FailureScreen({
  reason,
  paymentId,
  onRetry,
}: FailureScreenProps) {
  return (
    <div
      role="alert"
      className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 shadow-lg text-center flex flex-col items-center"
    >
      {/* Failure Circle & Cross */}
      <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-5">
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-white tracking-tight">
        Payment Failed
      </h2>
      <p className="text-sm text-rose-300/90 mt-2 max-w-sm">
        {reason}
      </p>

      {/* Failure Receipt Info */}
      {paymentId && (
        <div className="w-full my-6 p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Payment Reference</span>
            <span className="font-mono text-zinc-200 text-[11px] truncate max-w-[200px]">
              {paymentId}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Status</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30 font-medium text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              Declined
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="w-full space-y-2 mt-4">
        <button
          onClick={onRetry}
          className="w-full inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium py-2.5 px-4 rounded-xl transition duration-150 shadow-sm cursor-pointer"
          aria-label="Try payment again"
        >
          <span>Try Again</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        <Link
          href="/"
          className="w-full inline-flex items-center justify-center gap-2 border border-zinc-800 bg-zinc-950 hover:bg-zinc-800/60 text-zinc-300 text-xs font-medium py-2.5 px-4 rounded-xl transition duration-150 cursor-pointer"
        >
          Cancel & Select Another Order
        </Link>
      </div>
    </div>
  );
}
