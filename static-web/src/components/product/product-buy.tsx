"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/cart";
import type { Product } from "@/lib/products";

export function ProductBuy({ p }: { p: Product }) {
  const { add } = useCart();
  const [size, setSize] = useState(p.sizes[0]);
  const sold = p.left === 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        {p.sizes.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSize(s)}
            aria-pressed={size === s}
            className={`mono border px-4 py-2 transition-colors ${size === s ? "border-black bg-black text-white" : "border-black/20 hover:border-black/50"}`}
          >
            {s}
          </button>
        ))}
      </div>
      <button
        type="button"
        disabled={sold}
        onClick={() => add({ id: p.id, name: p.name, price: p.price, size })}
        className="mono w-fit bg-black px-10 py-4 text-white transition-opacity hover:opacity-80 disabled:opacity-40"
      >
        {sold ? "Sold out" : "Add to bag"}
      </button>
    </div>
  );
}
