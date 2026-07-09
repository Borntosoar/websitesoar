import { HeroFilm } from "./HeroFilm";

// Cinema hero — the SOAR emblem film runs full-bleed (object-cover), edge to
// edge on phone and desktop. The mark lives upper-centre and clears every crop;
// a lower scrim carries the tagline + CTA without ever dimming the emblem.
export function RepresentHero() {
  return (
    <section id="top" className="on-dark relative h-[82svh] w-full overflow-hidden bg-[#0b0a09] text-paper md:h-svh">
      {/* the film, filling the frame */}
      <HeroFilm className="absolute inset-0" />

      {/* depth around the mark + a base scrim, kept below the emblem so it never dims it */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_92%_at_50%_38%,transparent_46%,rgba(0,0,0,0.5))]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

      {/* tagline + CTA, pinned low, clear of the emblem */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-6 pb-[9svh] text-center">
        {/* the title beat — rises in as the flare hits (~3s into the 6s loop), then out */}
        <div className="hero-beat flex flex-col items-center">
          <h1 className="display text-[clamp(2rem,5.4vw,3.6rem)] [text-shadow:0_2px_18px_rgba(0,0,0,0.7)]">
            Born to <span className="italic">soar</span>.
          </h1>
          <p className="mono mt-3 text-[0.72rem] tracking-[0.34em] text-paper/90 [text-shadow:0_1px_12px_rgba(0,0,0,0.8)]">· Edition of 200 ·</p>
        </div>
        <a
          href="#collection"
          className="mono hero-rise mt-8 border border-paper/50 bg-black/25 px-12 py-3.5 text-paper backdrop-blur-sm transition-colors hover:bg-paper hover:text-ink [text-shadow:0_1px_10px_rgba(0,0,0,0.55)]"
          style={{ animationDelay: "0.16s" }}
        >
          Shop Now
        </a>
      </div>
    </section>
  );
}
