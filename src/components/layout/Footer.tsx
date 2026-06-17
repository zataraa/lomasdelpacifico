import { useTranslations } from "next-intl";

import { site } from "@config/site";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  const navItems = [
    { id: "location", key: "location" },
    { id: "map", key: "map" },
    { id: "plans", key: "plans" },
    { id: "contact", key: "contact" },
  ] as const;

  return (
    <footer className="texture-grain relative bg-night text-ivory/80">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[2fr_1fr_1fr] md:px-8 md:py-20">
        <div>
          <p className="font-display text-2xl text-ivory">
            Lomas <span className="text-gold">del</span> Pacífico
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/60">
            {t("tagline")}
          </p>
          <div className="mt-6 flex gap-5">
            {site.socials.instagram && (
              <a
                href={site.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] uppercase tracking-[0.18em] text-ivory/60 transition-colors hover:text-gold"
              >
                Instagram
              </a>
            )}
            {site.socials.facebook && (
              <a
                href={site.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] uppercase tracking-[0.18em] text-ivory/60 transition-colors hover:text-gold"
              >
                Facebook
              </a>
            )}
          </div>
        </div>

        <nav aria-label="Footer">
          <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-gold">
            {t("navTitle")}
          </p>
          <ul className="space-y-2.5">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-sm text-ivory/70 transition-colors hover:text-gold"
                >
                  {tNav(item.key)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-gold">
            {t("contactTitle")}
          </p>
          <ul className="space-y-2.5 text-sm text-ivory/70">
            <li>
              <a
                href={`mailto:${site.contact.email}`}
                className="transition-colors hover:text-gold"
              >
                {site.contact.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${site.contact.phoneDisplay.replace(/\s/g, "")}`}
                className="transition-colors hover:text-gold"
              >
                {site.contact.phoneDisplay}
              </a>
            </li>
          </ul>

          <p className="mt-8 mb-4 text-[11px] uppercase tracking-[0.28em] text-gold">
            {t("legalTitle")}
          </p>
          <ul className="space-y-2.5 text-sm text-ivory/70">
            {/* TODO: link real privacy / terms pages when legal text arrives */}
            <li>
              <a href="#" className="transition-colors hover:text-gold">
                {t("privacy")}
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-gold">
                {t("terms")}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="mx-auto max-w-7xl space-y-3 px-5 py-8 md:px-8">
          <p className="text-xs leading-relaxed text-ivory/40">
            {t("legalNote")}
          </p>
          <p className="text-xs text-ivory/50">
            {t("credits", {
              year: new Date().getFullYear(),
              ejido: site.ejidoCredit,
            })}
          </p>
        </div>
      </div>
    </footer>
  );
}
