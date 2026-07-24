"use client";
import { useState } from "react";
import { ACCESS_DOMAINS } from "@/lib/config";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    // Client-side domain check
    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain || !ACCESS_DOMAINS.includes(domain)) {
      setStatus("error");
      setErrorMsg(
        `Email domain not allowed. Accepted domains: ${ACCESS_DOMAINS.join(", ")}`
      );
      return;
    }

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed.");
      window.location.href = "/admin";
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-ivory rounded-2xl p-6 sm:p-8 space-y-6 max-w-sm mx-auto">
      <div>
        <label className="block">
          <span className="font-body text-sm font-semibold text-jade">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            placeholder="you@de5.net"
            className="mt-1 w-full rounded-lg border border-sage px-4 py-2.5 font-body text-ink focus:outline-none focus:ring-2 focus:ring-ember"
          />
        </label>
      </div>

      <div>
        <label className="block">
          <span className="font-body text-sm font-semibold text-jade">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-sage px-4 py-2.5 font-body text-ink focus:outline-none focus:ring-2 focus:ring-ember"
          />
        </label>
      </div>

      {errorMsg && (
        <p className="font-body text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full btn-primary font-body font-semibold py-3.5 rounded-full disabled:opacity-60"
      >
        {status === "submitting" ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
