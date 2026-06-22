"use client";

import { motion, useReducedMotion } from "framer-motion";

/** The SOAR mark — a box that fractures open, a star escaping — drawing itself
 *  in hairline by hairline (feel-before-read). Static under reduced motion. */
export function BoxMark({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const line = (delay: number, duration = 1.3) =>
    reduce
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          whileInView: { pathLength: 1, opacity: 1 },
          viewport: { once: true },
          transition: { duration, ease: "easeInOut" as const, delay },
        };

  return (
    <svg width="150" height="150" viewBox="0 0 150 150" fill="none" className={className} aria-hidden="true">
      <motion.path d="M20 12 H138 V108" stroke="currentColor" strokeWidth="1" {...line(0)} />
      <motion.path d="M12 20 V138 H120" stroke="currentColor" strokeWidth="1" {...line(0.15)} />
      <motion.path d="M120 138 L150 120" stroke="currentColor" strokeWidth="1" {...line(1.0, 0.5)} />
      <motion.path d="M138 108 L150 96" stroke="currentColor" strokeWidth="1" {...line(1.1, 0.5)} />
      <motion.path
        d="M132 26 l3 9 9 3 -9 3 -3 9 -3 -9 -9 -3 9 -3 z"
        fill="currentColor"
        className="text-ink/55"
        initial={reduce ? false : { scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1], delay: 1.45 }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
    </svg>
  );
}
