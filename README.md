# Lomas del Pacífico — Website

Luxury one-page site for the Lomas del Pacífico development (Elías Calles,
Baja California Sur): bilingual EN/ES, with an interactive map of the 42 lots
for sale, synced inventory listing, payment plans and a contact form.

Built with Next.js (App Router) + TypeScript + Tailwind CSS, next-intl,
MapLibre GL (free satellite imagery — no API key needed), Framer Motion,
Lenis, react-hook-form + zod, and zustand.

---

## Running the site locally

```bash
npm install
npm run dev        # → http://localhost:3000
```

Production build: `npm run build && npm start`. The site deploys to
[Vercel](https://vercel.com) with zero configuration — import the repository
and press Deploy.

---

## Everyday edits (no coding knowledge needed)

All day-to-day changes live in **two files**. After editing, redeploy
(automatic if the repo is connected to Vercel).

### 1. Set lot prices — [config/pricing.ts](config/pricing.ts)

- **Price per tier**: edit the numbers in `priceByTierUsd`. Every lot in
  that tier takes the price automatically. Use `null` to show
  "Price on request".
- **Price for one specific lot**: add a line to `lotOverrides`, e.g.

  ```ts
  "R22P121LS-12": { priceUsd: 210_000 },
  ```

- The MXN price is calculated automatically from `usdToMxn` in
  `config/site.ts`. To pin an exact MXN figure: `{ priceMxn: 3_900_000 }`.

### 2. Mark a lot as sold or reserved — same file

```ts
"R23P121LS-27": { status: "reserved" },
"R26P121LS-25": { status: "sold" },
```

Sold/reserved lots appear dimmed on the map, can't be selected, and show
their status in the listing. Delete the line to make a lot available again.

> ⚠️ The file currently contains a few **demo** overrides (one sold, one
> reserved, custom highway-lot prices). Remove them when entering real data.

### 3. Adjust the payment plans — same file

Edit `paymentPlans`: down-payment percentage, number of months, and the
cash discount / financing surcharge. Monthly installments are calculated
automatically from each lot's price.

### 4. Contact details, WhatsApp, exchange rate — [config/site.ts](config/site.ts)

Phone, email, WhatsApp number (digits only, starting with country code 52),
social links, the USD→MXN rate, and the production domain. Every placeholder
is marked with `TODO`.

---

## Swapping in real content

| What | How |
|---|---|
| **Photos (gallery)** | Drop images into `public/gallery/` and replace the gradient tiles in [src/components/sections/Gallery.tsx](src/components/sections/Gallery.tsx) with `<Image>` tags (instructions in a comment at the top of that file). |
| **Hero image/video** | Replace the gradient backdrop in [src/components/sections/Hero.tsx](src/components/sections/Hero.tsx) (marked with a comment). |
| **Master-plan PDF** | Put the file in `public/` (e.g. `public/master-plan.pdf`) and update `masterPlanPdf` in `config/site.ts`. |
| **Legal texts** | The footer's privacy/terms links are placeholders (`#`) — point them at real pages when the texts exist. |
| **Receiving leads by email** | The form currently logs to the server console. Follow the commented instructions in [src/app/api/contact/route.ts](src/app/api/contact/route.ts) (≈5 minutes with a free Resend account). The WhatsApp button works already. |

---

## Languages

- **English is the default** and lives at `/`; Spanish at `/es`.
- A visitor's choice (EN | ES toggle in the header) is remembered on the
  device and restored on return visits.
- **Every** visible text lives in [messages/en.json](messages/en.json) and
  [messages/es.json](messages/es.json) — edit copy there, never in components.
- To make Spanish the default instead: in
  [src/i18n/routing.ts](src/i18n/routing.ts) change `defaultLocale: "en"` to
  `"es"`.

---

## Adding more lots / more sellers later

The development has several ejido owners; the site is built to grow:

1. Export the new lots as GeoJSON with the same properties as the current
   file (see [data/README_DATOS.md](data/README_DATOS.md) for the schema).
2. Save it as `src/data/<name>.json`.
3. In [src/lib/lots.ts](src/lib/lots.ts), import it and append it to the
   `SOURCES` array.

The map, filters, listing and forms pick the new lots up automatically, and
their prices are managed through `config/pricing.ts` like all the others.

The original data files stay untouched in `data/` — the site never requires
editing GeoJSON by hand.

---

## Project layout (for developers)

```
config/           ← everything the owner edits (prices, contacts, plans)
messages/         ← all copy, EN + ES
data/             ← original GeoJSON from the surveyor (reference)
src/data/         ← the GeoJSON actually imported by the app
src/lib/lots.ts   ← single typed data module (config merged onto GeoJSON)
src/lib/store.ts  ← shared state: selection, filters, modal, form prefill
src/components/
  map/            ← MapLibre map, lot panel/bottom-sheet, legend, filters
  sections/       ← Hero, Location, Development, Inventory, Plans, …
  plans/          ← payment-plan cards + modal
public/data/      ← 1.1 MB master-plan context layer (lazy-loaded)
```

Notes: the map has two views — **Satellite** (Esri World Imagery, free,
attribution included; default) and **Minimal**, which renders the master
plan as a sepia architectural site plan on ivory. The visitor's choice is
remembered on the device. The 42-lot GeoJSON is bundled at build time; the
3,988-lot master-plan layer is fetched asynchronously in parallel with map
start-up. All animations respect `prefers-reduced-motion`.
