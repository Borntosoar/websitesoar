import { Reveal } from "./Reveal";
import { HeroFilm } from "./HeroFilm";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// Cinema hero — the SOAR film shown at its natural portrait shape (logo never
// cropped) in a clean framed still, floated over a blurred fill of itself so the
// full width is covered, never blank. Works identically on phone and desktop.
export function RepresentHero() {
  return (
    <section id="top" className="on-dark relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden bg-[#0b0a09] py-24 text-paper">
      {/* blurred ambient fill — the film, softened, covering the whole frame */}
      <HeroFilm className="absolute inset-0 scale-110 blur-3xl brightness-[0.4]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_45%,transparent_34%,rgba(0,0,0,0.72))]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6">
        <Reveal>
          {/* the film at its true aspect — no crop, logo intact */}
          <div className="relative aspect-[9/16] h-[46svh] max-h-[540px] overflow-hidden rounded-[3px] ring-1 ring-paper/10 shadow-[0_40px_90px_-25px_rgba(0,0,0,0.85)] md:h-[58svh]">
            <HeroFilm className="absolute inset-0" />
          </div>
        </Reveal>

        <div className="flex flex-col items-center text-center">
          <Reveal delay={0.06}>
            <p className="mono text-paper/70">Collection One — Drop 001</p>
          </Reveal>
          <Reveal delay={0.12}>
            <h1 className="display mt-3 text-[clamp(2.2rem,6vw,4.4rem)] drop-shadow-lg">
              Born to <span className="italic">soar</span>.
            </h1>
          </Reveal>
          <Reveal delay={0.18}>
            <a
              href="#collection"
              className="mono mt-6 border border-paper/45 bg-black/25 px-12 py-3.5 text-paper backdrop-blur-sm transition-colors hover:bg-paper hover:text-ink"
            >
              Shop Now
            </a>
          </Reveal>
        </div>
      </div>

      <div aria-hidden className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
        <span className="mono text-paper/60">Scroll</span>
      </div>
    </section>
  );
}
