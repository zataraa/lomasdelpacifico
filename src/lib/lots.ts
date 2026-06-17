/**
 * Single typed data module for the lot inventory.
 *
 * All map layers, listings and forms read lots through this module.
 * It merges the editable pricing/status config (config/pricing.ts)
 * onto the raw GeoJSON at load time, so the GeoJSON files never need
 * to be edited by hand.
 *
 * EXTENSIBILITY: this development has several ejido owners. To add
 * another seller's inventory later, export their lots with the same
 * property schema (see data/README_DATOS.md), drop the file in
 * src/data/ and append it to SOURCES below — the map, filters and
 * listing pick it up automatically.
 */

import { site } from "@config/site";
import {
  lotOverrides,
  priceByTierUsd,
  type LotStatus,
  type Tier,
} from "@config/pricing";

import lotesEnVenta from "@/data/lotes-en-venta.json";
import lotesSalvadorSarabia from "@/data/lotes-salvador-sarabia.json";
import lotesSusanaZonaSur from "@/data/lotes-susana-zona-sur.json";
import lotesFlorencioMoreno from "@/data/lotes-florencio-moreno.json";
import projectBoundary from "@/data/project-boundary.json";

export type { LotStatus, Tier };

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */

interface RawLotProperties {
  lot_id: string;
  poligono: string;
  area_m2: number;
  centroid: [number, number];
  beach_proximity_rank: number;
  tier: Tier;
  status: LotStatus;
  price_usd: number | null;
  price_mxn: number | null;
  payment_plan_url: string | null;
  /** Seller fields — present once a file carries multiple owners. */
  seller?: string;
  seller_initials?: string;
  /** Manzana/Lote scheme — present only for Zona Sur lots. */
  manzana?: number;
  lote?: number;
  zona?: string;
}

interface PolygonGeometry {
  type: "Polygon";
  coordinates: number[][][];
}

interface RawFeature {
  type: "Feature";
  properties: RawLotProperties;
  geometry: PolygonGeometry;
}

interface RawFeatureCollection {
  type: "FeatureCollection";
  features: RawFeature[];
}

/** A lot with pricing/status config applied — what the UI consumes. */
export interface Lot {
  lotId: string;
  /** Short label for map symbols, e.g. "12" from "R22P121LS-12". */
  label: string;
  poligono: string;
  areaM2: number;
  centroid: [number, number];
  beachRank: number;
  tier: Tier;
  status: LotStatus;
  priceUsd: number | null;
  priceMxn: number | null;
  /** Initials of the lot's seller, shown in the panel (e.g. "S.S.V."). */
  sellerInitials: string | null;
  /** Manzana/Lote scheme (Zona Sur lots); null for rifa-named lots. */
  manzana: number | null;
  lote: number | null;
  zona: string | null;
  geometry: PolygonGeometry;
}

/* ------------------------------------------------------------------ */
/* Sources — append more seller files here                              */
/* ------------------------------------------------------------------ */

const SOURCES: RawFeatureCollection[] = [
  lotesEnVenta as unknown as RawFeatureCollection,
  lotesSalvadorSarabia as unknown as RawFeatureCollection,
  lotesSusanaZonaSur as unknown as RawFeatureCollection,
  lotesFlorencioMoreno as unknown as RawFeatureCollection,
];

/* ------------------------------------------------------------------ */
/* Merge config onto raw data                                           */
/* ------------------------------------------------------------------ */

function toLot(f: RawFeature): Lot {
  const p = f.properties;
  const override = lotOverrides[p.lot_id] ?? {};

  const tier = override.tier ?? p.tier;
  const status = override.status ?? p.status;

  const priceUsd =
    override.priceUsd !== undefined
      ? override.priceUsd
      : p.price_usd ?? priceByTierUsd[tier];

  const priceMxn =
    override.priceMxn !== undefined
      ? override.priceMxn
      : p.price_mxn ??
        (priceUsd != null ? Math.round(priceUsd * site.usdToMxn) : null);

  return {
    lotId: p.lot_id,
    label: p.lot_id.split("-").pop() ?? p.lot_id,
    poligono: p.poligono,
    areaM2: p.area_m2,
    centroid: p.centroid,
    beachRank: p.beach_proximity_rank,
    tier,
    status,
    priceUsd,
    priceMxn,
    sellerInitials: p.seller_initials ?? null,
    manzana: p.manzana ?? null,
    lote: p.lote ?? null,
    zona: p.zona ?? null,
    geometry: f.geometry,
  };
}

const mergedLots: Lot[] = SOURCES.flatMap((fc) => fc.features).map(toLot);

