"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Lock } from "lucide-react";
import { createContext, useContext, useState, type ReactNode } from "react";
import { Garment } from "@/components/ui/garment";
import { shopifyEnabled, createCheckout } from "@/lib/shopify";

export type Line = {
  lineId: string;
  id: string;
  handle?: string;
  variantId?: string;
  title: string;
  price: number;
  qty: number;
  category: string;
  size?: string;
  image?: string;
};

type AddInput = { id: string; handle?: string; variantId?: string; title: string; price: number; category: string; size?: string; image?: string };

type CartCtx = {
  items: Line[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (o: boolean) => void;
  add: (i: AddInput) => void;
  setQty: (lineId: string, qty: number) => void;
  remove: (lineId: string) => void;
};

const FREE_AT = 200;
const Ctx = createContext<CartCtx | null>(null);

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within <CartProvider>");
  return c;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);

  function add(p: AddInput) {
    const lineId = p.id + (p.size ? `-${p.size}` : "");
    setItems((prev) => {
      const e = prev.find((x) => x.lineId === lineId);
      if (e) return prev.map((x) => (x.lineId === lineId ? { ...x, qty: x.qty + 1 } : x));
      return [...prev, { ...p, lineId, qty: 1 }];
    });
    setOpen(true);
  }
  function setQty(lineId: string, qty: number) {
    setItems((prev) =>
      qty <= 0 ? prev.filter((x) => x.lineId !== lineId) : prev.map((x) => (x.lineId === lineId ? { ...x, qty } : x)),
    );
  }
  function remove(lineId: string) {
    setItems((prev) => prev.filter((x) => x.lineId !== lineId));
  }

  const count = items.reduce((n, i) => n + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <Ctx.Provider value={{ items, count, subtotal, open, setOpen, add, setQty, remove }}>{children}</Ctx.Provider>
  );
}

function Thumb({ line }: { line: Line }) {
  return (
    <div className="grid h-20 w-16 shrink-0 place-items-center overflow-hidden border border-ink/10 bg-paper">
      {line.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={line.image} alt={line.title} className="h-full w-full object-cover" />
      ) : (
        <Garment kind={line.category} />
      )}
    </div>
  );
}

export function CartDrawer() {
  const { items, open, setOpen, subtotal, setQty, remove } = useCart();
  const [note, setNote] = useState(false);
  const [busy, setBusy] = useState(false);
  const progress = Math.min(1, subtotal / FREE_AT);
  const remaining = Math.max(0, FREE_AT - subtotal);

  async function checkout() {
    if (!shopifyEnabled) {
      setNote(true);
      return;
    }
    setBusy(true);
    try {
      const lines: { merchandiseId: string; quantity: number }[] = [];
      for (const i of items) {
        if (!i.variantId) {
          setBusy(false);
          setNote(true);
          return;
        }
        lines.push({ merchandiseId: i.variantId, quantity: i.qty });
      }
      // auto-apply the claimed 10% offer (SOAR10) — Shopify ignores it if the
      // code isn't active, so it can never block checkout
      let promo: string[] | undefined;
      try {
        if (localStorage.getItem("soar-promo") === "claimed") promo = ["SOAR10"];
      } catch {}
      const url = await createCheckout(lines, promo);
      if (url) window.location.href = url;
      else {
        setBusy(false);
        setNote(true);
      }
    } catch {
      setBusy(false);
      setNote(true);
    }
  }

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
            className="fixed right-0 top-0 z-[141] flex h-svh w-full max-w-md flex-col bg-oat text-ink pr-[env(safe-area-inset-right)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            role="dialog"
            aria-label="Your bag"
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <span className="text-[11px] uppercase tracking-[0.2em] text-taupe">Your bag ({items.length})</span>
              <button onClick={() => setOpen(false)} aria-label="Close bag" className="-mr-2 grid h-11 w-11 place-items-center transition-opacity hover:opacity-60 md:-mr-0 md:h-9 md:w-9">
                <X size={18} strokeWidth={1.6} />
              </button>
            </div>

            {/* free-shipping progress */}
            {items.length > 0 && (
              <div className="border-b border-ink/10 px-6 py-4">
                <p className="text-[11px] uppercase tracking-[0.12em] text-taupe">
                  {remaining > 0 ? (
                    <>You&apos;re <span className="text-ink tabular-nums">${remaining}</span> from free shipping</>
                  ) : (
                    <span className="text-ink">Free shipping unlocked — you&apos;ve risen.</span>
                  )}
                </p>
                <div className="mt-2 h-[3px] w-full bg-ink/10">
                  <div className="h-full bg-ink transition-all duration-500" style={{ width: `${progress * 100}%` }} />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-auto px-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <ShoppingBag size={28} strokeWidth={1.2} className="text-taupe" />
                  <p className="text-ink/60">Your bag is empty.</p>
                  <button onClick={() => setOpen(false)} className="text-[12px] uppercase tracking-[0.14em] underline underline-offset-4">
                    Keep exploring
                  </button>
                </div>
              ) : (
                items.map((i) => (
                  <div key={i.lineId} className="flex gap-4 border-b border-ink/10 py-4">
                    <Thumb line={i} />
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-3">
                        <p className="font-medium leading-tight">{i.title}</p>
                        <span className="shrink-0 text-sm tabular-nums">${i.price * i.qty}</span>
                      </div>
                      <p className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-taupe">
                        {i.category}
                        {i.size ? ` · ${i.size}` : ""}
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center border border-ink/15">
                          <button onClick={() => setQty(i.lineId, i.qty - 1)} aria-label="Decrease" className="grid h-11 w-11 place-items-center hover:bg-ink/5 md:h-8 md:w-8">
                            <Minus size={13} strokeWidth={1.8} />
                          </button>
                          <span className="w-7 text-center text-sm tabular-nums">{i.qty}</span>
                          <button onClick={() => setQty(i.lineId, i.qty + 1)} aria-label="Increase" className="grid h-11 w-11 place-items-center hover:bg-ink/5 md:h-8 md:w-8">
                            <Plus size={13} strokeWidth={1.8} />
                          </button>
                        </div>
                        <button onClick={() => remove(i.lineId)} aria-label={`Remove ${i.title}`} className="text-[11px] uppercase tracking-[0.12em] text-taupe underline-offset-4 hover:text-ink hover:underline">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="sticky bottom-0 border-t border-ink/10 bg-oat px-6 pt-5 pb-[max(env(safe-area-inset-bottom),1.25rem)]">
                <div className="mb-4 flex items-baseline justify-between">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-taupe">Subtotal</span>
                  <span className="text-lg font-medium tabular-nums">${subtotal}</span>
                </div>
                <button
                  onClick={checkout}
                  disabled={busy}
                  className="flex w-full items-center justify-center gap-2 bg-ink py-3.5 text-[13px] font-medium uppercase tracking-[0.12em] text-oat transition-[colors,transform] hover:bg-espresso active:scale-[0.98] disabled:opacity-70"
                >
                  <Lock size={13} strokeWidth={1.8} /> {busy ? "Redirecting…" : "Secure checkout"}
                </button>
                <p className="mt-2 text-center text-[11px] uppercase tracking-[0.12em] text-taupe">
                  {note ? "Checkout connects once Shopify is linked — your bag is saved." : "Shipping & taxes calculated at checkout"}
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
