"use client";

import { useRef } from "react";

// The SOAR film, looped to the clean on-brand stretch only (skips the phone /
// Messages / UI frames elsewhere in the montage). Fills its panel, muted, no crop
// on portrait (mobile fills; desktop centre column).
const START = 2.9;
const END = 3.95;

export function HeroFilm({ className = "" }: { className?: string }) {
  const v = useRef<HTMLVideoElement>(null);
  const seek = () => {
    if (v.current) v.current.currentTime = START;
  };
  const loop = () => {
    const el = v.current;
    if (el && (el.currentTime >= END || el.currentTime < START - 0.05)) el.currentTime = START;
  };
  return (
    <video
      ref={v}
      className={`photo-grade h-full w-full object-cover ${className}`}
      autoPlay
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      onLoadedMetadata={seek}
      onTimeUpdate={loop}
    >
      <source src="/soar-entrance.mp4" type="video/mp4" />
    </video>
  );
}
