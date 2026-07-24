import Link from "next/link";
import { business } from "@/lib/config";

export default function BookingOptions() {
  const { onSite, offSite } = business.pricing;

  return (
    <section id="book" className="bg-jade">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ivory mb-12 max-w-lg">
          Two ways to book
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-ivory rounded-2xl p-8">
            <div className="font-body text-sm font-semibold text-ember tracking-widest uppercase mb-3">
              At the studio
            </div>
            <div className="font-display text-3xl font-semibold text-jade mb-1">
              {onSite.currency} {onSite.amount}
            </div>
            <div className="font-body text-sm text-ink/70 mb-6">per {onSite.duration}</div>
            <ul className="font-body text-sm text-ink space-y-2 mb-8">
              <li>Gatwick Mall, Ruai Town</li>
              <li>Walk in or book ahead</li>
              <li>Bed, stones, and heat ready and waiting</li>
            </ul>
            <Link
              href="/book?type=on-site"
              className="btn-primary inline-block font-body font-semibold px-6 py-3 rounded-full"
            >
              Book a studio session
            </Link>
          </div>

          <div className="bg-ivory rounded-2xl p-8">
            <div className="font-body text-sm font-semibold text-ember tracking-widest uppercase mb-3">
              At home
            </div>
            <div className="font-display text-3xl font-semibold text-jade mb-1">
              {offSite.currency} {offSite.amount}
            </div>
            <div className="font-body text-sm text-ink/70 mb-6">per {offSite.duration}, transport included</div>
            <ul className="font-body text-sm text-ink space-y-2 mb-8">
              <li>Anywhere we can bring the bed</li>
              <li>Drop a location pin when you book</li>
              <li>Book ahead so equipment gets there on time</li>
            </ul>
            <Link
              href="/book?type=off-site"
              className="btn-primary inline-block font-body font-semibold px-6 py-3 rounded-full"
            >
              Book a home visit
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
