import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "en",
  // English lives at the clean root "/", Spanish at "/es".
  localePrefix: "as-needed",
  // localeDetection stays ON (the default): English is served at "/" for
  // virtually everyone — English browsers, any non-Spanish browser, crawlers
  // and link-preview bots — while visitors whose device language is Spanish
  // are taken to "/es" on first visit. The header EN|ES toggle + localStorage
  // still let anyone switch and have it remembered.
  //
  // ⚠️ Do NOT set `localeDetection: false` here: combined with `as-needed`
  // it makes the middleware redirect "/" → "/" forever in a PRODUCTION build
  // (fine in dev, loops on Vercel). That's why we rely on detection instead.
});

export type Locale = (typeof routing.locales)[number];
