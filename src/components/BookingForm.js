"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { business } from "@/lib/config";

const LocationPicker = dynamic(() => import("./LocationPicker"), { ssr: false });

export default function BookingForm() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") === "off-site" ? "off-site" : "on-site";

  const [type, setType] = useState(initialType);
  const [form, setForm] = useState({ name: "", phone: "", date: "", time: "", notes: "" });
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");

  function update(field, val) {
    setForm((f) => ({ ...f, [field]: val }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (type === "off-site" && !location) {
      setStatus("error");
      setErrorMsg("Drop a pin on the map so we know where to bring the equipment.");
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
        <button
          type="button"
          onClick={() => setType("on-site")}
          className={`rounded-full py-3 font-body font-semibold text-sm border-2 transition-colors ${
            type === "on-site" ? "bg-jade text-ivory border-jade" : "bg-transparent text-jade border-jade"
          }`}
        >
          At the studio · {business.pricing.onSite.currency} {business.pricing.onSite.amount}
        </button>
        <button
          type="button"
          onClick={() => setType("off-site")}
          className={`rounded-full py-3 font-body font-semibold text-sm border-2 transition-colors ${
            type === "off-site" ? "bg-jade text-ivory border-jade" : "bg-transparent text-jade border-jade"
          }`}
        >
          Home visit · {business.pricing.offSite.currency} {business.pricing.offSite.amount}
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="font-body text-sm font-semibold text-jade">Full name</span>
          <input
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="mt-1 w-full rounded-lg border border-sage px-4 py-2.5 font-body text-ink focus:outline-none focus:ring-2 focus:ring-ember"
          />
        </label>
        <label className="block">
          <span className="font-body text-sm font-semibold text-jade">Phone / WhatsApp</span>
          <input
            required
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="mt-1 w-full rounded-lg border border-sage px-4 py-2.5 font-body text-ink focus:outline-none focus:ring-2 focus:ring-ember"
          />
        </label>
        <label className="block">
          <span className="font-body text-sm font-semibold text-jade">Date</span>
          <input
            required
            type="date"
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
            className="mt-1 w-full rounded-lg border border-sage px-4 py-2.5 font-body text-ink focus:outline-none focus:ring-2 focus:ring-ember"
          />
        </label>
        <label className="block">
          <span className="font-body text-sm font-semibold text-jade">Time</span>
          <input
            required
            type="time"
            value={form.time}
            onChange={(e) => update("time", e.target.value)}
            min="08:00"
            max="18:00"
            className="mt-1 w-full rounded-lg border border-sage px-4 py-2.5 font-body text-ink focus:outline-none focus:ring-2 focus:ring-ember"
          />
        </label>
      </div>

      {type === "off-site" && <LocationPicker value={location} onChange={setLocation} center={business.location} />}

      <label className="block">
        <span className="font-body text-sm font-semibold text-jade">Notes (optional)</span>
        <textarea
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border border-sage px-4 py-2.5 font-body text-ink focus:outline-none focus:ring-2 focus:ring-ember"
        />
      </label>

      {status === "error" && <p className="font-body text-sm text-red-600">{errorMsg}</p>}

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
