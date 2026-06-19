import { Reveal } from "@/components/ui/reveal";

const posts = [
  { n: "Field Notes", t: "Inside Drop 001 — The Escape", m: "5 min read" },
  { n: "Mindset", t: "On pressure: why discomfort is the point", m: "4 min read" },
  { n: "The Flock", t: "Stories from those who left the box", m: "6 min read" },
];

/** SOAR Journal — editorial teasers. */
export function Journal() {
  return (
    <section id="journal" className="bg-white py-20 text-black md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-12">
        <div className="mb-10 flex items-end justify-between border-b border-black/10 pb-5">
          <div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-black/50">SOAR Journal</span>
            <h2 className="mt-2 text-[clamp(2rem,5vw,3.2rem)] font-semibold leading-none">Words for the climb.</h2>
          </div>
          <a
            href="#"
            className="hidden shrink-0 text-[12px] uppercase tracking-[0.15em] text-black/60 underline-offset-4 hover:text-black hover:underline sm:block"
          >
            All entries
          </a>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {posts.map((p, i) => (
            <Reveal key={p.t} delay={i * 80}>
              <a href="#" className="group flex aspect-[4/3] flex-col justify-between overflow-hidden bg-black p-6 text-white">
                <span className="text-[11px] uppercase tracking-[0.2em] text-white/45">{p.n}</span>
                <div>
                  <h3 className="text-xl font-semibold leading-tight md:text-2xl">{p.t}</h3>
                  <span className="mt-3 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-white/50 transition-colors group-hover:text-white tabular-nums">
                    {p.m} · Read
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
