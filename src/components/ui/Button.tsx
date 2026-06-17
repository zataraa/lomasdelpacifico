import { type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";

const base =
  "inline-flex items-center justify-center gap-2 px-7 py-3 text-[13px] uppercase tracking-[0.18em] font-medium transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

const variants = {
  primary:
    "bg-gold text-ivory hover:bg-gold-deep shadow-[0_4px_20px_rgba(185,151,91,0.35)] hover:shadow-[0_6px_24px_rgba(185,151,91,0.45)]",
  outline:
    "border border-gold/60 text-ink hover:border-gold hover:bg-gold/10",
  ghost: "text-gold-deep hover:text-ink underline-offset-4 hover:underline",
  dark: "bg-ink text-ivory hover:bg-night",
} as const;

type Variant = keyof typeof variants;

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant }) {
  return (
    <a className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
}
