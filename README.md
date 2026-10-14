# Secure Checkout Flow

A modern, minimal, and resilient payment checkout application built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

---

## 📌 Project Overview

This project implements an end-to-end payment checkout flow designed to guarantee payment safety and prevent duplicate charges:

- **Payment Methods**: Supports **UPI** (VPA handle validation) and **Card** (Luhn algorithm check, expiry date verification, 3-digit CVV, and OTP verification step).
- **Double Payment Prevention**: Combines client-side button locking with server-enforced **Idempotency Keys** (`Idempotency-Key` header with UUID v4) so repeated or concurrent requests never create duplicate payments.
- **Payment Lifecycle & Polling**: Handles `SENDING` → `PENDING` → `SUCCESS` / `FAILED` transitions with automatic polling and retry capabilities.
- **Session Recovery**: Persists pending payment reference per order in session storage so refreshing or returning to the page recovers the existing transaction state rather than initiating a new charge.
- **Multi-Order Support**: Browse and select from multiple mock orders or navigate directly to `/checkout/[orderId]`.

---

## 🚀 Setup & Installation

### Prerequisites

- **Node.js**: v18.18.0 or higher
- **npm**, **yarn**, or **pnpm**

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Development Server

```bash
npm run dev
```

The application will be running locally at:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🧪 How to Test & Verify

### 1. View Orders & Navigate to Checkout

- Open [http://localhost:3000](http://localhost:3000) to view all available mock orders (`ORD-001`, `ORD-002`, `ORD-003`).
- Click **"Proceed to Pay"** on any card to navigate to `/checkout/[orderId]`.
- Click **"← All Orders"** in the sidebar at any time to switch between orders.

### 2. Testing UPI Flow

- Select the **UPI** tab.
- Enter a valid UPI handle, for example: `name@okaxis`, `user@paytm`, or `john@okhdfcbank`.
- Click **Pay Now**. The UI shows the secure processing overlay and polls until the transaction reaches `SUCCESS` or `FAILED`.

### 3. Testing Card Payment & OTP

- Select the **Card** tab.
- Enter valid card credentials:
  - **Card Number**: Any 16-digit number passing the Luhn algorithm (e.g. `4532 0150 0000 0000` or standard test cards).
  - **Expiry**: Any future date in `MM/YY` format (e.g. `12/28`).
  - **CVV**: Any 3-digit number (e.g. `123`).
- Click **Continue to OTP →**.
- A mock OTP is generated and shown on screen.
- Enter the 6-digit OTP and click **Verify & Pay**.

### 4. Testing Double-Click & Idempotency

- Rapidly click the Pay / Verify button: the button immediately disables, preventing duplicate network calls.
- Inspect network requests in DevTools: each payment attempt sends a unique `Idempotency-Key` header. If re-transmitted, the server returns the existing payment record rather than creating a new one.

### 5. Testing Tab Refresh & State Recovery

- When a payment enters the **"Confirming Your Payment"** (`PENDING`) state, refresh the browser page.
- The application rehydrates the in-flight payment ID and resumes polling without creating a new payment attempt.

---
