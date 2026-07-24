import { Suspense } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import { business } from "@/lib/config";

export const metadata = {
  title: `Book a session — ${business.name}`,
};

export default function BookPage() {
  return (
    <div className="min-h-screen bg-parchment font-body text-ink">
      <Nav />
      <section className="bg-jade">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-14 pb-16 sm:pt-20 sm:pb-20">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ivory mb-3">Book a session</h1>
          <p className="font-body text-parchment">
            Pick a time that works. We&apos;ll confirm by phone or WhatsApp before your session.
          </p>
        </div>
      </section>
      <section className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <Suspense fallback={null}>
          <BookingForm />
        </Suspense>
      </section>
      <Footer />
    </div>
  );
}
