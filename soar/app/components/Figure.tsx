// A stylish streetwear figure — one clean oversized-fit silhouette (rounded
// dropped shoulders, hands in pockets, baggy trousers/shorts, chunky sneakers)
// standing in for campaign photography. Single unified path per mass = no facets.
// Monochrome via currentColor; PhotoTile adds the studio light + grain so it reads
// as a shot. Swap 1:1 for real photos/AI renders later.

type Fit = "longsleeve" | "tee" | "shorts";

export function Figure({ fit = "longsleeve", flip = false, className }: { fit?: Fit; flip?: boolean; className?: string }) {
  const shorts = fit === "shorts";

  return (
    <svg viewBox="0 0 360 940" className={className} fill="currentColor" aria-hidden="true" style={flip ? { transform: "scaleX(-1)" } : undefined}>
      {/* hair + head */}
      <path d="M148 74 C144 30 216 30 212 74 C212 52 199 42 180 42 C161 42 148 52 148 74 Z" />
      <ellipse cx="180" cy="82" rx="27" ry="35" />
      <path d="M171 112 H189 V136 H171 Z" />

      {/* bottoms */}
      {shorts ? (
        <>
          {/* baggy shorts */}
          <path d="M128 446 Q180 432 232 446 L240 484 L226 656 L198 660 L186 524 Q180 520 174 524 L162 660 L134 656 L120 484 Z" />
          {/* lower legs */}
          <path d="M166 654 H194 L191 836 H170 Z" />
          <path d="M166 654 H140 L150 836 H168 Z" transform="translate(2 0)" />
        </>
      ) : (
        // baggy full-length trousers, relaxed
        <path d="M126 462 Q180 448 234 462 L246 506 L230 838 L200 844 L188 560 Q180 552 172 560 L160 844 L130 838 L114 506 Z" />
      )}

      {/* chunky sneakers */}
      <path d="M148 828 H196 Q210 828 212 844 L214 866 Q214 880 198 880 H144 Q130 880 130 866 L132 844 Q134 828 148 828 Z" />
      <path d="M170 828 H214 Q228 828 230 844 L232 866 Q232 880 216 880 H170 Z" />

      {/* the top — oversized, rounded dropped shoulders, hands in pockets (one clean
          silhouette, no internal seams). Hem sits low over the hips. */}
      <path
        d={
          shorts
            ? "M150 140 Q108 152 100 214 Q96 260 110 300 L120 452 Q180 470 240 452 L250 300 Q264 260 260 214 Q252 152 210 140 Q180 130 150 140 Z"
            : "M150 140 Q106 152 98 220 Q94 300 106 360 L114 478 Q180 496 246 478 L254 360 Q266 300 262 220 Q254 152 210 140 Q180 130 150 140 Z"
        }
      />
      {/* hands tucked at the hem (small) */}
      <ellipse cx="120" cy={shorts ? 452 : 470} rx="13" ry="16" />
      <ellipse cx="240" cy={shorts ? 452 : 470} rx="13" ry="16" />
    </svg>
  );
}
