"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const VIDEO_URL = process.env.NEXT_PUBLIC_ENTRANCE_VIDEO_URL ?? null;

export default function EntranceGate() {
  const [gateOpen, setGateOpen] = useState<boolean | null>(null);
  const [wordmarkVisible, setWordmarkVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);
  const wordmarkFired = useRef(false);
  const ctaFired = useRef(false);

  useEffect(() => {
    const entered = sessionStorage.getItem("soar_entered");
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Defer setState to avoid synchronous setState-in-effect
    timers.push(setTimeout(() => setGateOpen(!entered), 0));

    if (!entered && !VIDEO_URL) {
      timers.push(setTimeout(() => setWordmarkVisible(true), 600));
      timers.push(setTimeout(() => setCtaVisible(true), 2000));
    }

    return () => timers.forEach(clearTimeout);
  }, []);

  function triggerWordmark() {
    if (wordmarkFired.current) return;
    wordmarkFired.current = true;
    setWordmarkVisible(true);
  }

  function triggerCta() {
    if (ctaFired.current) return;
    ctaFired.current = true;
    setCtaVisible(true);
  }

  function handleTimeUpdate(e: React.SyntheticEvent<HTMLVideoElement>) {
    const v = e.currentTarget;
    if (
      !wordmarkFired.current &&
      v.duration > 0 &&
      v.currentTime >= v.duration * 0.45
    ) {
      triggerWordmark();
    }
  }

  function handleEnter() {
    sessionStorage.setItem("soar_entered", "1");
    setGateOpen(false);
  }

  // null = not yet checked (prevents SSR flash)
  if (gateOpen === null) return null;

  return (
    <AnimatePresence>
      {gateOpen && (
        <motion.div
          key="entrance"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black"
        >
          {VIDEO_URL ? (
            <video
              src={VIDEO_URL}
              autoPlay
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => triggerCta()}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black" />
          )}

          {/* Vignette */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.75)_100%)]" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <motion.h1
              initial={{ opacity: 0, letterSpacing: "0.5em" }}
              animate={
                wordmarkVisible
                  ? { opacity: 1, letterSpacing: "0.05em" }
                  : {}
              }
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="font-display select-none text-[18vw] leading-none text-white sm:text-[14vw] md:text-[10vw]"
            >
              SOAR
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={wordmarkVisible ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-3 text-[10px] uppercase tracking-[0.4em] text-white/40"
            >
              Growth begins where comfort ends.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 6 }}
              animate={ctaVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              onClick={handleEnter}
              className="mt-12 text-xs uppercase tracking-[0.4em] text-white/60 transition-colors hover:text-white"
            >
              Begin Ascent →
            </motion.button>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 5 }}
              onClick={handleEnter}
              className="mt-6 text-[10px] uppercase tracking-[0.3em] text-white/25 transition-colors hover:text-white/50"
            >
              Skip
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
