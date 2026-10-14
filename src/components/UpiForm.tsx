"use client";

import { useState } from "react";
import { validateUpiId } from "@/lib/validators";

interface UpiFormProps {
  onSubmit: (upiId: string) => void;
  disabled: boolean;
}

export function UpiForm({ onSubmit, disabled }: UpiFormProps) {
  const [upiId, setUpiId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUpiId(e.target.value);
    if (touched) {
      setError(validateUpiId(e.target.value));
    }
  }

  function handleBlur() {
    setTouched(true);
    setError(validateUpiId(upiId));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    const err = validateUpiId(upiId);
    setError(err);
    if (!err) {
      onSubmit(upiId.trim());
    }
  }

  const inputId = "upi-id-input";
  const errorId = "upi-id-error";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="space-y-1.5">
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-zinc-300"
        >
          UPI ID / VPA
        </label>
        <div className="relative">
          <input
            id={inputId}
            type="text"
            inputMode="email"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="username@okaxis"
            value={upiId}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? errorId : undefined}
            className={`w-full bg-zinc-950 border rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition ${
              error
                ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                : "border-zinc-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            }`}
          />
        </div>

        {error && (
          <p id={errorId} role="alert" className="text-xs text-rose-400 mt-1">
            {error}
          </p>
        )}

        <p className="text-[11px] text-zinc-400 mt-1">
          Supported handles: <code className="text-zinc-300">@okaxis</code>,{" "}
          <code className="text-zinc-300">@okhdfcbank</code>,{" "}
          <code className="text-zinc-300">@paytm</code>,{" "}
          <code className="text-zinc-300">@upi</code>
        </p>
      </div>

      <button
        type="submit"
        disabled={disabled}
        className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-3 px-4 rounded-xl transition duration-150 shadow-sm cursor-pointer"
        aria-label="Pay via UPI"
      >
        {disabled ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Processing…</span>
          </>
        ) : (
          <span>Pay Now</span>
        )}
      </button>
    </form>
  );
}
