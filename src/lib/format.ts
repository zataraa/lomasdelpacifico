/** Locale-aware number, currency and area formatting helpers. */

const SQFT_PER_M2 = 10.7639;

export function formatNumber(value: number, locale: string): string {
  return new Intl.NumberFormat(locale === "es" ? "es-MX" : "en-US").format(
    value
  );
}

export function formatUsd(value: number, locale: string): string {
  return new Intl.NumberFormat(locale === "es" ? "es-MX" : "en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatMxn(value: number, locale: string): string {
  const formatted = new Intl.NumberFormat(
    locale === "es" ? "es-MX" : "en-US",
    {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
      currencyDisplay: "code",
    }
  ).format(value);
  // "MXN 2,756,500" → "2,756,500 MXN" reads better in both languages
  return formatted.replace(/^MXN\s?/, "") + " MXN";
}

export function formatAreaM2(m2: number, locale: string): string {
  return `${formatNumber(m2, locale)} m²`;
}

export function formatAreaSqFt(m2: number, locale: string): string {
  return `${formatNumber(Math.round(m2 * SQFT_PER_M2), locale)} ft²`;
}
