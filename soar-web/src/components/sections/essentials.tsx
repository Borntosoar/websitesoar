"use client";

import { bestSellers } from "@/lib/products";
import { ProductCard } from "@/components/ui/product-card";
import { useCatalog } from "@/components/ui/catalog";
import { Reveal } from "@/components/ui/reveal";

/** The Essentials — live Shopify products (falls back to local placeholders).
 *  A horizontal scroll-snap rail on mobile, a clean 4-up grid on desktop. */
export function Essentials() {
  const cat = useCatalog();
  const items = (cat ?? bestSellers).slice(0, 4);
  const total = String(items.length).padStart(2, "0");

  return (
    <section className="bg-black py-24 text-white md:py-36">
      <div className="mx-auto max-w-7xl">
        {/* editorial header — eyebrow + index + Section-H2 ramp */}
        <header className="border-b border-white/10 px-6 pb-8 md:px-12 md:pb-10">
          <Reveal>
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.34em] text-white/45">
              <span>The Essentials</span>
              <span className="tabular-nums">01 / {total}</span>
            </div>
          </Reveal>
          <div className="mt-6 flex items-end justify-between gap-6">
            <Reveal delay={80}>
              <h2 className="max-w-[14ch] text-[clamp(2.4rem,7vw,6rem)] font-semibold leading-[0.9] tracking-[-0.01em]">
                Made to <span className="font-serif italic">rise</span> in.
              </h2>
            </Reveal>
            <Reveal delay={160} className="hidden shrink-0 pb-2 sm:block">
              <a
                href="#shop"
                className="text-[12px] uppercase tracking-[0.15em] text-white/55 underline-offset-4 hover:text-white hover:underline"
              >
                View all
              </a>
            </Reveal>
          </div>
        </header>

        {/* product rail — scroll-snaps on mobile (gutter-aligned, notch-safe),
            settles into a 4-up grid on desktop */}
        <Reveal delay={120}>
          <ul
            className="mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mt-14 md:grid md:snap-none md:grid-cols-4 md:gap-6 md:overflow-visible md:px-12 [scroll-padding-inline:1.5rem]"
          >
            {items.map((p, i) => (
              <li
                key={p.id}
                className="w-[64vw] shrink-0 sm:w-[42vw] md:w-auto"
                style={{ scrollSnapAlign: i === items.length - 1 ? "end" : "start" }}
              >
                <ProductCard p={p} dark />
              </li>
            ))}
          </ul>
        </Reveal>

        {/* footer rail — quiet scroll affordance (mobile) + verbatim View all */}
        <Reveal delay={160}>
          <div className="mt-8 flex items-center justify-between border-t border-white/10 px-6 pt-6 text-[11px] uppercase tracking-[0.2em] text-white/45 md:px-12">
            <span className="flex items-center gap-3 md:hidden" aria-hidden="true">
              <span className="tabular-nums">Drag</span>
              <span className="h-px w-10 bg-white/20" />
            </span>
            <span className="hidden tabular-nums md:inline">{total} pieces · Drop 001</span>
            <a
              href="#shop"
              className="text-white/55 underline-offset-4 hover:text-white hover:underline"
            >
              View all
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
