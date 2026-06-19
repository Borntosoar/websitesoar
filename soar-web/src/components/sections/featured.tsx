"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";

export function Featured() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section id="featured" ref={ref} className="grid bg-white text-black md:grid-cols-2">
      {/* Dark image panel — the drop watermark, light emerging from darkness */}
      <div className="relative min-h-[60svh] overflow-hidden bg-black text-white md:min-h-[88svh]">
        <motion.div style={{ y }} className="absolute inset-[-8%] grid place-items-center">
          <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_38%,rgba(255,255,255,0.10),transparent)]" />
          <span className="relative select-none font-semibold leading-none text-[34vw] tabular-nums text-white/[0.06] md:text-[15rem]">
            001
          </span>
        </motion.div>
        <span className="absolute left-6 top-6 text-[11px] uppercase tracking-[0.34em] tabular-nums text-white/45 md:left-12">
          01 / 04
        </span>
        <span className="absolute bottom-6 left-6 text-[11px] uppercase tracking-[0.34em] tabular-nums text-white/45 md:left-12">
          The Escape — Vol.01
        </span>
      </div>

      {/* Light copy panel — editorial, staggered entrance */}
      <div className="flex flex-col justify-center gap-6 px-6 py-24 md:px-12 md:py-36">
        <Reveal>
          <span className="text-[11px] uppercase tracking-[0.34em] tabular-nums text-black/45">Drop 001</span>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="text-[clamp(2.4rem,7vw,6rem)] font-semibold leading-[0.9] tracking-[-0.01em]">
            THE <span className="font-serif italic font-normal">Escape</span>
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="max-w-md text-[15px] leading-relaxed text-black/60 md:text-base">
            Designed for those who refuse limitations.
          </p>
        </Reveal>
        <Reveal delay={200}>
          <a
            href="#collection"
            className="mt-2 inline-flex w-fit bg-black px-8 py-3.5 text-[12px] uppercase tracking-[0.15em] text-white transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:opacity-80"
          >
            Shop now
          </a>
        </Reveal>
      </div>
    </section>
  );
}
