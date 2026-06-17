"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { MapFilters } from "@/components/map/MapFilters";
import { MapLegend } from "@/components/map/MapLegend";
import { LotPanel } from "@/components/map/LotPanel";

const LotMap = dynamic(
  () => import("@/components/map/LotMap").then((m) => m.LotMap),
  { ssr: false }
);

export function MapSection() {
  const t = useTranslations("map");

  return (
    <section id="map" className="scroll-mt-20 bg-sand/40 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <Reveal className="mt-12" delay={0.1}>
          <MapFilters />
        </Reveal>

        <Reveal className="mt-5" delay={0.15}>
          <div className="relative h-[68dvh] min-h-[440px] overflow-hidden border border-gold/25 shadow-[0_16px_60px_rgba(35,39,48,0.14)]">
            <LotMap />
            <MapLegend />
            <LotPanel />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
