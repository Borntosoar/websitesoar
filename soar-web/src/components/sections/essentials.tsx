"use client";

import { bestSellers } from "@/lib/products";
import { ProductCard } from "@/components/ui/product-card";
import { useCatalog } from "@/components/ui/catalog";

/** The Essentials — live Shopify products (falls back to local placeholders). */
export function Essentials() {
  const cat = useCatalog();
  const items = (cat ?? bestSellers).slice(0, 4);
  return (
    <section className="bg-black py-20 text-white md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-12">
        <div className="mb-10 flex items-end justify-between border-b border-white/10 pb-5">
          <div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-white/40">The Essentials</span>
            <h2 className="mt-2 text-[clamp(2rem,5vw,3.2rem)] font-semibold leading-none">Made to rise in.</h2>
          </div>
          <a
            href="#shop"
            className="hidden shrink-0 text-[12px] uppercase tracking-[0.15em] text-white/55 underline-offset-4 hover:text-white hover:underline sm:block"
          >
            View all
          </a>
        </div>
        <div className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0">
          {items.map((p) => (
            <div key={p.id} className="w-[62vw] shrink-0 snap-start sm:w-[40vw] md:w-auto">
              <ProductCard p={p} dark />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
