"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocale, useTranslations } from "next-intl";

import { site } from "@config/site";
import { lots } from "@/lib/lots";
import { useSiteStore } from "@/lib/store";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  lotId: z.string().optional(),
  message: z.string().min(5),
});

type ContactForm = z.infer<typeof contactSchema>;

const fieldCls =
  "w-full border border-ink/15 bg-ivory-soft px-4 py-3 text-sm text-ink placeholder:text-ink-soft/50 transition-colors hover:border-gold/60 focus:border-gold focus:outline-none";

export function Contact() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const contactLotId = useSiteStore((s) => s.contactLotId);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle"
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { lotId: "" },
  });

  // Lot chosen on the map / in the plans modal pre-fills the form.
  useEffect(() => {
    if (contactLotId) setValue("lotId", contactLotId);
  }, [contactLotId, setValue]);

  const watchedLot = watch("lotId");

  const whatsappHref = `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(
    t("whatsappMessage", { lotId: watchedLot || "none" })
  )}`;

  const onSubmit = async (data: ContactForm) => {
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("ok");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      className="texture-grain relative scroll-mt-20 bg-night py-20 text-ivory md:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-14 lg:grid-cols-[5fr_7fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow={t("eyebrow")}
              title={t("title")}
              subtitle={t("subtitle")}
              align="left"
              tone="dark"
            />

            <Reveal delay={0.15}>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-flex items-center gap-3 border border-gold/50 px-7 py-3.5 text-[13px] uppercase tracking-[0.18em] text-gold-soft transition-all hover:border-gold hover:bg-gold/10"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.4-2.9c-.3-.4 0-.5.2-.7l.4-.5c.1-.2.2-.3.3-.5v-.5L9.7 7.6c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.9.9-1.2 2.1-.4 3.6a12 12 0 0 0 4.4 4.4c1.6.8 2.4 1 3.2.9.6-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.3-.3Z" />
                </svg>
                {t("whatsapp")}
              </a>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-10 space-y-2 text-sm text-ivory/60">
                <p>{site.contact.phoneDisplay}</p>
                <p>{site.contact.email}</p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="border border-gold/25 bg-ivory p-6 text-ink md:p-9"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="contact-name" className="mb-1.5 block text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                    {t("form.name")}
                  </label>
                  <input
                    id="contact-name"
                    {...register("name")}
                    placeholder={t("form.namePlaceholder")}
                    aria-invalid={!!errors.name}
                    className={fieldCls}
                  />
                  {errors.name && (
                    <p role="alert" className="mt-1.5 text-xs text-terracotta">
                      {t("form.errors.name")}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-email" className="mb-1.5 block text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                    {t("form.email")}
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    {...register("email")}
                    placeholder={t("form.emailPlaceholder")}
                    aria-invalid={!!errors.email}
                    className={fieldCls}
                  />
                  {errors.email && (
                    <p role="alert" className="mt-1.5 text-xs text-terracotta">
                      {t("form.errors.email")}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-phone" className="mb-1.5 block text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                    {t("form.phone")}
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    {...register("phone")}
                    placeholder={t("form.phonePlaceholder")}
                    className={fieldCls}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="contact-lot" className="mb-1.5 block text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                    {t("form.lot")}
                  </label>
                  <select id="contact-lot" {...register("lotId")} className={`${fieldCls} cursor-pointer`}>
                    <option value="">{t("form.lotNone")}</option>
                    {lots
                      .filter((l) => l.status === "available")
                      .map((lot) => (
                        <option key={lot.lotId} value={lot.lotId}>
                          {lot.lotId}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="contact-message" className="mb-1.5 block text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                    {t("form.message")}
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    {...register("message")}
                    placeholder={t("form.messagePlaceholder")}
                    aria-invalid={!!errors.message}
                    className={`${fieldCls} resize-y`}
                  />
                  {errors.message && (
                    <p role="alert" className="mt-1.5 text-xs text-terracotta">
                      {t("form.errors.message")}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-7 flex flex-col items-start gap-4">
                <Button type="submit" disabled={status === "sending"}>
                  {status === "sending" ? t("form.sending") : t("form.submit")}
                </Button>
                <div aria-live="polite">
                  {status === "ok" && (
                    <p className="text-sm text-olive">{t("form.success")}</p>
                  )}
                  {status === "error" && (
                    <p className="text-sm text-terracotta">{t("form.error")}</p>
                  )}
                </div>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
