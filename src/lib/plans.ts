import { paymentPlans, type PaymentPlan } from "@config/pricing";

export { paymentPlans };
export type { PaymentPlan };

export interface PlanQuote {
  total: number;
  downPayment: number;
  monthly: number | null;
}

/** Computes a plan's totals for a given lot price (USD). */
export function quotePlan(plan: PaymentPlan, priceUsd: number): PlanQuote {
  const total = Math.round(priceUsd * (1 + plan.adjustmentPct / 100));
  const downPayment = Math.round((total * plan.downPaymentPct) / 100);
  const monthly =
    plan.months > 0 ? Math.round((total - downPayment) / plan.months) : null;
  return { total, downPayment, monthly };
}
