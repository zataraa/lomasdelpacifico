# Datos del proyecto — Lomas del Pacífico

Estos archivos ya están limpios y listos para usar en el sitio web. Fueron generados a partir de los KMZ originales del cliente (el cruce de nombres↔polígonos ya está hecho).

## 1. `lotes_en_venta.geojson`  ← EL IMPORTANTE
GeoJSON con los **42 lotes en venta** de la ejidataria María Susana Avilés Valle.
Son los polígonos **clickeables** del mapa. ~183 KB.

Cada `Feature` tiene estas `properties`:

| Campo | Tipo | Descripción |
|---|---|---|
| `lot_id` | string | Clave del lote, ej. `"R22P121LS-12"`. Úsala como ID único. |
| `poligono` | string | `"120"`, `"121"`, `"CARR"` (frente a carretera) o `"AJUSTE"`. |
| `area_m2` | number | Superficie en m². Casi todos 1501; los CARR son 1751; el ajuste 901. |
| `centroid` | [lon, lat] | Centro del lote, útil para etiquetas y `flyTo`. |
| `beach_proximity_rank` | number | 1 = el más cercano al Pacífico (oeste). Hasta 42. |
| `tier` | string | `"beachfront_premium"`, `"mid"`, `"inland"`. **Tentativo** — confirmar con el cliente. |
| `status` | string | `"available"` por defecto. Otros futuros: `"reserved"`, `"sold"`. |
| `price_usd` | null | **PENDIENTE**: lo llena el cliente. |
| `price_mxn` | null | **PENDIENTE**: lo llena el cliente. |
| `payment_plan_url` | null | **PENDIENTE**: link o ancla a la sección de planes de pago. |

> El `tier` se calculó por longitud (oeste = más cerca de la playa). Es un default
> para que el mapa funcione hoy. Reemplázalo cuando el cliente dé precios reales.

## 2. `project_boundary.geojson`
Contorno simplificado de TODO el desarrollo (~8 KB). Úsalo como línea/sombra de
fondo elegante para enmarcar el mapa.

## 3. `all_lots_context.geojson`
Los 3,988 lotes del plano completo, simplificados (~1.1 MB). Es **contexto visual**
(no clickeable, gris tenue) para que se vea la magnitud del proyecto detrás de los 42
lotes en venta. Cárgalo de forma diferida (lazy) o solo al acercar el zoom, para no
penalizar el tiempo de carga inicial.

## Notas geográficas
- Centro aprox. del mapa: lon -110.139, lat 23.238 (Elías Calles, BCS).
- El océano Pacífico está al **oeste**; los lotes `CARR` (frente a carretera Federal 19)
  son los más al oeste y los de mayor superficie.
- Bounding box de los 42 lotes: lon -110.1507..-110.1277 / lat 23.2316..23.2447.
