import { business } from "@/lib/config";

export default function QuickFacts() {
  const { onSite, offSite } = business.pricing;
  const facts = [
    {
      value: `${onSite.currency} ${onSite.amount}`,
      label: "On-site session",
      sub: `per ${onSite.duration}, at Gatwick Mall`,
    },
    {
      value: `${offSite.currency} ${offSite.amount}`,
      label: "Home visit",
      sub: `per ${offSite.duration}, transport included`,
    },
    { value: "Ahead of time", label: "Booking", sub: "pick a slot, drop a pin for home visits" },
  ];

  return (
    <section className="bg-ivory border-b border-black/5">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 grid sm:grid-cols-3 gap-8">
        {facts.map((f) => (
          <div key={f.label}>
            <div className="font-display text-2xl font-semibold text-jade mb-1">{f.value}</div>
            <div className="font-body text-sm font-semibold text-ember mb-1">{f.label}</div>
            <div className="font-body text-sm text-ink/70">{f.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
