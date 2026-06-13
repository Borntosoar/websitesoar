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

function Tile({ initial, handle }: { initial: string; handle: string }) {
  return (
    <a
      href="#"
      className="group relative grid aspect-square w-[42vw] shrink-0 place-items-end overflow-hidden border border-white/10 bg-black p-3 sm:w-[26vw] md:w-[18vw] lg:w-[15vw]"
    >
      <span className="pointer-events-none absolute inset-0 grid place-items-center text-[5rem] font-semibold text-white/[0.06] transition-transform duration-700 group-hover:scale-110">
        {initial}
      </span>
      <span className="relative z-10 text-[11px] uppercase tracking-[0.14em] text-white/55 transition-colors group-hover:text-white">
        {handle}
      </span>
    </a>
  );
}

function Row({ reverse }: { reverse?: boolean }) {
  const loop = [...flock, ...flock];
  return (
    <div className="flex w-max gap-3" style={{ animation: `flock-scroll ${reverse ? "55s" : "48s"} linear infinite`, animationDirection: reverse ? "reverse" : "normal" }}>
      {loop.map(([initial, handle], i) => (
        <Tile key={`${handle}-${i}`} initial={initial} handle={handle} />
      ))}
    </div>
  );
}

export function TheFlock() {
  return (
    <section id="community" className="overflow-hidden bg-black py-20 text-white md:py-28">
      <div className="mx-auto mb-12 flex max-w-7xl items-end justify-between px-5 md:px-12">
        <div>
          <span className="text-[11px] uppercase tracking-[0.3em] text-white/40">The Flock</span>
          <h2 className="mt-3 text-[clamp(2.4rem,7vw,5rem)] font-semibold leading-[0.92]">
            Those who left the box.
          </h2>
        </div>
        <a href="#" className="hidden shrink-0 text-[12px] uppercase tracking-[0.15em] text-white/60 underline-offset-4 hover:text-white hover:underline md:block">
          Tag #BornToSoar
        </a>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
          <Row />
        </div>
        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
          <Row reverse />
        </div>
      </div>
      <Reveal className="mx-auto mt-14 max-w-7xl px-5 md:px-12">
        <a href="#" className="text-[12px] uppercase tracking-[0.15em] text-white/60 underline-offset-4 hover:text-white hover:underline md:hidden">
          Tag #BornToSoar to join the wall
        </a>
      </Reveal>
    </section>
  );
}
