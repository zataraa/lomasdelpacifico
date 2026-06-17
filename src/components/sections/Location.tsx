import { useTranslations } from "next-intl";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/** Stylised (non-geographic) locator sketch of the BCS coast. */
function LocatorSketch() {
  const t = useTranslations("location");

  return (
    <figure className="border border-gold/25 bg-ivory-soft p-6 md:p-8">
      <svg
        viewBox="0 0 360 420"
        role="img"
        aria-label={t("mapCaption")}
        className="w-full"
      >
        {/* Ocean wash */}
        <rect width="360" height="420" fill="#eae2d3" opacity="0.35" />
        <text
          x="60"
          y="210"
          fill="#6b7a85"
          fontSize="13"
          fontStyle="italic"
          fontFamily="var(--font-display)"
          transform="rotate(-72 60 210)"
          letterSpacing="4"
        >
          {t("pacific")}
        </text>

        {/* Coast line (stylised) */}
        <path
          d="M150 18 C 138 80, 130 140, 138 200 C 146 260, 170 330, 212 398"
          fill="none"
          stroke="#b9975b"
          strokeWidth="1.5"
        />
        {/* Highway 19 */}
        <path
          d="M186 30 C 172 100, 165 170, 172 230 C 179 290, 200 340, 238 392"
          fill="none"
          stroke="#6b6b4f"
          strokeWidth="1"
          strokeDasharray="5 4"
          opacity="0.7"
        />
        <text x="252" y="330" fill="#6b6b4f" fontSize="10" letterSpacing="1">
          {t("highway")}
        </text>

        {/* La Paz */}
        <circle cx="190" cy="40" r="4" fill="#232730" />
        <text x="204" y="44" fill="#232730" fontSize="12" fontFamily="var(--font-display)">
          La Paz
        </text>

        {/* Todos Santos */}
        <circle cx="160" cy="186" r="3.5" fill="#232730" />
        <text x="174" y="190" fill="#232730" fontSize="11" fontFamily="var(--font-display)">
          Todos Santos
        </text>

        {/* Lomas del Pacífico ★ */}
        <circle cx="170" cy="238" r="9" fill="#b9975b" opacity="0.25">
          <animate attributeName="r" values="7;11;7" dur="3.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="170" cy="238" r="4.5" fill="#b9975b" />
        <text
          x="186"
          y="243"
          fill="#96793f"
          fontSize="12.5"
          fontWeight="600"
          fontFamily="var(--font-display)"
        >
          Lomas del Pacífico
        </text>

        {/* Cabo San Lucas */}
        <circle cx="216" cy="396" r="4" fill="#232730" />
        <text x="120" y="412" fill="#232730" fontSize="12" fontFamily="var(--font-display)">
          Cabo San Lucas
        </text>
      </svg>
      <figcaption className="mt-4 text-center text-xs text-ink-soft italic">
        {t("mapCaption")}
      </figcaption>
    </figure>
  );
}

export function Location() {
  const t = useTranslations("location");
  const facts = ["drive2", "drive1", "drive3", "surf", "coast"] as const;

  return (
    <section id="location" className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid items-start gap-14 lg:grid-cols-[7fr_5fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow={t("eyebrow")}
              title={t("title")}
              align="left"
            />
            <Reveal delay={0.1}>
              <p className="mt-8 font-display text-xl leading-relaxed text-ink italic md:text-2xl">
                {t("lead")}
              </p>
              <p className="mt-6 leading-relaxed text-ink-soft">{t("body1")}</p>
              <p className="mt-4 leading-relaxed text-ink-soft">{t("body2")}</p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-10 border-t border-gold/25 pt-7">
                <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-gold">
                  {t("factsTitle")}
                </p>
                <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {facts.map((key) => (
                    <li
                      key={key}
                      className="flex items-center gap-3 text-sm text-ink"
                    >
                      <span aria-hidden className="h-px w-5 shrink-0 bg-gold" />
                      {t(`facts.${key}`)}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="lg:sticky lg:top-28">
            <LocatorSketch />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
