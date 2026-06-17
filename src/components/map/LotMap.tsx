"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import maplibregl, {
  Map as MLMap,
  type ExpressionSpecification,
  type FilterSpecification,
  type MapGeoJSONFeature,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useLocale, useTranslations } from "next-intl";

import {
  boundaryBounds,
  boundaryFeatureCollection,
  getLot,
  lotsAsFeatureCollection,
  type Tier,
} from "@/lib/lots";
import { formatUsd } from "@/lib/format";
import { useSiteStore, type LotFilters } from "@/lib/store";

/* ------------------------------------------------------------------ */
/* Styling constants                                                    */
/* ------------------------------------------------------------------ */

/* Tier fills — champagne golds, richest for the front row. */
const TIER_COLORS: Record<string, string> = {
  beachfront_premium: "#c2913e",
  mid: "#d3bc88",
  inland: "#b3a877",
};

const DIMMED = "#7a7d83";

export type BasemapMode = "satellite" | "minimal";
const BASEMAP_STORAGE_KEY = "ldp-basemap";

/**
 * Mode-dependent paint: the same master-plan linework reads as fine
 * gold etching over satellite imagery, and as a sepia architectural
 * site plan on the minimal (ivory) canvas.
 */
const MODE_PAINT = {
  satellite: {
    contextLine: "#d9c391",
    contextLineOpacity: 0.55,
    contextFill: "#d4bc8b",
    contextFillOpacity: 0.06,
    boundaryGlow: "#d4bc8b",
    boundaryGlowOpacity: 0.4,
    boundaryLine: "#e3cf9e",
    lotsOutline: "#e8d5a3",
    labelColor: "#fbf9f4",
    labelHalo: "#232730",
  },
  minimal: {
    contextLine: "#a98a52",
    contextLineOpacity: 0.65,
    contextFill: "#e3d8bd",
    contextFillOpacity: 0.4,
    boundaryGlow: "#b9975b",
    boundaryGlowOpacity: 0.3,
    boundaryLine: "#96793f",
    lotsOutline: "#96793f",
    labelColor: "#232730",
    labelHalo: "#fbf9f4",
  },
} as const;

/* The minimal canvas — warm ivory, like premium paper. */
const MINIMAL_PAPER = "#f4eee1";

function lotOpacityExpression(base: number): ExpressionSpecification {
  return [
    "case",
    ["!=", ["get", "status"], "available"],
    0.3,
    ["boolean", ["feature-state", "selected"], false],
    0.9,
    ["boolean", ["feature-state", "hover"], false],
    0.8,
    base,
  ];
}

function lotLineWidthExpression(base: number): ExpressionSpecification {
  return [
    "case",
    ["boolean", ["feature-state", "selected"], false],
    2.8,
    ["boolean", ["feature-state", "hover"], false],
    2,
    base,
  ];
}

function filterExpression(f: LotFilters): FilterSpecification {
  const conditions: ExpressionSpecification[] = [];
  if (f.poligono !== "all")
    conditions.push(["==", ["get", "poligono"], f.poligono]);
  if (f.tier !== "all") conditions.push(["==", ["get", "tier"], f.tier]);
  if (f.status !== "all") conditions.push(["==", ["get", "status"], f.status]);
  if (f.seller !== "all")
    conditions.push(["==", ["get", "seller_initials"], f.seller]);
  if (f.maxPriceUsd != null)
    conditions.push([
      "<=",
      ["coalesce", ["get", "price_usd"], 0],
      f.maxPriceUsd,
    ]);
  return ["all", ...conditions] as FilterSpecification;
}

/** Dev-only: expose the map instance for console debugging. */
function exposeForDebug(map: MLMap) {
  if (process.env.NODE_ENV !== "production") {
    (window as unknown as Record<string, unknown>).__lotMap = map;
  }
}

interface TooltipState {
  x: number;
  y: number;
  lotId: string;
  areaM2: number;
  tier: Tier;
  priceUsd: number | null;
}

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

