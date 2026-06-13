"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin progress bar tracking page scroll. mix-blend keeps it visible on both
 *  black and white sections. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[115] h-[2px] w-full origin-left bg-white mix-blend-difference"
      aria-hidden
    />
  );
}
