# SOAR — Front of House (the flagship homepage opening)

> Shared source of truth for the front rebuild. Every agent building a front
> section MUST implement to this spec so the pieces read as ONE site. SOAR is
> premium, monochrome, quiet-luxury (Fear of God / Represent feel) — **luxury
> through meaning, not logos.** The emotional arc is *Pressure → Resistance →
> Breakthrough → Growth → Freedom*; the front must feel like the held breath
> before the rise. Original SOAR only — never copy another brand's words/images.

## Non-negotiables
- **Monochrome only.** Black `#000` (tokens `ink`/`espresso`/`bg-black`), white
  `#fff` (`oat`/`bone`/`bg-white`), greys `paper #F5F5F5`, `stone #D4D4D4`,
  `taupe #8A8A8A`, plus white/black opacity steps. **No colour. No gradients of
  colour.** Light emerges from darkness.
- **No new dependencies.** Use what's installed (framer-motion, three/R3F where
  already used). No new fonts, no external/unlicensed assets, no emoji icons
  (lucide-react only).
- **Don't invent marketing claims.** Reuse existing copy; you may tighten
  phrasing already present, but do not fabricate offers, numbers, or quotes.
- **Mobile-first & iPhone-safe.** Respect the existing patterns: `min-h-svh`,
  safe-area utilities (`pt-safe`/`pb-safe`/`px-safe`, or
  `pb-[max(env(safe-area-inset-bottom),1rem)]`), ≥44px touch targets, inputs
  ≥16px on mobile. No horizontal overflow.
- **Reduced motion.** Decorative motion must no-op under
  `prefers-reduced-motion` (Reveal already does via app MotionConfig; for raw
  CSS animations add a guard or use the existing guarded keyframes).

## Tokens & primitives (already in the repo — use them)
- Fonts: `font-sans` = Hanken Grotesk, `font-serif` = Newsreader (use *serif
  italic* for a single accent word only — sparingly, for emotion).
- Motion ease: `ease-[cubic-bezier(0.22,1,0.36,1)]` (a.k.a. the brand ease).
- Components: `Reveal` (`<Reveal delay={ms}>`, scroll-in, reduced-motion safe),
  `Magnetic` (cursor-lean wrapper for a CTA), `Logo` (`variant="white"|"black"`,
  size via className like `h-8 w-auto`), `DropClock` (`tone="light"|"dark"`).
- Global atmosphere already present: film grain overlay, rising light particles
  (`.soar-particle`), `::selection` white-on-black.

## Type scale (use these exact ramps for consistency)
- **Hero display:** `text-[clamp(3.2rem,13vw,10rem)] font-semibold leading-[0.85] tracking-[-0.02em]`
- **Section H2:** `text-[clamp(2.4rem,7vw,6rem)] font-semibold leading-[0.9] tracking-[-0.01em]`
- **Eyebrow / micro-label:** `text-[11px] uppercase tracking-[0.34em]` in `text-white/45` (or `text-black/45` on light)
- **Lede / body:** `text-[15px] md:text-base leading-relaxed text-white/60` (light bg: `text-black/60`), `max-w-md`
- **Numerals:** always `tabular-nums`.

## Rhythm
- Section padding: `py-24 md:py-36`; gutters `px-6 md:px-12`.
- Hairlines: `border-white/10` (dark) / `border-black/10` (light). 1px only.
- One **primary CTA per screen** (solid white-on-black or black-on-white bar,
  `px-8 py-3.5 text-[12px] uppercase tracking-[0.15em]`), wrap in `Magnetic`.
  Secondary actions are quiet text links with `underline-offset-4`.
- Motion: stagger entrances by ~80ms (`Reveal delay={0|80|160|240}`); entrance
  durations 0.8–1.1s; hovers ≤300ms; never animate width/height/top/left.

