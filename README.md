# SOAR

Premium black-&-white streetwear brand site — *Born To Soar*. Cinematic 3D studio
entrance (a bird breaks out of a box and soars), a Represent-style home, product
modules with a quick-view PDP and cart, a 10%-off account gate, legal pages, and
a digital drop clock.

> **The website is a Next.js app — you can't view it by double-clicking a file.**
> Run it locally, or open the live link below.

## Run it locally
```bash
cd soar-web
npm install
npm run dev
```
Open **http://localhost:3000** → at the gate click **“Have a password? Enter”** →
type **`soar`** → watch the bird soar, then the home opens.

## See it live (no setup)
Once GitHub Pages is enabled (Settings → Pages → Deploy from a branch → `gh-pages`
→ /root), the site is live at:
**https://borntosoar.github.io/websitesoar/**

Or deploy to **Vercel**: import the repo and set **Root Directory = `soar-web`**.

## What's in here
| Path | What it is |
|------|------------|
| `soar-web/` | **The website** — Next.js 14 + React Three Fiber + Framer Motion + Tailwind |
| `soar-theme/` | Shopify (Liquid) storefront theme |
| `.claude/skills/` | SOAR brand bible + website skills |
| `PHOTOS.md` | How to drop in real/AI product photos |
| `DEPLOY.md` | Deploy walkthrough |

## Add real product photos
See `PHOTOS.md` — drop images into `soar-web/public/products/<id>.jpg` and set the
`image` field in `soar-web/src/lib/products.ts`. Until then, original vector studio
renders stand in.

Entrance password: `soar`.
