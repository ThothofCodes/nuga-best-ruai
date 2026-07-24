import Link from "next/link";
import { business } from "@/lib/config";

export default function VisitUs() {
  return (
    <section id="visit" className="bg-ivory">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-jade mb-6">Visit us</h2>
            <div className="space-y-5 font-body">
              <div>
                <div className="text-sm font-semibold text-ember tracking-widest uppercase mb-1">Studio</div>
                <div className="text-ink">{business.address}</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-ember tracking-widest uppercase mb-1">Hours</div>
                <div className="text-ink">{business.hours}</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-ember tracking-widest uppercase mb-1">
                  Call or WhatsApp
                </div>
                <div className="text-ink space-y-2">
                  {business.phone ? <div>{business.phone}</div> : null}
                  <a
                    href="https://wa.me/+254786472853"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-jade px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    <span>💬</span>
                    <span>WhatsApp us</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-parchment rounded-2xl p-8 flex flex-col justify-center">
            <div className="font-display text-xl font-semibold text-jade mb-3">Ready when you are</div>
            <p className="font-body text-sm text-ink/70 mb-6">
              Book online and we&apos;ll confirm by phone or WhatsApp — or call/WhatsApp us directly to sort out a
              session.
            </p>
            <Link
              href="/book"
              className="btn-primary text-center font-body font-semibold px-6 py-3 rounded-full"
            >
              Book online
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
