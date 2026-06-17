"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useTranslations } from "next-intl";

import { ButtonLink } from "@/components/ui/Button";

/**
 * Cinematic hero. The backdrop is a layered CSS "dusk over the
 * Pacific" gradient — swap it for real photography or video by
 * replacing the .hero-backdrop element (see README).
 */
export function Hero() {
  const t = useTranslations("hero");
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const backdropY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const ease = [0.22, 1, 0.36, 1] as const;
  const fadeUp = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1.1, delay, ease },
        };

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-night"
    >
      {/* Backdrop — replace with <Image>/<video> when real media arrives */}
      <motion.div
        aria-hidden
        style={reduceMotion ? undefined : { y: backdropY }}
        className="absolute inset-[-12%]"
      >
        <div
          className="h-full w-full"
          style={{
            background: `
              radial-gradient(120% 60% at 75% 12%, rgba(212,188,139,0.32) 0%, transparent 55%),
              linear-gradient(180deg, #2b3442 0%, #3d4a57 30%, #6f7a82 52%, #b9975b33 60%, #1f2a35 62%, #16202b 100%)
            `,
          }}
        />
        {/* Horizon shimmer */}
        <div
          className="absolute inset-x-0 top-[52%] h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(212,188,139,0.8), transparent)",
          }}
        />
      </motion.div>
      <div aria-hidden className="texture-grain absolute inset-0" />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-night/85 via-transparent to-night/40"
      />

      <motion.div
        style={reduceMotion ? undefined : { opacity: contentOpacity }}
        className="relative z-10 mx-auto max-w-4xl px-6 text-center"
      >
        <motion.p
          {...fadeUp(0.2)}
          className="mb-6 text-[12px] font-medium uppercase tracking-[0.42em] text-gold-soft"
        >
          {t("eyebrow")}
        </motion.p>

        <motion.h1
          {...fadeUp(0.45)}
          className="font-display text-5xl leading-[1.05] font-medium text-ivory md:text-7xl"
        >
          {t("title")}
        </motion.h1>

        <motion.p
          {...fadeUp(0.7)}
          className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-ivory/75 md:text-lg"
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          {...fadeUp(0.95)}
          className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <ButtonLink href="#map">{t("cta")}</ButtonLink>
          <ButtonLink
            href="#contact"
            variant="outline"
            className="border-ivory/40 text-ivory hover:border-gold hover:bg-ivory/5"
          >
            {t("secondaryCta")}
          </ButtonLink>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.a
        href="#location"
        aria-label={t("scrollHint")}
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-ivory/60 transition-colors hover:text-gold"
      >
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.32em]">
            {t("scrollHint")}
          </span>
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none" aria-hidden>
            <path d="M6 0v18M1 13l5 5 5-5" stroke="currentColor" strokeWidth="1" />
          </svg>
        </motion.div>
      </motion.a>
    </section>
  );
}
