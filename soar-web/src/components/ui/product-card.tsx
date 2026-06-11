"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { useCart } from "@/components/ui/cart";

/** Tilt-on-hover product card with depth pop + quick-add to the cart drawer. */
export function ProductCard({
  id,
  idx,
  name,
  meta,
  price,
  soldOut,
}: {
  id: string;
  idx: string;
  name: string;
  meta: string;
  price: number;
  soldOut?: boolean;
}) {
  const cart = useCart();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 200, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 200, damping: 18 });

  return (
    <article className="group">
      <motion.div
        ref={ref}
        onMouseMove={(e) => {
          const r = ref.current?.getBoundingClientRect();
          if (!r) return;
          mx.set((e.clientX - r.left) / r.width - 0.5);
          my.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onMouseLeave={() => {
          mx.set(0);
          my.set(0);
        }}
        style={{ rotateX, rotateY, transformPerspective: 900, transformStyle: "preserve-3d" }}
        className="relative grid aspect-[4/5] place-items-center overflow-hidden border border-ink/10 bg-oat transition-colors group-hover:border-ink"
      >
        <span
          className="font-serif text-6xl text-stone transition-colors duration-500 group-hover:text-taupe"
          style={{ transform: "translateZ(45px)" }}
        >
          {idx}
        </span>
        {soldOut ? (
          <>
            <span className="absolute right-3 top-3 border border-ink bg-ink px-2 py-1.5 text-[10px] uppercase tracking-[0.12em] text-paper">
              Sold out
            </span>
            <span className="absolute bottom-3 left-3 translate-y-[160%] bg-espresso px-3 py-2 text-[11px] uppercase tracking-[0.1em] text-bone transition-transform duration-300 group-hover:translate-y-0">
              Notify me
            </span>
          </>
        ) : (
          <button
            type="button"
            onClick={() => cart.add({ id, title: name, price })}
            className="absolute bottom-3 left-3 translate-y-[160%] bg-ink px-3 py-2 text-[11px] uppercase tracking-[0.1em] text-oat transition-transform duration-300 group-hover:translate-y-0"
          >
            Quick add — ${price}
          </button>
        )}
      </motion.div>
      <div className="mt-4 flex items-baseline justify-between gap-3">
        <div>
          <h3 className="font-medium">{name}</h3>
          <span className="text-[11px] uppercase tracking-[0.14em] text-taupe">{meta}</span>
        </div>
        <span className="font-medium">${price}</span>
      </div>
    </article>
  );
}
