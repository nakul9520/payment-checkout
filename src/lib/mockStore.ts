import type { Order, Payment } from "@/types";

// ─── Orders ──────────────────────────────────────────────────────────────────

const SEED_ORDERS: Order[] = [
  {
    orderId: "ORD-001",
    merchant: "Artisan Coffee Co.",
    items: [
      { name: "Single Origin Ethiopia Yirgacheffe (250g)", quantity: 2, priceInPaise: 59900 },
      { name: "Cold Brew Starter Kit", quantity: 1, priceInPaise: 129900 },
    ],
    totalInPaise: 249700,
  },
  {
    orderId: "ORD-002",
    merchant: "Nakul Electronics",
    items: [
      { name: "Wireless Noise-Cancelling Headphones", quantity: 1, priceInPaise: 899900 },
      { name: "USB-C Charging Cable (2m)", quantity: 2, priceInPaise: 14900 },
    ],
    totalInPaise: 929700,
  },
  {
    orderId: "ORD-003",
    merchant: "Fresh Basket",
    items: [
      { name: "Organic Mixed Vegetables Box", quantity: 1, priceInPaise: 34900 },
      { name: "Farm Fresh Eggs (12-pack)", quantity: 2, priceInPaise: 11900 },
    ],
    totalInPaise: 58700,
  },
];

const orderMap = new Map<string, Order>(
  SEED_ORDERS.map((o) => [o.orderId, o])
);

export function getOrder(orderId: string): Order | undefined {
  return orderMap.get(orderId);
}

export function getAllOrders(): Order[] {
  return Array.from(orderMap.values());
}

// ─── Payments ─────────────────────────────────────────────────────────────────

const paymentByIdempotencyKey = new Map<string, Payment | Promise<Payment>>();
const paymentById = new Map<string, Payment>();

const FAILURE_REASONS = [
  "Insufficient funds",
  "Bank declined the transaction",
  "Card limit exceeded",
  "Network timeout from issuing bank",
];

function randomStatus(): "SUCCESS" | "FAILED" | "PENDING" {
  const r = Math.random();
  if (r < 0.34) return "SUCCESS";
  if (r < 0.67) return "FAILED";
  return "PENDING";
}

function randomFailureReason(): string {
  return FAILURE_REASONS[Math.floor(Math.random() * FAILURE_REASONS.length)];
}

function generatePaymentId(): string {
  return `pay_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function getOrCreatePayment(
  idempotencyKey: string,
  orderId: string,
  method: "upi" | "card"
): Promise<Payment> {
  const existing = paymentByIdempotencyKey.get(idempotencyKey);

  if (existing instanceof Promise) {
    return existing;
  }
  if (existing) {
    return existing;
  }

  const paymentPromise: Promise<Payment> = (async () => {
    // Simulate ~1.5 s processing delay
    await new Promise((r) => setTimeout(r, 1500));

    const status = randomStatus();
    const payment: Payment = {
      paymentId: generatePaymentId(),
      orderId,
      method,
      status,
      createdAt: Date.now(),
      idempotencyKey,
      ...(status === "FAILED" ? { failureReason: randomFailureReason() } : {}),
    };

    paymentByIdempotencyKey.set(idempotencyKey, payment);
    paymentById.set(payment.paymentId, payment);

    return payment;
  })();

  paymentByIdempotencyKey.set(idempotencyKey, paymentPromise);
  return paymentPromise;
}

const PENDING_TTL_MS = 5000; // 5 seconds before PENDING resolves

export function getPaymentStatus(paymentId: string): Payment | undefined {
  const payment = paymentById.get(paymentId);
  if (!payment) return undefined;

  if (
    payment.status === "PENDING" &&
    Date.now() - payment.createdAt >= PENDING_TTL_MS
  ) {
    const resolved = Math.random() < 0.7 ? "SUCCESS" : "FAILED";
    const updated: Payment = {
      ...payment,
      status: resolved,
      ...(resolved === "FAILED"
        ? { failureReason: randomFailureReason() }
        : {}),
    };
    paymentById.set(paymentId, updated);
    paymentByIdempotencyKey.set(payment.idempotencyKey, updated);
    return updated;
  }

  return payment;
}
