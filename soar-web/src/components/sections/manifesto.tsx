import { Reveal } from "@/components/ui/reveal";
import { RevealWords } from "@/components/ui/reveal-words";

const tenets = [
  ["01", "We haven't arrived — we're rising.", "SOAR is built inside the struggle, not above it."],
  ["02", "The box is a lie you can leave.", "Every limit is learned. Anything learned can be unlearned."],
  ["03", "Pressure is the price of the breakthrough.", "Growth begins where comfort ends."],
  ["04", "Quiet work outlasts loud noise.", "We don't chase the moment. We build the long climb."],
];

/** The Code — brand manifesto. Editorial statement + a numbered hairline
 *  ledger of the four tenets. Symbol over slogan, monochrome, quiet. */
export function Manifesto() {
  return (
    <section id="manifesto" className="bg-black py-24 text-white md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Statement: eyebrow + index, then the large word-by-word headline */}
        <Reveal>
          <div className="flex items-baseline justify-between border-b border-white/10 pb-5">
            <span className="text-[11px] uppercase tracking-[0.34em] text-white/45">
              The Code
            </span>
            <span className="text-[11px] uppercase tracking-[0.34em] tabular-nums text-white/30">
              01 / 04
            </span>
          </div>
        </Reveal>

        <RevealWords
          text="We were never meant to stay inside the box."
          accentWord="box"
          className="mt-10 max-w-5xl text-[clamp(2.4rem,7vw,6rem)] font-semibold leading-[0.9] tracking-[-0.01em] md:mt-14"
        />

        {/* The four tenets as a numbered, hairline-separated ledger */}
        <div className="mt-16 border-t border-white/10 md:mt-24">
          {tenets.map(([n, title, line], i) => (
            <Reveal key={n} delay={i * 80}>
              <div className="group grid grid-cols-[auto_1fr] items-start gap-x-6 border-b border-white/10 py-9 md:grid-cols-[8rem_1fr_minmax(0,28rem)] md:gap-x-12 md:py-12">
                {/* Oversized index numeral */}
                <span className="select-none text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-none tabular-nums text-white/20 transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-white/50">
                  {n}
                </span>

                {/* Tenet title */}
                <h3 className="text-[clamp(1.35rem,2.6vw,2rem)] font-semibold leading-[1.1] tracking-[-0.01em]">
                  {title}
                </h3>

                {/* Supporting line */}
                <p className="col-start-2 mt-3 max-w-md text-[15px] leading-relaxed text-white/55 md:col-start-3 md:mt-0 md:pt-2">
                  {line}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
