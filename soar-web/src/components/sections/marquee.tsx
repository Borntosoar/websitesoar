export function Marquee() {
  const items = ["Rise above", "Soar", "Ascension Vol.01", "Made to a 110% standard"];
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-ink/10 bg-oat py-3">
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap will-change-transform">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-8 text-sm font-medium tracking-tight text-ink/80">
            <span className={i % 2 ? "font-serif italic text-ink/55" : ""}>{t}</span>
            <span className="text-taupe">—</span>
          </span>
        ))}
      </div>
    </div>
  );
}
