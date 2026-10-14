export interface OrderItem {
  name: string;
  quantity: number;
  priceInPaise: number;
}

export interface Order {
  orderId: string;
  merchant: string;
  items: OrderItem[];
  totalInPaise: number;
}

export type PaymentMethod = "upi" | "card";

export type PaymentStatus = "SUCCESS" | "FAILED" | "PENDING";

export interface Payment {
  paymentId: string;
  orderId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: number;
  idempotencyKey: string;
  failureReason?: string;
}

export type PaymentStage =
  | "IDLE"
  | "SENDING"
  | "PENDING"
  | "SUCCESS"
  | "FAILED";

export interface PaymentState {
  stage: PaymentStage;
  paymentId: string;
  idempotencyKey: string;
  orderId: string;
  totalInPaise: number;
  reason: string;
}
