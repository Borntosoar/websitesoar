const items = ["Drop 001 — The Escape", "Numbered & limited", "Free shipping over $200", "Born to soar"];

/** Kinetic announcement marquee (the streetwear "ticker"). */
export function Ticker() {
  const a = [...items, ...items, ...items];
  const track = [...a, ...a];
  return (
    <div className="overflow-hidden border-y border-white/10 bg-black py-3 text-white">
      <div className="flex w-max" style={{ animation: "flock-scroll 36s linear infinite" }}>
        {track.map((t, i) => (
          <span key={i} className="flex items-center text-[12px] uppercase tracking-[0.2em] text-white/65">
            <span className="px-6">{t}</span>
            <span className="text-white/25">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
