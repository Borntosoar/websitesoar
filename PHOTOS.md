# Real / AI product photos — drop-in guide

The site ships with **original vector studio renders** of every garment so the
whole flow (grid → quick-view → cart) looks like real items today. To swap in
real or AI-generated photography, you don't touch any components — just add files
and set one field.

## How to add a photo (2 steps)

1. Export each shot as a square-ish image and place it here:
   `soar-web/public/products/<product-id>.jpg`
   (IDs are in `soar-web/src/lib/products.ts` — e.g. `ascension-hoodie.jpg`.)

2. In `soar-web/src/lib/products.ts`, set the `image` field on that product:
   ```ts
   { id: "ascension-hoodie", /* ... */ image: "/products/ascension-hoodie.jpg" }
   ```
   The card, quick-view, and cart automatically use the photo instead of the
   vector render. Leave `image` unset to keep the render.

> GitHub Pages note: the preview build serves under a sub-path. If a photo 404s
> on the Pages/githack preview, prefix the path with the base, e.g.
> `"/Borntosoar/websitesoar/gh-pages/products/ascension-hoodie.jpg"`. On Vercel
> or your own domain, plain `/products/...` is correct.

## AI image prompts (consistent B&W studio set)

Use the same base for every shot so the set is cohesive. Generate at 4:5,
high-res, then lightly retouch.

**Base style (prefix every prompt):**
> Premium black-and-white studio product photograph, single garment on a seamless
> light-grey studio backdrop, soft top-key lighting with gentle falloff, subtle
> contact shadow, minimal, editorial, high detail, fashion-house lookbook, no
> model, no text, no logos, monochrome.

**Per piece (append to the base):**
- `ascension-hoodie` — heavyweight black loopback-cotton hoodie, boxy fit, hood up softly, front pouch pocket, flat-lay-meets-ghost-mannequin.
- `escape-tee` — structured black boxy tee, dense cotton, clean drape.
- `flight-sweatpants` — tapered black heavyweight sweatpants, ribbed cuffs, folded ghost-mannequin.
- `rise-bomber` — black water-repellent bomber jacket, ribbed collar/cuffs/hem, architectural.
- `free-bird-cap` — low-profile black unstructured cap, tonal embroidered bird-and-box mark.
- `limitless-crew` — black heavyweight crewneck sweater, ribbed collar, no hood.
- `ascend-short` — black heavyweight terry shorts, mid-length, tapered.
- `horizon-tee` — lightweight black straight-fit tee, clean minimal.

**Optional lookbook/editorial** (for hero, featured, the-flock, journal):
> Cinematic black-and-white editorial fashion photograph, model wearing minimal
> black premium streetwear, dramatic studio light, motion of breaking free /
> ascending, negative space, grain, no logos, monochrome — "Born to Soar".

Send the files and I'll wire them in (and can also push them to your Shopify
products via the Shopify integration).
