import { Reveal } from "@/components/ui/reveal";

const faqs: [string, string][] = [
  ["When do drops release?", "Collections release in limited, numbered drops. Join the list for early access — once a drop sells out, it's gone."],
  ["How does sizing run?", "Pieces are cut for a considered, slightly relaxed fit. Each product lists measurements; when between sizes, size down for a cleaner line."],
  ["Shipping & returns?", "We ship worldwide from Canada. Unworn pieces can be returned within 30 days of delivery. Final-sale drops are marked at checkout."],
  ["Are pieces authenticated?", "Every garment is numbered and made in limited quantity from traceable, premium cloth."],
  ["Is there an age requirement?", "Yes — you must be at least 13 years old to use this site, and the age of majority in your region to purchase. See our Privacy Policy and Terms."],
];

/** FAQ — native, accessible <details> accordion (no JS toggles). Editorial
 *  header + numbered hairline ledger. Monochrome, quiet. The +→× rotate is
 *  decorative only; reduced motion no-ops it (no info carried by motion). */
export function Faq() {
  return (
    <section id="faq" className="bg-white py-24 text-black md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Editorial header: eyebrow + index, then the Section-H2 headline */}
        <Reveal>
          <div className="flex items-baseline justify-between border-b border-black/10 pb-5">
            <span className="text-[11px] uppercase tracking-[0.34em] text-black/45">
              FAQ
            </span>
            <span className="text-[11px] uppercase tracking-[0.34em] tabular-nums text-black/30">
              05 / 05
            </span>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <h2 className="mt-10 max-w-4xl text-[clamp(2.4rem,7vw,6rem)] font-semibold leading-[0.9] tracking-[-0.01em] md:mt-14">
            Questions, answered.
          </h2>
        </Reveal>

        {/* The questions as a numbered, hairline-separated ledger */}
        <div className="mt-16 border-t border-black/10 md:mt-24">
          {faqs.map(([q, a], i) => (
            <Reveal key={q} delay={i * 80}>
              <details className="group border-b border-black/10">
                <summary className="grid cursor-pointer list-none grid-cols-[auto_1fr_auto] items-baseline gap-x-5 py-7 md:grid-cols-[5rem_1fr_auto] md:gap-x-10 md:py-9 [&::-webkit-details-marker]:hidden">
                  {/* Oversized index numeral */}
                  <span className="select-none text-[clamp(1.5rem,3vw,2.5rem)] font-semibold leading-none tabular-nums text-black/20 transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-black/45 group-open:text-black/45">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Question */}
                  <h3 className="text-[clamp(1.15rem,2.4vw,1.75rem)] font-medium leading-[1.2] tracking-[-0.01em]">
                    {q}
                  </h3>

                  {/* Smooth +→× toggle indicator (transform only) */}
                  <span
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-2xl leading-none text-black/35 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-black/60 group-open:rotate-45 motion-reduce:transition-none md:mt-1.5"
                  >
                    +
                  </span>
                </summary>

                {/* Answer — indented to align under the question column on md+ */}
                <p className="max-w-2xl pb-9 text-[15px] leading-relaxed text-black/60 md:pl-[5.5rem] md:pr-5 md:text-base">
                  {a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>

        {/* Refined contact line */}
        <Reveal>
          <div className="mt-14 flex flex-col gap-1 md:mt-20">
            <span className="text-[11px] uppercase tracking-[0.34em] text-black/45">
              Still curious
            </span>
            <p className="text-[15px] leading-relaxed text-black/60 md:text-base">
              More questions? Reach us at{" "}
              <a
                href="mailto:soarnextlevel@gmail.com"
                className="text-black underline decoration-black/30 underline-offset-4 transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:decoration-black"
              >
                soarnextlevel@gmail.com
              </a>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
