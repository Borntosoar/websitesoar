"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";

/** Thin progress bar tracking page scroll (home only). */
export function ScrollProgress() {
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  if (pathname !== "/") return null;
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[115] h-[2px] w-full origin-left bg-white mix-blend-difference"
      aria-hidden
    />
  );
}
