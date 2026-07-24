import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import QuickFacts from "@/components/QuickFacts";
import HowItWorks from "@/components/HowItWorks";
import BookingOptions from "@/components/BookingOptions";
import WhatToExpect from "@/components/WhatToExpect";
import VisitUs from "@/components/VisitUs";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-parchment font-body text-ink">
      <Nav />
      <Hero />
      <QuickFacts />
      <HowItWorks />
      <BookingOptions />
      <WhatToExpect />
      <VisitUs />
      <Footer />
    </div>
  );
}
