import { Reveal } from "./Reveal";
import { GarmentFlat } from "./GarmentFlat";
import type { SoarProduct } from "@/lib/shopify";

function kindOf(type?: string) {
  return type === "Outerwear" ? "jacket" : type === "Bottoms" ? "shorts" : "top";
}

// How each piece is meant to be worn — the styling/editorial angle (vs. the
// shop cards). Keyed by handle, falls back to the product type.
const STYLING: Record<string, string> = {
  "the-trucker-jacket": "Worn open, sleeves pushed back. The anchor of the fit.",
  "long-sleeve": "Layered under the jacket, or on its own when it warms.",
  "utility-shorts": "Cut for movement — the season’s easy bottom.",
};

// A dark editorial "lookbook" — the collection styled, not just listed.
// Typographic + the garment flats; honest that real photography is coming.
export function Lookbook({ products }: { products: SoarProduct[] }) {
  return (
    <section id="lookbook" className="on-dark bg-pitch text-paper">
      <div className="wrap py-24 md:py-36">
        <Reveal>
          <div className="mb-12 flex items-baseline justify-between md:mb-20">
            <h2 className="mono text-paper/60">The lookbook</h2>
            <span className="mono text-paper/60">Collection One · Vol. 001</span>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="display max-w-[18ch] text-[clamp(2.2rem,6vw,5.2rem)]">Three pieces. Worn how you like.</p>
        </Reveal>

        <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-3 md:gap-8">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <a href={`/products/${p.handle}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden border border-paper/10 bg-white/[0.02]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <GarmentFlat kind={kindOf(p.productType)} className="h-[70%] w-auto text-paper/35 transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
                  </div>
                  <span className="mono absolute left-4 top-4 text-paper/50">{String(i + 1).padStart(3, "0")}</span>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="serif text-lg italic">{p.title}</span>
                  <span className="mono text-paper/50">${p.price}</span>
                </div>
                <p className="mt-2 max-w-[34ch] text-[13px] leading-snug text-paper/55">{STYLING[p.handle] ?? p.productType}</p>
                <span className="mono mt-3 inline-block text-paper/60 transition-colors group-hover:text-paper">Shop →</span>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="serif mt-16 max-w-2xl text-[clamp(1.2rem,2.6vw,1.7rem)] italic leading-snug text-paper/85 md:mt-24">
            No campaign, no stylist — just the pieces, made in small numbers, and photographed for real when the first run ships.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
