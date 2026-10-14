export function validateUpiId(val: string): string | null {
  const trimmed = val.trim();
  if (!trimmed) {
    return "UPI ID is required.";
  }
  // Standard VPA regex: username@bank
  const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
  if (!upiRegex.test(trimmed)) {
    return "Enter a valid UPI ID (e.g. name@okaxis, user@upi).";
  }
  return null;
}

export function validateCardNumber(val: string): string | null {
  const digits = val.replace(/\D/g, "");
  if (!digits) {
    return "Card number is required.";
  }
  if (digits.length !== 16) {
    return "Card number must be 16 digits.";
  }

  // Luhn algorithm check
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  if (sum % 10 !== 0) {
    return "Invalid card number. Please check the digits.";
  }

  return null;
}

export function validateExpiry(val: string): string | null {
  const trimmed = val.trim();
  if (!trimmed) {
    return "Expiry date is required.";
  }
  const match = trimmed.match(/^(\d{2})\/(\d{2})$/);
  if (!match) {
    return "Format must be MM/YY.";
  }

  const month = parseInt(match[1], 10);
  const year = 2000 + parseInt(match[2], 10);

  if (month < 1 || month > 12) {
    return "Month must be between 01 and 12.";
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-indexed

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return "Card has expired.";
  }

  return null;
}

export function validateCvv(val: string): string | null {
  const digits = val.replace(/\D/g, "");
  if (!digits) {
    return "CVV is required.";
  }
  if (digits.length !== 3) {
    return "CVV must be 3 digits.";
  }
  return null;
}

export function validateOtp(entered: string, expected: string): string | null {
  const trimmed = entered.trim();
  if (!trimmed) {
    return "OTP is required.";
  }
  if (!/^\d{6}$/.test(trimmed)) {
    return "OTP must be 6 digits.";
  }
  if (trimmed !== expected) {
    return "Incorrect OTP. Please enter the OTP displayed.";
  }
  return null;
}
