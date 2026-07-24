export default function WhatToExpect() {
  return (
    <section className="bg-parchment">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-jade mb-5">What to expect</h2>
          <p className="font-body text-ink/70 leading-relaxed mb-4">
            Sessions are fully clothed — no oils, no undressing. Most people feel the warmth within the first few
            minutes and leave looser through the back and shoulders.
          </p>
          <p className="font-body text-ink/70 leading-relaxed">
            First time in? Come in something comfortable, and let us know if you&apos;re pregnant, have a
            pacemaker, or have any condition that needs extra care.
          </p>
        </div>
        <div className="bg-ivory rounded-2xl p-8 border-t-2 border-ember">
          <div className="font-display text-lg font-semibold text-jade mb-4">Good to know</div>
          <ul className="font-body text-sm text-ink space-y-3">
            <li>Sessions run on time — arriving 5 minutes early keeps your slot exact</li>
            <li>Home visits need clear access for equipment — ground floor or a working lift</li>
            <li>Reschedule or cancel with a little notice, no hard feelings</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
