import { setRequestLocale } from "next-intl/server";
import { use } from "react";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Location } from "@/components/sections/Location";
import { Development } from "@/components/sections/Development";
import { MarketAnalysis } from "@/components/sections/MarketAnalysis";
import { MapSection } from "@/components/sections/MapSection";
import { Inventory } from "@/components/sections/Inventory";
import { PaymentPlans } from "@/components/sections/PaymentPlans";
import { Gallery } from "@/components/sections/Gallery";
import { Contact } from "@/components/sections/Contact";
import { PaymentPlansModal } from "@/components/plans/PaymentPlansModal";

export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return <PageContent />;
}

function PageContent() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Location />
        <div className="gold-rule mx-auto max-w-5xl" />
        <MapSection />
        <Development />
        <MarketAnalysis />
        <Inventory />
        <div className="gold-rule mx-auto max-w-5xl" />
        <PaymentPlans />
        <Gallery />
        <Contact />
      </main>
      <Footer />
      <PaymentPlansModal />
    </>
  );
}
