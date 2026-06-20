/** Minimal Supreme-style social proof. One band, no clutter. */
export function CommunityBand() {
  const stats: [string, string][] = [
    ["12,480", "In line"],
    ["001", "Current drop"],
    ["173s", "Last sellout"],
    ["48", "Countries"],
  ];
  return (
    <section id="archive" className="border-y border-black/14 bg-black text-white">
      <div className="frame grid grid-cols-2 gap-y-10 py-16 md:grid-cols-4 md:py-20">
        {stats.map(([n, l]) => (
          <div key={l} className="text-center">
            <div className="over text-[clamp(2.4rem,6vw,4.5rem)] leading-none tabular-nums">{n}</div>
            <div className="mono mt-3 text-white/45">{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