export function LotMap() {
  const t = useTranslations("map");
  const tLots = useTranslations("lots");
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const [mode, setMode] = useState<BasemapMode>(() => {
    if (typeof window === "undefined") return "satellite";
    const stored = window.localStorage.getItem(BASEMAP_STORAGE_KEY);
    return stored === "minimal" ? "minimal" : "satellite";
  });
  const modeRef = useRef(mode);

  const selectedLotId = useSiteStore((s) => s.selectedLotId);
  const selectLot = useSiteStore((s) => s.selectLot);
  const filters = useSiteStore((s) => s.filters);

  const hoveredRef = useRef<string | null>(null);
  const selectedRef = useRef<string | null>(null);

  /** Applies all mode-dependent layer styling (safe for missing layers). */
  const applyMode = useCallback((map: MLMap, m: BasemapMode) => {
    const p = MODE_PAINT[m];
    const setPaint = (
      layer: string,
      prop: string,
      value: string | number | ExpressionSpecification
    ) => {
      if (map.getLayer(layer)) map.setPaintProperty(layer, prop, value);
    };

    if (map.getLayer("satellite")) {
      map.setLayoutProperty(
        "satellite",
        "visibility",
        m === "satellite" ? "visible" : "none"
      );
    }

    setPaint("context-fill", "fill-color", p.contextFill);
    setPaint("context-fill", "fill-opacity", p.contextFillOpacity);
    setPaint("context-line", "line-color", p.contextLine);
    setPaint("context-line", "line-opacity", p.contextLineOpacity);
    setPaint("boundary-glow", "line-color", p.boundaryGlow);
    setPaint("boundary-glow", "line-opacity", p.boundaryGlowOpacity);
    setPaint("boundary-line", "line-color", p.boundaryLine);
    setPaint("lots-outline", "line-color", [
      "case",
      ["!=", ["get", "status"], "available"],
      DIMMED,
      p.lotsOutline,
    ]);
    setPaint("lots-labels", "text-color", p.labelColor);
    setPaint("lots-labels", "text-halo-color", p.labelHalo);
  }, []);

  const switchMode = (next: BasemapMode) => {
    setMode(next);
    modeRef.current = next;
    window.localStorage.setItem(BASEMAP_STORAGE_KEY, next);
    if (mapRef.current) applyMode(mapRef.current, next);
  };

  /* ---------------------------------------------------------------- */
  /* Map initialisation                                                 */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
        sources: {
          satellite: {
            type: "raster",
            tiles: [
              "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            ],
            tileSize: 256,
            maxzoom: 19,
            attribution:
              "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
          },
        },
        layers: [
          {
            // The "minimal" canvas — premium ivory paper behind everything;
            // visible whenever the satellite layer is hidden.
            id: "paper",
            type: "background",
            paint: { "background-color": MINIMAL_PAPER },
          },
          {
            id: "satellite",
            type: "raster",
            source: "satellite",
            paint: {
              // Muted, slightly warm satellite — keeps the luxury palette calm
              "raster-saturation": -0.55,
              "raster-contrast": -0.08,
              "raster-brightness-min": 0.08,
            },
          },
        ],
      },
      // Frame the entire development, not just the for-sale lots
      bounds: [
        [boundaryBounds[0], boundaryBounds[1]],
        [boundaryBounds[2], boundaryBounds[3]],
      ],
      fitBoundsOptions: {
        // Generous breathing room, but never starve small containers
        padding: Math.max(
          16,
          Math.min(56, containerRef.current.clientHeight * 0.07)
        ),
      },
      minZoom: 11,
      maxZoom: 18.5,
      cooperativeGestures: true,
      attributionControl: { compact: true },
    });
    mapRef.current = map;
    exposeForDebug(map);

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "top-right"
    );

    // The 1.1 MB master-plan layer is part of the centerpiece now:
    // start fetching immediately (in parallel with map setup) and add
    // it the moment both the style and the data are ready.
    const contextData = fetch("/data/all_lots_context.geojson")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .catch(() => null);

    map.on("load", () => {
      map.addSource("boundary", {
        type: "geojson",
        data: boundaryFeatureCollection,
      });
      map.addSource("lots", {
        type: "geojson",
        data: lotsAsFeatureCollection(),
        promoteId: "lot_id",
      });

      // 1. Project boundary — prominent gold stroke with a soft halo
      //    framing the whole development.
      map.addLayer({
        id: "boundary-glow",
        type: "line",
        source: "boundary",
        paint: {
          "line-color": MODE_PAINT.satellite.boundaryGlow,
          "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            12,
            10,
            16,
            18,
          ],
          "line-blur": 10,
          "line-opacity": MODE_PAINT.satellite.boundaryGlowOpacity,
        },
      });
      map.addLayer({
        id: "boundary-line",
        type: "line",
        source: "boundary",
        paint: {
          "line-color": MODE_PAINT.satellite.boundaryLine,
          "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            12,
            1.8,
            16,
            2.6,
          ],
          "line-opacity": 0.95,
        },
      });

      // 3. For-sale lots, champagne-gold by tier; sold/reserved dimmed.
      map.addLayer({
        id: "lots-fill",
        type: "fill",
        source: "lots",
        paint: {
          "fill-color": [
            "case",
            ["!=", ["get", "status"], "available"],
            DIMMED,
            [
              "match",
              ["get", "tier"],
              "beachfront_premium",
              TIER_COLORS.beachfront_premium,
              "mid",
              TIER_COLORS.mid,
              TIER_COLORS.inland,
            ],
          ],
          // Lots are ~40 m wide — nearly invisible at the overview zoom
          // unless they render almost solid, so opacity eases off as
          // the visitor zooms in.
          // ("zoom" must be the top-level expression in MapLibre.)
          "fill-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            13,
            lotOpacityExpression(0.95),
            16.5,
            lotOpacityExpression(0.55),
          ],
        },
      });
      map.addLayer({
        id: "lots-outline",
        type: "line",
        source: "lots",
        paint: {
          "line-color": [
            "case",
            ["!=", ["get", "status"], "available"],
            DIMMED,
            MODE_PAINT.satellite.lotsOutline,
          ],
          "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            13,
            lotLineWidthExpression(1.5),
            16.5,
            lotLineWidthExpression(1),
          ],
          "line-opacity": 0.95,
        },
      });

      // Short lot numbers, visible when zoomed in
      map.addLayer({
        id: "lots-labels",
        type: "symbol",
        source: "lots",
        minzoom: 15,
        layout: {
          "text-field": ["get", "label"],
          "text-font": ["Open Sans Semibold"],
          "text-size": 12,
        },
        paint: {
          "text-color": MODE_PAINT.satellite.labelColor,
          "text-halo-color": MODE_PAINT.satellite.labelHalo,
          "text-halo-width": 1,
          "text-opacity": [
            "case",
            ["!=", ["get", "status"], "available"],
            0.45,
            1,
          ],
        },
      });

      // 2. Master plan — every parcel as fine etched linework with a
      //    whisper of fill, beneath the for-sale lots.
      contextData.then((data) => {
        if (!data || !mapRef.current || map.getSource("context")) return;
        map.addSource("context", { type: "geojson", data });
        map.addLayer(
          {
            id: "context-fill",
            type: "fill",
            source: "context",
            paint: {
              "fill-color": MODE_PAINT.satellite.contextFill,
              "fill-opacity": MODE_PAINT.satellite.contextFillOpacity,
            },
          },
          "lots-fill"
        );
        map.addLayer(
          {
            id: "context-line",
            type: "line",
            source: "context",
            paint: {
              "line-color": MODE_PAINT.satellite.contextLine,
              "line-opacity": MODE_PAINT.satellite.contextLineOpacity,
              "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                12,
                0.35,
                14,
                0.6,
                17,
                1.4,
              ],
            },
          },
          "lots-fill"
        );
        // Re-assert the persisted mode now that all layers exist.
        applyMode(map, modeRef.current);
      });

      applyMode(map, modeRef.current);
      setLoaded(true);

      /* ------------------------- interactions ------------------------ */

      const setHover = (lotId: string | null) => {
        if (hoveredRef.current === lotId) return;
        if (hoveredRef.current) {
          map.setFeatureState(
            { source: "lots", id: hoveredRef.current },
            { hover: false }
          );
        }
        if (lotId) {
          map.setFeatureState({ source: "lots", id: lotId }, { hover: true });
        }
        hoveredRef.current = lotId;
      };

      map.on("mousemove", "lots-fill", (e) => {
        const feature: MapGeoJSONFeature | undefined = e.features?.[0];
        if (!feature) return;
        const available = feature.properties.status === "available";
        map.getCanvas().style.cursor = available ? "pointer" : "default";
        setHover(available ? (feature.properties.lot_id as string) : null);
        // The hover tooltip is a preview — once the lot's full panel is
        // open, showing it again on top is just noise.
        const alreadyOpen =
          useSiteStore.getState().selectedLotId === feature.properties.lot_id;
        if (available && !alreadyOpen) {
          setTooltip({
            x: e.point.x,
            y: e.point.y,
            lotId: feature.properties.lot_id as string,
            areaM2: feature.properties.area_m2 as number,
            tier: feature.properties.tier as Tier,
            priceUsd: (feature.properties.price_usd ?? null) as number | null,
          });
        } else {
          setTooltip(null);
        }
      });

      map.on("mouseleave", "lots-fill", () => {
        map.getCanvas().style.cursor = "";
        setHover(null);
        setTooltip(null);
      });

      map.on("click", "lots-fill", (e) => {
        const feature = e.features?.[0];
        if (!feature || feature.properties.status !== "available") return;
        setTooltip(null);
        selectLot(feature.properties.lot_id as string);
      });

      // Clicking empty map clears the selection
      map.on("click", (e) => {
        const hits = map.queryRenderedFeatures(e.point, {
          layers: ["lots-fill"],
        });
        if (hits.length === 0) selectLot(null);
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------------------------------------------------------- */
  /* React to selection (map click, inventory card or filter change)    */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loaded) return;

    if (selectedRef.current) {
      map.setFeatureState(
        { source: "lots", id: selectedRef.current },
        { selected: false }
      );
    }
    if (selectedLotId) {
      map.setFeatureState(
        { source: "lots", id: selectedLotId },
        { selected: true }
      );
      const lot = getLot(selectedLotId);
      if (lot) {
        map.flyTo({
          center: lot.centroid,
          zoom: Math.max(map.getZoom(), 16),
          duration: 1400,
          essential: false,
        });
      }
    }
    selectedRef.current = selectedLotId;
  }, [selectedLotId, loaded]);

  /* Filters → map layer filter */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loaded) return;
    const expr = filterExpression(filters);
    for (const layer of ["lots-fill", "lots-outline", "lots-labels"]) {
      map.setFilter(layer, expr);
    }
  }, [filters, loaded]);

  return (
    <div
      role="region"
      className="relative h-full w-full"
      aria-label={t("ariaLabel")}
    >
      <div ref={containerRef} className="h-full w-full" />

      {/* Satellite / Minimal toggle */}
      <div
        role="group"
        aria-label={t("basemap.label")}
        className="absolute top-4 left-4 z-10 flex border border-gold/30 bg-ivory/90 shadow-lg backdrop-blur-sm"
      >
        {(["satellite", "minimal"] as const).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            aria-pressed={mode === m}
            className={`cursor-pointer px-3.5 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors ${
              mode === m
                ? "bg-gold text-ivory"
                : "text-ink-soft hover:text-gold-deep"
            }`}
          >
            {t(`basemap.${m}`)}
          </button>
        ))}
      </div>

      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-sand">
          <p className="font-display text-lg text-ink-soft italic">
            {t("loading")}
          </p>
        </div>
      )}

      {tooltip && (
        <div
          role="tooltip"
          className="pointer-events-none absolute z-10 min-w-[150px] -translate-x-1/2 -translate-y-[calc(100%+14px)] border border-gold/30 bg-night/90 px-3.5 py-2.5 shadow-xl backdrop-blur-sm"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <p className="text-[12px] font-medium tracking-[0.08em] text-ivory">
            {tooltip.lotId}
          </p>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-gold-soft">
            {tLots(`tier.${tooltip.tier}`)}
          </p>
          <p className="mt-1 text-[11px] text-ivory/75">
            {t("tooltip.area", { area: tooltip.areaM2.toLocaleString() })}
            {" · "}
            {tooltip.priceUsd != null
              ? formatUsd(tooltip.priceUsd, locale)
              : tLots("panel.priceOnRequest")}
          </p>
        </div>
      )}
    </div>
  );
}
