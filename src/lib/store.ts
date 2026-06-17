"use client";

/**
 * Shared UI state connecting the map, the inventory listing, the
 * payment-plans modal and the contact form.
 */

import { create } from "zustand";
import { lots, type Lot, type LotStatus, type Tier } from "@/lib/lots";

export interface LotFilters {
  poligono: string | "all";
  tier: Tier | "all";
  status: LotStatus | "all";
  /** Seller, matched by initials (e.g. "M.S.A.V."); "all" = any seller. */
  seller: string | "all";
  /** Maximum USD price; null = no limit. Lots without price always match. */
  maxPriceUsd: number | null;
}

export const defaultFilters: LotFilters = {
  poligono: "all",
  tier: "all",
  status: "all",
  seller: "all",
  maxPriceUsd: null,
};

interface SiteState {
  /** Lot selected on the map / listing (panel open while set). */
  selectedLotId: string | null;
  /** Lot the payment-plans modal was opened for (null = modal closed). */
  plansLotId: string | null;
  plansOpen: boolean;
  /** Lot pre-filled in the contact form. */
  contactLotId: string | null;
  filters: LotFilters;

  selectLot: (lotId: string | null) => void;
  openPlans: (lotId?: string | null) => void;
  closePlans: () => void;
  setContactLot: (lotId: string | null) => void;
  setFilter: <K extends keyof LotFilters>(key: K, value: LotFilters[K]) => void;
  resetFilters: () => void;
}

export const useSiteStore = create<SiteState>((set) => ({
  selectedLotId: null,
  plansLotId: null,
  plansOpen: false,
  contactLotId: null,
  filters: defaultFilters,

  selectLot: (lotId) => set({ selectedLotId: lotId }),
  openPlans: (lotId = null) => set({ plansOpen: true, plansLotId: lotId }),
  closePlans: () => set({ plansOpen: false }),
  setContactLot: (lotId) => set({ contactLotId: lotId }),
  setFilter: (key, value) =>
    set((s) => ({ filters: { ...s.filters, [key]: value } })),
  resetFilters: () => set({ filters: defaultFilters }),
}));

export function lotMatchesFilters(lot: Lot, f: LotFilters): boolean {
  if (f.poligono !== "all" && lot.poligono !== f.poligono) return false;
  if (f.tier !== "all" && lot.tier !== f.tier) return false;
  if (f.status !== "all" && lot.status !== f.status) return false;
  if (f.seller !== "all" && lot.sellerInitials !== f.seller) return false;
  if (
    f.maxPriceUsd != null &&
    lot.priceUsd != null &&
    lot.priceUsd > f.maxPriceUsd
  )
    return false;
  return true;
}

export function useFilteredLots(): Lot[] {
  const filters = useSiteStore((s) => s.filters);
  return lots.filter((l) => lotMatchesFilters(l, filters));
}

/** Smooth-scrolls to a section anchor, respecting reduced motion. */
export function scrollToSection(id: string) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}
