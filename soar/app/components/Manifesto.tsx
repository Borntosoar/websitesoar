// The single inverted section — the "breakthrough" beat in the bright arc.
// Pressure → release. Feel before read.

export function Manifesto() {
  return (
    <section id="world" className="bg-pitch text-paper">
      <div className="wrap flex min-h-[88svh] flex-col justify-center py-28 md:py-40">
        <span className="mono text-paper/45">The idea</span>

        <h2 className="display mt-8 max-w-[18ch] text-[clamp(2.4rem,7vw,6.2rem)]">
          The box is everything
          <br />
          that keeps you small.
        </h2>

        <div className="mt-12 grid max-w-4xl gap-8 md:grid-cols-2">
          <p className="serif text-[clamp(1.15rem,2.6vw,1.6rem)] italic leading-snug text-paper/90">
            Fear. Doubt. The comfort zone. The expectations you never chose.
          </p>
          <p className="text-[14px] leading-relaxed text-paper/55">
            SOAR isn&rsquo;t about arriving. It&rsquo;s about breaking out — the
            daily reminder that you were built to rise above whatever holds you
            in. We haven&rsquo;t seen the result yet either. So we made the thing
            that gets us there. Growth begins where comfort ends.
          </p>
        </div>

        <div className="mt-16 flex items-center gap-4">
          <span className="h-px w-16 bg-paper/40" />
          <span className="mono text-paper/55">Rise above</span>
        </div>
      </div>
    </section>
  );
}
