"use client";

import { useState } from "react";
import { usePayment } from "@/hooks/usePayment";
import { OrderSummary } from "@/components/OrderSummary";
import { UpiForm } from "@/components/UpiForm";
import { CardForm } from "@/components/CardForm";
import { ProcessingOverlay } from "@/components/ProcessingOverlay";
import { PendingScreen } from "@/components/PendingScreen";
import { SuccessScreen } from "@/components/SuccessScreen";
import { FailureScreen } from "@/components/FailureScreen";
import type { Order } from "@/types";

interface CheckoutFormProps {
  order: Order;
}

type MethodTab = "upi" | "card";

export function CheckoutForm({ order }: CheckoutFormProps) {
  const [activeTab, setActiveTab] = useState<MethodTab>("upi");
  const { state, submit, retry } = usePayment({
    orderId: order.orderId,
    totalInPaise: order.totalInPaise,
  });

  const isProcessing = state.stage === "SENDING";
  const isPending = state.stage === "PENDING";
  const isTerminal = state.stage === "SUCCESS" || state.stage === "FAILED";
  const isFormDisabled = isProcessing || isPending || isTerminal;

  function handleUpiSubmit(_upiId: string) {
    submit("upi");
  }

  function handleCardSubmit() {
    submit("card");
  }

  // ─── Terminal / Interim States ──────────────────────────────────────────────

  if (state.stage === "SUCCESS") {
    return (
      <div className="w-full max-w-lg mx-auto">
        <SuccessScreen
          paymentId={state.paymentId}
          totalInPaise={state.totalInPaise}
        />
      </div>
    );
  }

  if (state.stage === "FAILED") {
    return (
      <div className="w-full max-w-lg mx-auto">
        <FailureScreen
          reason={state.reason}
          paymentId={state.paymentId}
          onRetry={retry}
        />
      </div>
    );
  }

  if (state.stage === "SENDING") {
    return (
      <div className="w-full max-w-lg mx-auto">
        <ProcessingOverlay />
      </div>
    );
  }

  if (state.stage === "PENDING") {
    return (
      <div className="w-full max-w-lg mx-auto">
        <PendingScreen />
      </div>
    );
  }

  // ─── Main Checkout View ───────────────────────────────────────────────────

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
      {/* Left Column: Order Summary */}
      <aside className="md:col-span-5 w-full">
        <OrderSummary order={order} />
      </aside>

      {/* Right Column: Payment Form */}
      <section className="md:col-span-7 w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white tracking-tight">
            Complete Payment
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Select your preferred payment method below
          </p>
        </div>

        {/* Method Switcher Tabs */}
        <div
          role="tablist"
          aria-label="Payment method"
          className="grid grid-cols-2 p-1 bg-zinc-950 border border-zinc-800/80 rounded-xl gap-1 mb-6"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "upi"}
            aria-controls="panel-upi"
            id="tab-upi"
            onClick={() => setActiveTab("upi")}
            disabled={isFormDisabled}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-medium transition duration-150 cursor-pointer ${
              activeTab === "upi"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <span aria-hidden="true">📱</span>
            <span>UPI</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "card"}
            aria-controls="panel-card"
            id="tab-card"
            onClick={() => setActiveTab("card")}
            disabled={isFormDisabled}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-medium transition duration-150 cursor-pointer ${
              activeTab === "card"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <span aria-hidden="true">💳</span>
            <span>Card</span>
          </button>
        </div>

        {/* UPI Form */}
        <div
          id="panel-upi"
          role="tabpanel"
          aria-labelledby="tab-upi"
          hidden={activeTab !== "upi"}
        >
          <UpiForm onSubmit={handleUpiSubmit} disabled={isFormDisabled} />
        </div>

        {/* Card Form */}
        <div
          id="panel-card"
          role="tabpanel"
          aria-labelledby="tab-card"
          hidden={activeTab !== "card"}
        >
          <CardForm onSubmit={handleCardSubmit} disabled={isFormDisabled} />
        </div>

        {/* Security Footer */}
        <div className="mt-6 pt-5 border-t border-zinc-800/80 flex items-center justify-center gap-2 text-xs text-zinc-400">
          <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>End-to-end 256-bit encrypted checkout</span>
        </div>
      </section>
    </div>
  );
}
