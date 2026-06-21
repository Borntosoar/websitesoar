"use client";

import { useCart } from "./CartProvider";
import type { SoarProduct } from "@/lib/shopify";

export function AddToBag({ product }: { product?: SoarProduct }) {
  const { add } = useCart();
  const buyable = Boolean(product?.variantId && product.available);
  const label = product && !product.available ? "Sold out" : "Add to bag";

  return (
    <button
      type="button"
      disabled={!buyable}
      onClick={() => {
        if (product?.variantId) add({ variantId: product.variantId, name: product.title, price: product.price });
      }}
      className="mono mt-2 w-fit bg-white px-8 py-3.5 text-black transition-opacity hover:opacity-80 disabled:opacity-40"
    >
      {label}
    </button>
  );
}
