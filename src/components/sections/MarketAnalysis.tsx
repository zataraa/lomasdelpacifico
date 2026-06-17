"use client";

import { useTranslations } from "next-intl";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

interface ComparisonRow {
  zone: string;
  distance: string;
  market: string;
  price: string;
  tag?: string;
  highlight?: boolean;
}

interface PerSqmRow {
  zone: string;
  price: string;
  tag?: string;
  highlight?: boolean;
}

const subheadingCls =
  "font-display text-2xl font-medium text-night md:text-3xl";
const thCls =
  "px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.16em] text-ivory/90";
const tdCls = "px-4 py-3.5 align-middle text-sm text-ink";

/** Zone cell with an optional "this project" tag underneath. */
function ZoneCell({ zone, tag }: { zone: string; tag?: string }) {
  return (
    <div>
      <span className={tag ? "font-semibold text-gold-deep" : ""}>{zone}</span>
      {tag && (
        <span className="mt-0.5 block text-[10px] uppercase tracking-[0.18em] text-gold-deep/80">
          {tag}
        </span>
      )}
    </div>
  );
}

export function MarketAnalysis() {
  const t = useTranslations("market");
  const advantages = t.raw("advantages") as string[];
  const comparisonRows = t.raw("comparisonRows") as ComparisonRow[];
  const perSqmRows = t.raw("perSqmRows") as PerSqmRow[];

  return (
    <section id="market" className="scroll-mt-20 bg-ivory py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("intro")}
        />

        {/* A — Location advantages */}
        <Reveal delay={0.1} className="mt-14">
          <h3 className={subheadingCls}>{t("advantagesTitle")}</h3>
          <ul className="mt-6 grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
            {advantages.map((adv, i) => (
              <li key={i} className="flex items-start gap-3 text-ink">
                <span
                  aria-hidden
                  className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold"
                />
                <span className="leading-relaxed">{adv}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* B — Regional market comparison */}
        <Reveal delay={0.12} className="mt-16">
          <h3 className={subheadingCls}>{t("comparisonTitle")}</h3>
          <div className="mt-6 overflow-x-auto border border-gold/25 shadow-[0_8px_32px_rgba(35,39,48,0.06)]">
            <table className="w-full min-w-[660px] border-collapse">
              <thead className="bg-night">
                <tr>
                  <th className={thCls}>{t("comparisonCols.zone")}</th>
                  <th className={thCls}>{t("comparisonCols.distance")}</th>
                  <th className={thCls}>{t("comparisonCols.market")}</th>
                  <th className={thCls}>{t("comparisonCols.price")}</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={i}
                    className={
                      row.highlight
                        ? "bg-gold/20 font-medium"
                        : "bg-ivory-soft odd:bg-ivory"
                    }
                  >
                    <td
                      className={`${tdCls} ${row.highlight ? "border-l-2 border-gold" : ""}`}
                    >
                      <ZoneCell zone={row.zone} tag={row.tag} />
                    </td>
                    <td className={tdCls}>{row.distance}</td>
                    <td className={tdCls}>{row.market}</td>
                    <td className={`${tdCls} whitespace-nowrap`}>{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        {/* C — Price per m² */}
        <Reveal delay={0.12} className="mt-16">
          <h3 className={subheadingCls}>{t("perSqmTitle")}</h3>
          <div className="mt-6 overflow-hidden border border-gold/25 shadow-[0_8px_32px_rgba(35,39,48,0.06)] md:max-w-xl">
            <table className="w-full border-collapse">
              <thead className="bg-night">
                <tr>
                  <th className={thCls}>{t("perSqmCols.zone")}</th>
                  <th className={thCls}>{t("perSqmCols.price")}</th>
                </tr>
              </thead>
              <tbody>
                {perSqmRows.map((row, i) => (
                  <tr
                    key={i}
                    className={
                      row.highlight
                        ? "bg-gold/20 font-medium"
                        : "bg-ivory-soft odd:bg-ivory"
                    }
                  >
                    <td
                      className={`${tdCls} ${row.highlight ? "border-l-2 border-gold" : ""}`}
                    >
                      <ZoneCell zone={row.zone} tag={row.tag} />
                    </td>
                    <td className={`${tdCls} whitespace-nowrap`}>{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        {/* D — Professional opinion */}
        <Reveal delay={0.12} className="mt-16">
          <h3 className={subheadingCls}>{t("opinionTitle")}</h3>
          <div className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-ink-soft">
            <p>{t("opinion1")}</p>
            <p>{t("opinion2")}</p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-10 text-xs leading-relaxed text-ink-soft/80 italic">
            {t("disclaimer")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
