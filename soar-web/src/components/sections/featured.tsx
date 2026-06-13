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
      <div className="relative min-h-[62svh] overflow-hidden bg-black md:min-h-[90svh]">
        <motion.div style={{ y }} className="absolute inset-[-6%] grid place-items-center" >
          <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_35%,#1a1a1a,#000)]" />
          <span className="relative select-none font-semibold text-[26vw] leading-none text-white/[0.06] md:text-[14rem]">001</span>
        </motion.div>
        <span className="absolute bottom-6 left-6 text-[11px] uppercase tracking-[0.2em] text-white/40">Campaign — replace with imagery</span>
      </div>
      <div className="flex flex-col justify-center gap-5 px-6 py-16 md:px-16">
        <Reveal><span className="text-[11px] uppercase tracking-[0.3em] text-black/50">Drop 001</span></Reveal>
        <Reveal delay={80}><h2 className="text-[clamp(2.6rem,6vw,5.5rem)] font-semibold leading-[0.92]">THE ESCAPE</h2></Reveal>
        <Reveal delay={140}><p className="max-w-sm text-black/60">Designed for those who refuse limitations.</p></Reveal>
        <Reveal delay={200}>
          <a href="#collection" className="w-fit bg-black px-8 py-3.5 text-[12px] uppercase tracking-[0.15em] text-white">Shop now</a>
        </Reveal>
      </div>
    </section>
  );
}
