import { Reveal } from "./Reveal";

// How SOAR makes things — ownable ethos, stated plainly. Replaces the old
// motivational arc. Quiet, specific, a touch dry.
const PRINCIPLES = [
  { n: "01", word: "Small numbers.", line: "Each piece in a single run, individually numbered, never restocked. When it's gone, it's gone." },
  { n: "02", word: "Built to last.", line: "Heavyweight fabrics, clean construction, tonal hardware. Made to be worn for years — not posted once." },
  { n: "03", word: "The slow way.", line: "Drawn and developed in-house in Alberta. We take the long way on purpose, and we're in no hurry." },
];

export function AscentSequence() {
  return (
    <section id="approach" className="border-t border-line">
      <div className="wrap py-24 md:py-36">
        <Reveal>
          <div className="mb-14 flex items-baseline justify-between md:mb-20">
            <span className="mono text-ash">The approach</span>
            <span className="mono text-ash">Less, made better</span>
          </div>
        </Reveal>

        <div>
          {PRINCIPLES.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.04}>
              <div className="group grid grid-cols-[auto_1fr] items-start gap-x-6 border-b border-line py-8 md:grid-cols-[5rem_1fr_minmax(0,34ch)] md:gap-x-10 md:py-12">
                <span className="mono pt-3 text-ash transition-colors group-hover:text-ink md:pt-5">{s.n}</span>
                <h3 className="display text-[clamp(2.1rem,6.5vw,5rem)] transition-transform duration-500 ease-out group-hover:translate-x-2 md:group-hover:translate-x-3">{s.word}</h3>
                <p className="col-start-2 mt-3 max-w-sm text-[14px] leading-relaxed text-ash md:col-start-3 md:mt-0 md:pt-6">
                  {s.line}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
