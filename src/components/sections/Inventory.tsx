"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

import { beachLabelKey, lotCount, type Lot } from "@/lib/lots";
import {
  formatAreaM2,
  formatAreaSqFt,
  formatNumber,
  formatUsd,
} from "@/lib/format";
import {
  scrollToSection,
  useFilteredLots,
  useSiteStore,
} from "@/lib/store";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusBadge, TierBadge } from "@/components/ui/Badge";

function LotCard({ lot }: { lot: Lot }) {
  const t = useTranslations("lots");
  const locale = useLocale();
  const selectLot = useSiteStore((s) => s.selectLot);
  const openPlans = useSiteStore((s) => s.openPlans);

  const unavailable = lot.status !== "available";

  const viewOnMap = () => {
    selectLot(lot.lotId);
    scrollToSection("map");
  };

  return (
    <article
      className={`group flex flex-col border border-gold/20 bg-ivory-soft p-5 transition-all duration-300 hover:border-gold/50 hover:shadow-[0_8px_32px_rgba(35,39,48,0.1)] ${
        unavailable ? "opacity-55" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-xl text-ink">{lot.lotId}</h3>
        <StatusBadge status={lot.status} label={t(`status.${lot.status}`)} />
      </div>

      <div className="mt-2.5">
        <TierBadge tier={lot.tier} label={t(`tier.${lot.tier}`)} />
      </div>

      <p className="mt-3 text-sm text-ink-soft">
        {formatAreaM2(lot.areaM2, locale)} ·{" "}
        {formatAreaSqFt(lot.areaM2, locale)}
      </p>
      <p className="mt-1 text-xs text-ink-soft/80 italic">
        {t(`beachLabel.${beachLabelKey(lot.beachRank)}`)}
      </p>

      <p className="mt-4 font-display text-2xl text-ink">
        {lot.priceUsd != null ? (
          formatUsd(lot.priceUsd, locale)
        ) : (
          <span className="text-xl italic">{t("panel.priceOnRequest")}</span>
        )}
      </p>

      <div className="mt-5 flex gap-4 border-t border-gold/15 pt-4 text-[12px] uppercase tracking-[0.16em]">
        <button
          onClick={viewOnMap}
          className="cursor-pointer text-gold-deep underline-offset-4 transition-colors hover:text-ink hover:underline"
        >
          {t("inventory.viewOnMap")}
        </button>
        {!unavailable && (
          <button
            onClick={() => openPlans(lot.lotId)}
            className="cursor-pointer text-gold-deep underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            {t("inventory.details")}
          </button>
        )}
      </div>
    </article>
  );
}

export function Inventory() {
  const t = useTranslations("lots.inventory");
  const locale = useLocale();
  const filtered = useFilteredLots();
  const resetFilters = useSiteStore((s) => s.resetFilters);
  const reduceMotion = useReducedMotion();

  // The grid is collapsed by default — with 84+ lots across several
  // sellers, the full grid would dominate the page. Filters live in the
  // map section above and stay visible/synced regardless of this state.
  const [expanded, setExpanded] = useState(false);

  // Rendered only while expanded (lazy-mounted), so a collapsed page
  // never pays to build the whole grid — this is what keeps it scalable
  // as more sellers are added.
  const gridContent =
    filtered.length > 0 ? (
      <div className="grid gap-5 pt-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((lot) => (
          <LotCard key={lot.lotId} lot={lot} />
        ))}
      </div>
    ) : (
      <div className="mt-12 border border-gold/20 bg-ivory-soft px-6 py-16 text-center">
        <p className="font-display text-xl text-ink-soft italic">{t("empty")}</p>
        <button
          onClick={resetFilters}
          className="mt-4 cursor-pointer text-[12px] uppercase tracking-[0.18em] text-gold-deep underline-offset-4 hover:underline"
        >
          {t("emptyCta")}
        </button>
      </div>
    );

  return (
    <section id="lots" className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle", { count: formatNumber(lotCount, locale) })}
        />

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls="lots-grid"
            className="inline-flex cursor-pointer items-center gap-3 border border-gold/60 px-7 py-3 text-[13px] tracking-[0.18em] text-ink uppercase transition-all duration-300 hover:border-gold hover:bg-gold/10"
          >
            {expanded ? t("hideAll") : t("viewAll")}
            <svg
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
              aria-hidden
              className={`text-gold-deep transition-transform duration-300 motion-reduce:transition-none ${
                expanded ? "rotate-180" : ""
              }`}
            >
              <path d="M1 1.5l5 5 5-5" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </button>
        </div>

        <div id="lots-grid">
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key="grid"
                initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                animate={reduceMotion ? {} : { height: "auto", opacity: 1 }}
                exit={reduceMotion ? {} : { height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: "hidden" }}
              >
                {gridContent}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
