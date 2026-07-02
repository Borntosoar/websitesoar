"use client";

import { useReducedMotion } from "framer-motion";

// The SOAR emblem film — purpose-built, seamless, on-brand end to end, so it
// simply loops natively (no frame-window hacks). Poster + reduced-motion fall
// back to the rest frame (a still of the same emblem), so nothing ever flashes.
const POSTER = "/hero-poster.jpg";
const SRC = "/soar-hero.mp4";

export function HeroFilm({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();

  if (reduce) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={POSTER} alt="" className={`h-full w-full object-cover ${className}`} />;
  }
  return (
    <video
      poster={POSTER}
      className={`h-full w-full object-cover ${className}`}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
    >
      <source src={SRC} type="video/mp4" />
    </video>
  );
}
