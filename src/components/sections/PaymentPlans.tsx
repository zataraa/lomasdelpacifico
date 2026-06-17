"use client";

import { useTranslations } from "next-intl";

import { lots } from "@/lib/lots";
import { paymentPlans } from "@/lib/plans";
import { useSiteStore } from "@/lib/store";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PlanCard } from "@/components/plans/PlanCard";

/** Plan cards shared by this section and the payment-plans modal. */
export function PlansGrid({ lotId }: { lotId: string | null }) {
  const t = useTranslations("plans");
  const lot = lots.find((l) => l.lotId === lotId) ?? null;
  const priceUsd = lot?.priceUsd ?? null;

  return (
    <div>
      {lot && priceUsd == null && (
        <p className="mt-8 text-center text-sm text-ink-soft italic">
          {t("priceOnRequestNote")}
        </p>
      )}
      <div className="mt-10 grid gap-6 pt-3 md:grid-cols-3">
        {paymentPlans.map((plan, i) => (
          <Reveal key={plan.id} delay={0.12 + i * 0.08}>
            <PlanCard plan={plan} priceUsd={priceUsd} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export function PaymentPlans() {
  const t = useTranslations("plans");
  const plansLotId = useSiteStore((s) => s.plansLotId);

  const availableLots = lots.filter((l) => l.status === "available");
  const selected = availableLots.find((l) => l.lotId === plansLotId) ?? null;

  return (
    <section id="plans" className="scroll-mt-20 bg-sand/40 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <Reveal delay={0.1}>
          <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-2">
            <label
              htmlFor="plan-lot-select"
              className="text-[11px] uppercase tracking-[0.24em] text-ink-soft"
            >
              {t("selectLot")}
            </label>
            <select
              id="plan-lot-select"
              value={selected?.lotId ?? ""}
              onChange={(e) =>
                useSiteStore.setState({ plansLotId: e.target.value || null })
              }
              className="w-full cursor-pointer appearance-none border border-ink/15 bg-ivory-soft px-4 py-3 text-center text-sm text-ink transition-colors hover:border-gold focus:border-gold focus:outline-none"
            >
              <option value="">{t("noLot")}</option>
              {availableLots.map((lot) => (
                <option key={lot.lotId} value={lot.lotId}>
                  {lot.lotId}
                </option>
              ))}
            </select>
          </div>
        </Reveal>

        <PlansGrid lotId={selected?.lotId ?? null} />

        <Reveal delay={0.25}>
          <p className="mx-auto mt-10 max-w-xl text-center text-xs leading-relaxed text-ink-soft/80 italic">
            {t("disclaimer")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
