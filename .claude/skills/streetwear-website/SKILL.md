---
name: streetwear-website
description: >-
  Build, design, plan, or audit a streetwear / hype / fashion DTC e-commerce
  website or brand "drop" site. Use for: streetwear brand websites, clothing
  & apparel stores, hypebeast/sneaker drops, limited-release launches, lookbook
  & editorial commerce, Shopify storefronts. Encodes the recurring website,
  UX and conversion patterns of the most profitable streetwear brands (Supreme,
  Stüssy, Kith, BAPE, Off-White, plus Palace, Aimé Leon Dore, Fear of God /
  Essentials, Corteiz). Topics: drop mechanics, release calendars, countdown
  timers, raffles, virtual waiting rooms, scarcity & FOMO, sold-out states,
  email/SMS capture (Klaviyo/Attentive), product detail pages, editorial
  lookbooks, homepage blueprint, minimalist vs graphic design systems,
  mobile-first checkout, Shopify tech stack, performance, conversion.
---

# Streetwear Website — Build Playbook

How the most profitable streetwear brands turn a website into a hype engine —
distilled into a reusable system for designing and building a new streetwear
brand site that converts.

> **Methodology & honesty note.** Brand rankings below blend public revenue,
> valuation/acquisition data, and market dominance. Several streetwear brands
> are private; their figures are **estimates** and flagged as such. Patterns are
> synthesized from each brand's live storefront plus third-party teardowns.
> Full citations live in `references/brand-teardowns.md`.

## When to use this skill

- Designing or building a **streetwear / fashion / apparel** brand website
- Planning a **product drop / limited release / launch** experience
- Adding **scarcity, FOMO, countdowns, raffles, or waiting rooms** to a store
- Designing **product pages, lookbooks, or editorial** content for apparel
- Choosing a **tech stack** for a DTC fashion store (Shopify et al.)
- Auditing why a streetwear store **isn't converting or feeling premium**

Pair with the **`ui-ux-pro-max`** skill for the underlying visual system
(styles, palettes, typography) and accessibility/UX rules.

---

## The Top 5 (most commercially dominant) + the next wave

| # | Brand | Est. scale | Owner / signal | Signature website move |
|---|-------|-----------|----------------|------------------------|
| 1 | **Supreme** | ~$538M rev (FY3/2024) | Sold to EssilorLuxottica **$1.5B** 2024 (was $2.1B VF, 2020) | Weekly **Thursday 11am ET** drop; brutally minimal grid; sells out in **19–173s** |
| 2 | **Stüssy** | ~$155M rev (2025 est.) | Private, family-owned | OG restraint; rolling limited drops; never "sells out" the brand |
| 3 | **Kith** | ~$135M rev (2025 est.) | Ronnie Fieg | **Shopify Plus** editorial empire; lookbooks + loyalty + retail theater |
| 4 | **BAPE** | est. (private) | I.T Group (Hong Kong) | Dense **graphic merchandising**; camo/ape-head as system; regional sites |
| 5 | **Off-White** | est. (private) | **LVMH** majority (2021) | Luxury-street; industrial motifs (quotes, caution tape); collab-led |
| + | **Palace** | est. (private) | Independent (London) | Supreme-style **weekly Friday drop**; irreverent, web-native |
| + | **Aimé Leon Dore** | est. (private) | Teddy Santis | Cinematic **editorial lookbooks**; "quiet luxury" street |
| + | **Fear of God / Essentials** | est. (private) | Jerry Lorenzo | Minimal neutral system; Essentials = high-volume diffusion |
| + | **Corteiz (Crtz)** | est. (private) | Clint419 (London) | **Guerrilla** drops, password gates, deliberate friction = exclusivity |

*Figures for private brands are estimates — see `references/brand-teardowns.md` for sources and per-brand teardowns.*

**Two takeaways from the ranking:**
1. The money is in the **release model**, not the storefront chrome. Supreme's
   site is intentionally plain — the *drop* is the product.
2. There are **two winning aesthetics** (see Design Systems below): radical
   minimalism (Supreme, Stüssy, Essentials, Palace) or a **signature graphic
   system** (BAPE, Off-White). Pick one pole and commit — never blend timidly.

---

## The 9 transferable factors (the heart of the playbook)

