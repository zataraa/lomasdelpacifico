"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { LangToggle } from "./LangToggle";

const NAV_ITEMS = [
  { id: "location", key: "location" },
  { id: "map", key: "map" },
  { id: "development", key: "development" },
  { id: "lots", key: "lots" },
  { id: "plans", key: "plans" },
  { id: "gallery", key: "gallery" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Over the dark hero the header is transparent with ivory text;
  // once scrolled it becomes a translucent ivory bar with ink text.
  const tone = scrolled ? "light" : "dark";
  const linkColor =
    tone === "dark"
      ? "text-ivory/80 hover:text-ivory"
      : "text-ink-soft hover:text-ink";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-gold/15 bg-ivory/85 shadow-[0_2px_24px_rgba(35,39,48,0.06)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
        <a
          href="#top"
          className={`font-display text-xl tracking-wide md:text-2xl ${
            tone === "dark" ? "text-ivory" : "text-ink"
          }`}
        >
          Lomas <span className="text-gold">del</span> Pacífico
        </a>

        <nav
          aria-label="Main"
          className="hidden items-center gap-7 lg:flex"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`text-[12px] uppercase tracking-[0.18em] transition-colors ${linkColor}`}
            >
              {t(item.key)}
            </a>
          ))}
          <a
            href="#contact"
            className={`border px-4 py-2 text-[12px] uppercase tracking-[0.18em] transition-all ${
              tone === "dark"
                ? "border-ivory/40 text-ivory hover:border-gold hover:text-gold"
                : "border-gold/60 text-ink hover:bg-gold/10"
            }`}
          >
            {t("requestInfo")}
          </a>
          <LangToggle tone={tone} />
        </nav>

        {/* Mobile */}
        <div className="flex items-center gap-5 lg:hidden">
          <LangToggle tone={tone} />
          <button
            aria-label={t("menu")}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className={`flex h-10 w-10 flex-col items-center justify-center gap-[5px] ${
              tone === "dark" ? "text-ivory" : "text-ink"
            }`}
          >
            <span
              className={`block h-px w-6 bg-current transition-transform duration-300 ${
                menuOpen ? "translate-y-[6px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-6 bg-current transition-opacity duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-px w-6 bg-current transition-transform duration-300 ${
                menuOpen ? "-translate-y-[6px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            aria-label="Mobile"
            initial={reduceMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduceMotion ? undefined : { opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-b border-gold/15 bg-ivory/95 backdrop-blur-md lg:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {[...NAV_ITEMS, { id: "contact", key: "contact" } as const].map(
                (item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="py-3 text-[13px] uppercase tracking-[0.18em] text-ink-soft transition-colors hover:text-gold"
                  >
                    {t(item.key)}
                  </a>
                )
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
