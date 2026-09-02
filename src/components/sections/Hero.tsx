"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useTranslations } from "next-intl";

import { ButtonLink } from "@/components/ui/Button";

/**
 * Cinematic hero. The backdrop is a muted, looping drone flight along
 * the coast (public/video/hero.mp4, exported from the original 4K60
 * footage). To swap it, replace that file and its poster — the poster
 * should be the clip's own first frame so playback starts seamlessly.
 */
export function Hero() {
  const t = useTranslations("hero");
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();

  // Honour prefers-reduced-motion: hold on the poster frame instead of
  // looping the flight. Removing `autoplay` alone would not stop a clip
  // that already began playing, so pause it explicitly.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reduceMotion) video.pause();
    else void video.play().catch(() => {});
  }, [reduceMotion]);

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
      {/* Backdrop — aerial flight along the coast, drifting on scroll.
          The poster is the clip's own first frame, so there is no jump
          when playback starts (and it is what shows when the visitor
          prefers reduced motion or the video cannot load). */}
      <motion.div
        aria-hidden
        style={reduceMotion ? undefined : { y: backdropY }}
        className="absolute inset-[-12%]"
      >
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          poster="/video/hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
      </motion.div>
      <div aria-hidden className="texture-grain absolute inset-0" />
      {/* Scrim: the frame is a bright hazy sunset, so the headline needs a
          real veil over it, not just darkened edges. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/45 to-night/60"
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
