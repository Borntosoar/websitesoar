# SOAR — headless flagship

> Growth begins where comfort ends.

The SOAR storefront: Next.js 16 (App Router, Turbopack) · React 19 · Tailwind v4 ·
React Three Fiber v9 · GSAP · Framer Motion. A GLSL glitch hero, a 3D garment
viewer, a cinematic entrance flythrough, Shopify-backed commerce, and a
pre-launch access gate.

This is a **separate codebase** from `soar-web/` (the static-export SOAR site on
GitHub Pages) and from `static-web/` (the STATIC brand). It is the live
headless flagship and is meant for a Node host.

## Local development

```bash
cd soar
npm install
npm run dev      # http://localhost:3000
npm run lint     # tsc --noEmit (type-check)
npm run build    # production build
```

The site runs with **zero configuration** — without Shopify env vars it renders
placeholder products via the `isShopifyConfigured` fallback and never crashes.

## Environment variables

Set these in your host (Vercel → Project → Settings → Environment Variables).
Nothing here is committed to the repo.

| Variable | Purpose | Unset behaviour |
| --- | --- | --- |
| `SHOPIFY_STORE_DOMAIN` | `your-store.myshopify.com` | Placeholder products; "Add to bag" disabled |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Storefront API token (server-side) | — as above — |
| `SOAR_ACCESS_PASSWORD` | Pre-launch shared password | Gate is **open** (site public) |

The Storefront token is read **server-side only** (Server Actions + `lib/shopify.ts`)
so it never reaches the browser. The access password is validated server-side and
only a SHA-256 token is stored in an httpOnly cookie — the raw password is never
sent to the client.

## Deploy

This app uses middleware (`proxy.ts`) and Server Actions, so it **cannot**
static-export to GitHub Pages. Deploy it to a Node host. Two supported paths —
pick one:

### A. Vercel Git integration (recommended)

1. Import the repo in Vercel.
2. **Set Root Directory = `soar`.** Vercel auto-detects Next.js.
3. Add the env vars above.
4. Push → Vercel builds and deploys (preview per PR, production on your main branch).

No secrets in the repo, no workflow to maintain.

### B. GitHub Actions → Vercel CLI

Use `.github/workflows/soar-deploy.yml` (already in the repo). It stays dormant
until you add three repo secrets:

- `VERCEL_TOKEN` — a Vercel access token
- `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` — from `.vercel/project.json` after
  running `vercel link` inside `soar/` once locally

Then pushes to `soar/**` deploy to production. Don't combine this with path A on
the same Vercel project.

## CI

`.github/workflows/soar-ci.yml` runs `npm run lint` + `npm run build` on every
push/PR that touches `soar/**`. No secrets required.
