"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { getLot } from "@/lib/lots";
import { scrollToSection, useSiteStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { PlansGrid } from "@/components/sections/PaymentPlans";

/**
 * Payment-plans modal, opened from a lot card with that lot
 * preselected. "Reserve this lot" hands the lot to the contact form.
 */
export function PaymentPlansModal() {
  const t = useTranslations("plans");
  const plansOpen = useSiteStore((s) => s.plansOpen);
  const plansLotId = useSiteStore((s) => s.plansLotId);
  const closePlans = useSiteStore((s) => s.closePlans);
  const setContactLot = useSiteStore((s) => s.setContactLot);
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);

  const lot = getLot(plansLotId);

  useEffect(() => {
    if (!plansOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePlans();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus({ preventScroll: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [plansOpen, closePlans]);

  const reserve = () => {
    if (lot) setContactLot(lot.lotId);
    closePlans();
    scrollToSection("contact");
  };

  return (
    <AnimatePresence>
      {plansOpen && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] flex items-end justify-center bg-night/70 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={closePlans}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={
              lot ? t("forLot", { lotId: lot.lotId }) : t("noLot")
            }
            tabIndex={-1}
            initial={reduceMotion ? false : { opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="texture-grain relative max-h-[88dvh] w-full max-w-4xl overflow-y-auto bg-ivory p-6 shadow-2xl outline-none sm:border sm:border-gold/30 md:p-10"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-gold">
                  {t("eyebrow")}
                </p>
                <h2 className="mt-2 font-display text-3xl text-ink">
                  {lot ? t("forLot", { lotId: lot.lotId }) : t("title")}
                </h2>
                {!lot && (
                  <p className="mt-2 text-sm text-ink-soft">{t("noLot")}</p>
                )}
              </div>
              <button
                onClick={closePlans}
                aria-label={t("close")}
                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center border border-ink/10 text-ink-soft transition-colors hover:border-gold hover:text-gold"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </button>
            </div>

            <PlansGrid lotId={lot?.lotId ?? null} />

            <div className="mt-9 flex flex-col items-center gap-4">
              <Button onClick={reserve} className="w-full sm:w-auto">
                {t("reserveCta")}
              </Button>
              <p className="max-w-md text-center text-xs text-ink-soft/80 italic">
                {t("disclaimer")}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
