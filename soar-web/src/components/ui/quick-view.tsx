"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Minus } from "lucide-react";
import { createContext, useContext, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/ui/cart";
import { ProductImage } from "@/components/ui/product-image";
import { getProduct, type Product } from "@/lib/products";

type QV = { product: Product | null; open: (p: Product) => void; close: () => void };
const Ctx = createContext<QV | null>(null);

export function useQuickView() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useQuickView must be used within <QuickViewProvider>");
  return c;
}

export function QuickViewProvider({ children }: { children: ReactNode }) {
  const [product, setProduct] = useState<Product | null>(null);
  return <Ctx.Provider value={{ product, open: setProduct, close: () => setProduct(null) }}>{children}</Ctx.Provider>;
}

function Panel({ product }: { product: Product }) {
  const cart = useCart();
  const { open, close } = useQuickView();
  const needSize = product.sizes.length > 1;
  const [size, setSize] = useState(needSize ? "" : product.sizes[0]);
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState(false);
  const related = product.related.map(getProduct).filter(Boolean) as Product[];
  const stock = Math.round((product.left / product.edition) * 100);

  function addToBag() {
    if (needSize && !size) {
      setErr(true);
      return;
    }
    for (let i = 0; i < qty; i++) {
      cart.add({ id: product.id, handle: product.handle, title: product.name, price: product.price, category: product.category, size: size || undefined, image: product.image });
    }
    close();
  }

  return (
    <div className="grid h-full md:grid-cols-2">
      {/* image */}
      <div className="relative hidden bg-paper md:block">
        <ProductImage p={product} />
        {product.tag && (
          <span className="absolute left-4 top-4 bg-ink px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-oat">
            {product.tag}
          </span>
        )}
      </div>

      {/* details */}
      <div className="flex max-h-[88svh] flex-col overflow-auto p-6 md:p-9">
        <div className="flex items-start justify-between">
          <span className="text-[11px] uppercase tracking-[0.2em] text-taupe">SOAR — {product.code}</span>
          <button onClick={close} aria-label="Close" className="-mr-1 -mt-1 transition-opacity hover:opacity-60">
            <X size={18} strokeWidth={1.6} />
          </button>
        </div>

        {/* mobile image */}
        <div className="relative mt-3 aspect-[4/5] bg-paper md:hidden">
          <ProductImage p={product} />
        </div>

        <h2 className="mt-4 text-2xl font-medium md:text-3xl">{product.name}</h2>
        <p className="mt-1 text-lg tabular-nums">${product.price}</p>
        <p className="mt-4 text-sm leading-relaxed text-ink/65">{product.description}</p>

        {/* scarcity */}
        <div className="mt-5">
          <div className="flex justify-between text-[11px] uppercase tracking-[0.12em] text-taupe">
            <span>Limited {product.edition}</span>
            <span className="text-ink">Only {product.left} left</span>
          </div>
          <div className="mt-2 h-[3px] w-full bg-ink/10">
            <div className="h-full bg-ink" style={{ width: `${stock}%` }} />
          </div>
        </div>

        {/* size */}
        <div className="mt-6">
          <span className="text-[11px] uppercase tracking-[0.16em] text-taupe">{needSize ? "Size" : "One size"}</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSize(s);
                  setErr(false);
                }}
                className={cn(
                  "min-w-11 border px-3 py-2 text-[12px] uppercase tracking-[0.08em] transition-colors",
                  size === s ? "border-ink bg-ink text-oat" : "border-ink/20 hover:border-ink",
                )}
              >
                {s}
              </button>
            ))}
          </div>
          {err && <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-ink">Select a size to continue</p>}
        </div>

        {/* qty + add */}
        <div className="mt-6 flex gap-3">
          <div className="flex items-center border border-ink/15">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease" className="grid h-12 w-11 place-items-center hover:bg-ink/5">
              <Minus size={14} strokeWidth={1.8} />
            </button>
            <span className="w-8 text-center tabular-nums">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} aria-label="Increase" className="grid h-12 w-11 place-items-center hover:bg-ink/5">
              <Plus size={14} strokeWidth={1.8} />
            </button>
          </div>
          <button
            onClick={addToBag}
            className="flex-1 bg-ink text-[13px] font-medium uppercase tracking-[0.12em] text-oat transition-colors hover:bg-espresso"
          >
            Add to bag — ${product.price * qty}
          </button>
        </div>

        {/* details */}
        <ul className="mt-7 space-y-2 border-t border-ink/10 pt-5 text-sm text-ink/65">
          {product.details.map((d) => (
            <li key={d} className="flex gap-2">
              <span className="text-taupe">—</span>
              {d}
            </li>
          ))}
        </ul>

        {/* complete the look */}
        {related.length > 0 && (
          <div className="mt-7 border-t border-ink/10 pt-5">
            <span className="text-[11px] uppercase tracking-[0.16em] text-taupe">Complete the look</span>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {related.map((r) => (
                <button key={r.id} onClick={() => open(r)} className="group text-left">
                  <div className="aspect-[4/5] overflow-hidden border border-ink/10 bg-paper">
                    <ProductImage p={r} className="transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <p className="mt-1.5 truncate text-[12px]">{r.name}</p>
                  <p className="text-[11px] tabular-nums text-taupe">${r.price}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function ProductQuickView() {
  const { product, close } = useQuickView();
  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            className="fixed inset-0 z-[150] bg-espresso/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-[151] mx-auto h-[92svh] w-full max-w-4xl overflow-hidden bg-oat text-ink md:inset-y-0 md:my-auto md:h-[min(88svh,720px)]"
            initial={{ y: "100%", opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.6 }}
            transition={{ type: "spring", stiffness: 280, damping: 34 }}
            role="dialog"
            aria-label={product.name}
          >
            <Panel key={product.id} product={product} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
