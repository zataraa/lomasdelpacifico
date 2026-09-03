/**
 * ════════════════════════════════════════════════════════════════════
 *  SITE CONFIGURATION — edit this file to update contact details,
 *  links and general settings. No other file needs to change.
 *
 *  After editing, redeploy the site (or it updates automatically if
 *  connected to Vercel + GitHub).
 * ════════════════════════════════════════════════════════════════════
 */

export const site = {
  /** Brand name shown in the header, footer and page titles. */
  brandName: "Lomas del Pacífico",

  /**
   * Production URL (used for SEO, sitemap.xml, robots.txt and the
   * link previews shown when the site is shared on WhatsApp/Facebook).
   *
   * Must be the canonical host, with no trailing slash: the apex
   * lomasdelpacifico.mx answers with a 308 redirect to www, so www is
   * the address every canonical/OG link should point at.
   */
  url: "https://www.lomasdelpacifico.mx",

  /* ──────────────────────────────────────────────────────────────────
   * CONTACT — replace every placeholder below with real details.
   * ────────────────────────────────────────────────────────────────── */
  contact: {
    /** WhatsApp number in international format, digits only (52 = Mexico). */
    whatsapp: "526647587222",
    /** Phone number as displayed to visitors. */
    phoneDisplay: "+52 664 758 7222",
    email: "info@lomasdelpacifico.mx",
  },

  /* Social profiles. Leave the value as "" to hide that icon. */
  socials: {
    instagram: "https://instagram.com/lomasdelpacifico", // TODO
    facebook: "https://facebook.com/lomasdelpacifico", // TODO
  },

  /* ──────────────────────────────────────────────────────────────────
   * CURRENCY
   * Prices are set in USD (see config/pricing.ts). The MXN price shown
   * to visitors is calculated automatically with this exchange rate,
   * unless a lot has an explicit MXN override.
   * ────────────────────────────────────────────────────────────────── */
  usdToMxn: 18.5, // TODO: update from time to time

  /* ──────────────────────────────────────────────────────────────────
   * FILES
   * Put the real master-plan PDF in the /public folder and update the
   * path below (e.g. "/master-plan.pdf").
   * ────────────────────────────────────────────────────────────────── */
  masterPlanPdf: "/master-plan-placeholder.pdf", // TODO: real PDF

  /**
   * Seller of record. The Lot Details panel shows each lot's OWN
   * `seller_initials` (from its GeoJSON), so different lots can belong
   * to different owners. These globals are only a fallback for lots
   * whose data has no seller — the panel shows INITIALS, never the full
   * name.
   */
  sellerName: "María Susana Avilés Valle", // full name, for reference/credits
  sellerInitials: "M.S.A.V.", // fallback initials shown in the panel

  /** Credit shown in the footer. */
  ejidoCredit: "Ejido Elías Calles — varios ejidatarios",
} as const;

export type SiteConfig = typeof site;
