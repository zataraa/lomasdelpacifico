"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

import { site } from "@config/site";
import { beachLabelKey, getLot, lotCount, type Lot } from "@/lib/lots";
import {
  formatAreaM2,
  formatAreaSqFt,
  formatMxn,
  formatUsd,
} from "@/lib/format";
import { useSiteStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { StatusBadge, TierBadge } from "@/components/ui/Badge";

function sectionLabel(
  lot: Lot,
  t: ReturnType<typeof useTranslations<"lots">>
): string {
  // Zona Sur lots use a Manzana/Lote scheme; show the zone, not the
  // raw "ZONA_SUR" polygon token.
  if (lot.zona) return t("panel.sectionZona", { name: lot.zona });
  if (lot.poligono === "CARR") return t("panel.sectionCARR");
  if (lot.poligono === "AJUSTE") return t("panel.sectionAJUSTE");
  return t("panel.sectionPoligono", { name: lot.poligono });
}

function PanelBody({ lot, onClose }: { lot: Lot; onClose: () => void }) {
  const t = useTranslations("lots");
  const tContact = useTranslations("contact");
  const locale = useLocale();
  const openPlans = useSiteStore((s) => s.openPlans);

  const whatsappHref = `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(
    tContact("whatsappMessage", { lotId: lot.lotId })
  )}`;

  const rows: Array<{ label: string; value: React.ReactNode }> = [
    {
      label: t("panel.status"),
      value: (
        <StatusBadge status={lot.status} label={t(`status.${lot.status}`)} />
      ),
    },
    {
      label: t("panel.area"),
      value: `${formatAreaM2(lot.areaM2, locale)} · ${formatAreaSqFt(lot.areaM2, locale)}`,
    },
    {
      label: t("panel.price"),
      value:
        lot.priceUsd != null ? (
          <span>
            <span className="font-display text-xl leading-none text-ink">
              {formatUsd(lot.priceUsd, locale)}
            </span>
            {lot.priceMxn != null && (
              <span className="mt-0.5 block text-[12px] text-ink-soft">
                ≈ {formatMxn(lot.priceMxn, locale)}
              </span>
            )}
          </span>
        ) : (
          <span className="italic">{t("panel.priceOnRequestFull")}</span>
        ),
    },
    { label: t("panel.section"), value: sectionLabel(lot, t) },
    // Extra row for Zona Sur lots that carry a Manzana/Lote scheme.
    ...(lot.manzana != null && lot.lote != null
      ? [
          {
            label: t("panel.manzanaLote"),
            value: t("panel.manzanaLoteValue", {
              manzana: lot.manzana,
              lote: lot.lote,
            }),
          },
        ]
      : []),
    {
      label: t("panel.beach"),
      value: (
        <span>
          {t(`beachLabel.${beachLabelKey(lot.beachRank)}`)}
          <span className="mt-0.5 block text-[11px] text-ink-soft/70">
            {t("panel.beachRank", { rank: lot.beachRank, total: lotCount })}
          </span>
        </span>
      ),
    },
    {
      label: t("panel.source"),
      value: (
        <span className="inline-flex items-center justify-end gap-2">
          <svg
            width="13"
            height="13"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden
            className="shrink-0 text-gold-deep"
          >
            <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2" />
            <path
              d="M2.5 14c.8-2.6 3-4 5.5-4s4.7 1.4 5.5 4"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
          {/* Initials only — per-lot seller, never the full name. */}
          {lot.sellerInitials ?? site.sellerInitials}
        </span>
      ),
    },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Header: "Lot Details" + lot id, close X */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold">
            {t("panel.title")}
          </p>
          <h3 className="mt-1 font-display text-2xl text-ink">{lot.lotId}</h3>
          <div className="mt-2.5">
            <TierBadge tier={lot.tier} label={t(`tier.${lot.tier}`)} />
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label={t("panel.close")}
          className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center border border-ink/10 text-ink-soft transition-colors hover:border-gold hover:text-gold"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
      </div>

      <dl className="mt-5 space-y-3.5 border-t border-gold/20 pt-5">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-6 text-sm"
          >
            <dt className="shrink-0 text-[11px] uppercase tracking-[0.18em] text-ink-soft">
              {row.label}
            </dt>
            <dd className="text-right font-medium text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-5 border-t border-gold/20 pt-4 text-[11.5px] leading-relaxed text-ink-soft/85 italic">
        {t("panel.disclaimer")}
      </p>

      <div className="mt-5 flex flex-col gap-3">
        {/* Primary: WhatsApp */}
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2.5 bg-[#1f8a4c] px-7 py-3 text-[13px] font-medium tracking-[0.18em] text-ivory uppercase shadow-[0_4px_20px_rgba(31,138,76,0.3)] transition-all duration-300 hover:bg-[#196f3d] hover:shadow-[0_6px_24px_rgba(31,138,76,0.4)]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.4-2.9c-.3-.4 0-.5.2-.7l.4-.5c.1-.2.2-.3.3-.5v-.5L9.7 7.6c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.9.9-1.2 2.1-.4 3.6a12 12 0 0 0 4.4 4.4c1.6.8 2.4 1 3.2.9.6-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.3-.3Z" />
          </svg>
          {t("panel.whatsappCta")}
        </a>
        {/* Secondary: payment plans / financing */}
        <Button variant="outline" onClick={() => openPlans(lot.lotId)}>
          {lot.priceUsd != null
            ? t("panel.viewPlans")
            : t("panel.financingCta")}
        </Button>
      </div>
    </div>
  );
}

/**
 * Lot Details: a floating card over the map on desktop, a draggable
 * bottom sheet on mobile. Opened by clicking/tapping a lot on the map
 * or a card in the inventory.
 */
export function LotPanel() {
  const selectedLotId = useSiteStore((s) => s.selectedLotId);
  const selectLot = useSiteStore((s) => s.selectLot);
  const lot = getLot(selectedLotId);
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  const close = () => selectLot(null);

  useEffect(() => {
    if (!lot) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.focus({ preventScroll: true });
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lot?.lotId]);

  return (
    <AnimatePresence>
      {lot && (
        <>
          {/* Desktop: floating panel over the map */}
          <motion.div
            key={`panel-${lot.lotId}`}
            ref={panelRef}
            role="dialog"
            aria-modal="false"
            aria-label={lot.lotId}
            tabIndex={-1}
            initial={reduceMotion ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: 24 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="texture-grain absolute top-5 right-5 bottom-5 z-20 hidden w-[350px] overflow-y-auto border border-gold/25 bg-ivory/95 p-6 shadow-[0_12px_48px_rgba(35,39,48,0.25)] backdrop-blur-md outline-none md:block"
          >
            <PanelBody lot={lot} onClose={close} />
          </motion.div>

          {/* Mobile: draggable bottom sheet */}
          <motion.div
            key={`sheet-${lot.lotId}`}
            role="dialog"
            aria-modal="false"
            aria-label={lot.lotId}
            drag={reduceMotion ? false : "y"}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 90 || info.velocity.y > 600) close();
            }}
            initial={reduceMotion ? false : { y: "100%" }}
            animate={{ y: 0 }}
            exit={reduceMotion ? undefined : { y: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[82dvh] overflow-y-auto rounded-t-2xl border-t border-gold/25 bg-ivory p-5 pb-8 shadow-[0_-8px_40px_rgba(35,39,48,0.3)] md:hidden"
          >
            <div
              aria-hidden
              className="mx-auto mb-4 h-1 w-12 rounded-full bg-ink/15"
            />
            <PanelBody lot={lot} onClose={close} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
