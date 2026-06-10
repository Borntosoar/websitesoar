import { Reveal } from "@/components/ui/reveal";

const pieces = [
  { idx: "I", name: "Ascension Hoodie", meta: "600gsm organic", price: "$280", state: "low" },
  { idx: "II", name: "Limitless Tee", meta: "Long-staple pima", price: "$120", state: "out" },
  { idx: "III", name: "Rise Above Jacket", meta: "Japanese dry twill", price: "$420", state: "ok" },
  { idx: "IV", name: "Comfort Ends Cargo", meta: "Italian ripstop", price: "$260", state: "ok" },
] as const;

export function Shop() {
  return (
    <section id="shop" className="bg-paper py-20 text-ink md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-12">
        <div className="mb-12 flex items-center justify-between border-b border-ink/10 pb-5 text-[11px] uppercase tracking-[0.17em] text-taupe">
          <span>(02) Shop — Ascension</span>
          <span>Four pieces</span>
        </div>
        <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {pieces.map((p, i) => (
            <Reveal key={p.idx} delay={i * 90}>
              <article className="group">
                <div className="relative grid aspect-[4/5] place-items-center overflow-hidden border border-ink/10 bg-oat transition-colors group-hover:border-ink">
                  <span
                    className={
                      p.state === "out"
                        ? "font-serif text-6xl text-stone"
                        : "font-serif text-6xl text-stone transition-transform duration-500 group-hover:-translate-y-1 group-hover:text-taupe"
                    }
                  >
                    {p.idx}
                  </span>
                  {p.state === "low" && (
                    <span className="absolute right-3 top-3 border border-ink/20 bg-paper/80 px-2 py-1.5 text-[10px] uppercase tracking-[0.12em] text-ink/70 backdrop-blur-sm">
                      Only 12 left
                    </span>
                  )}
                  {p.state === "out" && (
                    <span className="absolute right-3 top-3 border border-ink bg-ink px-2 py-1.5 text-[10px] uppercase tracking-[0.12em] text-paper">
                      Sold out
                    </span>
                  )}
                  <span
                    className={
                      "absolute bottom-3 left-3 translate-y-[160%] px-3 py-2 text-[11px] uppercase tracking-[0.1em] transition-transform duration-300 group-hover:translate-y-0 " +
                      (p.state === "out" ? "bg-espresso text-bone" : "bg-ink text-oat")
                    }
                  >
                    {p.state === "out" ? "Notify me" : "Add to bag"}
                  </span>
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-3">
                  <div>
                    <h3 className="font-medium">{p.name}</h3>
                    <span className="text-[11px] uppercase tracking-[0.14em] text-taupe">{p.meta}</span>
                  </div>
                  <span className="font-medium">{p.price}</span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
