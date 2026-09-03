import { useTranslations } from "next-intl";

import { site } from "@config/site";

/**
 * Floating WhatsApp button, bottom-right on every screen.
 *
 * Sits at z-40 on purpose: above the page, but below the header (z-50),
 * the mobile lot sheet (z-50) and the payment-plans modal (z-60), so it
 * never covers a panel that already carries its own WhatsApp button.
 *
 * No client JavaScript — it is only a link, so it costs nothing to ship.
 */
export function WhatsAppFab() {
  const t = useTranslations("contact");

  const href = `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(
    t("whatsappMessage", { lotId: "none" })
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsapp")}
      title={t("whatsapp")}
      className="fixed right-5 bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_6px_24px_rgba(37,211,102,0.45)] transition-all duration-300 hover:scale-105 hover:bg-[#1ebe5b] hover:shadow-[0_8px_30px_rgba(37,211,102,0.6)] focus-visible:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100 md:right-8 md:bottom-8"
    >
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.4-2.9c-.3-.4 0-.5.2-.7l.4-.5c.1-.2.2-.3.3-.5v-.5L9.7 7.6c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.9.9-1.2 2.1-.4 3.6a12 12 0 0 0 4.4 4.4c1.6.8 2.4 1 3.2.9.6-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.3-.3Z" />
      </svg>
    </a>
  );
}
