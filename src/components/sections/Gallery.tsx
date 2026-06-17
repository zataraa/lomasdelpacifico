import { useTranslations } from "next-intl";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/*
 * PLACEHOLDER GALLERY
 * Each tile is an elegant CSS duotone gradient standing in for real
 * photography. To use real photos: drop images into /public/gallery/
 * and replace the <div style=…> below with
 *   <Image src="/gallery/01.jpg" alt={…} fill className="object-cover" />
 * (see README "Swapping in real photos").
 */
const TILES = [
  {
    key: "one",
    tall: true,
    bg: "linear-gradient(165deg, #d4bc8b 0%, #b06b4a 45%, #1b2430 100%)",
  },
  {
    key: "two",
    tall: false,
    bg: "linear-gradient(150deg, #9fb2bb 0%, #5b7282 55%, #2b3442 100%)",
  },
  {
    key: "three",
    tall: false,
    bg: "linear-gradient(160deg, #eae2d3 0%, #b9975b 60%, #6b6b4f 100%)",
  },
  {
    key: "four",
    tall: false,
    bg: "linear-gradient(145deg, #cfd8d3 0%, #6f8a8a 50%, #34495a 100%)",
  },
  {
    key: "five",
    tall: false,
    bg: "linear-gradient(170deg, #ddd2bc 0%, #a8956a 50%, #4f4a38 100%)",
  },
  {
    key: "six",
    tall: true,
    bg: "linear-gradient(155deg, #e8c89a 0%, #b97a5b 50%, #232730 100%)",
  },
] as const;

export function Gallery() {
  const t = useTranslations("gallery");

  return (
    <section id="gallery" className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="mt-14 grid auto-rows-[230px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TILES.map((tile, i) => (
            <Reveal
              key={tile.key}
              delay={i * 0.06}
              y={24}
              className={`h-full ${tile.tall ? "sm:row-span-2" : ""}`}
            >
              <figure className="texture-grain group relative h-full w-full overflow-hidden">
                <div
                  aria-hidden
                  className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  style={{ background: tile.bg }}
                />
                <figcaption className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-night/80 to-transparent p-5 pt-12">
                  <p className="font-display text-base text-ivory italic">
                    {t(`captions.${tile.key}`)}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-ink-soft/70 italic">
          {t("placeholderNote")}
        </p>
      </div>
    </section>
  );
}
