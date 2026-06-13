import { Reveal } from "@/components/ui/reveal";

const cats = [
  { t: "Hoodies", n: "01" },
  { t: "Sweatpants", n: "02" },
  { t: "Tees", n: "03" },
  { t: "Outerwear", n: "04" },
  { t: "Accessories", n: "05" },
];

export function CollectionGrid() {
  return (
    <section id="collection" className="bg-white py-20 text-black md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-12">
        <div className="mb-10 flex items-center justify-between border-b border-black/10 pb-5 text-[11px] uppercase tracking-[0.2em] text-black/50">
          <span>The Collection</span>
          <span>Ascension Vol.01</span>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {cats.map((c, i) => (
            <Reveal key={c.t} delay={i * 70} className={i === 0 ? "md:col-span-2" : ""}>
              <a href="#" className="group relative flex aspect-[4/5] items-end overflow-hidden bg-black p-6 text-white">
                <span className="absolute right-5 top-4 text-[11px] uppercase tracking-[0.2em] text-white/40">{c.n}</span>
                <div className="absolute inset-0 grid place-items-center">
                  <span className="select-none font-semibold text-[22vw] text-white/[0.05] transition-transform duration-700 group-hover:scale-105 md:text-[9rem]">
                    {c.t[0]}
                  </span>
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-semibold md:text-3xl">{c.t}</h3>
                  <span className="text-[11px] uppercase tracking-[0.14em] text-white/50 underline-offset-4 group-hover:underline">Shop</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
