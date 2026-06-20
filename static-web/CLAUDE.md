# STATIC — Codebase Guide

**STATIC is a separate brand & codebase from SOAR.** Do not merge assets, copy,
or commerce config between them.

**Concept:** "Everything is noise until you cut through it." Immediate, precise,
architectural — Supreme drop energy + Balenciaga editorial scale + Represent
product discipline. Pure black/white; an **RGB channel-split glitch is the only
colour**, used as an accent (logo reveal / hover / transition) — never the
resting state. **"Flush" = a strict baseline grid:** consistent margins, vertical
rhythm, consistent aspect ratios, zero overlap. Drama from contrast/scale.

## Stack
- Next.js 14 (App Router) + TypeScript + Tailwind.
- Shopify **Storefront API** (commerce engine only) — `src/lib/shopify.ts`,
  env-gated (`NEXT_PUBLIC_SHOPIFY_DOMAIN` / `_STOREFRONT_TOKEN`); falls back to
  mock data (`src/lib/products.ts`). No STATIC store yet → runs on mock.
- React Three Fiber + drei (3D viewer), GSAP (timing), Framer Motion (UI).

## Map
- `src/app/layout.tsx` — fonts: Anton (display) / Archivo (body) / Space Mono (labels).
- `src/app/globals.css` — tokens + `.frame`/`.col12` grid + `.glitch` (RGB split) + `.scan`.
- `src/app/page.tsx` — GlitchHero → DropStrip → ProductViewer → EditorialGrid → CommunityBand → Footer.
- `src/app/product/[handle]/page.tsx` — PDP (mock).
- `src/components/hero/glitch-hero.tsx` — oversized STATIC wordmark, sub-2s glitch reveal → sharp lockup.
- `src/components/product-viewer/{product-viewer,viewer-scene}.tsx` — R3F canvas (ssr:false),
  OrbitControls drag-to-rotate, placeholder faceted mesh (drop in real GLB next), hotspots.
- `src/components/sections/*` — `drop-strip`, `editorial-grid` (the flush grid), `community-band`.
- `src/components/site-{header,footer}.tsx`.

## Conventions
- Classes: `.frame` (max-width + gutter), `.over` (oversized display), `.mono` (labels),
  `.glitch` with `data-text` (accent only). Monochrome only; glitch `#00f0ff` / `#ff006a` are accents.
- Mobile-first; verify grid discipline at **375px** and **1440px**.

## Next steps
Real garment GLB into the viewer · real Shopify store+token · PDP variant →
`createCheckout` handoff · Framer cart drawer · real editorial photography.

## Run
`cd static-web && npm install && npm run dev`
