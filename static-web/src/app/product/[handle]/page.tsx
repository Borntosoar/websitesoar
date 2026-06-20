import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { products, byHandle } from "@/lib/products";

export function generateStaticParams() {
  return products.map((p) => ({ handle: p.handle }));
}

export default function ProductPage({ params }: { params: { handle: string } }) {
  const p = byHandle(params.handle);
  if (!p) notFound();
  const pct = Math.round((1 - p.left / p.total) * 100);

  return (
    <>
      <SiteHeader />
      <main className="frame grid gap-12 py-12 md:grid-cols-2 md:gap-16 md:py-20">
        <div className="relative aspect-[3/4] overflow-hidden border border-black/12 bg-[#f1f1f1]">
          <div className="over absolute inset-0 flex items-center justify-center text-[8rem] text-black/[0.06]">{p.category.slice(0, 2)}</div>
          {p.left === 0 && <span className="mono absolute left-3 top-3 bg-black px-2 py-1 text-white">Sold out</span>}
        </div>
        <div className="flex flex-col justify-center gap-7">
          {p.tag && <span className="mono text-black/45">{p.tag}</span>}
          <h1 className="over text-[clamp(2.4rem,6vw,4.5rem)]">{p.name}</h1>
          <span className="over text-2xl tabular-nums">${p.price}</span>
          <p className="mono text-black/55">{p.category} · {p.left > 0 ? `${p.left}/${p.total} remaining · ${pct}% claimed` : "Sold out"}</p>
          <div className="flex flex-wrap gap-2">
            {p.sizes.map((s) => (
              <span key={s} className="mono border border-black/20 px-4 py-2">{s}</span>
            ))}
          </div>
          <button
            type="button"
            disabled={p.left === 0}
            className="mono mt-2 w-fit bg-black px-10 py-4 text-white transition-opacity hover:opacity-80 disabled:opacity-40"
          >
            {p.left === 0 ? "Sold out" : "Add to bag"}
          </button>
          <p className="mono text-black/35">Secure Shopify checkout · Shop Pay</p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
