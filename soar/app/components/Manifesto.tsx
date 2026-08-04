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
          <p className="lede text-paper/90">We were Tragic before we were SOAR.</p>
          <p className="text-[14px] leading-relaxed text-paper/55">
            The box is where everyone starts. Leaving it is the whole name —
            you already know if it&rsquo;s you.
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
