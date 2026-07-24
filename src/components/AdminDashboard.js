"use client";
import { useState, useEffect } from "react";
import {
  BOOKING_STATUSES,
  STATUS_COLORS,
  STATUS_LABELS,
  whatsappLink,
  formatDate,
} from "@/lib/bookingConfig";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setError("");
        const [filteredRes, allRes] = await Promise.all([
          fetch(`/api/bookings?status=${filter}`),
          fetch(`/api/bookings?status=all`),
        ]);
        const filteredData = await filteredRes.json();
        const allData = await allRes.json();
        if (!filteredRes.ok) throw new Error(filteredData.error || "Failed to load bookings.");
        if (!allRes.ok) throw new Error(allData.error || "Failed to load bookings.");
        if (!cancelled) {
          setBookings(filteredData.bookings);
          setAllBookings(allData.bookings);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [filter]);

  async function updateStatus(id, status) {
    try {
      setUpdatingId(id);
      setError("");
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed.");
      const updater = (prev) => prev.map((b) => (b._id === id ? { ...b, status } : b));
      setBookings(updater);
      setAllBookings(updater);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteBooking(id) {
    if (!confirm("Delete this booking? This cannot be undone.")) return;
    try {
      setUpdatingId(id);
      setError("");
      const res = await fetch(`/api/bookings?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed.");
      const remover = (prev) => prev.filter((b) => b._id !== id);
      setBookings(remover);
      setAllBookings(remover);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  }



  const counts = {
    all: allBookings.length,
    pending: allBookings.filter((b) => b.status === "pending").length,
    confirmed: allBookings.filter((b) => b.status === "confirmed").length,
    completed: allBookings.filter((b) => b.status === "completed").length,
    declined: allBookings.filter((b) => b.status === "declined").length,
    cancelled: allBookings.filter((b) => b.status === "cancelled").length,
  };

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    window.location.href = "/admin/login";
  }

  return (
    <div className="space-y-6">
      {/* Logout button */}
      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-full text-sm font-body font-semibold border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Sign out
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {["all", ...BOOKING_STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => { setFilter(s); setLoading(true); }}
            className={`px-4 py-2 rounded-full text-sm font-body font-semibold border-2 transition-colors capitalize ${
              filter === s
                ? "bg-jade text-ivory border-jade"
                : "bg-transparent text-jade border-jade hover:bg-jade hover:text-ivory"
            }`}
          >                    {STATUS_LABELS[s] || s} ({counts[s] ?? 0})
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-300 rounded-xl px-4 py-3 font-body text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 font-body text-ink/50">Loading bookings…</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 font-body text-ink/50">
          No bookings found{filter !== "all" ? ` with status "${filter}"` : ""}.
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-ivory rounded-2xl p-5 sm:p-6 border border-black/5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Booking info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-display text-lg font-semibold text-jade truncate">
                      {booking.name}
                    </h3>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-body font-semibold border capitalize ${
                        STATUS_COLORS[booking.status] || STATUS_COLORS.pending
                      }`}
                    >
                      {booking.status}
                    </span>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-body font-semibold bg-ember/10 text-ember border border-ember/30 capitalize">
                      {booking.type}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-1 font-body text-sm text-ink/70">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-ink/90">Phone:</span>{" "}
                      <span>{booking.phone}</span>
                      <a
                        href={whatsappLink(booking)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-body font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                        title="Send WhatsApp confirmation"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        WhatsApp
                      </a>
                    </div>
                    <div>
                      <span className="font-semibold text-ink/90">Date:</span>{" "}
                      {formatDate(booking.date)} at {booking.time}
                    </div>
                    {booking.location?.lat != null && (
                      <div className="sm:col-span-2">
                        <span className="font-semibold text-ink/90">Location:</span>{" "}
                        {booking.location.lat.toFixed(4)}, {booking.location.lng.toFixed(4)}
                      </div>
                    )}
                    {booking.notes && (
                      <div className="sm:col-span-2">
                        <span className="font-semibold text-ink/90">Notes:</span>{" "}
                        {booking.notes}
                      </div>
                    )}
                    <div className="sm:col-span-2 text-xs text-ink/40">
                      Booked {new Date(booking.createdAt).toLocaleString("en-KE")}
                    </div>
                  </div>
                </div>

                {/* Action controls */}
                <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                  {booking.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(booking._id, "confirmed")}
                        disabled={updatingId === booking._id}
                        className="px-4 py-2 rounded-full text-sm font-body font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateStatus(booking._id, "declined")}
                        disabled={updatingId === booking._id}
                        className="px-4 py-2 rounded-full text-sm font-body font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                      >
                        Decline
                      </button>
                    </>
                  )}
                  {booking.status === "confirmed" && (
                    <button
                      onClick={() => updateStatus(booking._id, "completed")}
                      disabled={updatingId === booking._id}
                      className="px-4 py-2 rounded-full text-sm font-body font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      Complete
                    </button>
                  )}
                  {booking.status !== "cancelled" && booking.status !== "completed" && (
                    <button
                      onClick={() => updateStatus(booking._id, "cancelled")}
                      disabled={updatingId === booking._id}
                      className="px-4 py-2 rounded-full text-sm font-body font-semibold border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={() => deleteBooking(booking._id)}
                    disabled={updatingId === booking._id}
                    className="px-4 py-2 rounded-full text-xs font-body font-semibold text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
