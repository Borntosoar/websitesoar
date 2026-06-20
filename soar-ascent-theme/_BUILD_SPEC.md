# SOAR — "ASCENT" Shopify theme — BUILD CONTRACT (read fully; build to this exactly)

A from-scratch premium Online Store 2.0 theme. Concept: **THE ASCENT** — the store
is one rise up the road into the stars (the SOAR logo, lived). Monochrome, quiet
luxury (Fear of God / Represent feel), cinematic, original SOAR only — never copy
another brand's visuals. The result must be a VALID theme that uploads as a zip.

## Tech rules (non-negotiable)
- **Online Store 2.0**: JSON templates (`templates/*.json`) that reference sections;
  every section has a `{% schema %}` with settings/blocks + a `presets` entry so it
  works in the theme editor.
- `layout/theme.liquid` MUST include `{{ content_for_header }}` in `<head>` and
  `{{ content_for_layout }}` in `<body>`.
- Pull real data via Liquid: `collections`, `product`, `cart`, `all_products`,
  `shop`, `routes`, `settings`, `section.settings`, `block.settings`.
- Money: `{{ price | money }}`. Images: `{{ img | image_url: width: 1200 | image_tag: loading: 'lazy', sizes: '...' }}`. URLs: `{{ product.url }}`, `routes.cart_url`, `routes.root_url`.
- No nested product loops; use `{% liquid %}` for multiline; guard with `{% if x != blank %}`.
- Accessibility: semantic HTML, alt text, `aria-label` on icon buttons, focus-visible.
- Performance: `loading="lazy"` below the fold; minimal JS; the only JS files are
  `assets/soar.js` (+ optional `assets/soar-entrance.js`).

## Brand + design tokens (define once in soar.css `:root`, use EVERYWHERE)
```
--bg:#000; --fg:#fff; --paper:#f4f4f5; --ink:#0a0a0b;
--g-1:#e6e6e8; --g-2:#bcbcc0; --g-3:#8a8a8f; --g-4:#3a3a3e; --line:rgba(255,255,255,.12); --line-dark:rgba(0,0,0,.12);
--sans:"Hanken Grotesk",system-ui,sans-serif; --serif:"Newsreader",Georgia,serif;
--ease:cubic-bezier(.22,1,.36,1); --wrap:1280px;
```
Fonts via Google Fonts `<link>` in theme.liquid: Hanken Grotesk (300–700) + Newsreader italic. Monochrome ONLY — black/white/grey. No colour. Serif italic is the ONE accent (a single word), used sparingly.

## SHARED CSS CLASS CONTRACT (all agents use these EXACT names; agent 1 defines them in soar.css)
- Layout: `.soar` (root), `.wrap` (max-width var(--wrap), inline padding 24px / 48px md), `.section` (py 96px / 144px md).
- Type: `.eyebrow` (11px uppercase, letter-spacing .34em, grey), `.display` (clamp(3rem,11vw,8rem) 600 leading .85), `.h2` (clamp(2.4rem,7vw,6rem) 600 leading .9 tracking -.01em), `.lede` (15–16px, grey, max-width 32rem), `.accent` (font-serif italic).
- Controls: `.btn` (solid: white bg / black text, px 32 py 14, 12px uppercase tracking .15em, `:active{transform:scale(.98)}`), `.btn-ghost` (1px border, transparent), `.link` (quiet underline-offset).
- Marks: `.hair` (1px line var(--line)), `.idx` (tabular-nums small index e.g. "01 / 04"), `.tnum{font-variant-numeric:tabular-nums}`.
- Utility: `.stars` (the persistent starfield background layer), `.reveal` (fade/rise in-view via IntersectionObserver in soar.js, `prefers-reduced-motion` safe).
- Mobile-first; tap targets ≥44px; inputs render ≥16px on mobile.

## THE ENTRANCE (keep entrance + password) — snippets/entrance.liquid + soar.js
- A full-screen fixed overlay (`#soar-entrance`) shown on first visit (gate via `sessionStorage 'soar-gate'`). Skippable.
- Stages: gateway (BORN TO SOAR + "The road ahead isn't for everyone." + "This is where limits end. This is where potential begins." + **BEGIN ASCENT** button + a quiet "Enter password" toggle) → on begin/submit, a cinematic rise → lifts away to reveal the store.
- Visual: a monochrome **road-to-stars** — a CSS/Canvas starfield + a perspective road that climbs (no heavy 3D required for v1; make it premium with CSS perspective + a `<canvas>` starfield in soar-entrance.js). Stars brighten on ascent. The SOAR logo (`{{ 'soar-logo-white.png' | asset_url }}` — agent 1 adds the asset, see below) resolves at the summit.
- Password: a single shared access password input ("soar") OR an email capture (10% / early access) — store `localStorage 'soar-gate-passed'`. Don't block forever; always offer Skip.
- Respect `prefers-reduced-motion`: static premium fallback, no flythrough, copy + CTA intact.

