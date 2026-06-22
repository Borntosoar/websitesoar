"use client";

import { useEffect, useState } from "react";
import { useCart } from "./cart/CartProvider";

const LINKS = [
  { label: "Collection", href: "#collection" },
  { label: "World", href: "#world" },
  { label: "Access", href: "#access" },
];

export function Nav() {
  const { count, setOpen } = useCart();
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid ? "bg-paper/85 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className={`absolute inset-x-0 bottom-0 rule transition-opacity duration-500 ${solid ? "opacity-100" : "opacity-0"}`} />
      <nav className="wrap flex h-16 items-center justify-between md:h-[72px]">
        <a href="#top" aria-label="SOAR — home" className="select-none text-[19px] font-bold tracking-[0.34em] text-ink">
          SOAR
        </a>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="mono text-ink/70 transition-colors hover:text-ink">
              {l.label}
            </a>
          ))}
        </div>

        <button onClick={() => setOpen(true)} className="mono text-ink/80 transition-colors hover:text-ink">
          Bag<span className="tabular-nums"> ({count})</span>
        </button>
      </nav>
    </header>
  );
}
