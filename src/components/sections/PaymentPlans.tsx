"use client";

import { useLocale, useTranslations } from "next-intl";

import {
  tierRateUsdPerM2,
  tieredPriceUsd,
  type PriceTier,
} from "@config/pricing";
import { lots } from "@/lib/lots";
import { paymentPlans, quotePlan, tieredPaymentPlans } from "@/lib/plans";
import { formatUsd } from "@/lib/format";
import { useSiteStore } from "@/lib/store";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PlanCard } from "@/components/plans/PlanCard";

/** Plan cards shared by this section and the payment-plans modal. */
export function PlansGrid({ lotId }: { lotId: string | null }) {
  const t = useTranslations("plans");
  const lot = lots.find((l) => l.lotId === lotId) ?? null;
  const priceUsd = lot?.priceUsd ?? null;

  // Tiered (per-m²) lots use the real financing scheme with per-term
  // surcharges; flat-priced lots keep the generic no-surcharge plans.
  // With no lot selected, the section presents the real scheme.
  const plans =
    lot == null || lot.priceTier ? tieredPaymentPlans : paymentPlans;

  return (
    <div>
      {lot && priceUsd == null && (
        <p className="mt-8 text-center text-sm text-ink-soft italic">
          {t("priceOnRequestNote")}
        </p>
      )}
      <div className="mt-10 grid gap-6 pt-3 md:grid-cols-3">
        {plans.map((plan, i) => (
          <Reveal key={plan.id} delay={0.12 + i * 0.08}>
            <PlanCard plan={plan} priceUsd={priceUsd} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/**
 * Per-category example table for the tiered per-m² pricing: cash price
 * and monthly payments for a typical ~1,500 m² lot, all computed from
 * config/pricing.ts (nothing hardcoded).
 */
function TierExampleTable() {
  const t = useTranslations("plans.tierTable");
  const locale = useLocale();

  const EXAMPLE_AREA_M2 = 1500;
  const tiers = Object.keys(tierRateUsdPerM2) as PriceTier[];

  const thCls =
    "px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-ivory/90";
  const tdCls = "px-4 py-3 align-middle text-sm text-ink whitespace-nowrap";

  return (
    <div className="mx-auto mt-14 max-w-4xl">
      <h3 className="text-center font-display text-2xl font-medium text-night">
        {t("title")}
      </h3>
      <div className="mt-6 overflow-x-auto border border-gold/25 shadow-[0_8px_32px_rgba(35,39,48,0.06)]">
        <table className="w-full min-w-[640px] border-collapse">
          <thead className="bg-night">
            <tr>
              <th className={thCls}>{t("cols.tier")}</th>
              <th className={thCls}>{t("cols.rate")}</th>
              <th className={thCls}>{t("cols.cash")}</th>
              {tieredPaymentPlans.map((plan) => (
                <th key={plan.id} className={thCls}>
                  {t("cols.monthly", { years: plan.months / 12 })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tiers.map((tier) => {
              const cash = tieredPriceUsd(tier, EXAMPLE_AREA_M2);
              return (
                <tr key={tier} className="bg-ivory-soft odd:bg-ivory">
                  <td className={`${tdCls} font-medium`}>
                    {t(`names.${tier}`)}
                  </td>
                  <td className={tdCls}>
                    {formatUsd(tierRateUsdPerM2[tier], locale)}/m²
                  </td>
                  <td className={`${tdCls} font-medium`}>
                    {formatUsd(cash, locale)}
                  </td>
                  {tieredPaymentPlans.map((plan) => {
                    const quote = quotePlan(plan, cash);
                    return (
                      <td key={plan.id} className={tdCls}>
                        {quote.monthly != null
                          ? formatUsd(quote.monthly, locale)
                          : "—"}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-center text-xs leading-relaxed text-ink-soft/80 italic">
        {t("note")}
      </p>
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

        {/* Per-category example table — belongs to the tiered per-m²
            scheme, so it hides when a flat-priced lot is selected. */}
        {(!selected || selected.priceTier) && (
          <Reveal delay={0.2}>
            <TierExampleTable />
          </Reveal>
        )}

        <Reveal delay={0.25}>
          <p className="mx-auto mt-10 max-w-xl text-center text-xs leading-relaxed text-ink-soft/80 italic">
            {t("disclaimer")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
