"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const POSTER = "/earth-poster.jpg";

function PosterBg() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={POSTER} alt="" aria-hidden className="h-full w-full object-cover" />;
}

const EarthScene = dynamic(() => import("./EarthScene").then((m) => m.EarthScene), {
  ssr: false,
  loading: () => <PosterBg />,
});

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

// The hero as a live 3D Earth: the planet turns with a day/night terminator and
// city lights, a light ripple races across it (the SOAR chain reaction), and the
// camera pulls back into a starfield. Static poster when WebGL is unavailable.
export function EarthHero() {
  const [webgl, setWebgl] = useState(true);
  useEffect(() => {
    setWebgl(hasWebGL());
  }, []);

  return (
    <section id="top" className="on-dark relative h-[82svh] w-full overflow-hidden bg-[#050507] text-paper md:h-svh">
      <div className="absolute inset-0">{webgl ? <EarthScene /> : <PosterBg />}</div>

      {/* depth + legibility, kept low so it never dims the planet */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-black/92 via-black/45 to-transparent" />

      {/* tagline + CTA, pinned low */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-6 pb-[9svh] text-center">
        <p className="mono hero-rise text-paper/85 [text-shadow:0_1px_10px_rgba(0,0,0,0.6)]">Collection One — Drop 001</p>
        <h1 className="display hero-rise mt-3 text-[clamp(2rem,5.4vw,3.6rem)] drop-shadow-lg" style={{ animationDelay: "0.08s" }}>
          Born to <span className="italic">soar</span>.
        </h1>
        <a
          href="#collection"
          className="mono hero-rise mt-7 border border-paper/50 bg-black/25 px-12 py-3.5 text-paper backdrop-blur-sm transition-colors hover:bg-paper hover:text-ink [text-shadow:0_1px_10px_rgba(0,0,0,0.6)]"
          style={{ animationDelay: "0.16s" }}
        >
          Shop Now
        </a>
      </div>
    </section>
  );
}
