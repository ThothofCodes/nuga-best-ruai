import { Suspense } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import crypto from "crypto";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AdminDashboard from "@/components/AdminDashboard";
import { business } from "@/lib/config";

export const metadata = {
  title: `Admin — ${business.name}`,
};

function verifySession(token) {
  if (!token) return false;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  const secret = process.env.ADMIN_SESSION_SECRET || adminPassword;
  const expected = crypto.createHmac("sha256", secret).update(adminPassword).digest("hex");
  try {
    const bufA = Buffer.from(token, "utf8");
    const bufB = Buffer.from(expected, "utf8");
    if (bufA.length !== bufB.length) {
      crypto.timingSafeEqual(bufA, bufA);
      return false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;

  if (!verifySession(sessionToken)) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-parchment font-body text-ink">
      <Nav />
      <section className="bg-jade">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 pt-14 pb-16 sm:pt-20 sm:pb-20">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ivory mb-3">
            Booking Management
          </h1>
          <p className="font-body text-parchment">
            View, confirm, decline, or complete bookings from {business.name}.
          </p>
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <Suspense fallback={<div className="text-center py-16 font-body text-ink/50">Loading…</div>}>
          <AdminDashboard />
        </Suspense>
      </section>
      <Footer />
    </div>
  );
}
