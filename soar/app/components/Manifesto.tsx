// The one inverted section — a quiet word on the mark, then it gets out of the
// way. Symbol over slogan; the meaning is the wearer's.

export function Manifesto() {
  return (
    <section id="name" className="bg-pitch text-paper">
      <div className="wrap flex min-h-[80svh] flex-col justify-center py-28 md:py-40">
        <span className="mono text-paper/60">On the name</span>

        <h2 className="display mt-8 max-w-[16ch] text-[clamp(2.2rem,6vw,5.4rem)]">
          A bird, drawn
          <br />
          leaving a box.
        </h2>

        <div className="mt-12 grid max-w-4xl gap-8 md:grid-cols-2">
          <p className="lede text-paper/90">
            That&rsquo;s the whole mark. We don&rsquo;t explain it much further.
          </p>
          <p className="text-[14px] leading-relaxed text-paper/55">
            Most of what keeps people where they are is a box of their own making
            — quieter than a symbol, and harder to leave. We&rsquo;d rather make
            the clothes than lecture anyone about it. Read into the bird what you
            like; most people read their own.
          </p>
        </div>

        <div className="mt-16 flex items-center gap-4">
          <span className="h-px w-16 bg-paper/40" />
          <span className="mono text-paper/55">Born to soar</span>
        </div>
      </div>
    </section>
  );
}
