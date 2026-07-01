import { Reveal } from "./Reveal";

// Full-viewport campaign hero (Represent move) — three real Drop 001 shots side
// by side, the collection line + Shop Now over the bottom.
const SHOTS = ["/lookbook/jacket-grey.webp", "/lookbook/jacket-front.webp", "/lookbook/jacket-back.webp"];

export function RepresentHero() {
  return (
    <section id="top" className="on-dark relative flex min-h-svh w-full flex-col justify-end overflow-hidden bg-[#0b0a09] text-paper">
      {/* campaign photos */}
      <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-3">
        {SHOTS.map((s, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={s}
            src={s}
            alt=""
            loading="eager"
            decoding="async"
            fetchPriority={i === 0 ? "high" : "auto"}
            className={`photo-grade h-full w-full object-cover object-top ${i > 0 ? "hidden md:block" : ""}`}
          />
        ))}
      </div>

      {/* legibility scrim + grain */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[68%] bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/55 to-transparent" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />

      {/* overlay copy */}
      <div className="relative z-10 flex flex-col items-center px-6 pb-[9vh] text-center">
        <Reveal>
          <p className="mono text-paper/75">Collection One — Drop 001</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="display mt-3 text-[clamp(2.6rem,8vw,6rem)] drop-shadow-lg">
            Born to <span className="italic">soar</span>.
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <a
            href="#collection"
            className="mono mt-7 border border-paper/45 bg-black/25 px-12 py-3.5 text-paper backdrop-blur-sm transition-colors hover:bg-paper hover:text-ink"
          >
            Shop Now
          </a>
        </Reveal>
      </div>

      <div aria-hidden className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
        <span className="mono text-paper/60">Scroll</span>
      </div>
    </section>
  );
}
