"use client";

import { AnimatePresence, motion } from "framer-motion";
import { createContext, useContext, useState, type ReactNode } from "react";
import { startCheckout } from "@/app/actions";

type Line = { variantId: string; name: string; price: number; qty: number };
type Ctx = {
  lines: Line[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (o: boolean) => void;
  add: (l: Omit<Line, "qty">) => void;
  setQty: (variantId: string, q: number) => void;
};

const CartCtx = createContext<Ctx | null>(null);

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart must be used within <CartProvider>");
  return c;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);

  function add(l: Omit<Line, "qty">) {
    setLines((prev) => {
      const e = prev.find((x) => x.variantId === l.variantId);
      if (e) return prev.map((x) => (x.variantId === l.variantId ? { ...x, qty: x.qty + 1 } : x));
      return [...prev, { ...l, qty: 1 }];
    });
    setOpen(true);
  }
  function setQty(variantId: string, q: number) {
    setLines((prev) => (q <= 0 ? prev.filter((x) => x.variantId !== variantId) : prev.map((x) => (x.variantId === variantId ? { ...x, qty: q } : x))));
  }

  const count = lines.reduce((n, i) => n + i.qty, 0);
  const subtotal = lines.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartCtx.Provider value={{ lines, count, subtotal, open, setOpen, add, setQty }}>
      {children}
      <CartDrawer />
    </CartCtx.Provider>
  );
}

function CartDrawer() {
  const { lines, open, setOpen, subtotal, setQty } = useCart();
  const [busy, setBusy] = useState(false);

  async function checkout() {
    setBusy(true);
    const url = await startCheckout(lines.map((l) => ({ merchandiseId: l.variantId, quantity: l.qty })));
    if (url) window.location.href = url;
    else setBusy(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[60] bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.aside
            className="fixed right-0 top-0 z-[61] flex h-svh w-full max-w-sm flex-col border-l border-white/15 bg-[#0a0a0a] text-white"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            role="dialog"
            aria-label="Bag"
          >
            <div className="flex items-center justify-between border-b border-white/15 px-6 py-5">
              <span className="mono">Bag ({lines.length})</span>
              <button className="mono text-white/60 hover:text-white" onClick={() => setOpen(false)}>Close</button>
            </div>
            <div className="flex-1 overflow-auto px-6">
              {lines.length === 0 ? (
                <p className="mono py-24 text-center text-white/40">Nothing yet. Rise above.</p>
              ) : (
                lines.map((l) => (
                  <div key={l.variantId} className="flex items-center justify-between gap-4 border-b border-white/10 py-5">
                    <p className="mono min-w-0 truncate">{l.name}</p>
                    <div className="flex items-center gap-5">
                      <div className="mono flex items-center gap-1">
                        <button className="flex h-9 w-9 items-center justify-center text-base text-white/65 transition-colors hover:text-white" aria-label="Decrease" onClick={() => setQty(l.variantId, l.qty - 1)}>−</button>
                        <span className="w-6 text-center tabular-nums">{l.qty}</span>
                        <button className="flex h-9 w-9 items-center justify-center text-base text-white/65 transition-colors hover:text-white" aria-label="Increase" onClick={() => setQty(l.variantId, l.qty + 1)}>+</button>
                      </div>
                      <span className="mono shrink-0 tabular-nums">${l.price * l.qty}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            {lines.length > 0 && (
              <div className="border-t border-white/15 px-6 py-5">
                <div className="mono mb-4 flex items-baseline justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums">${subtotal}</span>
                </div>
                <button onClick={checkout} disabled={busy} className="mono w-full bg-white py-4 text-black transition-opacity hover:opacity-80 disabled:opacity-50">
                  {busy ? "Redirecting…" : "Checkout"}
                </button>
                <p className="mono mt-3 text-center text-white/35">Shopify-hosted checkout — connects when a store is set</p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
