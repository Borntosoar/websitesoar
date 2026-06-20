"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { WaitlistAccess } from "@/components/ui/waitlist-access";

/** UPCOMING FLIGHTS — locked future drops. Silhouettes only; details sealed
 *  until release. Builds anticipation without an ecommerce grid. */
const drops = [
  { n: "002", name: "Nightfall", when: "Autumn", note: "Heavyweight outerwear" },
  { n: "003", name: "Free Fall", when: "Winter", note: "The descent chapter" },
  { n: "004", name: "Open Sky", when: "2027", note: "Sealed" },
];

export function FutureDrops() {
  const [waitOpen, setWaitOpen] = useState(false);

  return (
    <section
      id="upcoming"
      className="bg-white py-24 text-black md:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Editorial header */}
        <header className="mb-14 md:mb-20">
          <Reveal>
            <div className="flex items-center justify-between border-b border-black/10 pb-5">
              <span className="text-[11px] uppercase tracking-[0.34em] text-black/45">
                Upcoming Flights
              </span>
              <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.34em] text-black/45 tabular-nums">
                <Lock size={11} strokeWidth={1.6} aria-hidden />
                Locked
              </span>
            </div>
          </Reveal>
          <div className="mt-8 flex flex-col gap-6 md:mt-10 md:flex-row md:items-end md:justify-between">
            <Reveal delay={80}>
              <h2 className="max-w-3xl text-[clamp(2.4rem,7vw,6rem)] font-semibold leading-[0.9] tracking-[-0.01em]">
                Sealed until <span className="font-serif italic">release</span>.
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="max-w-md text-[15px] leading-relaxed text-black/60 md:text-base">
                Three flights queued on the runway. Silhouettes only — names,
                dates and details stay under lock until each drop breaks.
              </p>
            </Reveal>
          </div>
        </header>

        {/* Locked drop cards */}
        <div className="grid gap-3 md:grid-cols-3">
          {drops.map((d, i) => (
            <Reveal key={d.n} delay={i * 80}>
              <article className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden border border-black/10 bg-black p-6 text-white">
                {/* Light from dark */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_30%,rgba(255,255,255,0.10),transparent)] opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                />
                {/* Oversized watermark drop number — blur→clear on hover */}
                <div className="absolute inset-0 grid place-items-center">
                  <span className="select-none text-[34vw] font-semibold leading-none tabular-nums text-white/[0.05] blur-[3px] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-white/[0.08] group-hover:blur-[1px] md:text-[12rem]">
                    {d.n}
                  </span>
                </div>

                {/* Top row — index + lock cue */}
                <div className="relative z-10 flex items-center justify-between text-[11px] uppercase tracking-[0.28em] text-white/45">
                  <span className="tabular-nums">Drop {d.n}</span>
                  <span className="flex items-center gap-2 tabular-nums">
                    {String(i + 2).padStart(2, "0")} / 04
                    <Lock size={13} strokeWidth={1.6} aria-hidden />
                  </span>
                </div>

                {/* Bottom block — coming/locked framing + CTA */}
                <div className="relative z-10">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/35">
                    Coming
                  </span>
                  <h3 className="mt-2 text-2xl font-semibold leading-[0.95] md:text-3xl">
                    {d.name}
                  </h3>
                  <p className="mt-2 text-[12px] uppercase tracking-[0.14em] tabular-nums text-white/45">
                    {d.note} — {d.when}
                  </p>
                  <button
                    type="button"
                    onClick={() => setWaitOpen(true)}
                    className="mt-6 inline-flex items-center gap-2 border border-white/30 px-6 py-3.5 text-[11px] uppercase tracking-[0.15em] text-white/80 transition-colors duration-300 hover:border-white hover:text-white active:scale-[0.98]"
                  >
                    <Lock size={12} strokeWidth={1.8} aria-hidden /> Get notified
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      <WaitlistAccess open={waitOpen} onClose={() => setWaitOpen(false)} />
    </section>
  );
}
