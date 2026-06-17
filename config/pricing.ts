/**
 * ════════════════════════════════════════════════════════════════════
 *  PRICING & PAYMENT PLANS — the only file you need to touch to set
 *  prices, mark lots as sold/reserved, or adjust the payment plans.
 *
 *  The lot map and listing pick these values up automatically; the
 *  GeoJSON data files never need to be edited.
 * ════════════════════════════════════════════════════════════════════
 */

export type Tier = "beachfront_premium" | "mid" | "inland";
export type LotStatus = "available" | "reserved" | "sold";

/* ────────────────────────────────────────────────────────────────────
 * 1. PRICE PER TIER (USD)
 *
 * Every lot belongs to a tier (closest to the Pacific = premium).
 * Set the standard price for each tier here. Use `null` to show
 * "Price on request" for that whole tier.
 *
 * The client's recommended list price is a single flat $99,000 USD for
 * every lot, so all three tiers share the same value. To price by tier
 * later, just give each tier a different number. The MXN figure shown
 * to visitors is derived automatically from this via the FX rate in
 * config/site.ts.
 * ──────────────────────────────────────────────────────────────────── */
export const priceByTierUsd: Record<Tier, number | null> = {
  beachfront_premium: 99_000,
  mid: 99_000,
  inland: 99_000,
};

/* ────────────────────────────────────────────────────────────────────
 * 2. PER-LOT OVERRIDES
 *
 * Fine-tune individual lots by their lot key (shown on the map and in
 * the listing). Anything you set here wins over the tier price.
 *
 *   "R22P121LS-12": { priceUsd: 210_000 },          → custom price
 *   "R23P121LS-27": { status: "sold" },             → mark as sold
 *   "R24P121LS-5":  { status: "reserved" },         → mark as reserved
 *   "R1CARRLS-12":  { tier: "beachfront_premium" }, → change tier
 *   "R39AJULS-30":  { priceUsd: null },             → price on request
 *
 * Remove the example lines below when entering real data.
 * ──────────────────────────────────────────────────────────────────── */
export const lotOverrides: Record<
  string,
  Partial<{
    priceUsd: number | null;
    priceMxn: number | null; // only if you want a fixed MXN price
    status: LotStatus;
    tier: Tier;
  }>
> = {
  // Per-lot overrides win over the flat list price above. Examples:
  //   "R22P121LS-12": { priceUsd: 120_000 },  → a custom price for one lot
  //   "R39AJULS-30":  { priceUsd: null },      → show "Price on request"
  //   "R1CARRLS-12":  { tier: "beachfront_premium" }, → move to another tier
  // The entries below mark specific lots as taken:
  "R23P121LS-27": { status: "reserved" },
  "R26P121LS-25": { status: "sold" },
};

/* ────────────────────────────────────────────────────────────────────
 * 3. PAYMENT PLANS
 *
 * Shown in the "Payment plans" section and in each lot's card.
 * - downPaymentPct: percentage paid up front (0–100)
 * - months:         number of monthly installments (0 = single payment)
 * - adjustmentPct:  discount (negative) or financing surcharge
 *                   (positive) applied to the lot price for this plan
 *
 * Monthly installment is calculated automatically:
 *   total   = price × (1 + adjustmentPct/100)
 *   down    = total × downPaymentPct/100
 *   monthly = (total − down) ÷ months
 * ──────────────────────────────────────────────────────────────────── */
export interface PaymentPlan {
  id: "threeYear" | "fourYear" | "fiveYear";
  downPaymentPct: number;
  months: number;
  adjustmentPct: number;
  featured?: boolean;
}

/*
 * Client's terms: 20%–30% down, the balance financed over 3–5 years in
 * equal monthly installments. adjustmentPct is 0 (no discount/surcharge)
 * — set it negative for a discount or positive for a financing charge.
 */
export const paymentPlans: PaymentPlan[] = [
  {
    id: "threeYear",
    downPaymentPct: 20,
    months: 36, // 3 years
    adjustmentPct: 0,
  },
  {
    id: "fourYear",
    downPaymentPct: 25,
    months: 48, // 4 years
    adjustmentPct: 0,
    featured: true,
  },
  {
    id: "fiveYear",
    downPaymentPct: 30,
    months: 60, // 5 years
    adjustmentPct: 0,
  },
];
