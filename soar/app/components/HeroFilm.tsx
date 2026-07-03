"use client";

import { useRef, useState } from "react";

// The SOAR hero film. Landscape and portrait cuts both ship in the HTML; a CSS
// media query (.land-vid / .port-vid) picks the one that fits the viewport, and
// preload="none" means only the shown cut is ever fetched. A separate CSS query
// (.rm-only / .rm-hide) swaps to a static still under reduced motion — honoured
// on the first paint, no hydration gap. A quiet pause control (WCAG 2.2.2)
// governs whichever cut is playing.
const POSTER = "/hero-poster.jpg";
const POSTER_P = "/hero-poster-portrait.jpg";
const SRC = "/soar-hero.mp4";
const SRC_P = "/soar-hero-portrait.mp4";
const BASE = "h-full w-full object-cover";

export function HeroFilm({ className = "" }: { className?: string }) {
  const landRef = useRef<HTMLVideoElement>(null);
  const portRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);

  function toggle() {
    const vids = [landRef.current, portRef.current].filter((v): v is HTMLVideoElement => !!v);
    const playing = vids.some((v) => !v.paused);
    vids.forEach((v) => {
      if (playing) v.pause();
      else v.play().catch(() => {});
    });
    setPaused(playing);
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={POSTER} alt="" aria-hidden className={`rm-only ${BASE} ${className}`} />
      <video ref={landRef} poster={POSTER} className={`rm-hide land-vid ${BASE} ${className}`} autoPlay muted loop playsInline preload="none" aria-hidden="true">
        <source src={SRC} type="video/mp4" />
      </video>
      <video ref={portRef} poster={POSTER_P} className={`rm-hide port-vid ${BASE} ${className}`} autoPlay muted loop playsInline preload="none" aria-hidden="true">
        <source src={SRC_P} type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={toggle}
        aria-label={paused ? "Play background film" : "Pause background film"}
        className="rm-hide absolute bottom-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-paper/20 bg-black/25 text-paper/55 backdrop-blur-sm transition-colors hover:border-paper/45 hover:text-paper"
      >
        {paused ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        )}
      </button>
    </>
  );
}
