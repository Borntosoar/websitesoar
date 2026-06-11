"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function Stat({ to, suffix, label }: { to: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <div className="flex flex-col gap-2">
      <span ref={ref} className="font-serif text-4xl leading-none md:text-6xl">
        {Math.round(val)}
        {suffix}
      </span>
      <span className="text-[11px] uppercase tracking-[0.17em] text-taupe">{label}</span>
    </div>
  );
}

/** Count-up "by the numbers" band — animates on scroll into view. */
export function Stats() {
  return (
    <section className="border-y border-ink/10 bg-oat py-20 text-ink md:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-5 md:grid-cols-4 md:px-12">
        <Stat to={3} label="Founders" />
        <Stat to={200} label="Per run" />
        <Stat to={14} label="Countries" />
        <Stat to={110} suffix="%" label="The standard" />
      </div>
    </section>
  );
}
