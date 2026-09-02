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
 * NOTE (August 2026): every one of the 131 lots is now priced per m²
 * through the zone model in section 3, so this flat price is only a
 * FALLBACK for lots added later that have no entry in `priceTierByLot`.
 * The MXN figure derived here via the FX rate in config/site.ts applies
 * to those fallback lots only — zone-priced lots are USD-only.
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
 * 3. TIERED PER-M² PRICING — every lot, all three ejidatarios
 *
 * Real pricing model (August 2026), from the client's zoning study
 * "lomas_precios_por_zona_final.xlsx". Each lot belongs to one of three
 * zones; its cash ("contado") price is calculated automatically:
 *
 *   contado = rate per m² × the lot's surveyed area, rounded to the
 *             nearest $500 USD
 *
 * To change a rate, edit `tierRateUsdPerM2`. To move a lot to another
 * zone, edit its single line in `priceTierByLot` — every price on the
 * site updates automatically. All 131 lots are listed, so the flat price
 * in section 1 is now only a fallback for lots added later.
 *
 * ZONES came from the study's line-of-sight analysis over the INEGI 5 m
 * terrain model (CARR lots = Premium by rule). Note the study flags 45
 * lots as "Dudosa / Revisión pendiente" and keeps them as Interior; it
 * does not model buildings or vegetation, so ocean-view calls may still
 * be refined on site.
 *
 * The five Zona Sur lots (M…-L…) carry no row in the study — its author
 * could not attribute them in the KMZs, though they are María Susana's.
 * They follow the study's own rule for uncertain cases: Interior.
 * ──────────────────────────────────────────────────────────────────── */
export type PriceTier = "premium" | "vistaMar" | "interior";

/** Official zone names: Premium / primera fila · Vista al mar · Interior. */
export const tierRateUsdPerM2: Record<PriceTier, number> = {
  premium: 100,
  vistaMar: 55,
  interior: 35,
};

/** Cash (contado) price: rate × area, rounded to the nearest $500. */
export function tieredPriceUsd(tier: PriceTier, areaM2: number): number {
  return Math.round((tierRateUsdPerM2[tier] * areaM2) / 500) * 500;
}

