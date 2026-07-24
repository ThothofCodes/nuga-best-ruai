export default function HowItWorks() {
  const facets = [
    {
      title: "Far-infrared heat",
      body: "Gentle heat that reaches below the surface, easing muscle tension and supporting circulation through the session.",
    },
    {
      title: "Heated jade & tourmaline",
      body: "Smooth stones warm through and move slowly along your spine, carrying heat deeper than a heating pad ever could.",
    },
    {
      title: "Spinal acupressure",
      body: "Steady, targeted pressure along points on either side of the spine as the bed moves gently beneath you.",
    },
  ];

  return (
    <section id="how-it-works" className="bg-parchment">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-jade mb-4 max-w-lg">
          How the warmth works
        </h2>
        <p className="font-body text-ink/70 max-w-xl mb-12">
          Three things happen at once on a Nuga Best bed. None of them require you to undress or lie under oil.
        </p>
        <div className="grid sm:grid-cols-3 gap-10">
          {facets.map((f) => (
            <div key={f.title} className="border-t-2 border-ember pt-5">
              <h3 className="font-display text-lg font-semibold text-jade mb-2">{f.title}</h3>
              <p className="font-body text-sm text-ink/70 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
        <p className="font-body text-xs text-ink/60 mt-12 max-w-xl">
          Nuga Best sessions are a wellness therapy, not a substitute for medical care. Talk to a doctor about
          chronic or serious conditions.
        </p>
      </div>
    </section>
  );
}
