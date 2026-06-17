import { useLocale, useTranslations } from "next-intl";

import { site } from "@config/site";
import { lotCount } from "@/lib/lots";
import { formatNumber } from "@/lib/format";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Development() {
  const t = useTranslations("development");
  const locale = useLocale();

  // The for-sale count is derived from the data, so it stays correct as
  // sellers are added; the other figures are editable copy.
  const totalLots = formatNumber(lotCount, locale);
  const stats = [
    { value: totalLots, label: t("stats.lotsLabel") },
    { value: t("stats.areaValue"), label: t("stats.areaLabel") },
    { value: t("stats.planValue"), label: t("stats.planLabel") },
    { value: t("stats.frontValue"), label: t("stats.frontLabel") },
  ];

  return (
    <section
      id="development"
      className="texture-grain relative scroll-mt-20 bg-night py-20 text-ivory md:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("lead", { count: totalLots })}
          tone="dark"
        />

        <Reveal delay={0.1}>
          <p className="mx-auto mt-10 max-w-3xl text-center leading-relaxed text-ivory/70">
            {t("body")}
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-2 gap-px bg-gold/20 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={0.1 + i * 0.08}>
              <div className="flex h-full flex-col items-center justify-center bg-night px-6 py-10 text-center">
                <p className="font-display text-4xl text-gold-soft md:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-3 text-[12px] uppercase tracking-[0.22em] text-ivory/60">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-14 flex flex-col items-center gap-3 text-center">
            <a
              href={site.masterPlanPdf}
              download
              className="inline-flex items-center gap-3 border border-gold/50 px-7 py-3.5 text-[13px] uppercase tracking-[0.18em] text-gold-soft transition-all hover:border-gold hover:bg-gold/10"
            >
              <svg width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden>
                <path
                  d="M7 0v11M2.5 7L7 11.5 11.5 7M1 15h12"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </svg>
              {t("masterPlanCta")}
            </a>
            <p className="text-xs text-ivory/40 italic">{t("masterPlanNote")}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
