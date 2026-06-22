// Technical "flat" line-drawings of each Drop 001 garment — the premium
// pre-photography stand-in (an atelier tech-pack aesthetic), drawn in faint
// hairlines so it reads as art direction, not a placeholder.

type Kind = "jacket" | "top" | "shorts";

const COMMON = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
  vectorEffect: "non-scaling-stroke" as const,
};

export function GarmentFlat({ kind, className }: { kind: Kind; className?: string }) {
  return (
    <svg viewBox="0 0 220 240" className={className} aria-hidden="true">
      {kind === "top" && <Top />}
      {kind === "jacket" && <Jacket />}
      {kind === "shorts" && <Shorts />}
    </svg>
  );
}

function Top() {
  return (
    <g {...COMMON}>
      {/* body + long sleeves */}
      <path d="M85 48 C97 58 123 58 135 48 L152 44 L196 150 L171 159 L152 86 L152 206 L68 206 L68 86 L49 159 L24 150 L68 44 Z" />
      {/* collar band */}
      <path d="M85 48 C100 40 120 40 135 48" />
      {/* cuff + hem seams */}
      <path d="M30 150 L51 157" opacity="0.6" />
      <path d="M190 150 L169 157" opacity="0.6" />
      <path d="M68 198 L152 198" opacity="0.5" />
    </g>
  );
}

function Jacket() {
  return (
    <g {...COMMON}>
      {/* boxy body + sleeves */}
      <path d="M78 56 L58 50 L34 150 L53 158 L72 88 L72 200 L148 200 L148 88 L167 158 L186 150 L162 50 L142 56" />
      {/* collar (notched) */}
      <path d="M78 56 L96 48 L110 60 L124 48 L142 56" />
      {/* center button placket */}
      <path d="M110 60 L110 200" />
      <circle cx="110" cy="92" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="110" cy="120" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="110" cy="148" r="1.6" fill="currentColor" stroke="none" />
      {/* chest flap pockets */}
      <path d="M82 96 L100 96 L100 116 L82 116 Z" opacity="0.7" />
      <path d="M120 96 L138 96 L138 116 L120 116 Z" opacity="0.7" />
      {/* hem band + cuffs */}
      <path d="M72 184 L148 184" opacity="0.5" />
      <path d="M40 150 L57 156" opacity="0.6" />
      <path d="M180 150 L163 156" opacity="0.6" />
    </g>
  );
}

function Shorts() {
  return (
    <g {...COMMON}>
      {/* waistband */}
      <path d="M62 66 L158 66 L158 82 L62 82 Z" />
      {/* legs */}
      <path d="M62 82 L62 198 L104 198 L104 124 Q110 131 116 124 L116 198 L158 198 L158 82" />
      {/* fly */}
      <path d="M110 82 L110 120" opacity="0.7" />
      {/* hem seams */}
      <path d="M64 190 L104 190" opacity="0.5" />
      <path d="M116 190 L156 190" opacity="0.5" />
      {/* side pockets */}
      <path d="M70 88 L80 100" opacity="0.6" />
      <path d="M150 88 L140 100" opacity="0.6" />
    </g>
  );
}
