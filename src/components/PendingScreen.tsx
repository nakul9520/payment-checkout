"use client";

export function PendingScreen() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 shadow-lg text-center flex flex-col items-center"
    >
      {/* Animated Pulse Dots */}
      <div className="flex items-center gap-2 mb-5">
        <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
        <span className="w-3 h-3 rounded-full bg-amber-400 animate-bounce" />
        <span className="w-3 h-3 rounded-full bg-amber-400 opacity-75" />
      </div>

      <h2 className="text-xl font-bold text-white tracking-tight">
        Confirming Your Payment
      </h2>
      <p className="text-xs text-zinc-400 mt-2 max-w-sm leading-relaxed">
        We are awaiting final confirmation from your issuing bank. This typically takes 3–5 seconds. Please do not refresh or close this page.
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-950 rounded-full h-1.5 mt-6 overflow-hidden border border-zinc-800/80">
        <div className="bg-amber-400 h-1.5 rounded-full w-2/3 animate-pulse" />
      </div>
    </div>
  );
}
