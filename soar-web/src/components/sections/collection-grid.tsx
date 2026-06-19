"use client";

import { cn } from "@/lib/utils";
import { products } from "@/lib/products";
import { ProductImage } from "@/components/ui/product-image";
import { ProductCard } from "@/components/ui/product-card";
import { useQuickView } from "@/components/ui/quick-view";
import { useCatalog } from "@/components/ui/catalog";
import { Reveal } from "@/components/ui/reveal";
import type { Product } from "@/lib/products";

/** A quiet drop-culture scarcity line — only when the data genuinely supports it
 *  (never fabricate counts; live Shopify items can report 0 = unknown stock). */
function scarcity(p: Product): string | null {
  if (p.edition > 0 && p.left === 0) return "Sold out";
  if (p.left > 0 && p.left <= 20) return `Only ${p.left} left`;
  return null;
}

/** The lead tile — one oversized hairline-framed piece that anchors the
 *  asymmetric grid. Opens the same quick-view PDP as ProductCard. */
function FeaturedTile({ p }: { p: Product }) {
  const { open } = useQuickView();
  const note = scarcity(p);
  const soldOut = note === "Sold out";
  return (
    <button
      type="button"
      onClick={() => open(p)}
      aria-label={`View ${p.name}`}
      className="group relative flex h-full w-full flex-col overflow-hidden border border-black/10 text-left transition-transform active:scale-[0.99]"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden md:aspect-auto md:flex-1">
        <ProductImage
          p={p}
          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />

        {/* corner index + code */}
        <span className="absolute left-5 top-4 text-[11px] uppercase tracking-[0.2em] text-black/45 tabular-nums">
          {p.tag ?? "Featured"}
        </span>
        <span className="absolute right-5 top-4 text-[11px] uppercase tracking-[0.2em] text-black/40 tabular-nums">
          {p.code}
        </span>

        {/* scarcity cue — quiet, data-driven */}
        {note && (
          <span
            className={cn(
              "absolute left-5 bottom-5 text-[11px] uppercase tracking-[0.18em] tabular-nums",
              soldOut ? "text-black/40 line-through" : "text-black/60",
            )}
          >
            {note}
          </span>
        )}
      </div>

      {/* meta rail — label slides up on hover */}
      <div className="flex items-end justify-between gap-4 border-t border-black/10 px-5 py-5 md:px-6">
        <div className="min-w-0">
          <span className="block text-[11px] uppercase tracking-[0.2em] text-black/45">
            {p.category}
          </span>
          <h3 className="mt-1.5 text-[clamp(1.5rem,3.4vw,2.25rem)] font-semibold leading-[1.02] tracking-[-0.01em] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:translate-y-1 md:group-hover:translate-y-0">
            {p.name}
          </h3>
        </div>
        <div className="shrink-0 text-right">
          <span className="block text-base font-medium tabular-nums">${p.price}</span>
          <span className="mt-1 inline-block text-[11px] uppercase tracking-[0.14em] text-black/45 underline-offset-4 group-hover:underline">
            {soldOut ? "Sold out" : "Shop"}
          </span>
        </div>
      </div>
    </button>
  );
}

/** COLLECTION — the commercial heart. An asymmetric featured-first category
 *  layout: one oversized lead tile + a supporting grid of the full catalog.
 *  Reuses the live Shopify catalog (local fallback) + ProductCard + quick-view. */
export function CollectionGrid() {
  const cat = useCatalog();
  const items = cat ?? products;
  const [lead, ...rest] = items;
  const supporting = rest.slice(0, 6);
  const total = String(items.length).padStart(2, "0");

  if (!lead) return null;

  return (
    <section id="collection" className="bg-white py-24 text-black md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* editorial header — eyebrow + Section-H2 + index */}
        <header className="border-b border-black/10 pb-8 md:pb-10">
          <Reveal>
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.34em] text-black/45">
              <span>The Collection</span>
              <span className="tabular-nums">01 / {total}</span>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-6 max-w-[14ch] text-[clamp(2.4rem,7vw,6rem)] font-semibold leading-[0.9] tracking-[-0.01em]">
              Ascension <span className="font-serif italic">Vol.01</span>
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-black/60 md:text-base">
              Numbered, weighted, built for the long climb. Every piece a limited
              run — once the edition is gone, it stays gone.
            </p>
          </Reveal>
        </header>

        {/* asymmetric featured-first grid */}
        <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 md:mt-14 md:grid-cols-12 md:gap-x-6 md:gap-y-14">
          {/* lead tile spans both columns on mobile, 7/12 + full height on desktop */}
          <Reveal className="col-span-2 md:col-span-7 md:row-span-2" delay={0}>
            <FeaturedTile p={lead} />
          </Reveal>

          {/* supporting tiles — first two sit beside the lead (5/12), the
              rest pack into clean pairs below (6/12); no orphaned columns */}
          {supporting.map((p, i) => (
            <Reveal
              key={p.id}
              className={i < 2 ? "md:col-span-5" : "md:col-span-6"}
              delay={80 + (i % 2) * 80}
            >
              <ProductCard p={p} />
            </Reveal>
          ))}
        </div>

        {/* quiet secondary — full catalog lives in New Arrivals above */}
        <Reveal delay={120}>
          <div className="mt-14 flex items-center justify-between border-t border-black/10 pt-8 text-[11px] uppercase tracking-[0.2em] text-black/45 md:mt-20">
            <span className="tabular-nums">{total} pieces · Drop 001</span>
            <a
              href="#shop"
              className="text-black/60 underline-offset-4 hover:text-black hover:underline"
            >
              View all
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
