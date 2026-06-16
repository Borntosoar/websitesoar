"use client";

import { products } from "@/lib/products";
import { ProductCard } from "@/components/ui/product-card";
import { Reveal } from "@/components/ui/reveal";
import { useCatalog } from "@/components/ui/catalog";

/** New Arrivals — live Shopify products (falls back to local placeholders). */
export function ShopGrid() {
  const cat = useCatalog();
  const items = (cat ?? products).slice(0, 8);
  return (
    <section id="shop" className="bg-white py-20 text-black md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-12">
        <div className="mb-10 flex items-end justify-between border-b border-black/10 pb-5">
          <div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-black/50">New Arrivals</span>
            <h2 className="mt-2 text-[clamp(2rem,5vw,3.2rem)] font-semibold leading-none">Wear the breakthrough.</h2>
          </div>
          <a
            href="#collection"
            className="hidden shrink-0 text-[12px] uppercase tracking-[0.15em] text-black/60 underline-offset-4 hover:text-black hover:underline sm:block"
          >
            Shop all
          </a>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-9 md:grid-cols-4">
          {items.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 60}>
              <ProductCard p={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
