"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "./cart/CartProvider";
import type { SoarProduct } from "@/lib/shopify";

/** One garment, one full screen. Alternating gallery layout — the clothes are
 *  the show. Falls back to an intentional "imagery coming" frame until product
 *  photography is uploaded to Shopify, then the real shot flows straight in. */
export function ProductChapter({ product, index, total }: { product: SoarProduct; index: number; total: number }) {
  const { add, setOpen } = useCart();
  const sellable = product.variants.filter((v) => v.available);
  const [size, setSize] = useState(() => (sellable[0] ?? product.variants[0])?.size);
  const chosen = product.variants.find((v) => v.size === size) ?? product.variants[0];
  const soldOut = sellable.length === 0;

  const dot = product.description ? product.description.indexOf(".") : -1;
  const lead = dot > 0 ? product.description!.slice(0, dot + 1) : product.title;
  const body = dot > 0 ? product.description!.slice(dot + 1).trim() : product.description ?? "";

  const num = String(index + 1).padStart(3, "0");
  const flip = index % 2 === 1; // alternate sides

  function addToBag() {
    if (!chosen) return;
    add({ variantId: chosen.id, name: `${product.title} — ${chosen.size}`, price: chosen.price });
    setOpen(true);
  }

  return (
    <article className="wrap grid items-center gap-y-10 py-16 md:min-h-svh md:grid-cols-2 md:gap-x-16 md:py-24">
      {/* image / frame */}
      <div className={flip ? "md:order-2" : ""}>
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-panel">
          {product.image ? (
            <Image src={product.image} alt={product.title} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
          ) : (
            <ImageFrame num={num} type={product.productType} />
          )}
        </div>
      </div>

      {/* detail */}
      <div className={`flex flex-col ${flip ? "md:order-1" : ""}`}>
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

        {/* size */}
        <div className="mt-8">
          <p className="mono mb-3 text-ash">Size</p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => {
              const active = v.size === size;
              return (
                <button
                  key={v.id}
                  type="button"
                  disabled={!v.available}
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
        </div>

        <button
          type="button"
          onClick={addToBag}
          disabled={soldOut}
          className="mono mt-9 w-fit bg-ink px-12 py-4 text-paper transition-opacity hover:opacity-85 disabled:opacity-40"
        >
          {soldOut ? "Sold out" : "Add to bag"}
        </button>

        <span className="mono mt-6 text-ash">
          {num} / {String(total).padStart(3, "0")} — Drop 001
        </span>
      </div>
    </article>
  );
}

/** Intentional, premium stand-in until photography lands — not an empty box. */
function ImageFrame({ num, type }: { num: string; type?: string }) {
  return (
    <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-b from-panel to-[#dedbd1] p-6">
      <div className="flex items-center justify-between">
        <span className="mono text-ink/45">{type ?? "SOAR"}</span>
        <span className="text-ink/40">✦</span>
      </div>
      <span className="display pointer-events-none select-none text-center text-[34vw] leading-none text-ink/[0.06] md:text-[12rem]">
        {num}
      </span>
      <div className="flex items-center justify-between">
        <span className="mono text-ink/45">SOAR — Drop 001</span>
        <span className="mono text-ink/35">Imagery coming</span>
      </div>
    </div>
  );
}
