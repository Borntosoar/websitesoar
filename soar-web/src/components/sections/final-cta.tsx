"use client";

import { useRef, useState, type FormEvent } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/** Final CTA — the close. The box was never real. A bird grows toward the
 *  camera as you scroll in, the wordmark lands, and the flight invite captures
 *  the email. Black & white. */
export function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const birdScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.25, 1.2, 3.4]);
  const birdOpacity = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [0, 0.9, 0.9, 0]);
  const birdY = useTransform(scrollYProgress, [0, 1], ["18%", "-22%"]);

  const [done, setDone] = useState(false);
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDone(true);
    e.currentTarget.reset();
  }

  return (
    <section ref={ref} id="born" className="relative flex min-h-[120svh] items-center justify-center overflow-hidden bg-black px-6 text-center text-white">
      {/* bird flying toward camera */}
      <motion.svg
        aria-hidden
        viewBox="0 0 24 24"
        style={{ scale: birdScale, opacity: birdOpacity, y: birdY }}
        className="pointer-events-none absolute w-[40vw] max-w-[520px]"
        fill="none"
        stroke="white"
        strokeWidth={0.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M1.5 13 C5 7 8 7 12 11.5 C16 7 19 7 22.5 13" />
        <path d="M5.5 11.6 C8 9.6 10 9.8 12 11.5 C14 9.8 16 9.6 18.5 11.6" opacity={0.5} />
      </motion.svg>

      <div className="relative z-10 flex flex-col items-center gap-6">
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-[11px] uppercase tracking-[0.4em] text-white/50"
        >
          The box was never real
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="text-[clamp(3rem,13vw,11rem)] font-semibold leading-[0.85] tracking-tight"
        >
          BORN TO SOAR
        </motion.h2>

        {done ? (
          <p className="mt-2 text-[12px] uppercase tracking-[0.2em] text-white/70">
            You&apos;re on the flight — watch your inbox.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-2 flex w-full max-w-[380px] gap-2">
            <input
              type="email"
              required
              placeholder="Email address"
              aria-label="Email address"
              className="min-w-0 flex-1 border-b border-white/30 bg-transparent px-1 py-2.5 text-center text-sm tracking-[0.12em] text-white outline-none placeholder:text-white/30 focus:border-white"
            />
            <button type="submit" className="bg-white px-6 py-2.5 text-[12px] uppercase tracking-[0.15em] text-black transition-opacity hover:opacity-80">
              Join the flight
            </button>
          </form>
        )}
      </div>

      <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.2em] text-white/30">
        SOAR® — Made to rise
      </span>
    </section>
  );
}
