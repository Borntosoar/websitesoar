"use client";

import { useRef, useState } from "react";

// The SOAR emblem film. Both the still and the film are rendered on the server;
// a CSS media query (see .rm-only / .rm-hide) decides which shows, so reduced
// motion is honoured on the very first paint — no hydration gap, and the film is
// never fetched for those users (preload="none"). A quiet pause control satisfies
// WCAG 2.2.2 for the auto-looping film.
const POSTER = "/hero-poster.jpg";
const SRC = "/soar-hero.mp4";
const BASE = "h-full w-full object-cover";

export function HeroFilm({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);

  function toggle() {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={POSTER} alt="" aria-hidden className={`rm-only ${BASE} ${className}`} />
      <video
        ref={ref}
        poster={POSTER}
        className={`rm-hide ${BASE} ${className}`}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
      >
        <source src={SRC} type="video/mp4" />
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
