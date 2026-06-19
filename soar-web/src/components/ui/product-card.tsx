"use client";

import { cn } from "@/lib/utils";
import { ProductImage } from "@/components/ui/product-image";
import { useQuickView } from "@/components/ui/quick-view";
import type { Product } from "@/lib/products";

/** Product module — opens the quick-view PDP (apparel needs a size). */
export function ProductCard({ p, dark = false }: { p: Product; dark?: boolean }) {
  const { open } = useQuickView();
  return (
    <div className="group">
      <button
        type="button"
        onClick={() => open(p)}
        aria-label={`View ${p.name}`}
        className={cn("relative block aspect-[4/5] w-full overflow-hidden border transition-transform active:scale-[0.98]", dark ? "border-white/10" : "border-black/10")}
      >
        <ProductImage p={p} className="transition-transform duration-700 group-hover:scale-[1.04]" />
        {p.tag && (
          <span className="absolute left-3 top-3 bg-black px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
            {p.tag}
          </span>
        )}
        <span className={cn("absolute right-3 top-3 text-[10px] uppercase tracking-[0.2em]", dark ? "text-white/50" : "text-black/40")}>
          {p.code}
        </span>
        <span className="pointer-events-none absolute inset-x-3 bottom-3 bg-black/85 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-white opacity-100 backdrop-blur md:translate-y-2 md:opacity-0 md:transition-all md:duration-300 md:group-hover:translate-y-0 md:group-hover:opacity-100">
          Quick view
        </span>
      </button>
      <div className={cn("mt-3 flex items-baseline justify-between gap-3", dark ? "text-white" : "text-black")}>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-medium">{p.name}</h3>
          <span className={cn("text-[11px] uppercase tracking-[0.14em]", dark ? "text-white/45" : "text-black/45")}>
            {p.category}
            {p.left <= 20 ? ` · Only ${p.left} left` : ""}
          </span>
        </div>
        <span className="shrink-0 text-sm tabular-nums">${p.price}</span>
      </div>
    </div>
  );
}
