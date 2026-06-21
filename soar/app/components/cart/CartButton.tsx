"use client";

import { useCart } from "./CartProvider";

export function CartButton() {
  const { count, setOpen } = useCart();
  return (
    <button className="mono text-white/70 transition-colors hover:text-white" onClick={() => setOpen(true)} aria-label={`Bag, ${count} items`}>
      Bag ({count})
    </button>
  );
}
