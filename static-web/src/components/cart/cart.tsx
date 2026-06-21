"use client";

import { AnimatePresence, motion } from "framer-motion";
import { createContext, useContext, useState, type ReactNode } from "react";
import { createCheckout } from "@/lib/shopify";

type Line = { id: string; variantId?: string; name: string; price: number; size: string; qty: number };
type Ctx = {
  items: Line[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (o: boolean) => void;
  add: (l: Omit<Line, "qty">) => void;
  setQty: (id: string, size: string, q: number) => void;
};

const CartCtx = createContext<Ctx | null>(null);

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart must be used within <CartProvider>");
  return c;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);

  function add(l: Omit<Line, "qty">) {
    setItems((prev) => {
      const k = l.id + l.size;
      const e = prev.find((x) => x.id + x.size === k);
      if (e) return prev.map((x) => (x.id + x.size === k ? { ...x, qty: x.qty + 1 } : x));
      return [...prev, { ...l, qty: 1 }];
    });
    setOpen(true);
  }
  function setQty(id: string, size: string, q: number) {
    setItems((prev) => (q <= 0 ? prev.filter((x) => !(x.id === id && x.size === size)) : prev.map((x) => (x.id === id && x.size === size ? { ...x, qty: q } : x))));
  }

  const count = items.reduce((n, i) => n + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartCtx.Provider value={{ items, count, subtotal, open, setOpen, add, setQty }}>
      {children}
      <CartDrawer />
    </CartCtx.Provider>
  );
}

function CartDrawer() {
  const { items, open, setOpen, subtotal, setQty } = useCart();
  const [busy, setBusy] = useState(false);

  async function checkout() {
    setBusy(true);
    const lines = items.filter((i) => i.variantId).map((i) => ({ merchandiseId: i.variantId as string, quantity: i.qty }));
    const url = lines.length ? await createCheckout(lines) : null;
    if (url) window.location.href = url;
    else setBusy(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[60] bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.aside
            className="fixed right-0 top-0 z-[61] flex h-svh w-full max-w-sm flex-col bg-black text-white"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            role="dialog"
            aria-label="Bag"
          >
            <div className="flex items-center justify-between border-b border-white/15 px-6 py-5">
              <span className="mono">Bag ({items.length})</span>
              <button className="mono text-white/60 hover:text-white" onClick={() => setOpen(false)}>Close</button>
            </div>
            <div className="no-scrollbar flex-1 overflow-auto px-6">
              {items.length === 0 ? (
                <p className="mono py-24 text-center text-white/40">Nothing yet. Cut through.</p>
              ) : (
                items.map((i) => (
                  <div key={i.id + i.size} className="flex items-center justify-between gap-4 border-b border-white/10 py-5">
                    <div className="min-w-0">
                      <p className="mono truncate">{i.name}</p>
                      <p className="mono mt-1 text-white/40">Size {i.size}</p>
                    </div>
                    <div className="flex items-center gap-5">
                      <div className="mono flex items-center gap-3">
                        <button aria-label="Decrease" onClick={() => setQty(i.id, i.size, i.qty - 1)}>−</button>
                        <span className="tabular-nums">{i.qty}</span>
                        <button aria-label="Increase" onClick={() => setQty(i.id, i.size, i.qty + 1)}>+</button>
                      </div>
                      <span className="mono shrink-0 tabular-nums">${i.price * i.qty}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            {items.length > 0 && (
              <div className="border-t border-white/15 px-6 py-5">
                <div className="mono mb-4 flex items-baseline justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums text-base">${subtotal}</span>
                </div>
                <button onClick={checkout} disabled={busy} className="mono w-full bg-white py-4 text-black transition-opacity hover:opacity-80 disabled:opacity-50">
                  {busy ? "Redirecting…" : "Checkout"}
                </button>
                <p className="mono mt-3 text-center text-white/35">Shopify checkout — connects with a STATIC store</p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
