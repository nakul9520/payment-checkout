"use client";

import { useState } from "react";
import {
  validateCardNumber,
  validateCvv,
  validateExpiry,
  validateOtp,
} from "@/lib/validators";
import { generateOtp } from "@/lib/otp";

interface CardFormProps {
  onSubmit: () => void;
  disabled: boolean;
}

type CardStep = "details" | "otp";

interface CardErrors {
  cardNumber?: string | null;
  expiry?: string | null;
  cvv?: string | null;
}

export function CardForm({ onSubmit, disabled }: CardFormProps) {
  const [step, setStep] = useState<CardStep>("details");

  // Card detail fields
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState<CardErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // OTP step
  const [mockOtp] = useState<string>(() => generateOtp());
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpTouched, setOtpTouched] = useState(false);

  // ─── Formatting ────────────────────────────────────────────────────────────

  function formatCardNumber(raw: string): string {
    const digits = raw.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  }

  function handleCardNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    if (touched.cardNumber) {
      setErrors((prev) => ({
        ...prev,
        cardNumber: validateCardNumber(formatted),
      }));
    }
  }

  function handleExpiryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    const formatted =
      raw.length > 2 ? `${raw.slice(0, 2)}/${raw.slice(2)}` : raw;
    setExpiry(formatted);
    if (touched.expiry) {
      setErrors((prev) => ({ ...prev, expiry: validateExpiry(formatted) }));
    }
  }

  function handleCvvChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.replace(/\D/g, "").slice(0, 3);
    setCvv(val);
    if (touched.cvv) {
      setErrors((prev) => ({ ...prev, cvv: validateCvv(val) }));
    }
  }

  // ─── Step 1: validate card details → go to OTP ────────────────────────────

  function handleDetailsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ cardNumber: true, expiry: true, cvv: true });

    const newErrors: CardErrors = {
      cardNumber: validateCardNumber(cardNumber),
      expiry: validateExpiry(expiry),
      cvv: validateCvv(cvv),
    };
    setErrors(newErrors);

    const hasError = Object.values(newErrors).some(Boolean);
    if (!hasError) {
      setStep("otp");
    }
  }

  // ─── Step 2: validate OTP → trigger payment ────────────────────────────────

  function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOtpTouched(true);
    const err = validateOtp(enteredOtp, mockOtp);
    setOtpError(err);
    if (!err) {
      onSubmit();
    }
  }

  function handleOtpChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setEnteredOtp(val);
    if (otpTouched) setOtpError(validateOtp(val, mockOtp));
  }

  // ─── Render: OTP Step ──────────────────────────────────────────────────────

  if (step === "otp") {
    return (
      <form onSubmit={handleOtpSubmit} noValidate className="space-y-5">
        {/* OTP Notification Banner */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-violet-950/40 border border-violet-800/50 text-xs">
          <span className="text-xl shrink-0" aria-hidden="true">
            📱
          </span>
          <div>
            <p className="font-semibold text-violet-200">OTP Sent</p>
            <p className="text-zinc-400 mt-0.5">
              Enter test OTP:{" "}
              <strong className="font-mono text-white text-sm bg-violet-900/50 px-1.5 py-0.5 rounded border border-violet-700/50">
                {mockOtp}
              </strong>
            </p>
          </div>
        </div>

        {/* OTP Input */}
        <div className="space-y-1.5">
          <label
            htmlFor="otp-input"
            className="block text-xs font-medium text-zinc-300"
          >
            One-Time Password (OTP)
          </label>
          <input
            id="otp-input"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="6-digit OTP"
            maxLength={6}
            value={enteredOtp}
            onChange={handleOtpChange}
            onBlur={() => {
              setOtpTouched(true);
              setOtpError(validateOtp(enteredOtp, mockOtp));
            }}
            disabled={disabled}
            aria-invalid={otpError ? "true" : "false"}
            aria-describedby={otpError ? "otp-error" : undefined}
            className={`w-full bg-zinc-950 border rounded-xl px-4 py-3 text-center tracking-[0.3em] font-mono text-base text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition ${
              otpError
                ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                : "border-zinc-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            }`}
          />
          {otpError && (
            <p id="otp-error" role="alert" className="text-xs text-rose-400 mt-1">
              {otpError}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setStep("details")}
            disabled={disabled}
            className="w-1/3 py-3 px-4 rounded-xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-800/60 text-zinc-300 text-xs font-medium transition disabled:opacity-50 cursor-pointer"
          >
            ← Back
          </button>
          <button
            type="submit"
            disabled={disabled}
            className="w-2/3 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-3 px-4 rounded-xl transition duration-150 shadow-sm cursor-pointer"
            aria-label="Verify OTP and Pay"
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
              <span>Verify & Pay</span>
            )}
          </button>
        </div>
      </form>
    );
  }

  // ─── Render: Card Details Step ─────────────────────────────────────────────

  return (
    <form onSubmit={handleDetailsSubmit} noValidate className="space-y-4">
      {/* Card Number */}
      <div className="space-y-1.5">
        <label
          htmlFor="card-number"
          className="block text-xs font-medium text-zinc-300"
        >
          Card Number
        </label>
        <input
          id="card-number"
          type="text"
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="4532 •••• •••• 8888"
          value={cardNumber}
          onChange={handleCardNumberChange}
          onBlur={() => {
            setTouched((p) => ({ ...p, cardNumber: true }));
            setErrors((prev) => ({
              ...prev,
              cardNumber: validateCardNumber(cardNumber),
            }));
          }}
          disabled={disabled}
          aria-invalid={errors.cardNumber ? "true" : "false"}
          aria-describedby={errors.cardNumber ? "card-number-error" : undefined}
          className={`w-full bg-zinc-950 border rounded-xl px-4 py-3 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition ${
            errors.cardNumber
              ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              : "border-zinc-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
          }`}
        />
        {errors.cardNumber && (
          <p
            id="card-number-error"
            role="alert"
            className="text-xs text-rose-400 mt-1"
          >
            {errors.cardNumber}
          </p>
        )}
      </div>

      {/* Row: Expiry & CVV */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label
            htmlFor="card-expiry"
            className="block text-xs font-medium text-zinc-300"
          >
            Expiry Date
          </label>
          <input
            id="card-expiry"
            type="text"
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM/YY"
            maxLength={5}
            value={expiry}
            onChange={handleExpiryChange}
            onBlur={() => {
              setTouched((p) => ({ ...p, expiry: true }));
              setErrors((prev) => ({
                ...prev,
                expiry: validateExpiry(expiry),
              }));
            }}
            disabled={disabled}
            aria-invalid={errors.expiry ? "true" : "false"}
            aria-describedby={errors.expiry ? "card-expiry-error" : undefined}
            className={`w-full bg-zinc-950 border rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition ${
              errors.expiry
                ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                : "border-zinc-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            }`}
          />
          {errors.expiry && (
            <p
              id="card-expiry-error"
              role="alert"
              className="text-xs text-rose-400 mt-1"
            >
              {errors.expiry}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="card-cvv"
            className="block text-xs font-medium text-zinc-300"
          >
            CVV
          </label>
          <input
            id="card-cvv"
            type="password"
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="•••"
            maxLength={3}
            value={cvv}
            onChange={handleCvvChange}
            onBlur={() => {
              setTouched((p) => ({ ...p, cvv: true }));
              setErrors((prev) => ({
                ...prev,
                cvv: validateCvv(cvv),
              }));
            }}
            disabled={disabled}
            aria-invalid={errors.cvv ? "true" : "false"}
            aria-describedby={errors.cvv ? "card-cvv-error" : undefined}
            className={`w-full bg-zinc-950 border rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition ${
              errors.cvv
                ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                : "border-zinc-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            }`}
          />
          {errors.cvv && (
            <p
              id="card-cvv-error"
              role="alert"
              className="text-xs text-rose-400 mt-1"
            >
              {errors.cvv}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={disabled}
        className="w-full mt-2 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-3 px-4 rounded-xl transition duration-150 shadow-sm cursor-pointer"
        aria-label="Proceed to OTP verification"
      >
        Continue to OTP →
      </button>
    </form>
  );
}
