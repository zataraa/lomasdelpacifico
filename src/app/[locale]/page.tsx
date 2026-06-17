import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { use } from "react";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Location } from "@/components/sections/Location";
import { Development } from "@/components/sections/Development";
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
  const t = useTranslations("common");

  return (
    <>
      <a
        href="#location"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-ivory focus:px-4 focus:py-2 focus:text-sm focus:text-ink"
      >
        {t("skipToContent")}
      </a>
      <Header />
      <main>
        <Hero />
        <Location />
        <div className="gold-rule mx-auto max-w-5xl" />
        <Development />
        <MapSection />
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
