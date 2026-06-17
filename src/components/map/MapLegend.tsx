"use client";

import { useTranslations } from "next-intl";

/* Keep in sync with TIER_COLORS in LotMap.tsx */
const ITEMS = [
  { key: "beachfront_premium", color: "#c2913e" },
  { key: "mid", color: "#d3bc88" },
  { key: "inland", color: "#b3a877" },
  { key: "unavailable", color: "#7a7d83" },
] as const;

export function MapLegend() {
  const t = useTranslations("map.legend");

  return (
    <div className="absolute bottom-6 left-5 z-10 hidden border border-gold/25 bg-ivory/90 px-4 py-3.5 shadow-lg backdrop-blur-sm sm:block">
      <p className="mb-2.5 text-[10px] uppercase tracking-[0.28em] text-gold-deep">
        {t("title")}
      </p>
      <ul className="space-y-1.5">
        {ITEMS.map((item) => (
          <li key={item.key} className="flex items-center gap-2.5 text-[12px] text-ink-soft">
            <span
              aria-hidden
              className="h-3 w-3 border border-ink/20"
              style={{ backgroundColor: item.color, opacity: 0.75 }}
            />
            {t(item.key)}
          </li>
        ))}
        <li className="flex items-center gap-2.5 text-[12px] text-ink-soft">
          <span
            aria-hidden
            className="h-0 w-3 border-t"
            style={{ borderColor: "#a98a52" }}
          />
          {t("masterplan")}
        </li>
        <li className="flex items-center gap-2.5 text-[12px] text-ink-soft">
          <span
            aria-hidden
            className="h-0 w-3 border-t-2"
            style={{ borderColor: "#d4bc8b" }}
          />
          {t("boundary")}
        </li>
      </ul>
    </div>
  );
}
