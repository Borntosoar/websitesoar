"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";
import { Figure } from "./Figure";

const HERO_PROMPT =
  "three stylish fashion models standing together, full body, black and white editorial streetwear campaign photograph, oversized fits, baggy trousers, chunky sneakers, minimal studio, dramatic lighting, film grain, monochrome, no text";
const HERO_SRC = `https://image.pollinations.ai/prompt/${encodeURIComponent(HERO_PROMPT)}?width=1600&height=1100&nologo=true&seed=24&model=flux`;

// Full-viewport campaign hero (Represent move). A real B&W AI campaign photo is
// fetched in the browser; three silhouettes are the instant fallback underneath.
export function RepresentHero() {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <section id="top" className="on-dark relative flex min-h-svh w-full flex-col justify-end overflow-hidden bg-gradient-to-b from-[#2a2723] to-[#0b0a09] text-paper">
      {/* studio sweep */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(100% 58% at 50% 8%, rgba(244,243,239,0.20), transparent 56%)" }} />

      {/* silhouette fallback */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-[5vw] px-4 md:gap-[4vw]">
        <Figure fit="longsleeve" className="hidden h-[74svh] w-auto text-paper/90 md:block" />
        <Figure fit="tee" className="h-[80svh] w-auto text-paper/90" />
        <Figure fit="shorts" flip className="hidden h-[74svh] w-auto text-paper/90 md:block" />
      </div>

      {/* real AI campaign photo (client-fetched), grayscale to stay on brand */}
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={HERO_SRC}
          alt=""
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover grayscale contrast-[1.04] transition-opacity duration-1000 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}

      {/* legibility scrim + grain */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-screen"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />

      {/* overlay copy */}
      <div className="relative z-10 flex flex-col items-center px-6 pb-[9vh] text-center">
        <Reveal>
          <p className="mono text-paper/75">Collection One — Drop 001</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="display mt-3 text-[clamp(2.6rem,8vw,6rem)] drop-shadow">
            Born to <span className="italic">soar</span>.
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <a
            href="#collection"
            className="mono mt-7 border border-paper/40 bg-black/25 px-12 py-3.5 text-paper backdrop-blur-sm transition-colors hover:bg-paper hover:text-ink"
          >
            Shop Now
          </a>
        </Reveal>
      </div>

      <div aria-hidden className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
        <span className="mono text-paper/45">Scroll</span>
      </div>
    </section>
  );
}
