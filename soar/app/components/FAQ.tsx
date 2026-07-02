import { Reveal } from "./Reveal";
import { SHIP } from "@/lib/policy";

// Calm, honest answers — aligned with /policies. Quiet voice, no hype.
const FAQS: { q: string; a: string }[] = [
  {
    q: "How do the pieces fit?",
    a: "Boxy and modern, cut true to size — size down for a sharper silhouette. Every product page has a fit note and a full size guide, and if you're between sizes, just email us.",
  },
  {
    q: "Will Drop 001 restock?",
    a: "No. Each piece is a single numbered run — an edition of 200 — and once a size is gone, it's gone. The next drop is a new edition, and First Flight hears about it first.",
  },
  {
    q: "How do I get the access code?",
    a: "Join First Flight. Members get the code before anyone else, along with the next release. It's the only way in for now, and it stays small on purpose.",
  },
  {
    q: "When will my order ship?",
    a: `Every piece ships from Alberta, Canada, processed within ${SHIP.processing}, with a tracking link by email. Standard shipping across Canada is on us; international rates show at checkout.`,
  },
  {
    q: "Can I return or exchange?",
    a: `Within ${SHIP.returnDays} days of delivery, on unworn pieces with tags attached — email us to start. Because each size is limited, reach out early; we'll do our best on an exchange before it sells out.`,
  },
  {
    q: "Where is SOAR from?",
    a: "Designed and developed in Alberta, Canada, by three friends building it the slow way. Prices are in CAD; checkout is handled securely by Shopify.",
  },
];

export function FAQ() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section id="faq" className="on-dark border-t border-paper/10 bg-pitch text-paper">
      <div className="wrap py-20 md:py-28">
        <Reveal>
          <div className="mb-10 flex items-baseline justify-between md:mb-14">
            <h2 className="mono text-paper/55">Questions</h2>
            <a href="mailto:soarnextlevel@gmail.com" className="mono text-paper/55 underline-offset-4 transition-colors hover:text-paper hover:underline">
              Anything else — email us
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="border-t border-paper/12">
            {FAQS.map((f) => (
              <details key={f.q} className="group border-b border-paper/12">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[clamp(1.05rem,2.4vw,1.35rem)] text-paper [&::-webkit-details-marker]:hidden">
                  <span>{f.q}</span>
                  <span aria-hidden className="relative h-4 w-4 shrink-0 text-paper/55 transition-transform duration-300 group-open:rotate-45">
                    <span className="absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 -translate-y-1/2 bg-current" />
                    <span className="absolute left-1/2 top-1/2 h-4 w-px -translate-x-1/2 -translate-y-1/2 bg-current" />
                  </span>
                </summary>
                <p className="max-w-2xl pb-6 text-[14px] leading-relaxed text-paper/55">{f.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </section>
  );
}
