const stats: [string, string][] = [
  ["12,480", "On the list"],
  ["001", "Current drop"],
  ["173s", "Last sellout"],
  ["48", "Countries"],
];

export function CommunityBand() {
  return (
    <section className="border-b border-white/10">
      <div className="wrap grid grid-cols-2 gap-y-10 py-16 md:grid-cols-4 md:py-20">
        {stats.map(([n, l]) => (
          <div key={l} className="text-center">
            <div className="display text-[clamp(2.4rem,6vw,4.5rem)] tabular-nums text-white">{n}</div>
            <div className="mono mt-3 text-white/45">{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
