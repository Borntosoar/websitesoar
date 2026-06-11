"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/** A trailing ring that follows the cursor (mix-blend so it reads on any
 *  background) and swells over interactive elements. Desktop / fine-pointer
 *  only; the native cursor stays for usability. */
export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const scale = useMotionValue(1);
  const rx = useSpring(x, { stiffness: 350, damping: 28, mass: 0.4 });
  const ry = useSpring(y, { stiffness: 350, damping: 28, mass: 0.4 });
  const rs = useSpring(scale, { stiffness: 300, damping: 20 });

  useEffect(() => {
    if (matchMedia("(pointer: coarse)").matches) return;
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest?.("a,button,input,[data-cursor-grow]");
      scale.set(el ? 2.6 : 1);
    };
    addEventListener("mousemove", move);
    addEventListener("mouseover", over);
    return () => {
      removeEventListener("mousemove", move);
      removeEventListener("mouseover", over);
    };
  }, [x, y, scale]);

  return (
    <motion.div
      aria-hidden
      style={{ x: rx, y: ry, scale: rs }}
      className="pointer-events-none fixed -left-[9px] -top-[9px] z-[200] hidden h-[18px] w-[18px] rounded-full border border-white mix-blend-difference md:block"
    />
  );
}
