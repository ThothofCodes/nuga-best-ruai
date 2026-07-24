"use client";
import { useState } from "react";
import Link from "next/link";
import Mark from "./Mark";

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-jade">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Mark size={38} />
          <div className="font-display leading-tight">
            <div className="text-ivory text-lg font-semibold">Nuga Best</div>
            <div className="text-ember text-xs tracking-widest font-semibold">RUAI</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-body text-sm">
          <Link href="/#how-it-works" className="text-parchment hover:text-ember transition-colors">
            How it works
          </Link>
          <Link href="/#book" className="text-parchment hover:text-ember transition-colors">
            Services
          </Link>
          <Link href="/#visit" className="text-parchment hover:text-ember transition-colors">
            Visit
          </Link>
        </nav>

        <Link
          href="/book"
          className="hidden md:inline-block btn-primary font-body font-semibold text-sm px-5 py-2.5 rounded-full"
        >
          Book a session
        </Link>

        <button className="md:hidden text-ivory" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-jade border-t border-white/10 px-5 py-4 flex flex-col gap-4 font-body text-sm">
          <Link href="/#how-it-works" className="text-parchment" onClick={() => setOpen(false)}>
            How it works
          </Link>
          <Link href="/#book" className="text-parchment" onClick={() => setOpen(false)}>
            Services
          </Link>
          <Link href="/#visit" className="text-parchment" onClick={() => setOpen(false)}>
            Visit
          </Link>
          <Link
            href="/book"
            className="btn-primary text-center font-semibold px-5 py-2.5 rounded-full"
            onClick={() => setOpen(false)}
          >
            Book a session
          </Link>
        </div>
      )}
    </header>
  );
}
