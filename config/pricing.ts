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
 * NOTE (July 2026): this flat price now applies ONLY to lots that have
 * no entry in `priceTierByLot` below (currently Salvador's and
 * Florencio's lots, at a flat $99,000). María Susana's lots are priced
 * per m² through the tiered model in section 3 instead. The MXN figure
 * shown to visitors is derived automatically from this via the FX rate
 * in config/site.ts (tiered lots are USD-only and never show MXN).
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
  //   "R23P121LS-27": { status: "reserved" },  → mark as reserved
  //   "R26P121LS-25": { status: "sold" },      → mark as sold
  // No overrides at the moment — every lot is listed as available.
};

/* ────────────────────────────────────────────────────────────────────
 * 3. TIERED PER-M² PRICING — María Susana's lots (M.S.A.V.)
 *
 * Real pricing model (July 2026). Each of María Susana's 47 lots is
 * assigned one of four categories; its cash ("contado") price is
 * calculated automatically:
 *
 *   contado = rate per m² × the lot's surveyed area, rounded to the
 *             nearest $500 USD
 *
 * To change a rate, edit `tierRateUsdPerM2`. To move a lot to another
 * category, edit its single line in `priceTierByLot` — every price on
 * the site updates automatically. Lots NOT listed here keep the flat
 * price from section 1 (other sellers).
 *
 * PROVISIONAL ASSIGNMENT: categories below follow ocean proximity
 * (westernmost centroid = closest to the Pacific), split into four
 * groups of 12/12/12/11 — pending client validation. The `// #n` comment
 * on each line is the lot's proximity rank among these 47 (1 = closest),
 * with its surveyed area.
 * ──────────────────────────────────────────────────────────────────── */
export type PriceTier = "premium" | "media" | "interior" | "bajio";

/** Official category names: Premium / Media / Interior / Bajío. */
export const tierRateUsdPerM2: Record<PriceTier, number> = {
  premium: 100,
  media: 70,
  interior: 50,
  bajio: 30,
};

/** Cash (contado) price: rate × area, rounded to the nearest $500. */
export function tieredPriceUsd(tier: PriceTier, areaM2: number): number {
  return Math.round((tierRateUsdPerM2[tier] * areaM2) / 500) * 500;
}

export const priceTierByLot: Record<string, PriceTier> = {
  // ── PREMIUM · $100/m² · ranks 1–12 (front row, incl. both 1,751 m² CARR lots)
  "R2CARRLS-3": "premium", //    #1 · 1,751 m²
  "R1CARRLS-12": "premium", //   #2 · 1,751 m²
  "R32P121LS-10": "premium", //  #3 · 1,501 m²
  "R3P120LS-21": "premium", //   #4 · 1,501 m²
  "R22P121LS-12": "premium", //  #5 · 1,501 m²
  "R24P121LS-5": "premium", //   #6 · 1,501 m²
  "R23P121LS-27": "premium", //  #7 · 1,501 m²
  "R4P120LS-29": "premium", //   #8 · 1,501 m²
  "R5P120LS-25": "premium", //   #9 · 1,501 m²
  "R33P121LS-21": "premium", // #10 · 1,501 m²
  "R7P120LS-28": "premium", //  #11 · 1,501 m²
  "R26P121LS-25": "premium", // #12 · 1,501 m²
  // ── MEDIA · $70/m² · ranks 13–24
  "R8P120LS-8": "media", //     #13 · 1,501 m²
  "R27P121LS-26": "media", //   #14 · 1,501 m²
  "R25P121LS-30": "media", //   #15 · 1,501 m²
  "R34P121LS-14": "media", //   #16 · 1,501 m²
  "R9P120LS-9": "media", //     #17 · 1,501 m²
  "R35P121LS-23": "media", //   #18 · 1,501 m²
  "R16P120LS-23": "media", //   #19 · 1,501 m²
  "R28P121LS-7": "media", //    #20 · 1,501 m²
  "R10P120LS-21": "media", //   #21 · 1,501 m²
  "R6P120LS-34": "media", //    #22 · 1,501 m²
  "R21P120LS-15": "media", //   #23 · 1,501 m²
  "R11P120LS-8": "media", //    #24 · 1,501 m²
  // ── INTERIOR · $50/m² · ranks 25–36
  "R12P120LS-24": "interior", // #25 · 1,501 m²
  "R29P121LS-11": "interior", // #26 · 1,501 m²
  "M15-L3": "interior", //       #27 · 1,501 m² (Zona Sur)
  "R36P121LS-18": "interior", // #28 · 1,501 m²
  "R13P120LS-33": "interior", // #29 · 1,501 m²
  "R31P121LS-23": "interior", // #30 · 1,501 m²
  "R42P121LS-22": "interior", // #31 · 1,501 m²
  "M17-L8": "interior", //       #32 · 1,515 m² (Zona Sur)
  "R39AJULS-30": "interior", //  #33 ·   901 m² (adjustment parcel)
  "R37P121LS-26": "interior", // #34 · 1,501 m²
  "R17P120LS-21": "interior", // #35 · 1,501 m²
  "R14P120LS-13": "interior", // #36 · 1,501 m²
  // ── BAJÍO · $30/m² · ranks 37–47 (most inland)
  "R38P121LS-5": "bajio", //    #37 · 1,495 m²
  "R19P120LS-29": "bajio", //   #38 · 1,501 m²
  "R30P121LS-32": "bajio", //   #39 · 1,501 m²
  "M7-L3": "bajio", //          #40 · 1,501 m² (Zona Sur)
  "M5-L1": "bajio", //          #41 · 1,501 m² (Zona Sur)
  "R20P120LS-4": "bajio", //    #42 · 1,501 m²
  "R18P120LS-13": "bajio", //   #43 · 1,501 m²
  "R41P121LS-23": "bajio", //   #44 · 1,501 m²
  "R15P120LS-25": "bajio", //   #45 · 1,501 m²
  "R40P121LS-22": "bajio", //   #46 · 1,501 m²
  "M1-L13": "bajio", //         #47 · 1,501 m² (Zona Sur)
};

/* ────────────────────────────────────────────────────────────────────
 * 4. PAYMENT PLANS
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
 * GENERIC plans — used for lots priced with the flat list price
 * (sellers without tiered pricing). 20%–30% down, the balance financed
 * over 3–5 years in equal monthly installments, no surcharge.
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

/*
 * TIERED-PRICE plans — María Susana's real financing scheme. The
 * financed total carries a surcharge over the cash price:
 *
 *   3 years → contado × 1.12, 20% down, 36 monthly payments
 *   4 years → contado × 1.16, 25% down, 48 monthly payments
 *   5 years → contado × 1.20, 30% down, 60 monthly payments
 *
 * Edit the percentages here; every quote on the site recalculates.
 */
export const financingSurchargePct: Record<PaymentPlan["id"], number> = {
  threeYear: 12,
  fourYear: 16,
  fiveYear: 20,
};

export const tieredPaymentPlans: PaymentPlan[] = paymentPlans.map((plan) => ({
  ...plan,
  adjustmentPct: financingSurchargePct[plan.id],
}));
