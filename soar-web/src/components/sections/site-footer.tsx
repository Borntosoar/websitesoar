const cols = [
  ["Shop", ["Ascension Vol.01", "Hoodies", "Outerwear"]],
  ["House", ["Our World", "Lookbook", "Sustainability"]],
  ["Support", ["Shipping", "Returns", "Size guide"]],
  ["Social", ["Instagram", "TikTok", "Newsletter"]],
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-espresso px-5 pb-9 pt-20 text-bone md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <a href="#top" className="col-span-2 text-5xl font-semibold tracking-[0.04em] md:col-span-1 md:text-6xl">
            SOAR<sup className="align-super text-[0.25em] text-bone/55">®</sup>
          </a>
          {cols.map(([heading, links]) => (
            <nav key={heading} className="flex flex-col gap-3">
              <span className="mb-1 text-[11px] uppercase tracking-[0.17em] text-bone/55">{heading}</span>
              {links.map((l) => (
                <a key={l} href="#" className="text-sm text-bone/60 transition-colors hover:text-bone">
                  {l}
                </a>
              ))}
            </nav>
          ))}
        </div>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-bone/15 pt-6 text-[11px] uppercase tracking-[0.14em] text-bone/55">
          <span>© {year} SOAR® — Made to rise</span>
          <span>Growth begins where comfort ends</span>
        </div>
      </div>
    </footer>
  );
}
