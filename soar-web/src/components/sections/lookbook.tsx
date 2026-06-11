"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const looks = [
  { idx: "01", title: "The Waiting Room", note: "Where it starts" },
  { idx: "02", title: "Pressure", note: "Before the break" },
  { idx: "03", title: "Breakthrough", note: "The moment" },
  { idx: "04", title: "Ascent", note: "After" },
  { idx: "05", title: "Reach Back", note: "For the next one" },
];

/** Drag-to-explore editorial lookbook — the brand's emotional arc as a rail. */
export function Lookbook() {
  const track = useRef<HTMLDivElement>(null);
  const [max, setMax] = useState(0);

  useEffect(() => {
    const calc = () => {
      if (track.current) setMax(Math.max(0, track.current.scrollWidth - track.current.offsetWidth));
    };
    calc();
    addEventListener("resize", calc);
    return () => removeEventListener("resize", calc);
  }, []);

  return (
    <section id="lookbook" className="overflow-hidden bg-espresso py-20 text-bone md:py-28">
      <div className="mb-10 flex items-center justify-between px-5 md:px-12">
        <span className="text-[11px] uppercase tracking-[0.2em] text-bone/55">Lookbook — the arc</span>
        <span className="text-[11px] uppercase tracking-[0.2em] text-bone/55">Drag to explore →</span>
      </div>
      <motion.div
        ref={track}
        drag="x"
        dragConstraints={{ left: -max, right: 0 }}
        dragElastic={0.08}
        className="flex w-max cursor-grab gap-4 px-5 active:cursor-grabbing md:gap-6 md:px-12"
        data-cursor-grow
      >
        {looks.map((l, i) => (
          <div
            key={l.idx}
            className="relative h-[64svh] w-[78vw] shrink-0 overflow-hidden md:w-[34vw]"
            style={{
              background:
                i % 2
                  ? "radial-gradient(80% 60% at 70% 10%, rgba(230,197,102,0.12), transparent 60%), linear-gradient(160deg,#2A251F,#15120E)"
                  : "linear-gradient(160deg,#262119,#1A160F)",
            }}
          >
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <span className="font-serif text-[7rem] italic text-bone/[0.06]">{l.idx}</span>
            </div>
            <div className="absolute bottom-0 left-0 p-7">
              <span className="text-[11px] uppercase tracking-[0.18em] text-bone/55">{l.note}</span>
              <h3 className="mt-1 text-2xl font-medium md:text-3xl">{l.title}</h3>
              <span className="mt-3 inline-block text-[11px] uppercase tracking-[0.14em] underline underline-offset-4 opacity-70">
                View look
              </span>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
