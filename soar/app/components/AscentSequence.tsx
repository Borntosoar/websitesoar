import { Reveal } from "./Reveal";

// The brand's emotional arc as an editorial sequence — no photography needed,
// pure typography + hairlines. Pressure → Resistance → Breakthrough → Growth →
// Freedom (soar-brand §4). The story beat the site was missing.
const STAGES = [
  { n: "01", word: "Pressure", line: "Everyone starts inside the box. The weight of expectation, doubt, the comfort that quietly keeps you still." },
  { n: "02", word: "Resistance", line: "Growth asks for friction. The work no one sees — the reps, the doubt, the days without results." },
  { n: "03", word: "Breakthrough", line: "The moment the structure cracks. Not luck. Earned. The bird was always going to leave the box." },
  { n: "04", word: "Growth", line: "Past the edge of comfort, something opens. You become the version you were building toward." },
  { n: "05", word: "Freedom", line: "Success was never the point. Freedom is. Everything after is just altitude." },
];

export function AscentSequence() {
  return (
    <section id="ascent" className="border-t border-line">
      <div className="wrap py-24 md:py-36">
        <Reveal>
          <div className="mb-14 flex items-baseline justify-between md:mb-20">
            <span className="mono text-ash">The ascent</span>
            <span className="mono text-ash">Growth begins where comfort ends</span>
          </div>
        </Reveal>

        <div>
          {STAGES.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.04}>
              <div className="group grid grid-cols-[auto_1fr] items-start gap-x-6 border-b border-line py-8 md:grid-cols-[5rem_1fr_minmax(0,30ch)] md:gap-x-10 md:py-12">
                <span className="mono pt-3 text-ash md:pt-5">{s.n}</span>
                <h3 className="display text-[clamp(2.1rem,7vw,5.4rem)]">{s.word}</h3>
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
