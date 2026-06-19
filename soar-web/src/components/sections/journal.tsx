import { Reveal } from "@/components/ui/reveal";

const posts = [
  { n: "Field Notes", t: "Inside Drop 001 — The Escape", m: "5 min read" },
  { n: "Mindset", t: "On pressure: why discomfort is the point", m: "4 min read" },
  { n: "The Flock", t: "Stories from those who left the box", m: "6 min read" },
];

/** SOAR Journal — editorial contents page: an asymmetric, numbered ledger of
 *  stories with large index numerals, tabular meta, and a quiet hover. */
export function Journal() {
  return (
    <section id="journal" className="bg-white py-24 text-black md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Section header — eyebrow + Section-H2 + quiet index */}
        <Reveal>
          <header className="flex items-end justify-between gap-6 border-b border-black/10 pb-8">
            <div>
              <span className="text-[11px] uppercase tracking-[0.34em] text-black/45">
                SOAR Journal
              </span>
              <h2 className="mt-4 max-w-[14ch] text-[clamp(2.4rem,7vw,6rem)] font-semibold leading-[0.9] tracking-[-0.01em]">
                Words for the climb.
              </h2>
            </div>
            <span className="hidden shrink-0 pb-1 text-[11px] uppercase tracking-[0.3em] text-black/40 tabular-nums sm:block">
              Vol. 01
            </span>
          </header>
        </Reveal>

        {/* Contents — numbered editorial list, hairline-separated */}
        <ol className="mt-4 md:mt-8">
          {posts.map((p, i) => (
            <Reveal key={p.t} delay={i * 80}>
              <li className="border-b border-black/10">
                <a
                  href="#"
                  className="group grid grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-2 py-7 md:grid-cols-[6rem_1fr_auto] md:gap-x-10 md:py-9"
                >
                  {/* Large index numeral */}
                  <span className="font-serif text-[clamp(1.6rem,5vw,2.75rem)] leading-none tracking-[-0.01em] text-black/25 tabular-nums transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-black">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Category + title */}
                  <div className="min-w-0">
                    <span className="text-[11px] uppercase tracking-[0.28em] text-black/45">
                      {p.n}
                    </span>
                    <h3 className="mt-2 text-[clamp(1.4rem,3.4vw,2.25rem)] font-semibold leading-[1.05] tracking-[-0.01em]">
                      {/* Quiet underline reveal on hover */}
                      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat pb-[2px] transition-[background-size] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-[length:100%_1px]">
                        {p.t}
                      </span>
                    </h3>
                  </div>

                  {/* Meta — read time + sliding Read label */}
                  <div className="col-start-2 flex items-center gap-3 self-end text-[11px] uppercase tracking-[0.18em] text-black/45 tabular-nums md:col-start-3 md:flex-col md:items-end md:gap-2 md:self-center md:text-right">
                    <span>{p.m}</span>
                    <span
                      aria-hidden
                      className="inline-flex items-center gap-1 text-black/40 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:gap-2 group-hover:text-black"
                    >
                      Read
                      <span className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </div>
                </a>
              </li>
            </Reveal>
          ))}
        </ol>

        {/* Quiet secondary link */}
        <Reveal delay={posts.length * 80}>
          <a
            href="#"
            className="mt-12 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.15em] text-black/55 underline-offset-4 transition-colors duration-300 hover:text-black hover:underline"
          >
            All entries
            <span aria-hidden>→</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
