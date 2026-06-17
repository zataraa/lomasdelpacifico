"use client";

import { useLocale, useTranslations } from "next-intl";

import { poligonos, sellers, type LotStatus, type Tier } from "@/lib/lots";
import { formatUsd } from "@/lib/format";
import {
  defaultFilters,
  useFilteredLots,
  useSiteStore,
} from "@/lib/store";

const TIERS: Tier[] = ["beachfront_premium", "mid", "inland"];
const STATUSES: LotStatus[] = ["available", "reserved", "sold"];
const PRICE_STEPS = [125_000, 150_000, 175_000, 200_000, 250_000];

const selectCls =
  "w-full cursor-pointer appearance-none border border-ink/15 bg-ivory-soft px-3 py-2.5 pr-8 text-[13px] text-ink transition-colors hover:border-gold focus:border-gold focus:outline-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%226%22%3E%3Cpath%20d%3D%22M0%200l5%206%205-6z%22%20fill%3D%22%23b9975b%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.75rem_center]";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] uppercase tracking-[0.24em] text-ink-soft">
        {label}
      </span>
      {children}
    </label>
  );
}

/** Filter bar shared by the map and the inventory grid (same store). */
export function MapFilters() {
  const t = useTranslations("map.filters");
  const tLots = useTranslations("lots");
  const locale = useLocale();
  const filters = useSiteStore((s) => s.filters);
  const setFilter = useSiteStore((s) => s.setFilter);
  const resetFilters = useSiteStore((s) => s.resetFilters);
  const filtered = useFilteredLots();

  const isDefault =
    JSON.stringify(filters) === JSON.stringify(defaultFilters);

  return (
    <div className="border border-gold/20 bg-ivory-soft/60 p-4 md:p-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-5">
        <Field label={t("seller")}>
          <select
            className={selectCls}
            value={filters.seller}
            onChange={(e) => setFilter("seller", e.target.value)}
          >
            <option value="all">{t("allSellers")}</option>
            {sellers.map((s) => (
              <option key={s.initials} value={s.initials}>
                {s.initials} ({s.count})
              </option>
            ))}
          </select>
        </Field>

        <Field label={t("poligono")}>
          <select
            className={selectCls}
            value={filters.poligono}
            onChange={(e) => setFilter("poligono", e.target.value)}
          >
            <option value="all">{t("all")}</option>
            {poligonos.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>

        <Field label={t("tier")}>
          <select
            className={selectCls}
            value={filters.tier}
            onChange={(e) => setFilter("tier", e.target.value as Tier | "all")}
          >
            <option value="all">{t("all")}</option>
            {TIERS.map((tier) => (
              <option key={tier} value={tier}>
                {tLots(`tier.${tier}`)}
              </option>
            ))}
          </select>
        </Field>

        <Field label={t("status")}>
          <select
            className={selectCls}
            value={filters.status}
            onChange={(e) =>
              setFilter("status", e.target.value as LotStatus | "all")
            }
          >
            <option value="all">{t("all")}</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {tLots(`status.${s}`)}
              </option>
            ))}
          </select>
        </Field>

        <Field label={t("maxPrice")}>
          <select
            className={selectCls}
            value={filters.maxPriceUsd ?? "any"}
            onChange={(e) =>
              setFilter(
                "maxPriceUsd",
                e.target.value === "any" ? null : Number(e.target.value)
              )
            }
          >
            <option value="any">{t("anyPrice")}</option>
            {PRICE_STEPS.map((p) => (
              <option key={p} value={p}>
                ≤ {formatUsd(p, locale)}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-3.5 flex items-center justify-between text-[12px]">
        <p className="text-ink-soft" aria-live="polite">
          {t("results", { count: filtered.length })}
        </p>
        {!isDefault && (
          <button
            onClick={resetFilters}
            className="cursor-pointer uppercase tracking-[0.18em] text-gold-deep underline-offset-4 hover:underline"
          >
            {t("reset")}
          </button>
        )}
      </div>
    </div>
  );
}
