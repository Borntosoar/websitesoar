"use client";

import { Lock } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

/** UPCOMING FLIGHTS — locked future drops. Silhouettes only; details sealed
 *  until release. Builds anticipation without an ecommerce grid. */
const drops = [
  { n: "002", name: "Nightfall", when: "Autumn", note: "Heavyweight outerwear" },
  { n: "003", name: "Free Fall", when: "Winter", note: "The descent chapter" },
  { n: "004", name: "Open Sky", when: "2027", note: "Sealed" },
];

export function FutureDrops() {
  return (
    <section id="upcoming" className="bg-white py-20 text-black md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-12">
        <div className="mb-12 flex items-center justify-between border-b border-black/10 pb-5 text-[11px] uppercase tracking-[0.2em] text-black/50">
          <span>Upcoming Flights</span>
          <span>Locked</span>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {drops.map((d, i) => (
            <Reveal key={d.n} delay={i * 90}>
              <article className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden bg-black p-6 text-white">
                <div className="absolute inset-0 grid place-items-center">
                  <span className="select-none text-[34vw] font-semibold leading-none text-white/[0.05] blur-[2px] transition-all duration-700 group-hover:blur-0 md:text-[12rem] tabular-nums">
                    {d.n}
                  </span>
                </div>
                <div className="relative z-10 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-white/45">
                  <span className="tabular-nums">Drop {d.n}</span>
                  <Lock size={13} strokeWidth={1.6} />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-semibold md:text-3xl">{d.name}</h3>
                  <p className="mt-1 text-[12px] uppercase tracking-[0.14em] text-white/45 tabular-nums">
                    {d.note} — {d.when}
                  </p>
                  <button
                    type="button"
                    className="mt-5 inline-flex items-center gap-2 border border-white/30 px-6 py-3.5 text-[11px] uppercase tracking-[0.15em] text-white/80 transition-colors hover:border-white hover:text-white active:scale-[0.98] transition-transform"
                  >
                    <Lock size={12} strokeWidth={1.8} /> Get notified
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
