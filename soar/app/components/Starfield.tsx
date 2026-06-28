// Faint, deterministic starfield (fixed positions — no hydration mismatch).
// Colour comes from the parent via currentColor; opacity via the parent class.
const STARS: [number, number, number][] = [
  [6, 12, 0.5], [13, 31, 0.35], [9, 58, 0.45], [18, 78, 0.3], [24, 20, 0.55],
  [29, 45, 0.35], [21, 63, 0.4], [34, 84, 0.3], [38, 14, 0.45], [43, 38, 0.6],
  [47, 70, 0.35], [52, 24, 0.4], [56, 52, 0.5], [49, 88, 0.3], [61, 16, 0.35],
  [64, 42, 0.45], [68, 66, 0.4], [59, 78, 0.3], [73, 28, 0.55], [77, 54, 0.35],
  [71, 86, 0.4], [82, 18, 0.4], [86, 44, 0.5], [80, 70, 0.3], [90, 32, 0.45],
  [94, 60, 0.35], [88, 82, 0.4], [3, 40, 0.35], [16, 48, 0.3], [37, 60, 0.4],
  [45, 12, 0.3], [66, 8, 0.4], [92, 12, 0.35], [97, 46, 0.3], [33, 33, 0.3], [54, 36, 0.35],
];

export function Starfield({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {STARS.map(([x, y, r], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={r}
          fill="currentColor"
          className="twinkle"
          style={{ animationDelay: `${(i % 7) * 0.5}s`, animationDuration: `${3 + (i % 4)}s` }}
        />
      ))}
    </svg>
  );
}
