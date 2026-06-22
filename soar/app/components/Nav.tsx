"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useCart } from "./cart/CartProvider";

const LINKS = [
  { label: "Collection", href: "#collection" },
  { label: "The Ascent", href: "#ascent" },
  { label: "Story", href: "#story" },
  { label: "Access", href: "#access" },
];

export function Nav() {
  const { count, open, setOpen } = useCart();
  const [solid, setSolid] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* drop ticker — honest, on-brand, always visible */}
      <div className="flex h-9 items-center justify-center bg-ink px-4 text-paper">
        <p className="mono truncate text-paper/85">
          Drop 001 — 200 made, individually numbered<span className="hidden sm:inline"> · Complimentary shipping across Canada</span>
        </p>
      </div>

      {/* nav row — transparent over hero, paper on scroll */}
      <div className={`relative transition-colors duration-500 ${solid ? "bg-paper/85 backdrop-blur-md" : "bg-transparent"}`}>
        <div className={`absolute inset-x-0 bottom-0 rule transition-opacity duration-500 ${solid ? "opacity-100" : "opacity-0"}`} />
        <nav className="wrap flex h-16 items-center justify-between md:h-[68px]">
          <a href="#top" aria-label="SOAR — home" className="select-none text-[19px] font-bold tracking-[0.34em] text-ink">
            SOAR
          </a>

          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 md:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="mono relative text-ink/70 transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-ink after:transition-[width] after:duration-300 hover:text-ink hover:after:w-full"
              >
                {l.label}
              </a>
            ))}
          </div>

          <button
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-label={`Open bag, ${count} ${count === 1 ? "item" : "items"}`}
            className="mono text-ink/80 transition-colors hover:text-ink"
          >
            Bag{" "}
            <motion.span
              key={count}
              initial={reduce ? false : { scale: 1.5, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 520, damping: 18 }}
              className="inline-block tabular-nums"
            >
              ({count})
            </motion.span>
          </button>
        </nav>
      </div>
    </header>
  );
}