/*
 * Combined ocean-proximity ranking across ALL sellers' lots.
 *
 * Each source file ships its own `beach_proximity_rank` numbered 1..42
 * independently, so two lots from different owners could both claim
 * "#1". We recompute a single ranking over the merged inventory using
 * the same west/longitude logic described in data/README_DATOS.md —
 * the westernmost centroid (smallest longitude) is closest to the
 * Pacific and ranks #1 — so ranks are unique 1..N across every owner.
 */
const combinedRank = new Map<string, number>();
[...mergedLots]
  .sort((a, b) => a.centroid[0] - b.centroid[0])
  .forEach((lot, i) => combinedRank.set(lot.lotId, i + 1));

/** All lots for sale, sorted by ocean proximity (1 = closest). */
export const lots: Lot[] = mergedLots
  .map((lot) => ({ ...lot, beachRank: combinedRank.get(lot.lotId)! }))
  .sort((a, b) => a.beachRank - b.beachRank);

/** Total lots for sale across every seller (derived, not hardcoded). */
export const lotCount = lots.length;

export const lotById = new Map(lots.map((l) => [l.lotId, l]));

export function getLot(lotId: string | null | undefined): Lot | undefined {
  return lotId ? lotById.get(lotId) : undefined;
}

/** Distinct polygon/section names, for the filter dropdown. */
export const poligonos = [...new Set(lots.map((l) => l.poligono))].sort();

/**
 * Distinct sellers (by initials) with a lot count, for the seller
 * filter. Derived from the data in onboarding order (first appearance
 * across SOURCES) so it auto-updates as sellers are added — full names
 * are never exposed, only initials.
 */
export interface SellerOption {
  initials: string;
  count: number;
}

export const sellers: SellerOption[] = (() => {
  const counts = new Map<string, number>();
  for (const lot of mergedLots) {
    if (!lot.sellerInitials) continue;
    counts.set(lot.sellerInitials, (counts.get(lot.sellerInitials) ?? 0) + 1);
  }
  return [...counts.entries()].map(([initials, count]) => ({
    initials,
    count,
  }));
})();

/* ------------------------------------------------------------------ */
/* GeoJSON for the map (enriched with merged price/status/label)        */
/* ------------------------------------------------------------------ */

export interface LotFeatureProperties {
  lot_id: string;
  label: string;
  poligono: string;
  area_m2: number;
  beach_rank: number;
  tier: Tier;
  status: LotStatus;
  price_usd: number | null;
  seller_initials: string | null;
}

export function lotsAsFeatureCollection(): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: lots.map((l) => ({
      type: "Feature",
      id: l.lotId,
      properties: {
        lot_id: l.lotId,
        label: l.label,
        poligono: l.poligono,
        area_m2: l.areaM2,
        beach_rank: l.beachRank,
        tier: l.tier,
        status: l.status,
        price_usd: l.priceUsd,
        seller_initials: l.sellerInitials,
      } satisfies LotFeatureProperties,
      geometry: l.geometry,
    })),
  };
}

export const boundaryFeatureCollection =
  projectBoundary as unknown as GeoJSON.FeatureCollection;

type Bounds = [number, number, number, number];

function expandBounds(b: { w: number; s: number; e: number; n: number }, coords: unknown): void {
  if (typeof (coords as number[])[0] === "number") {
    const [x, y] = coords as [number, number];
    if (x < b.w) b.w = x;
    if (x > b.e) b.e = x;
    if (y < b.s) b.s = y;
    if (y > b.n) b.n = y;
  } else {
    for (const c of coords as unknown[]) expandBounds(b, c);
  }
}

/** Bounding box of the for-sale lots: [west, south, east, north]. */
export const lotsBounds: Bounds = (() => {
  const b = { w: Infinity, s: Infinity, e: -Infinity, n: -Infinity };
  for (const lot of lots) expandBounds(b, lot.geometry.coordinates);
  return [b.w, b.s, b.e, b.n];
})();

/** Bounding box of the whole development (project boundary). */
export const boundaryBounds: Bounds = (() => {
  const b = { w: Infinity, s: Infinity, e: -Infinity, n: -Infinity };
  for (const f of boundaryFeatureCollection.features) {
    if ("coordinates" in f.geometry) expandBounds(b, f.geometry.coordinates);
  }
  return [b.w, b.s, b.e, b.n];
})();

/* ------------------------------------------------------------------ */
/* Beach-proximity label buckets                                        */
/* ------------------------------------------------------------------ */

/**
 * Maps a lot's combined ocean-proximity rank to a translation key under
 * "lots.beachLabel.*". Buckets by thirds of the full inventory, so the
 * split scales automatically as more lots/sellers are added.
 */
export function beachLabelKey(
  rank: number,
  total: number = lots.length
): "front" | "near" | "calm" {
  if (rank <= total / 3) return "front";
  if (rank <= (total * 2) / 3) return "near";
  return "calm";
}
