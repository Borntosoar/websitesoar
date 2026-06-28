"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useCart } from "./cart/CartProvider";

const LEFT = [
  { label: "Shop", href: "#collection" },
  { label: "Drop 001", href: "#collection" },
];
const RIGHT = [
  { label: "First Flight", href: "#access" },
  { label: "The approach", href: "#approach" },
];

function Icon({ d }: { d: string }) {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export function Nav() {
  const { count, open, setOpen } = useCart();
  const [solid, setSolid] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    // hysteresis: avoids flicker as the mobile address bar collapses near the fold
    const onScroll = () => setSolid((s) => (s ? window.scrollY > window.innerHeight * 0.55 : window.scrollY > window.innerHeight * 0.7));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // light text over the dark hero; dark text once scrolled onto paper
  const tone = solid ? "text-ink" : "text-paper";

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* announcement bar */}
      <div className="flex h-9 items-center justify-center bg-ink px-4 text-paper">
        <p className="mono truncate text-paper/90">
          First Flight is open — members get the code first<span className="hidden sm:inline"> · Drop 001 · Edition of 200</span>
        </p>
      </div>

      {/* nav row */}
      <div className={`relative transition-colors duration-500 ${solid ? "bg-paper/90 backdrop-blur-md" : "bg-transparent"}`}>
        <div className={`absolute inset-x-0 bottom-0 rule transition-opacity duration-500 ${solid ? "opacity-100" : "opacity-0"}`} />
        <nav className={`wrap grid h-[60px] grid-cols-[1fr_auto_1fr] items-center transition-colors duration-500 md:h-[70px] ${tone}`}>
          {/* left links */}
          <div className="flex items-center gap-6">
            {LEFT.map((l) => (
              <a key={l.label} href={l.href} className="mono opacity-80 transition-opacity hover:opacity-100">{l.label}</a>
            ))}
          </div>

          {/* center wordmark */}
          <a href="#top" aria-label="SOAR — home" className="select-none text-center text-[22px] font-bold tracking-[0.42em] md:text-[26px]">
            SOAR
          </a>

          {/* right links + utility icons */}
          <div className="flex items-center justify-end gap-5">
            {RIGHT.map((l) => (
              <a key={l.label} href={l.href} className="mono hidden opacity-80 transition-opacity hover:opacity-100 lg:inline">{l.label}</a>
            ))}
            <span className="mono hidden opacity-80 sm:inline">CA / CAD</span>
            <button
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-label={`Open bag, ${count} ${count === 1 ? "item" : "items"}`}
              className="relative opacity-90 transition-opacity hover:opacity-100"
            >
              <Icon d="M6 8h12l-1 12H7L6 8zM9 8a3 3 0 0 1 6 0" />
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={reduce ? false : { scale: 1.6 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 520, damping: 18 }}
                  className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-bold tabular-nums text-paper"
                  style={{ backgroundColor: solid ? undefined : "var(--color-paper)", color: solid ? undefined : "var(--color-ink)" }}
                >
                  {count}
                </motion.span>
              )}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
