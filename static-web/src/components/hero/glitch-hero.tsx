"use client";

import { useEffect, useState } from "react";

/** Hero — one oversized STATIC wordmark, a sub-2s RGB-split glitch reveal that
 *  resolves to a sharp, still, centred lockup. Glitch is accent-only. */
export function GlitchHero() {
  const [firing, setFiring] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setFiring(false), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="scan relative flex min-h-[88svh] flex-col items-center justify-center overflow-hidden border-b border-black/14 bg-white px-6 text-center">
      <span className="mono mb-8 text-black/45">Est. 2026 — Limited</span>
      <h1
        className={`glitch over text-[clamp(4rem,26vw,22rem)] ${firing ? "is-firing" : ""}`}
        data-text="STATIC"
        aria-label="STATIC"
      >
        STATIC
      </h1>
      <p className="mono mt-8 max-w-md text-black/55">Everything is noise until you cut through it.</p>
      <a href="#drop" className="mono mt-12 inline-block border border-black px-7 py-3 transition-colors duration-200 hover:bg-black hover:text-white">
        Enter the drop ↓
      </a>
    </section>
  );
}
