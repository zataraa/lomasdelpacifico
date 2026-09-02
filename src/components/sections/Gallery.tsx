import Image from "next/image";
import { useTranslations } from "next-intl";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/*
 * Real aerial photography of the development (drone, August 2026),
 * exported from the original RAW frames into /public/gallery.
 *
 * To swap a photo: drop a new file in with the same name. To add or
 * reorder tiles: edit the list below and add a matching caption under
 * "gallery.captions" in messages/en.json and messages/es.json.
 */
const TILES = [
  { key: "sunset", src: "/gallery/01-atardecer.jpg" },
  { key: "bay", src: "/gallery/02-lomas-bahia.jpg" },
  { key: "highway", src: "/gallery/03-carretera.jpg" },
  { key: "sierra", src: "/gallery/04-sierra.jpg" },
  { key: "valley", src: "/gallery/05-valle.jpg" },
  { key: "access", src: "/gallery/06-acceso.jpg" },
] as const;

const captionCls =
  "absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-night/85 to-transparent p-5 pt-14";

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

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TILES.map((tile, i) => (
            <Reveal key={tile.key} delay={(i % 3) * 0.08} y={24}>
              <figure className="group relative aspect-[16/9] w-full overflow-hidden border border-gold/15">
                <Image
                  src={tile.src}
                  alt={t(`captions.${tile.key}`)}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                />
                <figcaption className={captionCls}>
                  <p className="font-display text-base text-ivory italic">
                    {t(`captions.${tile.key}`)}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {/* 360° panorama — the whole site in one frame */}
        <Reveal delay={0.1} className="mt-4">
          <figure className="group relative aspect-[2/1] w-full overflow-hidden border border-gold/15 md:aspect-[3/1]">
            <Image
              src="/gallery/panorama-360.jpg"
              alt={t("captions.panorama")}
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
            />
            <figcaption className={captionCls}>
              <p className="font-display text-base text-ivory italic">
                {t("captions.panorama")}
              </p>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
