import { Reveal } from "./Reveal";
import { CampaignFigure } from "./CampaignFigure";
import { GarmentFlat } from "./GarmentFlat";
import type { SoarProduct } from "@/lib/shopify";

// The campaign spread — editorial "model" stills as a concept until photography
// lands: each garment worn on a ghosted figure, lit on a studio sweep. Follows
// the Represent move — a full-bleed campaign moment between shop grid and lookbook.

function kindOf(type?: string): "jacket" | "top" | "shorts" {
  return type === "Outerwear" ? "jacket" : type === "Bottoms" ? "shorts" : "top";
}

const WORN: Record<string, string> = {
  "the-trucker-jacket": "Worn open",
  "long-sleeve": "Worn alone",
  "utility-shorts": "Worn easy",
};

export function Campaign({ products }: { products: SoarProduct[] }) {
  return (
    <section id="campaign" className="border-t border-line bg-panel">
      <div className="wrap py-20 md:py-28">
        <Reveal>
          <div className="mb-10 flex items-end justify-between md:mb-16">
            <div>
              <span className="mono text-ash">The campaign</span>
              <h2 className="display mt-4 text-[clamp(2.4rem,6.5vw,5.6rem)] leading-[0.92]">
                Collection One,
                <br />
                on the body.
              </h2>
            </div>
            <span className="mono hidden text-ash md:block">SOAR — SS / 001</span>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {products.map((p, i) => {
            const kind = kindOf(p.productType);
            return (
              <Reveal key={p.id} delay={i * 0.07} className={i === 2 ? "col-span-2 md:col-span-1" : ""}>
                <a href={`/products/${p.handle}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-b from-[#23211d] to-[#0c0b0a]">
                    {/* studio sweep — a soft pool of light */}
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{ background: "radial-gradient(115% 64% at 50% 14%, rgba(244,243,239,0.22), transparent 58%)" }}
                    />
                    {/* the body — a ghosted figure */}
                    <CampaignFigure flip={i === 1} className="absolute bottom-0 left-1/2 h-[94%] w-auto -translate-x-1/2 text-paper/[0.13]" />
                    {/* the garment, worn — the luminous hero */}
                    <GarmentFlat
                      kind={kind}
                      className={`absolute left-1/2 w-auto -translate-x-1/2 text-paper/90 drop-shadow-[0_2px_30px_rgba(244,243,239,0.12)] transition-transform duration-700 ease-out group-hover:scale-[1.03] ${
                        kind === "shorts" ? "top-[40%] h-[33%]" : "top-[15%] h-[49%]"
                      }`}
                    />
                    {/* floor shadow grounding the figure */}
                    <div className="pointer-events-none absolute inset-x-[26%] bottom-[4%] h-5 rounded-[50%] bg-black/55 blur-md" />
                    {/* grain */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-screen"
                      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
                    />
                    <span className="mono absolute left-3 top-3 text-paper/55">{String(i + 1).padStart(2, "0")}</span>
                    <span className="mono absolute bottom-3 right-3 text-paper/55 opacity-0 transition-opacity duration-300 group-hover:opacity-100">View →</span>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="serif text-base italic">{p.title}</span>
                    <span className="mono text-ash">{WORN[p.handle] ?? "Worn your way"}</span>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
