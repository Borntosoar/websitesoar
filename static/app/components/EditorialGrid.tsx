const looks = [
  { label: "LOOK 01", from: "#1a1a1a", to: "#050505" },
  { label: "LOOK 02", from: "#2a2a2a", to: "#0a0a0a" },
  { label: "LOOK 03", from: "#151515", to: "#000000" },
  { label: "LOOK 04", from: "#242424", to: "#080808" },
  { label: "LOOK 05", from: "#1e1e1e", to: "#040404" },
  { label: "LOOK 06", from: "#272727", to: "#0c0c0c" },
  { label: "LOOK 07", from: "#181818", to: "#000000" },
  { label: "LOOK 08", from: "#202020", to: "#060606" },
];

export default function EditorialGrid() {
  return (
    <section id="archive" className="w-full bg-black">
      <div className="grid grid-cols-2 gap-px bg-white/10 sm:grid-cols-3 md:grid-cols-4">
        {looks.map((look) => (
          <div
            key={look.label}
            className="group relative aspect-[4/5] overflow-hidden bg-black"
            style={{
              backgroundImage: `linear-gradient(155deg, ${look.from}, ${look.to})`,
            }}
          >
            <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-[0.3em] text-white/50 transition-colors group-hover:text-white">
              {look.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
