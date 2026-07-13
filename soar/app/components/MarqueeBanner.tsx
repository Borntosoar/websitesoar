const items = [
  "DROP 002",
  "ASCENT COLLECTION",
  "LIMITED RELEASE",
  "GROWTH BEGINS WHERE COMFORT ENDS",
  "DROP 002",
  "ASCENT COLLECTION",
  "LIMITED RELEASE",
  "GROWTH BEGINS WHERE COMFORT ENDS",
];

export default function MarqueeBanner() {
  return (
    <div className="w-full overflow-hidden border-y border-white/10 bg-black py-3">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="mx-6 text-[10px] uppercase tracking-[0.35em] text-white/40"
          >
            {item}
            <span className="ml-6 text-white/15">—</span>
          </span>
        ))}
      </div>
    </div>
  );
}
