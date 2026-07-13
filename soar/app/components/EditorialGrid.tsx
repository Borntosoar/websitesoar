import Image from "next/image";

const HERO_IMG =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3FXgELxsRYjIzXOtRqy3Oa9oQQ7/hf_20260701_210915_03b1f4ae-d985-442e-b60b-e4d98dba62ba.png";

const concepts = [
  {
    id: "002",
    name: "ELEVATION\nHOODIE",
    price: "£195",
    tag: "DROP 002",
    bg: "radial-gradient(ellipse at 20% 80%, #1c1c3a 0%, #050508 55%, #000 100%)",
  },
  {
    id: "003",
    name: "RISE\nCARGO",
    price: "£175",
    tag: "DROP 002",
    bg: "radial-gradient(ellipse at 80% 20%, #1a0f0a 0%, #060402 55%, #000 100%)",
  },
  {
    id: "004",
    name: "ASCENT\nTEE",
    price: "£95",
    tag: "DROP 002",
    bg: "radial-gradient(ellipse at 50% 100%, #0d150d 0%, #020503 55%, #000 100%)",
  },
  {
    id: "005",
    name: "SUMMIT\nJOGGER",
    price: "£145",
    tag: "DROP 002",
    bg: "radial-gradient(ellipse at 10% 50%, #12121e 0%, #040408 55%, #000 100%)",
  },
  {
    id: "006",
    name: "PEAK\nLONGSLEEVE",
    price: "£120",
    tag: "DROP 002",
    bg: "radial-gradient(ellipse at 90% 90%, #1a1008 0%, #060402 55%, #000 100%)",
  },
  {
    id: "007",
    name: "SOAR\nSHORTS",
    price: "£110",
    tag: "DROP 002",
    bg: "radial-gradient(ellipse at 50% 0%, #0f0f1a 0%, #030305 55%, #000 100%)",
  },
];

export default function EditorialGrid() {
  return (
    <section id="archive" className="w-full bg-black">
      {/* Headline */}
      <div className="flex items-end justify-between border-b border-white/10 px-6 py-6 md:px-10">
        <h2 className="font-display text-2xl tracking-tight text-white sm:text-3xl">
          Drop 002
        </h2>
        <span className="text-[10px] uppercase tracking-[0.35em] text-white/30">
          7 pieces
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-px bg-white/[0.06] md:grid-cols-4">
        {/* Hero cell — real image, spans 2 cols + 2 rows */}
        <div className="group relative col-span-2 row-span-2 overflow-hidden bg-black">
          <Image
            src={HERO_IMG}
            alt="SOAR Ascent Jacket — Drop 002"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-6">
            <div>
              <p className="text-[9px] uppercase tracking-[0.35em] text-white/40">
                Drop 002 — 001
              </p>
              <p className="font-display mt-1 text-xl tracking-tight text-white">
                ASCENT JACKET
              </p>
            </div>
            <span className="text-sm text-white/60">£295</span>
          </div>
          <div className="absolute right-5 top-5 opacity-0 transition-opacity group-hover:opacity-100">
            <span className="rounded-full border border-white/30 px-4 py-1.5 text-[9px] uppercase tracking-[0.3em] text-white">
              View
            </span>
          </div>
        </div>

        {/* Concept cells */}
        {concepts.map((c) => (
          <div
            key={c.id}
            className="group relative aspect-[4/5] overflow-hidden bg-black"
            style={{ backgroundImage: c.bg }}
          >
            {/* Subtle grid lines */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 48px)",
              }}
            />

            {/* Large watermark number */}
            <span className="absolute right-4 top-4 font-display text-[80px] leading-none text-white/[0.04] select-none">
              {c.id}
            </span>

            {/* Product name */}
            <div className="absolute inset-x-0 top-0 flex flex-col p-5">
              <p className="text-[9px] uppercase tracking-[0.35em] text-white/30">
                {c.tag}
              </p>
              <p className="font-display mt-3 whitespace-pre-line text-lg leading-tight tracking-tight text-white/80 transition-colors group-hover:text-white">
                {c.name}
              </p>
            </div>

            {/* Bottom metadata */}
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-5">
              <span className="text-xs text-white/40 transition-colors group-hover:text-white/70">
                {c.price}
              </span>
              <span className="translate-y-1 text-[9px] uppercase tracking-[0.3em] text-white/0 transition-all group-hover:translate-y-0 group-hover:text-white/50">
                View →
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
