import { Reveal } from "./Reveal";

// The founders' origin — canon from the brand bible §0 (three friends, all-or-
// nothing, "putting in work and not seeing results yet"). Human, overcoming —
// not arrived. Built from typography; no photography needed.
export function Story() {
  return (
    <section id="story" className="border-t border-line">
      <div className="wrap py-24 md:py-36">
        <Reveal>
          <span className="mono text-ash">The origin</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="display mt-8 max-w-[20ch] text-[clamp(2.1rem,6vw,5rem)]">
            Three friends. The same, different situations. One way out.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-16">
          <Reveal delay={0.1}>
            <p className="serif text-[clamp(1.2rem,2.6vw,1.7rem)] italic leading-snug text-ink/85">
              Putting in the work and not seeing the results — yet. That&rsquo;s
              where SOAR started. Not above the struggle. Inside it.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="space-y-5 text-[14px] leading-relaxed text-ash">
              <p>
                SOAR is three friends building the way out — all or nothing. No
                overnight noise, no borrowed hype. A long, deliberate climb,
                earned the same way our people earn theirs.
              </p>
              <p>
                Every piece is premium in the small details, because the small
                details are what add up to the result. Wear it and relate —
                without being judged. The clothes meet you where you are, and
                remind you where you&rsquo;re going.
              </p>
              <p className="text-ink">We haven&rsquo;t arrived either. So we made the thing that gets us there.</p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div className="mt-16 flex items-center gap-4">
            <span className="h-px w-16 bg-line" />
            <span className="mono text-ash">The founders — SOAR</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
