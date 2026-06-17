"use client";

import { useLocale, useTranslations } from "next-intl";

import type { PaymentPlan } from "@config/pricing";
import { quotePlan } from "@/lib/plans";
import { formatUsd } from "@/lib/format";

/**
 * One payment-plan card. When `priceUsd` is provided the real figures
 * are computed; otherwise the card shows the plan structure only.
 */
export function PlanCard({
  plan,
  priceUsd,
}: {
  plan: PaymentPlan;
  priceUsd: number | null;
}) {
  const t = useTranslations("plans");
  const locale = useLocale();
  const quote = priceUsd != null ? quotePlan(plan, priceUsd) : null;

  return (
    <div
      className={`relative flex h-full flex-col border p-7 transition-all duration-300 ${
        plan.featured
          ? "border-gold bg-gold/[0.07] shadow-[0_8px_36px_rgba(185,151,91,0.18)]"
          : "border-gold/25 bg-ivory-soft hover:border-gold/50"
      }`}
    >
      {plan.featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-ivory">
          {t("featured")}
        </span>
      )}

      <h3 className="font-display text-2xl text-ink">{t(`names.${plan.id}`)}</h3>
      <p className="mt-2 min-h-10 text-sm leading-relaxed text-ink-soft">
        {t(`descriptions.${plan.id}`)}
      </p>

      <div className="gold-rule my-5" />

      <dl className="flex-1 space-y-4">
        <div>
          <dt className="text-[11px] uppercase tracking-[0.24em] text-ink-soft">
            {t("downPayment")}
          </dt>
          <dd className="mt-1 font-display text-2xl text-ink">
            {quote ? formatUsd(quote.downPayment, locale) : null}{" "}
            <span className={quote ? "text-base text-ink-soft" : "text-2xl"}>
              {quote ? `(${plan.downPaymentPct}%)` : `${plan.downPaymentPct}%`}
            </span>
          </dd>
        </div>

        <div>
          <dt className="text-[11px] uppercase tracking-[0.24em] text-ink-soft">
            {plan.months > 0
              ? t("monthly", { months: plan.months })
              : t("singlePayment")}
          </dt>
          {quote && (
            <dd className="mt-1 font-display text-2xl text-gold-deep">
              {plan.months > 0 && quote.monthly != null
                ? formatUsd(quote.monthly, locale)
                : formatUsd(quote.total, locale)}
            </dd>
          )}
        </div>

        {quote && plan.months > 0 && (
          <div>
            <dt className="text-[11px] uppercase tracking-[0.24em] text-ink-soft">
              {t("total")}
            </dt>
            <dd className="mt-1 text-base font-medium text-ink">
              {formatUsd(quote.total, locale)}
            </dd>
          </div>
        )}
      </dl>

      {plan.adjustmentPct !== 0 && (
        <p className="mt-5 border-t border-gold/15 pt-4 text-xs text-ink-soft italic">
          {plan.adjustmentPct < 0
            ? t("discount", { pct: Math.abs(plan.adjustmentPct) })
            : t("surcharge", { pct: plan.adjustmentPct })}
        </p>
      )}
    </div>
  );
}
