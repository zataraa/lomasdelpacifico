"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useTransition } from "react";

import { routing, type Locale } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";

/**
 * EN | ES switch. next-intl persists the choice in the NEXT_LOCALE
 * cookie (read by the server); we mirror it to localStorage as well.
 */
export function LangToggle({ tone = "light" }: { tone?: "light" | "dark" }) {
  const locale = useLocale();
  const t = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  // On return visits, restore the language the visitor chose last time.
  useEffect(() => {
    const stored = window.localStorage.getItem("ldp-locale");
    if (
      stored &&
      stored !== locale &&
      routing.locales.includes(stored as Locale)
    ) {
      router.replace(
        // @ts-expect-error params are compatible with the current route
        { pathname, params },
        { locale: stored as Locale }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function switchTo(next: Locale) {
    if (next === locale) return;
    // next-intl's middleware persists the NEXT_LOCALE cookie on switch;
    // we mirror the choice to localStorage for first-visit detection.
    window.localStorage.setItem("ldp-locale", next);
    startTransition(() => {
      router.replace(
        // @ts-expect-error params are compatible with the current route
        { pathname, params },
        { locale: next }
      );
    });
  }

  const inactive = tone === "dark" ? "text-ivory/50" : "text-ink-soft/60";
  const active = tone === "dark" ? "text-ivory" : "text-ink";

  return (
    <div
      role="group"
      aria-label={t("languageToggle")}
      className={`flex items-center gap-2 text-[12px] font-medium tracking-[0.2em] ${
        isPending ? "opacity-50" : ""
      }`}
    >
      {routing.locales.map((l, i) => (
        <span key={l} className="flex items-center gap-2">
          {i > 0 && <span className={inactive}>|</span>}
          <button
            onClick={() => switchTo(l)}
            aria-pressed={l === locale}
            className={`cursor-pointer uppercase transition-colors hover:text-gold ${
              l === locale ? `${active} underline underline-offset-4 decoration-gold` : inactive
            }`}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}
