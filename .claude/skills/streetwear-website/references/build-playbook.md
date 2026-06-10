# Build playbook — modules, drop mechanics, tech stack, conversion

Implementation-level companion to `SKILL.md`. Use after you've chosen an
**aesthetic pole** and a **drop model**.

---

## 1. Homepage module spec

| # | Module | Must include | Notes |
|---|--------|--------------|-------|
| 1 | Announcement bar | Next drop date / shipping promise | Kinetic marquee; dismissible |
| 2 | Hero | One statement, one CTA, next-drop hook | Oversized; ≤1 idea; countdown optional |
| 3 | **The Drop** | Current release grid + "sold out" states | Highest-value module — keep it near top |
| 4 | Lookbook | Cinematic editorial, shoppable | Tells the season's story |
| 5 | Shop categories | 4–8 clear entries | Scannable, image-led |
| 6 | Manifesto | 1–2 sentences of POV | Confident, no filler |
| 7 | Collab / UGC | Social proof, next teaser | Logos/imagery as headline |
| 8 | List capture | Email + SMS, "get access" | Above footer; value-explicit |
| 9 | Footer | Utility, legal, stockists, social | Big logo, accessible |

## 2. Product detail page (PDP) spec
- **Gallery first** (4:5 portrait, multiple angles + on-model + detail).
- Title, price (tabular numerals), 1-line fabric/origin, **size selector**.
- **Availability state**: in stock / low stock ("Only N left") / sold out →
  **Notify me** (back-in-stock). One decisive **Add to Cart**.
- Below fold: details, sizing/fit, shipping/returns, "complete the look".
- No marketing essays. Let imagery + scarcity carry it.

## 3. Drop-release implementation

**Scheduled drop**
- Publish product at a fixed time (Shopify scheduled publishing / Launchpad on
  Plus). Pre-build a **countdown** page for the gap.
- Pre-warm caches; expect a traffic spike; keep checkout lean.

**Raffle / draw**
- Pre-drop **registration form** (email/phone) → random winners → unique buy
  links. Bonus entries for referrals/social follow. Communicate fairness.

**Virtual waiting room / queue**
- For very high simultaneous demand, use a queue (e.g., **Queue-it**) or
  Shopify's native checkout throttling so the store doesn't crash and bots
  don't dominate. Show position/estimated wait.

**Password / coming-soon gate**
- Shopify password page or a lock for members-only / mystery drops
  (Corteiz-style manufactured exclusivity).

**Scarcity cues (all models)**
- Edition size ("Only 200 made"), low-stock counters, honest sold-out walls,
  one-item-per-customer limits, countdown timers on PDP + landing.

## 4. Recommended tech stack (DTC streetwear)

- **Storefront/commerce:** **Shopify** (or **Shopify Plus** at scale — Kith,
  many top brands). Fast to launch, robust at drop-spikes, huge app ecosystem,
  **Shop Pay** express checkout.
- **Email + SMS:** **Klaviyo** (email/flows) + **Attentive** or Klaviyo SMS.
  Core flows: welcome, drop reminder, **back-in-stock**, abandoned cart,
  post-purchase, VIP early-access.
- **Drop/queue/raffle:** Queue-it (waiting room), a raffle app, Launchpad
  (Plus) for scheduled drops.
- **Scarcity/social proof:** low-stock + sold-out logic (native or app).
- **Media/perf:** CDN images (WebP/AVIF), lazy-load, reserved aspect ratios.
- **Analytics:** GA4 + Shopify analytics; track drop sell-through & list growth.
- **Custom build alternative:** headless (Next.js + Shopify Storefront API) or a
  bespoke static site for marketing + Shopify for checkout — only when the brand
  needs a signature interactive experience the theme layer can't deliver.

> For a marketing/brand site without checkout yet (like the SOAR build in this
> repo), a static, dependency-free site is fine — but design the **drop module
> and list-capture** now so commerce can slot in via Shopify later.

## 5. Conversion flow (pre-drop → drop → post)

1. **Tease** (social, 1–2 weeks out) → drive to list capture.
2. **Capture** (email/SMS) with a clear value: "early access to the drop."
3. **Remind** (T-24h, T-1h, live) via SMS/email + on-site countdown.
4. **Drop** — fast PDPs, express checkout, queue if needed, honest stock states.
5. **Sell-out** — show it; push **back-in-stock** waitlists.
6. **Retain** — post-purchase flow, UGC ask, next-drop tease, membership/loyalty.

## 6. Copy & voice guide
- **Terse and confident.** Slogans over paragraphs. Uppercase labels, mono
  utility type ("VOL.01", "LIMITED 200", "SOLD OUT").
- Sell the **identity and the moment**, not features.
- Scarcity language honest and specific ("200 made", not "almost gone").
- CTAs are verbs of acquisition: "Cop", "Shop the drop", "Get access".

## 7. Measurement
- Sell-through rate & time-to-sellout per drop.
- List growth (email/SMS) and back-in-stock → purchase conversion.
- Mobile checkout completion & speed (LCP/INP).
- Repeat-purchase / membership retention.

---

### Quick start for a new brand
1. Pick **one aesthetic pole** (use `ui-ux-pro-max` for tokens).
2. Build homepage modules 1–9; make **The Drop** the hero of the page.
3. Stand up **Shopify + Klaviyo**, wire scarcity + back-in-stock.
4. Choose a **drop model**; schedule the first release + countdown.
5. Capture a list, tease on social, drop on a fixed cadence, show sell-outs.
