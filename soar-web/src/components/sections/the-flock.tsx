"use client";

import { Reveal } from "@/components/ui/reveal";

/** THE FLOCK — community wall. Two infinite rows scrolling opposite ways.
 *  Tiles are placeholders (initial + handle) until real member photos exist. */
const flock = [
  ["AYO", "@ayo.rises"],
  ["MILA", "@milaflies"],
  ["KOJO", "@kojo.soar"],
  ["NIA", "@nia.unboxed"],
  ["REMI", "@remi.ascends"],
  ["ZARA", "@zara.nofence"],
  ["TARIQ", "@tariq.flight"],
  ["IMANI", "@imani.rise"],
  ["DRE", "@dre.breaks.out"],
  ["SADE", "@sade.aloft"],
];

const EDGE_FADE =
  "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)";

function Tile({ initial, handle }: { initial: string; handle: string }) {
  return (
    <a
      href="#"
      className="group relative grid aspect-square w-[42vw] shrink-0 place-items-end overflow-hidden border border-white/10 bg-black p-3 transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-white/25 sm:w-[26vw] md:w-[18vw] lg:w-[15vw]"
    >
      {/* faint radial — light from dark */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 30%, rgba(255,255,255,0.08), transparent)",
        }}
      />
      <span className="pointer-events-none absolute inset-0 grid place-items-center text-[5rem] font-semibold text-white/[0.06] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110">
        {initial}
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute right-3 top-3 h-[3px] w-[3px] rounded-full bg-white/25 transition-colors duration-300 group-hover:bg-white/50"
      />
      <span className="relative z-10 text-[11px] uppercase tracking-[0.14em] text-white/55 transition-colors duration-300 group-hover:text-white">
        {handle}
      </span>
    </a>
  );
}

function Row({ reverse }: { reverse?: boolean }) {
  const loop = [...flock, ...flock];
  return (
    <div
      className="flex w-max gap-3"
      style={{
        animation: `flock-scroll ${reverse ? "55s" : "48s"} linear infinite`,
        animationDirection: reverse ? "reverse" : "normal",
      }}
    >
      {loop.map(([initial, handle], i) => (
        <Tile key={`${handle}-${i}`} initial={initial} handle={handle} />
      ))}
    </div>
  );
}

export function TheFlock() {
  return (
    <section
      id="community"
      className="overflow-hidden bg-black py-24 text-white md:py-36"
    >
      <div className="mx-auto mb-14 max-w-7xl px-6 md:mb-20 md:px-12">
        <Reveal className="flex items-center justify-between gap-4">
          <span className="text-[11px] uppercase tracking-[0.34em] text-white/45">
            The Flock
          </span>
          <span className="text-[11px] uppercase tracking-[0.34em] tabular-nums text-white/30">
            05 / 06
          </span>
        </Reveal>
        <div className="mt-6 flex items-end justify-between gap-8">
          <Reveal delay={80}>
            <h2 className="max-w-[14ch] text-[clamp(2.4rem,7vw,6rem)] font-semibold leading-[0.9] tracking-[-0.01em]">
              Those who left the box.
            </h2>
          </Reveal>
          <Reveal delay={160} className="hidden shrink-0 pb-2 md:block">
            <a
              href="#"
              className="text-[12px] uppercase tracking-[0.15em] text-white/60 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              Tag #BornToSoar
            </a>
          </Reveal>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div
          className="flex overflow-hidden"
          style={{ maskImage: EDGE_FADE, WebkitMaskImage: EDGE_FADE }}
        >
          <Row />
        </div>
        <div
          className="flex overflow-hidden"
          style={{ maskImage: EDGE_FADE, WebkitMaskImage: EDGE_FADE }}
        >
          <Row reverse />
        </div>
      </div>

      <Reveal className="mx-auto mt-16 max-w-7xl px-6 md:hidden">
        <a
          href="#"
          className="text-[12px] uppercase tracking-[0.15em] text-white/60 underline-offset-4 hover:text-white hover:underline"
        >
          Tag #BornToSoar to join the wall
        </a>
      </Reveal>
    </section>
  );
}
