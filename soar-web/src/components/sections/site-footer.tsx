"use client";

const cols = [
  ["Shop", ["Ascension Vol.01", "Hoodies", "Outerwear"]],
  ["House", ["Our World", "Lookbook", "Sustainability"]],
  ["Support", ["Shipping", "Returns", "Size guide"]],
  ["Social", ["Instagram", "TikTok", "Newsletter"]],
] as const;

function FooterSignup() {
  return (
    <form
      className="mb-14 flex max-w-xl flex-col gap-2.5 border-b border-bone/15 pb-12 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        const f = e.currentTarget;
        const note = f.querySelector("[data-note]") as HTMLElement | null;
        if (note) note.textContent = "You're in — check your inbox for 10% off.";
        f.reset();
      }}
      noValidate
    >
      <div className="flex-1">
        <p className="mb-3 text-sm text-bone/70">
          <strong className="font-medium text-bone">Get 10% off your first order</strong> — join
          the list for early drop access.
        </p>
        <div className="flex gap-2">
          <input
            type="email"
            required
            placeholder="Email address"
            aria-label="Email address"
            className="min-w-0 flex-1 border border-bone/20 bg-transparent px-4 py-3 text-sm text-bone outline-none transition-colors placeholder:text-bone/40 focus:border-bone"
          />
          <button
            type="submit"
            className="bg-bone px-5 py-3 text-[13px] font-medium text-ink transition-colors hover:bg-white"
          >
            Join
          </button>
        </div>
        <p data-note className="mt-2 text-[11px] uppercase tracking-[0.14em] text-bone/50">
          No noise — only ascent. Unsubscribe anytime.
        </p>
      </div>
    </form>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-espresso px-5 pb-9 pt-20 text-bone md:px-12">
      <div className="mx-auto max-w-7xl">
        <FooterSignup />
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
