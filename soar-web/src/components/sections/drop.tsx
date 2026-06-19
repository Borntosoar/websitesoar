import { Countdown } from "@/components/ui/countdown";
import { Reveal } from "@/components/ui/reveal";

export function Drop() {
  return (
    <section id="drop" className="relative overflow-hidden bg-espresso py-24 text-bone md:py-36">
      {/* Light from darkness — faint radial, never coloured */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_0%,rgba(255,255,255,0.07),transparent)]"
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        {/* Section header — eyebrow + index, hairline */}
        <Reveal>
          <div className="flex items-center justify-between border-b border-bone/10 pb-5 text-[11px] uppercase tracking-[0.34em] tabular-nums text-bone/45">
            <span>The Drop</span>
            <span>01 / 04</span>
          </div>
        </Reveal>

        {/* DROP 001 lockup + Section-H2 */}
        <div className="mt-12 grid gap-10 md:grid-cols-[1.25fr_1fr] md:items-end">
          <div>
            <Reveal>
              <span className="text-[11px] uppercase tracking-[0.34em] tabular-nums text-bone/45">
                Limited release
              </span>
            </Reveal>
            <Reveal delay={80}>
              <div className="mt-4 flex items-baseline gap-[0.18em] leading-[0.82]">
                <span className="text-[clamp(2.4rem,7vw,6rem)] font-semibold tracking-[-0.01em]">
                  DROP
                </span>
                <span className="text-[clamp(2.4rem,7vw,6rem)] font-semibold tracking-[-0.01em] tabular-nums">
                  001
                </span>
              </div>
            </Reveal>
            <Reveal delay={160}>
              <h2 className="mt-4 text-[clamp(2.4rem,7vw,6rem)] font-semibold leading-[0.9] tracking-[-0.01em]">
                Ascension <span className="font-serif font-normal italic">Vol.01</span>
              </h2>
            </Reveal>
          </div>

          {/* Countdown — quiet, right-aligned on desktop */}
          <Reveal delay={160}>
            <div className="md:pb-2">
              <span className="text-[11px] uppercase tracking-[0.34em] text-bone/45">Next drop in</span>
              <div className="mt-4">
                <Countdown />
              </div>
            </div>
          </Reveal>
        </div>

        {/* Lede + single primary CTA */}
        <div className="mt-12 grid gap-10 md:grid-cols-[1.25fr_1fr] md:items-start">
          <div>
            <Reveal delay={80}>
              <p className="max-w-md text-[15px] leading-relaxed text-bone/60 md:text-base">
                Four numbered essentials. Two hundred of each, released together,
                once. When the timer reaches zero the drop goes live — and when
                they&apos;re gone, they&apos;re gone.
              </p>
            </Reveal>
            <Reveal delay={160}>
              <a
                href="#shop"
                className="mt-8 inline-flex w-fit bg-bone px-8 py-3.5 text-[12px] uppercase tracking-[0.15em] text-ink transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:opacity-80"
              >
                Preview the collection
              </a>
            </Reveal>
          </div>

          {/* Lead piece — refined scarcity meter */}
          <Reveal delay={240}>
            <aside className="border border-bone/10 p-6">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.34em] tabular-nums text-bone/45">
                <span>Lead piece</span>
                <span>No. 01 / 04</span>
              </div>

              <div className="relative my-6 grid aspect-[16/10] place-items-center overflow-hidden border border-bone/10 bg-white/[0.03]">
                <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_45%,rgba(255,255,255,0.06),transparent)]" />
                <span className="relative select-none font-serif text-6xl leading-none text-bone/30">
                  S
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <h3 className="font-medium">Ascension Hoodie</h3>
                <span className="text-lg tabular-nums">$280</span>
              </div>

              {/* Progress meter */}
              <div className="mt-5">
                <div
                  className="h-[3px] w-full bg-bone/15"
                  role="progressbar"
                  aria-valuenow={184}
                  aria-valuemin={0}
                  aria-valuemax={200}
                  aria-label="184 of 200 reserved"
                >
                  <div className="h-full bg-bone" style={{ width: "92%" }} />
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-[0.34em] tabular-nums text-bone/45">
                  <span>Reserved</span>
                  <span>92%</span>
                </div>
              </div>

              <span className="mt-4 block text-[11px] uppercase tracking-[0.34em] tabular-nums text-bone/45">
                184 / 200 reserved — one per customer
              </span>
            </aside>
          </Reveal>
        </div>

        {/* Provenance hairline row */}
        <Reveal delay={80}>
          <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-bone/10 pt-6 text-[11px] uppercase tracking-[0.34em] text-bone/45">
            <li>Numbered &amp; authenticated</li>
            <li>Organic, traceable cloth</li>
            <li>30-day returns</li>
            <li>Secure checkout</li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
