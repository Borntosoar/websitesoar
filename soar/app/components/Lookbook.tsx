import { Reveal } from "./Reveal";
import { GarmentFlat } from "./GarmentFlat";
import type { SoarProduct } from "@/lib/shopify";

type Kind = "jacket" | "top" | "shorts";

function kindOf(type?: string): Kind {
  return type === "Outerwear" ? "jacket" : type === "Bottoms" ? "shorts" : "top";
}

// How each piece is meant to be worn — the styling angle (vs. the shop cards).
// Curated per handle; a kind-based line is the graceful fallback so live Shopify
// data can never degrade the copy to a raw category label.
const STYLING: Record<string, string> = {
  "the-trucker-jacket": "Worn open, sleeves pushed back. The anchor of the fit.",
  "long-sleeve": "Layered under the jacket, or on its own when it warms.",
  "utility-shorts": "Cut for movement — the season’s easy bottom.",
};
const STYLING_BY_KIND: Record<Kind, string> = {
  jacket: "The layer everything else is built around.",
  top: "The quiet base of the fit.",
  shorts: "Cut for movement — the easy bottom.",
};

// A bright editorial "lookbook" — the collection styled, not just listed. Kept
// light so the page holds one inverted section (the Manifesto) as the single
// breakthrough; the garment flats stand in, honestly, until photography lands.
export function Lookbook({ products }: { products: SoarProduct[] }) {
  return (
    <section id="lookbook" className="border-t border-line">
      <div className="wrap py-24 md:py-36">
        <Reveal>
          <div className="mb-12 flex items-baseline justify-between md:mb-20">
            <h2 className="mono text-ash">The lookbook</h2>
            <span className="mono text-ash">Collection One · Vol. 001</span>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="display max-w-[18ch] text-[clamp(2.2rem,6vw,5.2rem)]">Three pieces. Worn how you like.</p>
        </Reveal>

        <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-3 md:gap-8">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <a href={`/products/${p.handle}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden border border-line bg-gradient-to-b from-panel to-[#e0ddd3]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <GarmentFlat kind={kindOf(p.productType)} className="h-[70%] w-auto text-ink/30 transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
                  </div>
                  <span className="mono absolute left-4 top-4 text-ink/45">{String(i + 1).padStart(3, "0")}</span>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="serif text-lg italic">{p.title}</span>
                  <span className="mono text-ash">${p.price}</span>
                </div>
                <p className="mt-2 max-w-[34ch] text-[13px] leading-snug text-ash">{STYLING[p.handle] ?? STYLING_BY_KIND[kindOf(p.productType)]}</p>
                <span className="mono mt-3 inline-block text-ash transition-colors group-hover:text-ink">Shop →</span>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="lede mt-16 max-w-2xl text-ink/70 md:mt-24">
            No campaign, no stylist — just the pieces, made in small numbers, and photographed for real when the first run ships.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
