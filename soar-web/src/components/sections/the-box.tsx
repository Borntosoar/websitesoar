"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const BoxChapterScene = dynamic(
  () => import("@/components/ui/box-chapter-scene").then((m) => m.BoxChapterScene),
  { ssr: false },
);

const words = ["Fear", "Doubt", "Expectations", "Conformity", "Breakthrough", "Flight"];

export function TheBox() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  const [word, setWord] = useState(0);

  // only render the 3D film while the section is on screen
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} id="the-box" className="relative h-svh min-h-[640px] overflow-hidden bg-black text-white">
      {/* autoplaying fiber cinematic — plays like a video, no scroll needed */}
      <div className="absolute inset-0">
        <BoxChapterScene active={active} onWord={setWord} />
      </div>

      {/* gentle vignette so the type stays legible over the white floods */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_50%,transparent_55%,rgba(0,0,0,0.45))]" />

      <span className="pointer-events-none absolute left-1/2 top-[12vh] -translate-x-1/2 text-[11px] uppercase tracking-[0.4em] text-white/55 mix-blend-difference">
        The Box
      </span>

      {/* chapter word, timed to the 3D clock */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.h2
            key={word}
            initial={{ opacity: 0, y: 26, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -26, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(3rem,12vw,9rem)] font-semibold leading-none tracking-tight mix-blend-difference"
          >
            {words[word]}
          </motion.h2>
        </AnimatePresence>
      </div>

      {/* the line lands on the breakthrough / flight */}
      <AnimatePresence>
        {word >= 4 && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute bottom-[12vh] left-1/2 w-full max-w-3xl -translate-x-1/2 px-6 text-center text-[clamp(1.1rem,3vw,1.9rem)] font-medium leading-tight text-white mix-blend-difference"
          >
            You were never meant to stay inside the box.
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  );
}