## Do / Don't
| Do | Don't |
|----|----|
| Editorial, asymmetric, generous whitespace, vertical/ascending feel | Dead-centre generic stacks; cramped |
| One decisive CTA; quiet secondary link | Multiple competing CTAs |
| Hairlines, index marks (`01 / 04`), tabular numerals | Heavy borders, drop shadows, cards-everywhere |
| Serif italic on ONE word for emotion | Serif everywhere; oversized brutalism |
| Feel-before-read symbolism (box → rise) | Over-explaining the meaning |

---

## Per-section blueprints

### HERO (`src/components/sections/hero.tsx`) — the flagship statement
- Full-bleed `min-h-svh`, `bg-black text-white`, safe-area aware
  (`pt-[calc(env(safe-area-inset-top)+...)]` not needed since header floats, but
  keep bottom scroll cue clear of the home indicator with `pb-safe`).
- Depth: keep the rising `.soar-particle` field; add a faint radial light rising
  from the bottom-centre (`bg-[radial-gradient(80%_60%_at_50%_100%,rgba(255,255,255,0.10),transparent)]`)
  — light emerging from darkness. Grain is already global.
- Composition (editorial, not dead-centre): a top eyebrow row with a hairline
  ("Born to soar" · a quiet "Vol.01 — The Escape" index on the right). The
  display headline **"Rise above / the box."** using the Hero display ramp, with
  ONE accent word in `font-serif italic` (e.g. italicise *above*). A short lede.
  A single primary CTA **"Shop the drop"** (Magnetic) + a quiet secondary link
  **"The manifesto"** → `#manifesto` (or `#the-box`).
- A subtle drop cue is welcome but keep it light: a single hairline line like
  `Drop 001 · Thursday 11:00` (tabular-nums) — NOT a full clock (the entrance
  already has the countdown). Don't clutter.
- Motion: staggered reveal eyebrow→headline→lede→CTA; the headline may use a
  clip/mask rise. Slow, quiet. Reduced-motion safe.
- Bottom: a refined scroll cue — a thin 1px vertical line + `Scroll` label,
  centered, `pb-safe`.

### TICKER (`src/components/sections/ticker.tsx`) — refined kinetic marquee
- Keep the infinite horizontal scroll and the EXISTING items. Premium it:
  `bg-black text-white`, hairline `border-y border-white/10`, `text-[11px]
  uppercase tracking-[0.3em] text-white/55`.
- Replace the big `✦` separator with a restrained mark: a small 1px dot or a
  thin slash in `text-white/25`.
- Add edge fade so items dissolve at both sides (premium):
  `style={{ WebkitMaskImage / maskImage: "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)" }}` on the overflow container.
- Respect reduced-motion: pause the animation (the existing
  `[style*="flock-scroll"]` reduced-motion guard in globals.css covers the inline
  animation — keep using `animation: flock-scroll ...`).

### FEATURED (`src/components/sections/featured.tsx`) — the lead drop, cinematic
- Keep the split (image-panel + copy-panel) and the parallax, but elevate to the
  shared system. Left/dark panel: the giant `001` watermark (`text-white/[0.06]`,
  tabular-nums) over a radial light, plus a corner index `01 / 04` and a bottom
  caption "The Escape — Vol.01" (tracking, tabular-nums).
- Right/light panel (`bg-white text-black`): eyebrow "Drop 001", the H2 ramp
  headline **THE ESCAPE** (you may italicise one word in `font-serif`), the
  existing lede, and ONE primary CTA "Shop now" → `#collection`. Generous
  `py-24 md:py-36`, `px-6 md:px-12`, staggered `Reveal`.
- Mobile: image panel stacks above copy; ensure no overflow; min-h tuned for
  phones (`min-h-[60svh] md:min-h-[88svh]`).

---

## Verification (every agent)
- Edit ONLY your assigned file. Do NOT run `next build` (a single authoritative
  build runs at integration). Verify types with `npx tsc --noEmit` from
  `soar-web/` and fix only errors you introduced.
- Keep desktop and mobile both correct; use `md:` for desktop deltas.
- Report a concise diff summary (what changed + why it serves the spec).
