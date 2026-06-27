import { Reveal } from "./Reveal";
import { HeroBackdrop } from "./HeroBackdrop";

// Full-screen campaign hero — a procedural monochrome ascent scene (the road →
// north star motif, alive) behind centered copy + a ghost CTA. A real campaign
// film can replace the backdrop later; this stands in, on-brand and free.
export function Hero() {
  return (
    <section id="top" className="on-dark relative flex min-h-svh flex-col items-center justify-end overflow-hidden bg-pitch pb-[13vh] text-center text-paper">
      {/* living backdrop — the road climbing toward the star */}
      <HeroBackdrop />
      {/* legibility — darken the lower band where the copy sits */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(11,10,9,0.3)_0%,transparent_28%,transparent_52%,rgba(11,10,9,0.88)_100%)]" />

      <div className="relative z-10 flex flex-col items-center gap-6 px-6">
        <Reveal>
          <p className="mono text-paper/60">Collection One — Drop 001</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="display text-[clamp(3rem,8.5vw,7.4rem)]">
            Born to <span className="italic">soar</span>.
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="max-w-md text-[14px] leading-relaxed text-paper/65">
            Three pieces to begin with. An edition of 200 — individually numbered, made once, and not again.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <a
            href="#collection"
            className="mono mt-2 border border-paper/55 px-12 py-4 text-paper transition-colors hover:bg-paper hover:text-ink"
          >
            Shop the drop
          </a>
        </Reveal>
      </div>

      <div className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2">
        <span className="mono text-paper/40">Scroll</span>
      </div>
    </section>
  );
}
