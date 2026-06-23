import { Reveal } from "./Reveal";
import { BoxMark } from "./BoxMark";

// Represent-style full-screen campaign hero — dark, centered, ghost CTA. The
// SOAR mark sits large and faint behind (a real campaign image/video drops in
// here later).
export function Hero() {
  return (
    <section id="top" className="on-dark relative flex min-h-svh flex-col items-center justify-end overflow-hidden bg-pitch pb-[13vh] text-center text-paper">
      {/* faint mark backdrop */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <BoxMark className="h-[46vmin] w-[46vmin] text-paper/[0.08]" />
      </div>
      {/* depth */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_30%,transparent_45%,rgba(0,0,0,0.6))]" />

      <div className="relative z-10 flex flex-col items-center gap-6 px-6">
        <Reveal>
          <p className="mono text-paper/60">Collection One — Drop 001</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="display text-[clamp(2.8rem,8vw,7rem)]">
            The long way <span className="italic">up</span>.
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

      {/* scroll hint */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
        <span className="mono text-paper/40">Scroll</span>
      </div>
    </section>
  );
}