### F1 — Drop-driven architecture
The site is organized around **scheduled scarcity**, not an always-on catalog.
- A predictable cadence (Supreme = Thu 11:00 ET; Palace = Fri) the audience
  internalizes. Surface a **"New / This Week"** as the primary destination.
- A **drop calendar** + **countdown timer** to the next release.
- Each drop is a finite event: limited units, then **sold out** (don't hide it —
  the sold-out wall is social proof).

### F2 — Commit to one aesthetic pole
- **Minimalist** (Supreme/Stüssy/Essentials): white or single-color ground,
  tiny nav, product on plain background, near-zero marketing copy. The clothes
  and the scarcity do the talking.
- **Signature graphic system** (BAPE/Off-White): a proprietary motif (camo,
  ape head, quotation marks, caution tape, helvetica-caps) applied relentlessly
  as brand furniture. Consistency = the luxury signal.

### F3 — Editorial storytelling as commerce
Kith and Aimé Leon Dore prove **content sells the lifestyle**.
- **Lookbooks** per drop (cinematic, on-location, on-model + flatlay).
- "Stories"/journal, brand films, founder POV, monthly "chapters."
- Shoppable editorials: imagery links straight to product.

### F4 — Scarcity & FOMO, made explicit
- "**Only 200 made**", "**Only 5 left**", low-stock counters, one-per-customer.
- Honest **sold-out** badges + **back-in-stock** waitlists.
- **Numbered / limited** runs; show edition size.

### F5 — Frictionless, fast, mobile-first checkout
- Most traffic and most drops are **mobile**. Sub-second, thumb-reachable.
- **Express checkout** (Shop Pay / Apple Pay / Google Pay); minimal form fields.
- The drop dies on latency — pre-warm, cache, throttle gracefully (see F? / tech).

### F6 — Owned audience: email + SMS
- Capture before the drop; **Klaviyo** (email) + **Attentive** (SMS) are standard.
- Flows: drop reminders, "**back in stock**", abandoned cart, post-purchase,
  early-access for members. SMS back-in-stock converts waitlists into instant
  revenue at drop time.

### F7 — Community as the top of funnel
- Instagram/TikTok teasers, **Discord**, raffles, and IRL stunts drive traffic
  to a known drop time. The website is the **conversion endpoint** of a hype
  cycle that lives on social.

### F8 — Product page conventions
- **Big imagery first**, terse copy, fabric/origin one-liner, size selector,
  **availability state**, one decisive **Add to Cart**. No essay, no clutter.
- Tabular price, related/"complete the look", recently dropped.

### F9 — Performance, accessibility, trust
- Reserve image space (no layout shift), lazy-load below the fold, WebP/AVIF.
- Keyboard + screen-reader support, 4.5:1 contrast, visible focus.
- Trust: sizing, shipping/returns clarity, authenticity (anti-resale messaging).

---

## Homepage blueprint (section-by-section)

1. **Announcement / ticker** — drop date, free-shipping, "Vol.0X" (kinetic marquee).
2. **Hero** — one bold brand statement + the *next drop* hook + a single CTA
   ("Shop the drop" / countdown). One idea, oversized.
3. **The drop / "This week"** — the current release as a tight product grid
   (the most important module — put it high).
4. **Lookbook / editorial** — cinematic imagery telling the season's story.
5. **Categories / shop** — minimal, scannable (Hoodies, Tees, Outerwear…).
6. **Brand / manifesto** — short, confident POV (why the brand exists).
7. **Community / UGC / collabs** — social proof, the next collab teaser.
8. **Email/SMS capture** — "Get on the list" for drop access.
9. **Footer** — utility, legal, stockists, social, big logo.

See `references/build-playbook.md` for the full module spec, drop-release
decision guide, and the recommended tech stack.

---

## Drop release models — pick by goal

| Model | Mechanic | Best for | Tooling |
|-------|----------|----------|---------|
| **Scheduled drop** | Fixed day/time, limited stock, live then sold out | Building ritual & habit (Supreme) | Shopify + scheduled publish + countdown |
| **Raffle / draw** | Register for a chance; random winners; fairness | Hyped, bot-prone, 1:N demand | Raffle app / form + Klaviyo |
| **Waiting room / queue** | Virtual line throttles drop-spike traffic | Huge simultaneous demand | Queue-it / native checkout throttle |
| **Password / coming-soon** | Gated launch page; access = exclusivity | Mystery, members-only, Corteiz-style | Shopify password page / lock |
| **Always-on + restocks** | Catalog with back-in-stock waitlists | Steady DTC revenue (Stüssy-ish) | Klaviyo back-in-stock + low-stock cues |

