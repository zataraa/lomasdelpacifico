import type { LotStatus, Tier } from "@/lib/lots";

export const tierColors: Record<Tier, string> = {
  beachfront_premium: "bg-gold/15 text-gold-deep border-gold/40",
  mid: "bg-sand-deep/40 text-olive border-sand-deep",
  inland: "bg-olive/10 text-olive border-olive/30",
};

const statusColors: Record<LotStatus, string> = {
  available: "bg-[#3e7a55]/10 text-[#2f6644] border-[#3e7a55]/35",
  reserved: "bg-terracotta/10 text-terracotta border-terracotta/30",
  sold: "bg-ink/5 text-ink-soft border-ink/15",
};

export function TierBadge({ tier, label }: { tier: Tier; label: string }) {
  return (
    <span
      className={`inline-block border px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] ${tierColors[tier]}`}
    >
      {label}
    </span>
  );
}

export function StatusBadge({
  status,
  label,
}: {
  status: LotStatus;
  label: string;
}) {
  return (
    <span
      className={`inline-block border px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] ${statusColors[status]}`}
    >
      {label}
    </span>
  );
}
