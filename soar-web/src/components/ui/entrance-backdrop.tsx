/**
 * SOAR — Entrance backdrop. A lightweight, dependency-free monochrome scene used
 * (1) as the loading state while the heavy 3D chunk downloads, and (2) as the
 * static fallback when WebGL is unavailable or the visitor prefers reduced
 * motion. Pure CSS + positioned dots — no three.js, no animation. Evokes the
 * road-to-the-stars: night sky, a faint horizon light (light from darkness),
 * a quiet static starfield.
 */

// deterministic scatter (no Math.random → no hydration / flicker surprises)
const STARS = Array.from({ length: 64 }).map((_, i) => ({
  left: (i * 37.137) % 100,
  top: (i * 22.7) % 72,
  size: (i % 3) + 1,
  opacity: 0.1 + (((i * 13) % 50) / 100) * 0.55,
}));

export function EntranceBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black" aria-hidden="true">
      {/* night sky deepening downward */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-[#0a0a0c]" />
      {/* faint horizon light rising — light emerging from darkness */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_94%,rgba(255,255,255,0.12),transparent_62%)]" />
      {/* a quiet, static starfield in the upper sky */}
      {STARS.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, opacity: s.opacity }}
        />
      ))}
    </div>
  );
}