---

## Design systems — two proven poles

Use the `ui-ux-pro-max` skill to generate exact tokens, but anchor on one pole:

**Pole A — Brutalist Minimalism / Kinetic Brutalism**
- Mono/near-mono palette + **one** accent; oversized grotesque display
  (Anton/Archivo/Space Grotesk), mono labels; **0px radius, 2px borders, no
  shadows**; kinetic marquees; flat product-on-ground photography.

**Pole B — Signature Graphic / Industrial**
- A relentless proprietary motif (camo, quotation marks, hazard tape, numbering)
  + bold sans; dense graphic merchandising; collab logos as homepage centerpiece.

Both: SVG icons (never emoji), tabular numerals for prices, big tap targets,
generous negative space, and a single decisive CTA per screen.

---

## Pre-launch checklist

- [ ] One clear **aesthetic pole**, applied consistently across every page
- [ ] **Drop cadence** decided + surfaced (calendar + countdown to next)
- [ ] Current drop is the **highest module** on the homepage
- [ ] **Scarcity states** wired: limited qty, low-stock, sold-out, back-in-stock
- [ ] **Email + SMS** capture live with drop-reminder & back-in-stock flows
- [ ] **Mobile checkout** is express, sub-second, thumb-reachable
- [ ] **Lookbook/editorial** for the launch season
- [ ] Performance: no layout shift, lazy media, WebP/AVIF, fast TTFB
- [ ] Accessibility: contrast, focus, keyboard, alt text, reduced-motion
- [ ] Trust: sizing, shipping/returns, support reachable

## Anti-patterns (what kills the hype)

- A bloated mega-catalog with no drop ritual or scarcity.
- Timid, blended aesthetic (half-minimal, half-graphic) — reads generic.
- Marketing copy bloat on product pages; weak, multi-CTA hero.
- Hiding sold-out (it's social proof) or faking scarcity (erodes trust).
- Slow, multi-step checkout; desktop-first thinking.
- Stock photography / emoji icons / inconsistent type — instantly "cheap."

---

## References (read for depth)

- `references/brand-teardowns.md` — per-brand analysis (Supreme, Stüssy, Kith,
  BAPE, Off-White, Palace, ALD, Essentials, Corteiz) with figures + **sources**.
- `references/build-playbook.md` — full homepage module spec, drop-release
  implementation details, the **tech stack** (Shopify Plus + apps), conversion
  flows, and a copy/voice guide.

---

## Applying this to SOAR (read the `soar-brand` skill first)

When the brand is **SOAR**, every pattern here is filtered through the
`soar-brand` bible and gated by its **Brand Test**. SOAR is quiet-luxury
(*Fear of God / Essentials × Represent*), **not** loud-graphic or brutalist —
*luxury through meaning, never logos.*

- **Aesthetic pole:** the **minimalist** pole, executed in **muted neutrals**
  (oat / stone / taupe / **espresso**), **no bright colour**, Hanken Grotesk +
  Newsreader serif accents, architectural whitespace, slow/quiet motion.
- **Hero = the breakthrough symbol**, not a product grid or marquee: a **bird
  escaping a fractured box**, light emerging from darkness ("breakthrough, not
  flight"). The symbol carries the brand before any copy does.
- **Drop culture = a ritual of transformation.** Map the mechanics to the
  emotional sequence *Pressure → Resistance → Breakthrough → Growth → Freedom*:
  the **countdown** is the held breath before release; **"Limited 200 / numbered"**
  are individual ascents; an honest **sold-out** wall is the box others stayed
  inside.
- **Storytelling:** lead with meaning and symbol; copy is **quietly confident,
  overcoming-not-perfect**, feel-before-read. Avoid hype, exclamation, trend slang.
- **Capture:** frame the list as **"join the ascent / the movement,"** not
  "subscribe." Klaviyo/SMS for drop access + back-in-stock.
- **Before shipping:** run the SOAR **Brand Test** (growth? freedom? overcoming?
  resilience? possibility? on-philosophy?). If any answer is no, change it.
