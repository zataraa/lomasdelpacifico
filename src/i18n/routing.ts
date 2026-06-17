import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "en",
  // English lives at "/", Spanish at "/es"
  localePrefix: "as-needed",
  // Hard requirement: every first visit lands in English, regardless of
  // browser language. Returning visitors are restored client-side from
  // the preference saved by the language toggle (localStorage).
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
