import { Reveal } from "./Reveal";
import { BoxMark } from "./BoxMark";

// Bright editorial hero — typographic, architectural, gallery-quiet. The
// fractured-box → star motif (the SOAR symbol) is rendered in hairlines.

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-svh flex-col justify-between overflow-hidden pt-28 pb-10 md:pt-32">
      {/* top meta row */}
      <Reveal>
        <div className="wrap flex items-center justify-between">
          <span className="mono text-ash">Collection One</span>
          <span className="mono text-ash">Est. Alberta · Canada</span>
        </div>
      </Reveal>

      {/* center statement */}
      <div className="wrap relative">
        <div aria-hidden className="pointer-events-none absolute -top-4 right-2 hidden md:block">
          <BoxMark className="text-ink/30" />
        </div>

        <Reveal>
          <p className="mono mb-7 text-ash">The first release — Drop 001</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="display max-w-[14ch] text-[clamp(3.1rem,11vw,11.5rem)]">
            Growth begins<br />
            where <span className="italic">comfort</span> ends.
          </h1>
        </Reveal>
        <Reveal delay={0.18}>
          <p className="mt-8 max-w-md text-[15px] leading-relaxed text-ash">
            Three pieces, built with intent. A limited first release for those who
            let the work speak — no loud branding, only considered lines.
          </p>
        </Reveal>
      </div>

      {/* bottom row */}
      <Reveal delay={0.26}>
        <div className="wrap flex items-end justify-between">
          <a href="#collection" className="group inline-flex items-center gap-3">
            <span className="mono text-ink">View the collection</span>
            <span className="inline-block h-px w-12 bg-ink transition-all duration-500 group-hover:w-20" />
            <span className="text-ink">↓</span>
          </a>
          <span className="mono hidden text-ash sm:block">003 garments</span>
        </div>
      </Reveal>
    </section>
  );
}