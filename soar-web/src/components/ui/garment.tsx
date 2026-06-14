"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Original art-directed B&W studio render of a garment, by category. Used as a
 *  cohesive lookbook stand-in until real/AI photography is dropped in. */
const mirror = (node: ReactNode) => <g transform="matrix(-1 0 0 1 200 0)">{node}</g>;

function body(kind: string): ReactNode {
  switch (kind) {
    case "Tees":
      return (
        <>
          <path d="M68 64 L86 66 C94 73 106 73 114 66 L132 64 L139 152 C112 161 88 161 61 152 Z" />
          <path d="M68 65 L45 95 L60 104 L83 76 Z" />
          {mirror(<path d="M68 65 L45 95 L60 104 L83 76 Z" />)}
        </>
      );
    case "Sweatpants":
      return (
        <>
          <path d="M74 48 L126 48 L126 60 L74 60 Z" />
          <path d="M75 60 L99 60 L97 204 L74 204 L71 122 Z" />
          {mirror(<path d="M75 60 L99 60 L97 204 L74 204 L71 122 Z" />)}
        </>
      );
    case "Shorts":
      return (
        <>
          <path d="M74 70 L126 70 L126 82 L74 82 Z" />
          <path d="M75 82 L99 82 L98 144 L73 144 Z" />
          {mirror(<path d="M75 82 L99 82 L98 144 L73 144 Z" />)}
        </>
      );
    case "Outerwear":
      return (
        <>
          <path d="M82 54 L118 54 L116 66 L84 66 Z" />
          <path d="M66 62 L134 62 L141 150 C112 160 88 160 59 150 Z" />
          <path d="M66 63 L40 94 L35 142 L55 148 L74 88 Z" />
          {mirror(<path d="M66 63 L40 94 L35 142 L55 148 L74 88 Z" />)}
        </>
      );
    case "Accessories":
      return (
        <>
          <path d="M68 118 C68 90 132 90 132 118 L68 118 Z" />
          <path d="M60 118 C72 132 150 130 152 118 L152 124 C146 138 70 138 60 126 Z" />
          <circle cx="100" cy="92" r="3.4" />
        </>
      );
    default: // Hoodies (and crewnecks)
      return (
        <>
          <path d="M72 50 C80 26 120 26 128 50 L122 66 C112 54 88 54 78 66 Z" />
          <path d="M70 60 L86 62 C95 70 105 70 114 62 L130 60 L138 156 C112 166 88 166 62 156 Z" />
          <path d="M70 61 L42 92 L34 140 L54 146 L78 84 Z" />
          {mirror(<path d="M70 61 L42 92 L34 140 L54 146 L78 84 Z" />)}
        </>
      );
  }
}

function seams(kind: string): ReactNode {
  switch (kind) {
    case "Sweatpants":
      return (
        <>
          <path d="M74 196 L97 196" />
          <path d="M103 196 L126 196" />
          <path d="M100 60 L100 110" />
        </>
      );
    case "Outerwear":
      return (
        <>
          <path d="M100 66 L100 152" />
          <path d="M62 146 L138 146" />
        </>
      );
    case "Accessories":
      return <path d="M70 118 C84 110 116 110 130 118" />;
    case "Tees":
      return <path d="M88 66 C94 73 106 73 112 66" />;
    default:
      return (
        <>
          <path d="M84 116 L116 116 L120 138 L80 138 Z" />
          <path d="M94 66 L92 96" />
          <path d="M106 66 L108 96" />
        </>
      );
  }
}

export function Garment({ kind, className }: { kind: string; className?: string }) {
  const uid = useId().replace(/[:]/g, "");
  const bg = `bg${uid}`;
  const cl = `cl${uid}`;
  const hl = `hl${uid}`;
  const sh = `sh${uid}`;
  return (
    <svg
      viewBox="0 0 200 240"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label={kind}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id={bg} cx="50%" cy="36%" r="78%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e6e6e6" />
        </radialGradient>
        <linearGradient id={cl} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2c2c2c" />
          <stop offset="55%" stopColor="#141414" />
          <stop offset="100%" stopColor="#070707" />
        </linearGradient>
        <linearGradient id={hl} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="42%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <filter id={sh} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      <rect width="200" height="240" fill={`url(#${bg})`} />
      <ellipse cx="100" cy="214" rx="60" ry="9" fill="#000000" opacity="0.14" filter={`url(#${sh})`} />
      <g fill={`url(#${cl})`}>{body(kind)}</g>
      {/* soft studio sheen */}
      <g fill={`url(#${hl})`} style={{ mixBlendMode: "screen" }}>{body(kind)}</g>
      <g fill="none" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        {seams(kind)}
      </g>
    </svg>
  );
}