export const priceTierByLot: Record<string, PriceTier> = {
  // ── PREMIUM / PRIMERA FILA · $100/m² · 6 lotes
  "R2CARRLS-3":      "premium", // 1,751 m² · M.S.A.V.
  "R1CARRLS-10":     "premium", // 1,751 m² · F.E.M.A.
  "R1CARRLS-12":     "premium", // 1,751 m² · M.S.A.V.
  "R2CARRLS-14":     "premium", // 1,751 m² · F.E.M.A.
  "R2CARRLS-16":     "premium", // 1,751 m² · S.S.V.
  "R1CARRLS-30":     "premium", // 1,751 m² · S.S.V.
  // ── VISTA AL MAR · $55/m² · 37 lotes
  "R3P120LS-2":      "vistaMar", // 1,501 m² · S.S.V.
  "R5P120LS-1":      "vistaMar", // 1,501 m² · F.E.M.A.
  "R32P121LS-10":    "vistaMar", // 1,501 m² · M.S.A.V.
  "R3P120LS-12":     "vistaMar", // 1,501 m² · F.E.M.A.
  "R3P120LS-21":     "vistaMar", // 1,501 m² · M.S.A.V.
  "R22P121LS-13":    "vistaMar", // 1,501 m² · S.S.V.
  "R22P121LS-15":    "vistaMar", // 1,501 m² · F.E.M.A.
  "R5P120LS-7":      "vistaMar", // 1,501 m² · S.S.V.
  "R24P121LS-5":     "vistaMar", // 1,501 m² · M.S.A.V.
  "R4P120LS-16":     "vistaMar", // 1,501 m² · S.S.V.
  "R24P121LS-21":    "vistaMar", // 1,501 m² · F.E.M.A.
  "R4P120LS-29":     "vistaMar", // 1,501 m² · M.S.A.V.
  "R33P121LS-21":    "vistaMar", // 1,501 m² · M.S.A.V.
  "R7P120LS-8":      "vistaMar", // 1,501 m² · S.S.V.
  "R26P121LS-22":    "vistaMar", // 1,501 m² · F.E.M.A.
  "R8P120LS-12":     "vistaMar", // 1,501 m² · S.S.V.
  "R7P120LS-32":     "vistaMar", // 1,501 m² · F.E.M.A.
  "R27P121LS-26":    "vistaMar", // 1,501 m² · M.S.A.V.
  "R25P121LS-30":    "vistaMar", // 1,501 m² · M.S.A.V.
  "R16P120LS-23":    "vistaMar", // 1,501 m² · M.S.A.V.
  "R10P120LS-21":    "vistaMar", // 1,501 m² · M.S.A.V.
  "R38P121LS-21":    "vistaMar", // 1,501 m² · F.E.M.A.
  "R6P120LS-34":     "vistaMar", // 1,501 m² · M.S.A.V.
  "R29P121LS-24":    "vistaMar", // 1,501 m² · F.E.M.A.
  "R11P120LS-34":    "vistaMar", // 1,501 m² · S.S.V.
  "R31P121LS-23":    "vistaMar", // 1,501 m² · M.S.A.V.
  "R17P120LS-21":    "vistaMar", // 1,501 m² · M.S.A.V.
  "R17P120LS-24":    "vistaMar", // 1,501 m² · F.E.M.A.
  "R30P121LS-19":    "vistaMar", // 1,501 m² · S.S.V.
  "R19P120LS-31":    "vistaMar", // 1,501 m² · F.E.M.A.
  "R30P121LS-22":    "vistaMar", // 1,501 m² · F.E.M.A.
  "R19P120LS-29":    "vistaMar", // 1,501 m² · M.S.A.V.
  "R30P121LS-32":    "vistaMar", // 1,501 m² · M.S.A.V.
  "R16P120LS-19":    "vistaMar", // 1,501 m² · S.S.V.
  "R41P121LS-32":    "vistaMar", // 1,501 m² · F.E.M.A.
  "R20P120LS-4":     "vistaMar", // 1,501 m² · M.S.A.V.
  "R18P120LS-13":    "vistaMar", // 1,501 m² · M.S.A.V.
  // ── INTERIOR · $35/m² · 88 lotes
  "R32P121LS-3":     "interior", // 1,501 m² · S.S.V.
  "R21P120LS-17":    "interior", // 1,501 m² · F.E.M.A.
  "R22P121LS-12":    "interior", // 1,501 m² · M.S.A.V.
  "R23P121LS-8":     "interior", // 1,501 m² · S.S.V.
  "R23P121LS-11":    "interior", // 1,501 m² · F.E.M.A.
  "R24P121LS-8":     "interior", // 1,501 m² · S.S.V.
  "R23P121LS-27":    "interior", // 1,501 m² · M.S.A.V.
  "R5P120LS-25":     "interior", // 1,501 m² · M.S.A.V.
  "R25P121LS-3":     "interior", // 1,501 m² · F.E.M.A.
  "R4P120LS-33":     "interior", // 1,501 m² · F.E.M.A.
  "R25P121LS-11":    "interior", // 1,501 m² · S.S.V.
  "R6P120LS-17":     "interior", // 1,501 m² · F.E.M.A.
  "R6P120LS-19":     "interior", // 1,501 m² · S.S.V.
  "R26P121LS-28":    "interior", // 1,501 m² · S.S.V.
  "R32P121LS-32":    "interior", // 1,501 m² · F.E.M.A.
  "R7P120LS-28":     "interior", // 1,501 m² · M.S.A.V.
  "R26P121LS-25":    "interior", // 1,501 m² · M.S.A.V.
  "R33P121LS-31":    "interior", // 1,501 m² · S.S.V.
  "R8P120LS-8":      "interior", // 1,501 m² · M.S.A.V.
  "R8P120LS-9":      "interior", // 1,501 m² · F.E.M.A.
  "R10P120LS-2":     "interior", // 1,501 m² · S.S.V.
  "R34P121LS-12":    "interior", // 1,501 m² · S.S.V.
  "R33P121LS-34":    "interior", // 1,501 m² · F.E.M.A.
  "R27P121LS-31":    "interior", // 1,501 m² · F.E.M.A.
  "R35P121LS-5":     "interior", // 1,501 m² · S.S.V.
  "R27P121LS-7":     "interior", // 1,501 m² · S.S.V.
  "R34P121LS-14":    "interior", // 1,501 m² · M.S.A.V.
  "R35P121LS-10":    "interior", // 1,501 m² · F.E.M.A.
  "R9P120LS-9":      "interior", // 1,501 m² · M.S.A.V.
  "R9P120LS-15":     "interior", // 1,501 m² · S.S.V.
  "R35P121LS-23":    "interior", // 1,501 m² · M.S.A.V.
  "R34P121LS-30":    "interior", // 1,501 m² · F.E.M.A.
  "R9P120LS-26":     "interior", // 1,501 m² · F.E.M.A.
  "R28P121LS-5":     "interior", // 1,501 m² · S.S.V.
  "R39P120LS-24":    "interior", // 1,151 m² · S.S.V.
  "R28P121LS-16":    "interior", // 1,501 m² · F.E.M.A.
  "R28P121LS-7":     "interior", // 1,501 m² · M.S.A.V.
  "R10P120LS-23":    "interior", // 1,501 m² · F.E.M.A.
  "R21P120LS-15":    "interior", // 1,501 m² · M.S.A.V.
  "R38P121LS-23":    "interior", // 1,501 m² · S.S.V.
  "R21P120LS-29":    "interior", // 1,501 m² · S.S.V.
  "R11P120LS-8":     "interior", // 1,501 m² · M.S.A.V.
  "R11P120LS-6":     "interior", // 1,501 m² · F.E.M.A.
  "R12P120LS-18":    "interior", // 1,501 m² · S.S.V.
  "R12P120LS-21":    "interior", // 1,501 m² · F.E.M.A.
  "R12P120LS-24":    "interior", // 1,501 m² · M.S.A.V.
  "R20P120LS-2":     "interior", // 1,501 m² · S.S.V.
  "R29P121LS-1":     "interior", // 1,501 m² · S.S.V.
  "R29P121LS-11":    "interior", // 1,501 m² · M.S.A.V.
  "M15-L3":          "interior", // 1,501 m² · M.S.A.V. (Zona Sur — sin fila en el Excel)
  "R36P121LS-18":    "interior", // 1,501 m² · M.S.A.V.
  "R36P121LS-21":    "interior", // 1,501 m² · F.E.M.A.
  "R13P120LS-33":    "interior", // 1,501 m² · M.S.A.V.
  "R13P120LS-34":    "interior", // 1,501 m² · F.E.M.A.
  "R42P121LS-24":    "interior", // 1,501 m² · S.S.V.
  "R42P121LS-25":    "interior", // 1,501 m² · F.E.M.A.
  "R13P120LS-10":    "interior", // 1,501 m² · S.S.V.
  "R17P120LS-6":     "interior", // 1,501 m² · S.S.V.
  "R36P121LS-24":    "interior", // 1,501 m² · S.S.V.
  "R42P121LS-22":    "interior", // 1,501 m² · M.S.A.V.
  "R20P120LS-21":    "interior", // 1,501 m² · F.E.M.A.
  "M17-L8":          "interior", // 1,515 m² · M.S.A.V. (Zona Sur — sin fila en el Excel)
  "R39AJULS-30":     "interior", //   901 m² · M.S.A.V.
  "R37P121LS-4":     "interior", // 1,501 m² · F.E.M.A.
  "R31P121LS-31":    "interior", // 1,501 m² · F.E.M.A.
  "R14P120LS-4":     "interior", // 1,501 m² · S.S.V.
  "R37P121LS-26":    "interior", // 1,501 m² · M.S.A.V.
  "R31P121LS-34":    "interior", // 1,501 m² · S.S.V.
  "R37P121LS-6":     "interior", // 1,501 m² · S.S.V.
  "R14P120LS-29":    "interior", // 1,501 m² · F.E.M.A.
  "R16P120LS-7":     "interior", // 1,501 m² · F.E.M.A.
  "R14P120LS-13":    "interior", // 1,501 m² · M.S.A.V.
  "R38P121LS-5":     "interior", // 1,495 m² · M.S.A.V.
  "M7-L3":           "interior", // 1,501 m² · M.S.A.V. (Zona Sur — sin fila en el Excel)
  "M5-L1":           "interior", // 1,501 m² · M.S.A.V. (Zona Sur — sin fila en el Excel)
  "R18P120LS-31":    "interior", // 1,501 m² · S.S.V.
  "R18P120LS-32":    "interior", // 1,501 m² · F.E.M.A.
  "R15P120LS-22":    "interior", // 1,501 m² · F.E.M.A.
  "R41P121LS-23":    "interior", // 1,501 m² · M.S.A.V.
  "R19P120LS-11":    "interior", // 1,501 m² · S.S.V.
  "R41P121LS-17":    "interior", // 1,501 m² · S.S.V.
  "R15P120LS-25":    "interior", // 1,501 m² · M.S.A.V.
  "R15P120LS-27":    "interior", // 1,501 m² · S.S.V.
  "R40P121LS-22":    "interior", // 1,501 m² · M.S.A.V.
  "R40P121LS-8":     "interior", // 1,501 m² · F.E.M.A.
  "R40P121LS-14":    "interior", // 1,501 m² · S.S.V.
  "M1-L13":          "interior", // 1,501 m² · M.S.A.V. (Zona Sur — sin fila en el Excel)
  "R43P121LS-18":    "interior", //   700 m² · F.E.M.A.
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
