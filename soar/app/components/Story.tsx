import { Reveal } from "./Reveal";

// The founders' origin — canon from the brand bible §0, told plainly. Human and
// unfinished, not a highlight reel.
export function Story() {
  return (
    <section id="story" className="border-t border-line">
      <div className="wrap py-24 md:py-36">
        <Reveal>
          <span className="mono text-ash">The origin</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="display mt-8 max-w-[20ch] text-[clamp(2.1rem,6vw,5rem)]">
            Three friends, a long way from finished.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-16">
          <Reveal delay={0.1}>
            <p className="lede text-ink/85">
              We started SOAR in the middle of figuring our own lives out — not at
              the top of anything.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="space-y-5 text-[14px] leading-relaxed text-ash">
              <p>
                Three of us, from different versions of the same situation. We
                made the clothes we wanted to wear while we worked, and we&rsquo;re
                building the brand the slow way — small runs, real attention to the
                details most people skip.
              </p>
              <p className="text-ink">
                You don&rsquo;t have to have it all figured out to wear it. Neither
                do we.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div className="mt-16 flex items-center gap-4">
            <span className="h-px w-16 bg-line" />
            <span className="mono text-ash">SOAR · Alberta</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
