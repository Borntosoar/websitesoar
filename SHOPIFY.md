# Headless Shopify setup (the React site + Shopify commerce)

The `soar-web/` site keeps its exact React/3D design and uses **Shopify** for real
products and checkout via the **Storefront API**. Store: **`n06e1d-pn.myshopify.com`** (SOAR, CAD).

When the two env vars below are set, the cart's **Secure checkout** maps each bag
item to its Shopify variant and sends the customer to Shopify's real, hosted
checkout. Without them, the site still runs and shows a placeholder checkout.

## 1. Get a Storefront API token (one of these)

**Easiest — Headless channel:** Shopify admin → **Settings → Apps and sales
channels → Shopify (Headless)** (install the *Headless* channel if needed) →
create a storefront → copy the **Storefront API access token** (public). It also
auto-publishes your products to the storefront.

**Or — custom app:** Settings → Apps → **Develop apps → Create an app** → enable
**Storefront API** scopes (`unauthenticated_read_product_listings`,
`unauthenticated_write_checkouts`/`unauthenticated_read_checkouts`) → install →
copy the **Storefront API access token**.

## 2. Set the env vars

`soar-web/.env.local` (local) and in Vercel (Project → Settings → Environment Variables):

```
NEXT_PUBLIC_SHOPIFY_DOMAIN=n06e1d-pn.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=<your public storefront token>
```

## 3. Products

The 8 SOAR pieces use handles that match `soar-web/src/lib/products.ts`
(`ascension-hoodie`, `escape-tee`, `flight-sweatpants`, `rise-bomber`,
`free-bird-cap`, `limitless-crewneck`, `ascend-shorts`, `horizon-tee`), each with a
**Size** option. The cart matches `handle` + `size` → Shopify variant at checkout.
Make sure these products exist and are **published** to your storefront/Online Store.

## 4. Deploy on Vercel

Import `Borntosoar/websitesoar` → **Root Directory = `soar-web`** → add the two env
vars above → Deploy. The cinematic React/3D site is your storefront; Shopify powers
checkout.

> The token is a **public** Storefront token (read products + create checkouts) — safe
> in client code. It is referenced via env vars and never committed to git.
