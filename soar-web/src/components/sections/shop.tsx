import { ProductCard } from "@/components/ui/product-card";

const pieces = [
  { id: "ascension-hoodie", idx: "I", name: "Ascension Hoodie", meta: "600gsm organic", price: 280 },
  { id: "limitless-tee", idx: "II", name: "Limitless Tee", meta: "Long-staple pima", price: 120, soldOut: true },
  { id: "rise-above-jacket", idx: "III", name: "Rise Above Jacket", meta: "Japanese dry twill", price: 420 },
  { id: "comfort-ends-cargo", idx: "IV", name: "Comfort Ends Cargo", meta: "Italian ripstop", price: 260 },
];

export function Shop() {
  return (
    <section id="shop" className="bg-paper py-20 text-ink md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-12">
        <div className="mb-12 flex items-center justify-between border-b border-ink/10 pb-5 text-[11px] uppercase tracking-[0.17em] text-taupe">
          <span>(02) Shop — Ascension</span>
          <span>Tilt · quick add</span>
        </div>
        <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {pieces.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}
