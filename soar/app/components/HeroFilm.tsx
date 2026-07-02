"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

// The SOAR film, looped to the clean on-brand stretch only. Frame-accurate reset
// (requestVideoFrameCallback) so the loop can never overshoot into the montage's
// off-brand frames. Poster + reduced-motion → a static still (a11y / no-autoplay).
const START = 2.9;
const END = 3.9;
const POSTER = "/hero-poster.jpg";

export function HeroFilm({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const v = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = v.current;
    if (!el || reduce) return;
    let stop = false;
    const rvfc = (el as unknown as { requestVideoFrameCallback?: (cb: () => void) => void }).requestVideoFrameCallback?.bind(el);
    const tick = () => {
      if (stop) return;
      if (el.currentTime >= END || el.currentTime < START - 0.05) el.currentTime = START;
      if (rvfc) rvfc(tick);
      else requestAnimationFrame(tick);
    };
    const begin = () => {
      el.currentTime = START;
      tick();
    };
    if (el.readyState >= 1) begin();
    else el.addEventListener("loadedmetadata", begin, { once: true });
    return () => {
      stop = true;
    };
  }, [reduce]);

  if (reduce) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={POSTER} alt="" className={`photo-grade h-full w-full object-cover ${className}`} />;
  }
  return (
    <video ref={v} poster={POSTER} className={`photo-grade h-full w-full object-cover ${className}`} autoPlay muted playsInline preload="metadata" aria-hidden="true">
      <source src="/soar-entrance.mp4" type="video/mp4" />
    </video>
  );
}
