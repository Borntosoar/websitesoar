"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const nav = [
  ["Drop", "#drop"],
  ["Shop", "#shop"],
  ["World", "#world"],
  ["Contact", "#list"],
] as const;

export function SiteHeader() {
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const on = () => setStuck(window.scrollY > window.innerHeight * 0.7);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);

  return (
    <header
      data-site-header
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-6 px-5 py-5 transition-colors duration-300 md:px-12",
        stuck
          ? "border-b border-ink/10 bg-oat/85 text-ink backdrop-blur-md"
          : "text-bone",
      )}
    >
      <a href="#top" className="text-[1.05rem] font-semibold tracking-[0.18em]">
        SOAR<sup className="text-[0.5em] align-super">®</sup>
      </a>
      <nav className="hidden gap-8 md:flex">
        {nav.map(([label, href]) => (
          <a key={href} href={href} className="text-[13px] opacity-80 transition-opacity hover:opacity-100">
            {label}
          </a>
        ))}
      </nav>
      <button className="text-[11px] uppercase tracking-[0.12em]" type="button">
        Bag (0)
      </button>
    </header>
  );
}
