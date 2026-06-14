import { Reveal } from "@/components/ui/reveal";

const tenets = [
  ["01", "We haven't arrived — we're rising.", "SOAR is built inside the struggle, not above it."],
  ["02", "The box is a lie you can leave.", "Every limit is learned. Anything learned can be unlearned."],
  ["03", "Pressure is the price of the breakthrough.", "Growth begins where comfort ends."],
  ["04", "Quiet work outlasts loud noise.", "We don't chase the moment. We build the long climb."],
];

/** The Code — brand manifesto. Quiet, declarative, symbol over slogan. */
export function Manifesto() {
  return (
    <section id="manifesto" className="bg-black py-24 text-white md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-12">
        <Reveal>
          <span className="text-[11px] uppercase tracking-[0.3em] text-white/40">The Code</span>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-4 max-w-4xl text-[clamp(2.2rem,6vw,5rem)] font-semibold leading-[0.95]">
            We were never meant to stay inside the box.
          </h2>
        </Reveal>
        <div className="mt-16 grid gap-px border border-white/10 bg-white/10 md:grid-cols-2">
          {tenets.map(([n, t, d], i) => (
            <Reveal key={n} delay={i * 70}>
              <div className="flex h-full flex-col gap-3 bg-black p-8 md:p-10">
                <span className="text-[11px] uppercase tracking-[0.2em] text-white/35">{n}</span>
                <h3 className="text-xl font-semibold md:text-2xl">{t}</h3>
                <p className="text-sm text-white/55">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
