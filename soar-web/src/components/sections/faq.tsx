const faqs: [string, string][] = [
  ["When do drops release?", "Collections release in limited, numbered drops. Join the list for early access — once a drop sells out, it's gone."],
  ["How does sizing run?", "Pieces are cut for a considered, slightly relaxed fit. Each product lists measurements; when between sizes, size down for a cleaner line."],
  ["Shipping & returns?", "We ship worldwide from Canada. Unworn pieces can be returned within 30 days of delivery. Final-sale drops are marked at checkout."],
  ["Are pieces authenticated?", "Every garment is numbered and made in limited quantity from traceable, premium cloth."],
  ["Is there an age requirement?", "Yes — you must be at least 13 years old to use this site, and the age of majority in your region to purchase. See our Privacy Policy and Terms."],
];

/** FAQ — native, accessible accordion (no JS needed). */
export function Faq() {
  return (
    <section id="faq" className="bg-white py-20 text-black md:py-28">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <span className="text-[11px] uppercase tracking-[0.3em] text-black/50">FAQ</span>
        <h2 className="mt-3 text-[clamp(2rem,5vw,3.2rem)] font-semibold leading-none">Questions, answered.</h2>
        <div className="mt-10 divide-y divide-black/10 border-y border-black/10">
          {faqs.map(([q, a]) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium [&::-webkit-details-marker]:hidden">
                {q}
                <span className="shrink-0 text-xl leading-none text-black/40 transition-transform duration-300 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-black/60">{a}</p>
            </details>
          ))}
        </div>
        <p className="mt-8 text-sm text-black/50">
          More questions?{" "}
          <a href="mailto:soarnextlevel@gmail.com" className="underline underline-offset-4 hover:text-black">
            soarnextlevel@gmail.com
          </a>
        </p>
      </div>
    </section>
  );
}
