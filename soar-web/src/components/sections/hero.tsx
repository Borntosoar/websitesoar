"use client";

import { motion } from "framer-motion";
import { Magnetic } from "@/components/ui/magnetic";

export function Hero() {
  return (
    <section id="hero" className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-black px-6 text-center text-white">
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 36 }).map((_, i) => (
          <span
            key={i}
            className="soar-particle"
            style={{ left: `${(i * 2.8) % 100}%`, animationDelay: `${(i % 12) * 0.6}s`, animationDuration: `${6 + (i % 6)}s` }}
          />
        ))}
      </div>
      <motion.span initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="text-[11px] uppercase tracking-[0.4em] text-white/50">
        Born to soar
      </motion.span>
      <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.35 }} className="mt-4 text-[clamp(3.5rem,15vw,12rem)] font-semibold leading-[0.85] tracking-tight">
        SOAR
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }} className="mt-6 max-w-md text-white/60">
        Break limitations. Become who you were meant to be.
      </motion.p>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }} className="mt-9 flex flex-wrap justify-center gap-3">
        <Magnetic>
          <a href="#collection" className="bg-white px-8 py-3.5 text-[12px] uppercase tracking-[0.15em] text-black">Shop collection</a>
        </Magnetic>
        <Magnetic>
          <a href="#the-box" className="border border-white/40 px-8 py-3.5 text-[12px] uppercase tracking-[0.15em] text-white transition-colors hover:bg-white hover:text-black">Discover SOAR</a>
        </Magnetic>
      </motion.div>
      <a href="#featured" className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.2em] text-white/40">Scroll</a>
    </section>
  );
}
