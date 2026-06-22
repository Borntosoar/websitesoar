"use client";

import { AnimatePresence, motion } from "framer-motion";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
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
const STORAGE_KEY = "soar-bag";

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart must be used within <CartProvider>");
  return c;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // persist the bag across reloads/sessions (drop-day mobile reality)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, hydrated]);

  function add(l: Omit<Line, "qty">) {
    setLines((prev) => {
      const e = prev.find((x) => x.variantId === l.variantId);
      if (e) return prev.map((x) => (x.variantId === l.variantId ? { ...x, qty: x.qty + 1 } : x));
      return [...prev, { ...l, qty: 1 }];
    });
    // intentionally not auto-opening — ProductChapter shows an inline
    // confirmation and the nav bag count pulses (less jarring on a drop page).
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
  const asideRef = useRef<HTMLElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  // modal behaviour: focus in, trap Tab, Escape to close, return focus on close
  useEffect(() => {
    if (!open) return;
    restoreTo.current = document.activeElement as HTMLElement;
    const focusables = () =>
      asideRef.current
        ? Array.from(asideRef.current.querySelectorAll<HTMLElement>('button, a[href], input, [tabindex]:not([tabindex="-1"])')).filter((el) => !el.hasAttribute("disabled"))
        : [];
    const id = setTimeout(() => focusables()[0]?.focus(), 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setOpen(false);
      if (e.key !== "Tab") return;
      const f = focusables();
      if (f.length === 0) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(id);
      document.removeEventListener("keydown", onKey);
      restoreTo.current?.focus?.();
    };
  }, [open, setOpen]);

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
          <motion.div className="fixed inset-0 z-[60] bg-ink/35" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.aside
            ref={asideRef}
            className="fixed right-0 top-0 z-[61] flex h-svh w-full max-w-sm flex-col border-l border-line bg-paper text-ink"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            role="dialog"
            aria-modal="true"
            aria-label="Bag"
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <span className="mono">Bag ({lines.length})</span>
              <button type="button" className="mono text-ash hover:text-ink" onClick={() => setOpen(false)}>Close</button>
            </div>
            <div className="flex-1 overflow-auto px-6 [overscroll-behavior:contain]">
              {lines.length === 0 ? (
                <p className="mono py-24 text-center text-ash">Nothing yet. Rise above.</p>
              ) : (
                lines.map((l) => (
                  <div key={l.variantId} className="flex items-center justify-between gap-4 border-b border-line py-5">
                    <p className="min-w-0 truncate text-[14px]">{l.name}</p>
                    <div className="flex items-center gap-5">
                      <div className="mono flex items-center gap-1">
                        <button type="button" className="flex h-9 w-9 items-center justify-center text-base text-ash transition-colors hover:text-ink" aria-label={`Decrease ${l.name}`} onClick={() => setQty(l.variantId, l.qty - 1)}>−</button>
                        <span className="w-6 text-center tabular-nums">{l.qty}</span>
                        <button type="button" className="flex h-9 w-9 items-center justify-center text-base text-ash transition-colors hover:text-ink" aria-label={`Increase ${l.name}`} onClick={() => setQty(l.variantId, l.qty + 1)}>+</button>
                      </div>
                      <span className="mono shrink-0 tabular-nums">${l.price * l.qty}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            {lines.length > 0 && (
              <div className="border-t border-line px-6 py-5">
                <div className="mono mb-4 flex items-baseline justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums">${subtotal} CAD</span>
                </div>
                <button type="button" onClick={checkout} disabled={busy} className="mono w-full bg-ink py-4 text-paper transition-opacity hover:opacity-85 disabled:opacity-50">
                  {busy ? "Redirecting…" : "Checkout"}
                </button>
                <p className="mono mt-3 text-center text-ash">Secure Shopify checkout</p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
