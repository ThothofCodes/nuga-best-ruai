// ─── Booking Configuration ────────────────────────────────────────────────────
// Single source of truth for every booking-related constant, validation rule,
// status map, and helper function. Import from here instead of hardcoding.

import { business } from "./config";

// ─── Status ──────────────────────────────────────────────────────────────────

export const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "completed",
  "declined",
  "cancelled",
];

export const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  declined: "Declined",
  cancelled: "Cancelled",
};

export const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  confirmed: "bg-emerald-100 text-emerald-800 border-emerald-300",
  completed: "bg-blue-100 text-blue-800 border-blue-300",
  declined: "bg-red-100 text-red-800 border-red-300",
  cancelled: "bg-gray-100 text-gray-600 border-gray-300",
};

export const DEFAULT_STATUS = "pending";

// ─── Types ───────────────────────────────────────────────────────────────────

export const BOOKING_TYPES = ["on-site", "off-site"];

export const TYPE_LABELS = {
  "on-site": "At the studio",
  "off-site": "Home visit",
};

/** Map booking type (kebab-case) to the key used in business.pricing (camelCase). */
export const PRICING_KEY = {
  "on-site": "onSite",
  "off-site": "offSite",
};

// ─── Limits ──────────────────────────────────────────────────────────────────

export const LIMITS = {
  nameMinLength: 2,
  nameMaxLength: 100,
  phoneMinDigits: 9,
  phoneMaxDigits: 15,
  notesMaxLength: 500,
  maxBookingsPerRequest: 200, // GET endpoint limit
};

// ─── Business hours ──────────────────────────────────────────────────────────

export const BUSINESS_HOURS = {
  open: "08:00",
  close: "18:00",
};

// ─── Validation rules ────────────────────────────────────────────────────────
// Shared between client (BookingForm) and server (api/bookings).

export const VALIDATORS = {
  name: (v) => {
    if (!v || !v.trim()) return "Name is required.";
    if (v.trim().length < LIMITS.nameMinLength)
      return `Name must be at least ${LIMITS.nameMinLength} characters.`;
    if (v.trim().length > LIMITS.nameMaxLength)
      return `Name must be at most ${LIMITS.nameMaxLength} characters.`;
    return "";
  },
  phone: (v) => {
    if (!v || !v.trim()) return "Phone number is required.";
    const digits = v.replace(/[^\d+]/g, "");
    if (digits.length < LIMITS.phoneMinDigits)
      return `Enter a valid phone number (at least ${LIMITS.phoneMinDigits} digits).`;
    if (digits.length > LIMITS.phoneMaxDigits)
      return `Phone number is too long (max ${LIMITS.phoneMaxDigits} digits).`;
    return "";
  },
  date: (v) => {
    if (!v) return "Date is required.";
    const selected = new Date(v + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today) return "Date cannot be in the past.";
    return "";
  },
  time: (v) => {
    if (!v) return "Time is required.";
    if (v < BUSINESS_HOURS.open || v > BUSINESS_HOURS.close)
      return `Time must be between ${formatTime12h(BUSINESS_HOURS.open)} and ${formatTime12h(BUSINESS_HOURS.close)}.`;
    return "";
  },
  notes: (v) => {
    if (v && v.length > LIMITS.notesMaxLength)
      return `Notes must be at most ${LIMITS.notesMaxLength} characters.`;
    return "";
  },
};

// ─── Server-side validation ──────────────────────────────────────────────────
// Returns { valid, errors, errorMsg } for the API route.

export function validateBookingPayload(body) {
  const { type, name, phone, date, time, location } = body;
  const errors = {};

  if (!type || !BOOKING_TYPES.includes(type)) {
    errors.type = "Invalid booking type.";
  }

  const nameErr = VALIDATORS.name(name);
  if (nameErr) errors.name = nameErr;

  const phoneErr = VALIDATORS.phone(phone);
  if (phoneErr) errors.phone = phoneErr;

  const dateErr = VALIDATORS.date(date);
  if (dateErr) errors.date = dateErr;

  const timeErr = VALIDATORS.time(time);
  if (timeErr) errors.time = timeErr;

  const notesErr = VALIDATORS.notes(body.notes);
  if (notesErr) errors.notes = notesErr;

  if (type === "off-site" && (!location || typeof location.lat !== "number")) {
    errors.location = "A location pin is required for home visits.";
  }

  const valid = Object.keys(errors).length === 0;
  const errorMsg = valid ? "" : Object.values(errors).join(" ");

  return { valid, errors, errorMsg };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Normalize a Kenyan phone number to international format (254XXXXXXXXX). */
function normalizePhone(phone) {
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.startsWith("0") && digits.length >= 10) return "254" + digits.slice(1);
  if (digits.startsWith("254")) return digits;
  return digits;
}

/** Convert "HH:mm" to "h:MM AM/PM" for display. */
function formatTime12h(time24) {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

/** Format a YYYY-MM-DD date string for display. */
export function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-KE", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/** Build a context-aware WhatsApp message for a booking. */
function whatsappMessage(booking) {
  const session = booking.type === "on-site" ? "studio" : "home";
  const when = `${booking.date} at ${booking.time}`;
  const name = business.name;

  switch (booking.status) {
    case "confirmed":
      return `Hi ${booking.name}, your ${session} session at ${name} is confirmed for ${when}. See you soon!`;
    case "completed":
      return `Hi ${booking.name}, thanks for visiting ${name}! Hope you enjoyed your ${session} session. See you next time!`;
    case "declined":
      return `Hi ${booking.name}, unfortunately we couldn't accommodate your booking for ${when}. Please contact us to reschedule.`;
    case "cancelled":
      return `Hi ${booking.name}, your booking for ${when} has been cancelled. Let us know if you'd like to rebook.`;
    default:
      return `Hi ${booking.name}, thanks for your booking request at ${name} for ${when}. We'll confirm shortly!`;
  }
}

/** Build a wa.me link for a booking's phone number. */
export function whatsappLink(booking) {
  const phone = normalizePhone(booking.phone);
  const text = encodeURIComponent(whatsappMessage(booking));
  return `https://wa.me/${phone}?text=${text}`;
}

/** Session config for admin auth. */
export const SESSION_CONFIG = {
  maxAge: 60 * 60 * 8, // 8 hours in seconds
  cookieName: "admin_session",
};