## HEADER / FOOTER conventions (sections/header.liquid + footer.liquid)
- Header: fixed, transparent over hero → solid (`.is-stuck`) on scroll (soar.js). Centered logo (fashion convention), left nav (linklists `section.settings.menu` → `linklists[handle]`), right: search, account (`routes.account_url`), cart (`#soar-cart-count`, opens cart drawer). Mobile: hamburger → full-screen menu.
- Footer: architectural, monochrome — big wordmark, link columns (menu blocks), email capture, social, legal, © year. Safe-area bottom padding.

## CART: a slide-in drawer (snippets/cart-drawer.liquid + soar.js using /cart/add.js, /cart/change.js, /cart.js). Free-ship bar, trust row (Secure · Free shipping over threshold · returns), Shop Pay note (native checkout). Checkout button → `{{ routes.cart_url }}` form submit / `/checkout`.

## FILE MANIFEST (agent ownership — NO overlaps)
**Agent 1 — Foundation & look:** `layout/theme.liquid`, `assets/soar.css` (the FULL design system implementing every class above + header/footer/cart/entrance/product/collection styles), `assets/soar.js` (sticky header, reveals, cart drawer AJAX, entrance controller), `assets/soar-entrance.js` (canvas starfield+road), `snippets/icon.liquid`, `snippets/entrance.liquid`, `snippets/cart-drawer.liquid`, `snippets/product-card.liquid`, `sections/header.liquid`, `sections/footer.liquid`, `config/settings_schema.json`, `config/settings_data.json`, `locales/en.default.json`. (Also drop a placeholder note that `assets/soar-logo-white.png` + `assets/soar-logo.png` must be added — the human will add real logo assets; reference them but the theme must not break if missing: guard with the shop name as text fallback.)
**Agent 2 — Homepage:** `templates/index.json` + sections: `soar-hero.liquid` (the landing after entrance — the climb continues, big statement, single CTA), `soar-marquee.liquid` (announcement ticker), `soar-featured.liquid` (asymmetric DROP feature: campaign side + name/scarcity/CTA), `soar-collection.liquid` (editorial featured-first product grid using `product-card` snippet + a section `collection` setting), `soar-manifesto.liquid` (full-width typographic break), `soar-capture.liquid` (countdown + email capture band), `soar-editorial.liquid` (image+text story). Each: real Liquid data, `{% schema %}` + preset, the shared classes, monochrome.
**Agent 3 — Commerce + required templates (valid theme):** premium `templates/product.json` + `sections/main-product.liquid` (gallery, title, price, variant/size selector, sticky add-to-cart on mobile, accordion details, trust row), `templates/collection.json` + `sections/main-collection.liquid` (filter/sort + grid via product-card), `templates/cart.json` + `sections/main-cart.liquid`. PLUS every REQUIRED template so the zip is valid (minimal but on-brand, each using theme.liquid's shell): `templates/404.json`(+section), `page.json`(+`main-page`), `blog.json`(+`main-blog`), `article.json`(+`main-article`), `search.json`(+`main-search`), `list-collections.json`(+`main-list-collections`), `password.json`(or `layout/password.liquid`), `gift_card.liquid`, and `customers/` templates: `account, activate_account, addresses, login, order, register, reset_password` (each a simple liquid template with the right Shopify `{% form %}` tags).

## Validity checklist (the zip MUST contain, or upload fails)
layout/theme.liquid · config/settings_schema.json · config/settings_data.json · locales/en.default.json · templates for: index, product, collection, list-collections, page, blog, article, search, cart, 404, gift_card, password, customers/(account, activate_account, addresses, login, order, register, reset_password). All referenced sections/snippets exist. Valid JSON in every `.json`. Valid `{% schema %}` JSON in every section.

## Verification (every agent)
Build only your files. Keep it VALID Liquid + valid JSON. Monochrome, original SOAR, mobile-first, accessible. Report the files you created.
