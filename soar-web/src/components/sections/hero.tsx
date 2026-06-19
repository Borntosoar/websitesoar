"use client";

import { Magnetic } from "@/components/ui/magnetic";
import { Reveal } from "@/components/ui/reveal";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-svh flex-col overflow-hidden bg-black px-6 text-white md:px-12"
    >
      {/* rising light particles — global atmosphere, reduced-motion safe */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {Array.from({ length: 36 }).map((_, i) => (
          <span
            key={i}
            className="soar-particle"
            style={{
              left: `${(i * 2.8) % 100}%`,
              animationDelay: `${(i % 12) * 0.6}s`,
              animationDuration: `${6 + (i % 6)}s`,
            }}
          />
        ))}
      </div>

      {/* light from darkness — faint radial rising from the bottom-centre */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_100%,rgba(255,255,255,0.10),transparent)]"
        aria-hidden="true"
      />

      {/* editorial column: eyebrow top → headline/lede/cta centred → scroll cue bottom */}
      <div className="relative z-10 flex min-h-svh flex-col pt-[calc(env(safe-area-inset-top)+5.5rem)] pb-safe">
        {/* top eyebrow row with hairline + quiet right-aligned index */}
        <Reveal delay={0}>
          <div className="flex items-baseline gap-4 border-b border-white/10 pb-5">
            <span className="text-[11px] uppercase tracking-[0.34em] text-white/45">
              Born to soar
            </span>
            <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.34em] tabular-nums text-white/45">
              Vol.01 — The Escape
            </span>
          </div>
        </Reveal>

        {/* core statement — off-centre, ascending */}
        <div className="flex flex-1 flex-col justify-center py-16">
          <Reveal delay={80}>
            <h1 className="max-w-[14ch] text-[clamp(3.2rem,13vw,10rem)] font-semibold leading-[0.85] tracking-[-0.02em]">
              Rise <span className="font-serif font-normal italic">above</span>
              <br />
              the box.
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-8 max-w-md text-[15px] leading-relaxed text-white/60 md:text-base">
              Break limitations. Become who you were meant to be.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Magnetic>
                <a
                  href="#collection"
                  className="inline-flex min-h-[44px] items-center bg-white px-8 py-3.5 text-[12px] uppercase tracking-[0.15em] text-black"
                >
                  Shop the drop
                </a>
              </Magnetic>
              <a
                href="#manifesto"
                className="inline-flex min-h-[44px] items-center text-[12px] uppercase tracking-[0.15em] text-white/55 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                The manifesto
              </a>
            </div>
          </Reveal>

          {/* single subtle drop cue — a hairline note, not a full clock */}
          <Reveal delay={240}>
            <p className="mt-12 flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] tabular-nums text-white/35">
              <span className="h-px w-8 bg-white/20" aria-hidden="true" />
              Drop 001 · Thursday 11:00
            </p>
          </Reveal>
        </div>

        {/* refined scroll cue — thin line + label, kept clear of the home indicator */}
        <div className="flex flex-col items-center gap-3 pb-2">
          <span className="h-10 w-px bg-gradient-to-b from-white/30 to-transparent" aria-hidden="true" />
          <span className="text-[10px] uppercase tracking-[0.34em] text-white/40">Scroll</span>
        </div>
      </div>
    </section>
  );
}
