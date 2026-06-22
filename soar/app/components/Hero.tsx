// Bright editorial hero — typographic, architectural, gallery-quiet. The
// fractured-box → star motif (the SOAR symbol) is rendered in hairlines.

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-svh flex-col justify-between overflow-hidden pt-24 pb-10 md:pt-28">
      {/* top meta row */}
      <div className="wrap flex items-center justify-between">
        <span className="mono text-ash">Collection One</span>
        <span className="mono text-ash">Est. Alberta · Canada</span>
      </div>

      {/* center statement */}
      <div className="wrap relative">
        {/* fractured box + north star, in hairlines — the brand symbol, quietly */}
        <div aria-hidden className="pointer-events-none absolute -top-4 right-2 hidden md:block">
          <BoxBreak />
        </div>

        <p className="mono mb-7 text-ash">The first release — Drop 001</p>
        <h1 className="display max-w-[14ch] text-[clamp(3.1rem,11vw,11.5rem)]">
          Growth begins<br />
          where <span className="italic">comfort</span> ends.
        </h1>
        <p className="mt-8 max-w-md text-[15px] leading-relaxed text-ash">
          Three pieces, built with intent. A limited first release for those who
          let the work speak — no loud branding, only considered lines.
        </p>
      </div>

      {/* bottom row */}
      <div className="wrap flex items-end justify-between">
        <a href="#collection" className="group inline-flex items-center gap-3">
          <span className="mono text-ink">View the collection</span>
          <span className="inline-block h-px w-12 bg-ink transition-all duration-500 group-hover:w-20" />
          <span className="text-ink">↓</span>
        </a>
        <span className="mono hidden text-ash sm:block">003 garments</span>
      </div>
    </section>
  );
}

/** A square that fractures open at one corner, a star escaping — the SOAR mark
 *  in pure hairlines. Feel-before-read. */
function BoxBreak() {
  return (
    <svg width="150" height="150" viewBox="0 0 150 150" fill="none" className="text-ink/30">
      <path d="M20 12 H138 V108" stroke="currentColor" strokeWidth="1" />
      <path d="M12 20 V138 H120" stroke="currentColor" strokeWidth="1" />
      {/* the broken corner — fragments displaced */}
      <path d="M120 138 L150 120" stroke="currentColor" strokeWidth="1" />
      <path d="M138 108 L150 96" stroke="currentColor" strokeWidth="1" />
      {/* north star, escaped */}
      <path d="M132 26 l3 9 9 3 -9 3 -3 9 -3 -9 -9 -3 9 -3 z" fill="currentColor" className="text-ink/55" />
    </svg>
  );
}
