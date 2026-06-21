"use client";

import { useCart } from "@/components/cart/cart";

export function CartButton() {
  const { count, setOpen } = useCart();
  return (
    <button className="mono" onClick={() => setOpen(true)} aria-label={`Bag, ${count} items`}>
      Bag ({count})
    </button>
  );
}
