// Helper utility functions for dates, currency formatting, and booking calculations

/**
 * Format a number as Indian Rupee (INR) currency
 * e.g., 4500 => "₹4,500"
 */
export function formatCurrency(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Returns today's date formatted as YYYY-MM-DD for <input type="date">
 */
export function getTodayDateString() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Returns tomorrow's date formatted as YYYY-MM-DD
 */
export function getTomorrowDateString(baseDateString) {
  const base = baseDateString ? new Date(baseDateString) : new Date();
  if (isNaN(base.getTime())) {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  }
  const nextDay = new Date(base);
  nextDay.setDate(nextDay.getDate() + 1);
  return nextDay.toISOString().split('T')[0];
}

/**
 * Calculates number of nights between checkIn and checkOut strings (YYYY-MM-DD)
 */
export function calculateNights(checkInDate, checkOutDate) {
  if (!checkInDate || !checkOutDate) return 0;
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

/**
 * Calculates the complete booking bill breakdown
 */
export function calculateBookingTotal(pricePerNight, nights, taxRate = 0.12) {
  const validNights = Math.max(1, Number(nights) || 1);
  const basePrice = Number(pricePerNight) || 0;
  const subtotal = basePrice * validNights;
  const taxAmount = Math.round(subtotal * taxRate);
  const totalAmount = subtotal + taxAmount;

  return {
    nights: validNights,
    pricePerNight: basePrice,
    subtotal,
    taxRatePercentage: Math.round(taxRate * 100),
    taxAmount,
    totalAmount
  };
}

/**
 * Formats standard ISO or YYYY-MM-DD date into human friendly string
 * e.g. "2026-11-15" => "Sun, 15 Nov 2026"
 */
export function formatDisplayDate(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Email format validation
 */
export function isValidEmail(email) {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Indian phone number validation (accepts 10 digits with optional +91 or leading zero)
 */
export function isValidPhone(phone) {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s\-+()]/g, '');
  return cleaned.length >= 10 && cleaned.length <= 13;
}
