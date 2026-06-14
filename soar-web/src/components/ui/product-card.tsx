"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/ui/cart";
import type { Product } from "@/lib/products";

/** Product module. Until real garment photography exists, the tile is an
 *  intentional typographic plate; "Add to bag" is wired to the cart. */
export function ProductCard({ p, dark = false }: { p: Product; dark?: boolean }) {
  const cart = useCart();
  return (
    <div className="group">
      <div
        className={cn(
          "relative aspect-[4/5] overflow-hidden border",
          dark ? "border-white/10 bg-white/[0.04]" : "border-black/5 bg-black",
        )}
      >
        {p.tag && (
          <span className="absolute left-3 top-3 z-10 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-black">
            {p.tag}
          </span>
        )}
        <span className="absolute right-3 top-3 z-10 text-[10px] uppercase tracking-[0.2em] text-white/40">{p.code}</span>
        <div className="absolute inset-0 grid place-items-center">
          <span className="select-none text-[7rem] font-semibold uppercase leading-none text-white/[0.06] transition-transform duration-700 group-hover:scale-110">
            {p.category[0]}
          </span>
        </div>
        <button
          type="button"
          onClick={() => cart.add({ id: p.id, title: p.name, price: p.price })}
          className="absolute inset-x-3 bottom-3 flex translate-y-0 items-center justify-center gap-2 bg-white py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-black opacity-100 transition-all duration-300 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
        >
          <Plus size={13} strokeWidth={2} /> Add to bag
        </button>
      </div>
      <div className={cn("mt-3 flex items-baseline justify-between gap-3", dark ? "text-white" : "text-black")}>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-medium">{p.name}</h3>
          <span className={cn("text-[11px] uppercase tracking-[0.14em]", dark ? "text-white/45" : "text-black/45")}>
            {p.category}
          </span>
        </div>
        <span className="shrink-0 text-sm tabular-nums">${p.price}</span>
      </div>
    </div>
  );
}
