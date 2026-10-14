"use client";

export function ProcessingOverlay() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 shadow-lg text-center flex flex-col items-center"
    >
      {/* Clean Spinner */}
      <div className="mb-5">
        <svg
          className="animate-spin h-10 w-10 text-violet-500"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-20"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-90"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>

      <h2 className="text-xl font-bold text-white tracking-tight">
        Processing Payment
      </h2>
      <p className="text-xs text-zinc-400 mt-2 max-w-sm leading-relaxed">
        Please wait while we establish a secure session and transmit your payment details…
      </p>
    </div>
  );
}
