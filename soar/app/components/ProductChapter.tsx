"use client";

import { useState } from "react";
import Image from "next/image";
import { Reveal } from "./Reveal";
import { GarmentFlat } from "./GarmentFlat";
import { useCart } from "./cart/CartProvider";
import type { SoarProduct } from "@/lib/shopify";

const LOW_STOCK = 10;

function fitNote(type?: string) {
  if (type === "Bottoms") return "Tailored length, regular fit — true to size.";
  return "Boxy, modern fit — true to size. Size down for a sharper silhouette.";
}

/** One garment, one full screen. Real inventory drives honest scarcity; an
 *  intentional frame stands in until photography is uploaded. */
export function ProductChapter({
  product,
  index,
  total,
  others,
}: {
  product: SoarProduct;
  index: number;
  total: number;
  others: { title: string; href: string }[];
}) {
  const { add } = useCart();
  const sellable = product.variants.filter((v) => v.available);
  const [size, setSize] = useState(() => (sellable[0] ?? product.variants[0])?.size);
  const [guide, setGuide] = useState(false);
  const [added, setAdded] = useState(false);
  const chosen = product.variants.find((v) => v.size === size) ?? product.variants[0];
  const soldOut = sellable.length === 0;
  const low = chosen?.available && chosen.quantity > 0 && chosen.quantity <= LOW_STOCK ? chosen.quantity : 0;

  const dot = product.description ? product.description.indexOf(".") : -1;
  const lead = dot > 0 ? product.description!.slice(0, dot + 1) : product.title;
  const body = dot > 0 ? product.description!.slice(dot + 1).trim() : product.description ?? "";

  const num = String(index + 1).padStart(3, "0");
  const flip = index % 2 === 1;
  const kind = product.productType === "Outerwear" ? "jacket" : product.productType === "Bottoms" ? "shorts" : "top";

  function addToBag() {
    if (!chosen) return;
    add({ variantId: chosen.id, name: `${product.title} — ${chosen.size}`, price: chosen.price });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <article id={`product-${index}`} className="wrap grid items-center gap-y-10 py-16 md:min-h-svh md:grid-cols-2 md:gap-x-16 md:py-24">
      {/* image / frame */}
      <Reveal className={flip ? "md:order-2" : ""}>
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-panel">
          {product.image ? (
            <Image src={product.image} alt={product.title} fill priority={index === 0} sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
          ) : (
            <ImageFrame num={num} type={product.productType} kind={kind} />
          )}
        </div>
      </Reveal>

      {/* detail */}
      <Reveal delay={0.05} className={`flex flex-col ${flip ? "md:order-1" : ""}`}>
        <div className="mono mb-6 flex items-center gap-4 text-ash">
          <span>{num}</span>
          <span className="h-px w-8 bg-line" />
          <span>{product.productType ?? "Drop 001"}</span>
        </div>

        <h2 className="display text-[clamp(2.4rem,6vw,4.6rem)]">{product.title}</h2>
        <p className="serif mt-5 max-w-md text-[clamp(1.05rem,2.4vw,1.4rem)] italic leading-snug text-ink/85">{lead}</p>
        {body && <p className="mt-5 max-w-md text-[14px] leading-relaxed text-ash">{body}</p>}

        <div className="mt-9 flex items-baseline gap-3">
          <span className="text-2xl tabular-nums">${product.price}</span>
          <span className="mono text-ash">CAD</span>
        </div>

        {/* honest scarcity */}
        <p className="mono mt-4 text-ash" aria-live="polite">
          {product.total > 0 ? `Edition of ${product.total}` : "Limited edition"} · individually numbered
          {low > 0 && <span className="text-ink"> · {low} left in {chosen.size}</span>}
        </p>

        {/* size */}
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <span className="mono text-ash">Size</span>
            <button
              type="button"
              onClick={() => setGuide((g) => !g)}
              aria-expanded={guide}
              aria-controls={`guide-${index}`}
              className="mono text-ash underline-offset-4 hover:text-ink hover:underline"
            >
              Size guide
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => {
              const active = v.size === size;
              return (
                <button
                  key={v.id}
                  type="button"
                  disabled={!v.available}
                  aria-pressed={active}
                  aria-label={`Size ${v.size}${v.available ? "" : " — sold out"}`}
                  onClick={() => setSize(v.size)}
                  className={`mono h-11 min-w-[3rem] border px-3 transition-colors ${
                    active ? "border-ink bg-ink text-paper" : "border-line text-ink hover:border-ink"
                  } disabled:cursor-not-allowed disabled:border-line disabled:text-ash/40 disabled:line-through`}
                >
                  {v.size}
                </button>
              );
            })}
          </div>

          {guide && (
            <div id={`guide-${index}`} className="mt-4 border-l border-line pl-4 text-[13px] leading-relaxed text-ash">
              <p className="text-ink">{fitNote(product.productType)}</p>
              <p className="mt-2">Measure a garment you own flat and compare. Full garment measurements are coming — email us for specifics in the meantime.</p>
            </div>
          )}
        </div>

        {soldOut ? (
          <p className="mono mt-9 w-fit border border-line px-12 py-4 text-ash">Sold out — join First Flight for the next run</p>
        ) : (
          <button
            type="button"
            onClick={addToBag}
            className="group mono mt-9 flex w-fit items-center gap-2 bg-ink px-12 py-4 text-paper transition-opacity hover:opacity-85"
          >
            <span>{added ? "Added to bag" : `Add to bag — $${product.price}`}</span>
            <span className={`transition-all duration-300 ${added ? "w-3 opacity-100" : "w-0 opacity-0"}`}>✓</span>
          </button>
        )}
        <span className="sr-only" aria-live="polite">
          {added ? `${product.title}, size ${chosen?.size}, added to bag.` : ""}
        </span>

        {/* complete the drop */}
        {others.length > 0 && (
          <div className="mt-10 border-t border-line pt-6">
            <span className="mono text-ash">The rest of the set</span>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {others.map((o) => (
                <a key={o.href} href={o.href} className="text-[14px] text-ink/75 underline-offset-4 hover:text-ink hover:underline">
                  {o.title} →
                </a>
              ))}
            </div>
          </div>
        )}

        <span className="mono mt-8 text-ash">
          {num} / {String(total).padStart(3, "0")} — Drop 001
        </span>
      </Reveal>
    </article>
  );
}

/** Intentional, premium stand-in until photography lands — a tech-pack flat of
 *  the actual garment, not an empty box. */
function ImageFrame({ num, type, kind }: { num: string; type?: string; kind: "jacket" | "top" | "shorts" }) {
  return (
    <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-b from-panel to-[#e0ddd3] p-6">
      <div className="flex items-center justify-between">
        <span className="mono text-ink/50">{type ?? "SOAR"}</span>
        <span className="text-ink/35">✦</span>
      </div>
      <div className="relative flex flex-1 items-center justify-center">
        <span className="display pointer-events-none absolute select-none text-[34vw] leading-none text-ink/[0.05] md:text-[13rem]">{num}</span>
        <GarmentFlat kind={kind} className="relative h-[78%] w-auto text-ink/30" />
      </div>
      <div className="flex items-center justify-between">
        <span className="mono text-ink/50">SOAR — Drop 001</span>
        <span className="mono text-ink/40">Technical flat</span>
      </div>
    </div>
  );
}
