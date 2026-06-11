"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
import { createContext, useContext, useState, type ReactNode } from "react";

type Item = { id: string; title: string; price: number; qty: number };
type CartCtx = {
  items: Item[];
  count: number;
  open: boolean;
  setOpen: (o: boolean) => void;
  add: (i: Omit<Item, "qty">) => void;
  remove: (id: string) => void;
};

const Ctx = createContext<CartCtx | null>(null);

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within <CartProvider>");
  return c;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);

  function add(p: Omit<Item, "qty">) {
    setItems((prev) => {
      const e = prev.find((x) => x.id === p.id);
      if (e) return prev.map((x) => (x.id === p.id ? { ...x, qty: x.qty + 1 } : x));
      return [...prev, { ...p, qty: 1 }];
    });
    setOpen(true);
  }
  function remove(id: string) {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  const count = items.reduce((n, i) => n + i.qty, 0);
  return <Ctx.Provider value={{ items, count, open, setOpen, add, remove }}>{children}</Ctx.Provider>;
}

export function CartDrawer() {
  const { items, open, setOpen, remove } = useCart();
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[140] bg-espresso/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            className="fixed right-0 top-0 z-[141] flex h-svh w-full max-w-sm flex-col bg-oat text-ink"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 34 }}
            role="dialog"
            aria-label="Your bag"
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <span className="text-[11px] uppercase tracking-[0.2em] text-taupe">Your bag ({items.length})</span>
              <button onClick={() => setOpen(false)} aria-label="Close bag">
                <X size={18} strokeWidth={1.6} />
              </button>
            </div>

            <div className="flex-1 overflow-auto px-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <ShoppingBag size={28} strokeWidth={1.2} className="text-taupe" />
                  <p className="text-ink/60">Your bag is empty.</p>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-[12px] uppercase tracking-[0.14em] underline underline-offset-4"
                  >
                    Keep shopping
                  </button>
                </div>
              ) : (
                items.map((i) => (
                  <div key={i.id} className="flex items-center gap-4 border-b border-ink/10 py-4">
                    <div className="grid h-16 w-14 place-items-center border border-ink/10 bg-paper font-serif text-stone">
                      {i.title[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{i.title}</p>
                      <p className="text-[11px] uppercase tracking-[0.12em] text-taupe">Qty {i.qty}</p>
                    </div>
                    <span className="font-medium">${(i.price * i.qty).toFixed(0)}</span>
                    <button onClick={() => remove(i.id)} aria-label={`Remove ${i.title}`} className="text-taupe hover:text-ink">
                      <X size={14} strokeWidth={1.6} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-ink/10 px-6 py-5">
                <div className="mb-4 flex items-baseline justify-between">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-taupe">Subtotal</span>
                  <span className="text-lg font-medium">${total.toFixed(0)}</span>
                </div>
                <button className="w-full bg-ink py-3.5 text-[13px] font-medium text-oat transition-colors hover:bg-espresso">
                  Checkout
                </button>
                <p className="mt-2 text-center text-[11px] uppercase tracking-[0.12em] text-taupe">
                  Shipping &amp; taxes at checkout
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
