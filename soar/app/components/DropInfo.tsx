// Placeholder until Shopify is wired (step 1) — getProducts() becomes the source.
const claimed = 84;

export function DropInfo() {
  return (
    <section id="drop" className="border-b border-white/10">
      <div className="grid md:grid-cols-2">
        <div className="relative flex aspect-[4/5] items-end overflow-hidden bg-[radial-gradient(60%_60%_at_50%_38%,#161616,#000)] p-6 md:aspect-auto md:min-h-[80vh] md:p-12">
          <span className="display text-[24vw] leading-none text-white/90 md:text-[13rem]">001</span>
        </div>
        <div className="flex flex-col justify-center gap-6 p-6 md:p-16">
          <span className="mono text-white/45">Current drop</span>
          <h2 className="display text-[clamp(2.6rem,7vw,6rem)] text-white">The Ascension</h2>
          <p className="mono text-white/55">{claimed}% claimed · limited release</p>
          <div className="h-[2px] w-full max-w-md bg-white/12">
            <div className="h-full bg-white" style={{ width: `${claimed}%` }} />
          </div>
          <button className="mono mt-2 w-fit bg-white px-8 py-3.5 text-black transition-opacity hover:opacity-80" type="button">Add to bag</button>
        </div>
      </div>
    </section>
  );
}
