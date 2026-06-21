import Link from "next/link";
import { products } from "@/lib/products";

/** The "flush" section — strict grid, consistent aspect ratio + gutter. */
export function EditorialGrid() {
  return (
    <section id="shop" className="frame py-20 md:py-28">
      <div className="mb-10 flex items-end justify-between md:mb-14">
        <h2 className="over text-[clamp(2rem,5vw,3.6rem)]">The Index</h2>
        <span className="mono text-black/45">{products.length} pieces</span>
      </div>
      <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 md:gap-x-8 md:gap-y-16">
        {products.map((p, i) => (
          <Link key={p.id} href={`/product/${p.handle}`} className="group">
            <div className="relative aspect-[3/4] overflow-hidden border border-black/12 bg-[#f1f1f1]">
              <div className="over absolute inset-0 flex items-center justify-center text-[20vw] text-black/[0.06] md:text-[6rem]">
                {String(i + 1).padStart(2, "0")}
              </div>
              {p.left === 0 && <span className="mono absolute left-3 top-3 bg-black px-2 py-1 text-white">Sold out</span>}
              {p.tag && p.left > 0 && <span className="mono absolute left-3 top-3 text-black/50">{p.tag}</span>}
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-3">
              <span className="mono truncate">{p.name}</span>
              <span className="mono shrink-0 tabular-nums">${p.price}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
