const items = ["Drop 001 — The Escape", "Numbered & limited", "Free shipping over $200", "Born to soar"];

/** Kinetic announcement marquee (the streetwear "ticker"). */
export function Ticker() {
  const a = [...items, ...items, ...items];
  const track = [...a, ...a];
  return (
    <div
      className="overflow-hidden border-y border-white/10 bg-black py-3.5 text-white"
      style={{
        maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
      }}
    >
      <div className="flex w-max" style={{ animation: "flock-scroll 44s linear infinite" }}>
        {track.map((t, i) => (
          <span key={i} className="flex items-center text-[11px] uppercase tracking-[0.3em] text-white/55">
            <span className="px-7">{t}</span>
            <span aria-hidden className="h-[3px] w-[3px] rounded-full bg-white/25" />
          </span>
        ))}
      </div>
    </div>
  );
}
