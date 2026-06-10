# soar-web

A Next.js (App Router) + TypeScript + Tailwind + **shadcn-structured** app — the
React home for SOAR components. Created to integrate a 3D hero, **adapted to the
SOAR brand** (see the `soar-brand` skill).

## Run it

```bash
cd soar-web
npm install      # network access required for npm registry
npm run dev      # http://localhost:3000
```

> This was scaffolded by hand (file-by-file) because the host sandbox blocks
> outbound installs. Running `npm install` locally pulls every dependency in
> `package.json`. Alternatively reproduce the structure with:
> `npx create-next-app@latest soar-web --typescript --tailwind --app --src-dir`
> then `npx shadcn@latest init`.

## Structure (shadcn defaults)

```
soar-web/
├─ components.json          # shadcn config → ui alias = @/components/ui
├─ tailwind.config.ts       # SOAR muted-neutral tokens
├─ src/
│  ├─ app/
│  │  ├─ globals.css        # Tailwind + brand tokens + hero keyframes
│  │  ├─ layout.tsx         # Hanken Grotesk + Newsreader fonts, espresso bg
│  │  └─ page.tsx           # renders the hero (ssr:false)
│  ├─ components/ui/
│  │  └─ hero-breakthrough.tsx   # the adapted, on-brand 3D hero
│  └─ lib/utils.ts          # cn() helper
```

`@/components/ui` is the canonical shadcn primitives folder — every shadcn
component (and `npx shadcn@latest add …`) expects it via the `ui` alias in
`components.json`. New shadcn primitives land there; compose pages from them.

## What changed vs the source component

The reference was a neon WebGPU "Build Your Dreams" cyberpunk hero. Reworked to
pass the SOAR **Brand Test**:

| Source | SOAR adaptation |
|--------|-----------------|
| WebGPU (`three/webgpu` + TSL) | Standard **WebGL** (`three` + R3F) — runs everywhere |
| Neon red scan-line + heavy bloom | **Fractured box → ascending mark → warm light** (light from darkness) |
| Bright/cyberpunk colour | **Muted espresso + bone**, no excessive colour |
| "Build Your Dreams / AI-powered…" | "Growth begins where comfort **ends.**" |
| postimg depth-map textures | No external assets required |

## Notes
- Add real shadcn primitives anytime: `npx shadcn@latest add button` → lands in
  `src/components/ui/`.
- For product imagery use `next/image` with Unsplash (`images.unsplash.com` is
  already allow-listed in `next.config.mjs`).
- Deps: `three`, `@react-three/fiber`, `@react-three/drei` (+ Next/Tailwind/TS).
