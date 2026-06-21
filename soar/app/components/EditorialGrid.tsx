// Flush, asymmetric editorial grid — never a 3-products-in-a-row layout.
const tiles = [
  { n: "01", t: "Field Notes", big: true },
  { n: "02", t: "The Climb" },
  { n: "03", t: "Above The Box" },
  { n: "04", t: "Made To Rise" },
];

export function EditorialGrid() {
  return (
    <section id="editorial" className="wrap py-20 md:py-28">
      <div className="mb-10 flex items-end justify-between md:mb-14">
        <h2 className="display text-[clamp(2rem,5vw,3.6rem)] text-white">Editorial</h2>
        <span className="mono text-white/45">Vol. 01</span>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-12 md:gap-6">
        {tiles.map((t) => (
          <div
            key={t.n}
            className={`group relative overflow-hidden border border-white/10 ${
              t.big
                ? "col-span-2 aspect-[16/10] md:col-span-7 md:row-span-2 md:aspect-auto md:min-h-[60vh]"
                : "aspect-[4/3] md:col-span-5"
            }`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_40%,#141414,#000)]" />
            <span className="display absolute inset-0 flex items-center justify-center text-[16vw] text-white/[0.05] md:text-[8rem]">{t.n}</span>
            <span className="mono absolute bottom-4 left-4 text-white/60">{t.t}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
