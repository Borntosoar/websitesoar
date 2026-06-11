"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useRef } from "react";

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

const items = ["Rise above", "Soar", "Ascension Vol.01", "Made to a 110% standard"];

/** Marquee whose speed and direction react to scroll velocity. */
export function Marquee() {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smooth = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smooth, [0, 1000], [0, 5], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    let moveBy = dir.current * 2.4 * (delta / 1000);
    if (velocityFactor.get() < 0) dir.current = -1;
    else if (velocityFactor.get() > 0) dir.current = 1;
    moveBy += dir.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden border-y border-ink/10 bg-oat py-3">
      <motion.div style={{ x }} className="flex w-max whitespace-nowrap">
        {[0, 1, 2, 3].map((set) => (
          <span key={set} className="flex items-center">
            {items.map((t, i) => (
              <span key={i} className="flex items-center gap-8 pr-8 text-sm font-medium tracking-tight text-ink/80">
                <span className={i % 2 ? "font-serif italic text-ink/55" : ""}>{t}</span>
                <span className="text-taupe">—</span>
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
