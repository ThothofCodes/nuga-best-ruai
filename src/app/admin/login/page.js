import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AdminLogin from "@/components/AdminLogin";
import { business } from "@/lib/config";

export const metadata = {
  title: `Admin Login — ${business.name}`,
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-parchment font-body text-ink">
      <Nav />
      <section className="bg-jade">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 pt-14 pb-16 sm:pt-20 sm:pb-20">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ivory mb-3">
            Admin Access
          </h1>
          <p className="font-body text-parchment">
            Enter the admin password to manage bookings.
          </p>
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <AdminLogin />
      </section>
      <Footer />
    </div>
  );
}
