import Link from "next/link";
import { business } from "@/lib/config";

export default function Hero() {
  return (
    <section className="relative bg-jade overflow-hidden">
      <div className="absolute -right-24 -bottom-24 sm:-right-10 sm:-bottom-40 pointer-events-none">
        <svg width="420" height="420" viewBox="0 0 420 420" fill="none">
          <g transform="translate(210,210)">
            <circle r="190" fill="none" stroke="#8B9A7E" strokeWidth="1.5" opacity="0.25" />
            <circle r="150" fill="none" stroke="#8B9A7E" strokeWidth="2" opacity="0.3" />
            <circle r="110" fill="none" stroke="#EAE3D2" strokeWidth="2" opacity="0.25" />
            <circle r="72" fill="none" stroke="#BE6A34" strokeWidth="3" opacity="0.45" className="arc-pulse" />
            <circle r="34" fill="none" stroke="#BE6A34" strokeWidth="3" opacity="0.6" />
          </g>
        </svg>
      </div>
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="max-w-xl">
          <p className="font-body text-sm font-semibold tracking-widest text-ember uppercase mb-5">
            {business.tagline}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-ivory leading-tight mb-6">
            Heated jade, far-infrared warmth, and thirty minutes to yourself.
          </h1>
          <p className="font-body text-base sm:text-lg text-parchment mb-8 leading-relaxed">
            {business.name} brings thermal stone therapy to Gatwick Mall — or straight to your home, equipment and
            all.
          </p>
          <div className="flex flex-wrap gap-4 mb-8">
            <Link href="/book" className="btn-primary font-body font-semibold px-6 py-3 rounded-full">
              Book a session
            </Link>
            <a href="#how-it-works" className="btn-ghost-light font-body font-semibold px-6 py-3 rounded-full">
              See how it works
            </a>
          </div>
          <p className="font-body text-sm text-parchment">
            Open {business.hours} · {business.address}
          </p>
        </div>
      </div>
    </section>
  );
}
