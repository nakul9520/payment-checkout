"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { generateIdempotencyKey } from "@/lib/idempotency";
import type { Payment, PaymentMethod, PaymentState } from "@/types";

interface UsePaymentOptions {
  orderId: string;
  totalInPaise: number;
}

const STORAGE_PREFIX = "checkout_payment_";

export function usePayment({ orderId, totalInPaise }: UsePaymentOptions) {
  const [state, setState] = useState<PaymentState>(() => ({
    stage: "IDLE",
    paymentId: "",
    idempotencyKey: generateIdempotencyKey(),
    orderId,
    totalInPaise,
    reason: "",
  }));

  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const isSubmittingRef = useRef(false);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const pollStatus = useCallback(
    (paymentId: string) => {
      stopPolling();

      const check = async () => {
        try {
          const res = await fetch(`/api/payments/${paymentId}`);
          if (!res.ok) return;

          const data: Payment = await res.json();
          if (data.status === "SUCCESS") {
            stopPolling();
            sessionStorage.removeItem(`${STORAGE_PREFIX}${orderId}`);
            setState((prev) => ({
              ...prev,
              stage: "SUCCESS",
              paymentId: data.paymentId,
            }));
          } else if (data.status === "FAILED") {
            stopPolling();
            sessionStorage.removeItem(`${STORAGE_PREFIX}${orderId}`);
            setState((prev) => ({
              ...prev,
              stage: "FAILED",
              paymentId: data.paymentId,
              reason: data.failureReason || "Transaction declined by bank",
            }));
          }
        } catch {
          // Network hiccup — keep polling
        }
      };

      // Check immediately, then poll every 1 second
      check();
      pollingRef.current = setInterval(check, 1000);
    },
    [orderId, stopPolling]
  );

  // Restore in-flight payment on mount/reload
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(`${STORAGE_PREFIX}${orderId}`);
      if (saved) {
        const parsed: { paymentId: string; idempotencyKey: string } =
          JSON.parse(saved);
        if (parsed.paymentId) {
          setState((prev) => ({
            ...prev,
            stage: "PENDING",
            paymentId: parsed.paymentId,
            idempotencyKey: parsed.idempotencyKey || prev.idempotencyKey,
          }));
          pollStatus(parsed.paymentId);
        }
      }
    } catch {
      // Storage unavailable or invalid
    }

    return () => {
      stopPolling();
    };
  }, [orderId, pollStatus, stopPolling]);

  const submit = useCallback(
    async (method: PaymentMethod) => {
      if (isSubmittingRef.current) return;
      isSubmittingRef.current = true;

      const currentKey = state.idempotencyKey;
      setState((prev) => ({ ...prev, stage: "SENDING" }));

      try {
        const res = await fetch("/api/payments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Idempotency-Key": currentKey,
          },
          body: JSON.stringify({ orderId, method }),
        });

        if (!res.ok) {
          setState((prev) => ({
            ...prev,
            stage: "FAILED",
            reason: "Failed to initiate payment. Please try again.",
          }));
          isSubmittingRef.current = false;
          return;
        }

        const data: Payment = await res.json();

        if (data.status === "SUCCESS") {
          sessionStorage.removeItem(`${STORAGE_PREFIX}${orderId}`);
          setState((prev) => ({
            ...prev,
            stage: "SUCCESS",
            paymentId: data.paymentId,
          }));
        } else if (data.status === "FAILED") {
          sessionStorage.removeItem(`${STORAGE_PREFIX}${orderId}`);
          setState((prev) => ({
            ...prev,
            stage: "FAILED",
            paymentId: data.paymentId,
            reason: data.failureReason || "Payment declined by issuing bank",
          }));
        } else {
          // PENDING
          sessionStorage.setItem(
            `${STORAGE_PREFIX}${orderId}`,
            JSON.stringify({
              paymentId: data.paymentId,
              idempotencyKey: currentKey,
            })
          );
          setState((prev) => ({
            ...prev,
            stage: "PENDING",
            paymentId: data.paymentId,
          }));
          pollStatus(data.paymentId);
        }
      } catch {
        setState((prev) => ({
          ...prev,
          stage: "FAILED",
          reason: "Network error occurred while processing payment.",
        }));
      } finally {
        isSubmittingRef.current = false;
      }
    },
    [orderId, state.idempotencyKey, pollStatus]
  );

  const retry = useCallback(() => {
    stopPolling();
    sessionStorage.removeItem(`${STORAGE_PREFIX}${orderId}`);
    setState({
      stage: "IDLE",
      paymentId: "",
      idempotencyKey: generateIdempotencyKey(),
      orderId,
      totalInPaise,
      reason: "",
    });
    isSubmittingRef.current = false;
  }, [orderId, totalInPaise, stopPolling]);

  return { state, submit, retry };
}
