import { Reveal } from "./Reveal";

/** Eyebrow + display-serif title used to open every section. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  tone = "light",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  tone?: "light" | "dark";
}) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";
  const titleColor = tone === "dark" ? "text-ivory" : "text-ink";
  const subColor = tone === "dark" ? "text-ivory/70" : "text-ink-soft";

  return (
    <Reveal className={`max-w-2xl ${alignCls}`}>
      <p className="mb-4 text-[12px] font-medium uppercase tracking-[0.32em] text-gold">
        {eyebrow}
      </p>
      <h2
        className={`font-display text-4xl leading-[1.1] font-medium md:text-5xl ${titleColor}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-5 text-base leading-relaxed md:text-lg ${subColor}`}>
          {subtitle}
        </p>
      )}
      <div
        className={`gold-rule mt-8 w-24 max-w-full ${
          align === "center" ? "mx-auto" : ""
        }`}
      />
    </Reveal>
  );
}
