"use client";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { business } from "@/lib/config";
import { VALIDATORS, BOOKING_TYPES, TYPE_LABELS, PRICING_KEY } from "@/lib/bookingConfig";

const LocationPicker = dynamic(() => import("./LocationPicker"), { ssr: false });

export default function BookingForm() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") === "off-site" ? "off-site" : "on-site";

  const [type, setType] = useState(initialType);
  const [form, setForm] = useState({ name: "", phone: "", date: "", time: "", notes: "" });
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = useCallback((field, value) => {
    const msg = VALIDATORS[field](value);
    setErrors((prev) => ({ ...prev, [field]: msg }));
    return msg;
  }, []);

  function update(field, val) {
    setForm((f) => ({ ...f, [field]: val }));
    if (touched[field]) {
      validate(field, val);
    }
  }

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate(field, form[field]);
  }

  function validateAll() {
    const newErrors = {};
    let valid = true;
    for (const field of Object.keys(VALIDATORS)) {
      const msg = VALIDATORS[field](form[field]);
      if (msg) {
        newErrors[field] = msg;
        valid = false;
      }
    }
    if (type === "off-site" && !location) {
      valid = false;
    }
    setErrors(newErrors);
    setTouched({ name: true, phone: true, date: true, time: true, notes: true });
    return valid;
  }

  function inputClass(field) {
    const base = "mt-1 w-full rounded-lg border px-4 py-2.5 font-body text-ink focus:outline-none focus:ring-2 transition-colors";
    if (errors[field] && touched[field]) {
      return base + " border-red-400 focus:ring-red-400 bg-red-50/50";
    }
    return base + " border-sage focus:ring-ember";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateAll()) {
      if (type === "off-site" && !location) {
        setErrorMsg("Drop a pin on the map so we know where to bring the equipment.");
        setStatus("error");
      }
      return;
    }
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, ...form, location: type === "off-site" ? location : undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  }

  if (status === "success") {
    return (
      <div className="bg-ivory rounded-2xl p-8 text-center">
        <div className="font-display text-2xl font-semibold text-jade mb-2">Booking requested</div>
        <p className="font-body text-ink/70">
          We&apos;ll confirm by phone or WhatsApp at {form.phone} before your {type === "on-site" ? "studio" : "home"}{" "}
          session on {form.date} at {form.time}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-ivory rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="grid grid-cols-2 gap-3">
        {BOOKING_TYPES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`rounded-full py-3 font-body font-semibold text-sm border-2 transition-colors ${
              type === t ? "bg-jade text-ivory border-jade" : "bg-transparent text-jade border-jade"
            }`}
          >
            {TYPE_LABELS[t]} · {business.pricing[PRICING_KEY[t]].currency} {business.pricing[PRICING_KEY[t]].amount}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="font-body text-sm font-semibold text-jade">Full name</span>
          <input
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            className={inputClass("name")}
          />
          {errors.name && touched.name && (
            <span className="mt-1 block font-body text-xs text-red-600">{errors.name}</span>
          )}
        </label>
        <label className="block">
          <span className="font-body text-sm font-semibold text-jade">Phone / WhatsApp</span>
          <input
            required
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            onBlur={() => handleBlur("phone")}
            className={inputClass("phone")}
          />
          {errors.phone && touched.phone && (
            <span className="mt-1 block font-body text-xs text-red-600">{errors.phone}</span>
          )}
        </label>
        <label className="block">
          <span className="font-body text-sm font-semibold text-jade">Date</span>
          <input
            required
            type="date"
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
            onBlur={() => handleBlur("date")}
            className={inputClass("date")}
          />
          {errors.date && touched.date && (
            <span className="mt-1 block font-body text-xs text-red-600">{errors.date}</span>
          )}
        </label>
        <label className="block">
          <span className="font-body text-sm font-semibold text-jade">Time</span>
          <input
            required
            type="time"
            value={form.time}
            onChange={(e) => update("time", e.target.value)}
            onBlur={() => handleBlur("time")}
            min="08:00"
            max="18:00"
            className={inputClass("time")}
          />
          {errors.time && touched.time && (
            <span className="mt-1 block font-body text-xs text-red-600">{errors.time}</span>
          )}
        </label>
      </div>

      {type === "off-site" && <LocationPicker value={location} onChange={setLocation} center={business.location} />}

      <label className="block">          <span className="font-body text-sm font-semibold text-jade">Notes (optional)</span>
          <textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            onBlur={() => handleBlur("notes")}
            rows={3}
            className={inputClass("notes")}
          />
          {errors.notes && touched.notes && (
            <span className="mt-1 block font-body text-xs text-red-600">{errors.notes}</span>
          )}
      </label>

      {status === "error" && errorMsg && (
        <p className="font-body text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full btn-primary font-body font-semibold py-3.5 rounded-full disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Request this booking"}
      </button>
    </form>
  );
}
