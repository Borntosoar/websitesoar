"use client";

import { useState } from "react";
import Image from "next/image";
import { Reveal } from "./Reveal";
import { GarmentFlat } from "./GarmentFlat";
import { Tilt } from "./Tilt";
import { useCart } from "./cart/CartProvider";
import type { SoarProduct } from "@/lib/shopify";

function kindOf(type?: string) {
  return type === "Outerwear" ? "jacket" : type === "Bottoms" ? "shorts" : "top";
}

function ProductCard({ product }: { product: SoarProduct }) {
  const { add, setOpen } = useCart();
  const [openSizes, setOpenSizes] = useState(false);
  const soldOut = !product.variants.some((v) => v.available);
  const dot = product.description ? product.description.indexOf(".") : -1;
  const lead = dot > 0 ? product.description!.slice(0, dot + 1) : product.description ?? "";

  function quickAdd(variantId: string, size: string, price: number, max: number) {
    add({ variantId, name: `${product.title} — ${size}`, price, max });
    setOpen(true);
  }

  return (
    <div className="group flex flex-col">
      <Tilt className="relative aspect-[4/5] overflow-hidden bg-panel">
        <span className="mono absolute left-4 top-4 z-20 text-ink/55">{soldOut ? "Sold out" : "Drop 001"}</span>

        {product.image ? (
          <Image src={product.image} alt={product.title} fill sizes="(max-width:768px) 80vw, 33vw" className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-panel to-[#e0ddd3]">
            <GarmentFlat kind={kindOf(product.productType)} className="h-[74%] w-auto text-ink/30" />
          </div>
        )}

        {/* quick-add toggle (touch) */}
        {!soldOut && (
          <button
            onClick={() => setOpenSizes((o) => !o)}
            aria-label={openSizes ? `Hide sizes for ${product.title}` : `Choose a size for ${product.title}`}
            aria-expanded={openSizes}
            className="absolute bottom-4 right-4 z-30 flex h-11 w-11 items-center justify-center border border-ink/25 bg-paper text-lg leading-none text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            {openSizes ? "×" : "+"}
          </button>
        )}

        {/* size bar — slides up on hover (desktop) or via + (touch) */}
        {!soldOut && (
          <div className={`absolute inset-x-0 bottom-0 z-20 flex items-center justify-center gap-1.5 border-t border-line bg-paper/95 p-3 backdrop-blur-sm transition-transform duration-300 ${openSizes ? "translate-y-0" : "translate-y-full"} group-hover:translate-y-0 group-focus-within:translate-y-0`}>
            {product.variants.map((v) => (
              <button
                key={v.id}
                type="button"
                disabled={!v.available}
                onClick={() => quickAdd(v.id, v.size, v.price, v.quantity)}
                aria-label={`Add size ${v.size}`}
                className="mono flex h-11 min-w-11 items-center justify-center px-2 text-ink transition-colors hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:text-ash/70 disabled:line-through disabled:hover:bg-transparent disabled:hover:text-ash/70"
              >
                {v.size}
              </button>
            ))}
          </div>
        )}
      </Tilt>

      {/* meta */}
      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <a href={`/products/${product.handle}`} className="text-[15px] text-ink hover:underline">{product.title}</a>
          <p className="mono mt-1.5 text-ash">{product.productType ?? "Drop 001"}</p>
        </div>
        <span className="shrink-0 tabular-nums text-[15px] text-ink">${product.price} CAD</span>
      </div>
      {lead && <p className="mt-2 max-w-[36ch] text-[13px] leading-snug text-ash">{lead}</p>}
      <p className="mono mt-2 text-ash">Edition of {product.total} · individually numbered</p>
      <a href={`/products/${product.handle}`} className="mono mt-3 inline-block text-ash underline-offset-4 transition-colors hover:text-ink hover:underline">View details →</a>
    </div>
  );
}

export function ProductRow({ products }: { products: SoarProduct[] }) {
  return (
    <section id="collection" className="wrap py-16 md:py-24">
      <Reveal>
        <div className="mb-10 flex items-end justify-between border-b border-line pb-5">
          <h2 className="display text-[clamp(1.8rem,4vw,3rem)]">The Collection</h2>
          <span className="mono text-ash">{products.length} pieces · Drop 001</span>
        </div>
      </Reveal>

      {/* horizontal scroll on mobile, 3-up on desktop */}
      <div className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0">
        {products.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.06} className="w-[78vw] shrink-0 snap-start sm:w-[60vw] md:w-auto">
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
