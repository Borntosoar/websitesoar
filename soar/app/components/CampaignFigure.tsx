// An editorial figure — a stylized monochrome croquis standing in for a model
// until photography lands. Deliberately abstract (a silhouette, not a render), so
// it reads as deliberate art direction. `currentColor` inverts it on dark/light;
// `flip` mirrors the stance for variety across a spread.

export function CampaignFigure({ className, flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 300 860" className={className} aria-hidden="true" fill="currentColor" style={flip ? { transform: "scaleX(-1)" } : undefined}>
      {/* head */}
      <ellipse cx="150" cy="58" rx="28" ry="38" />
      {/* neck → shoulders → torso → legs, one silhouette with a true leg gap */}
      <path
        d="M139 93
           L161 93
           L160 117
           L200 157
           L183 252
           L177 362
           L189 409
           L178 800
           L156 808
           L160 620
           L150 479
           L140 620
           L144 808
           L122 800
           L111 409
           L123 362
           L117 252
           L100 157
           L140 117
           Z"
      />
      {/* arms, hanging just off the torso */}
      <path d="M100 159 L89 171 L99 415 L112 415 L115 360 L116 199 Z" />
      <path d="M200 159 L211 171 L201 415 L188 415 L185 360 L184 199 Z" />
    </svg>
  );
}
