# STATIC

Headless 3D flagship commerce — **Next.js (App Router)** + **Shopify Storefront API**
(commerce engine, mock-gated) + **React Three Fiber** + **GSAP / Framer Motion**.

> A separate brand & codebase from SOAR. *"Everything is noise until you cut through it."*

```bash
cd static-web
npm install
npm run dev      # http://localhost:3000
```

Copy `.env.example` → `.env.local` and add a STATIC Shopify domain + Storefront
token to switch from mock data to live commerce. Architecture: see `CLAUDE.md`.
