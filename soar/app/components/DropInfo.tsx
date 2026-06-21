import type { SoarProduct } from "@/lib/shopify";
import { AddToBag } from "./cart/AddToBag";

// Claimed % needs an edition-size metafield to be honest; placeholder until then.
const PLACEHOLDER_CLAIMED = 84;

export function DropInfo({ product }: { product?: SoarProduct }) {
  const title = product?.title ?? "The Ascension";
  const claimed = PLACEHOLDER_CLAIMED;
  const status = product
    ? product.available
      ? "Limited release · live now"
      : "Sold out"
    : `${claimed}% claimed · limited release`;

  return (
    <section id="drop" className="border-b border-white/10">
      <div className="grid md:grid-cols-2">
        <div className="relative flex aspect-[4/5] items-end overflow-hidden bg-[radial-gradient(60%_60%_at_50%_38%,#161616,#000)] p-6 md:aspect-auto md:min-h-[80vh] md:p-12">
          {product?.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image} alt={product.title} className="absolute inset-0 h-full w-full object-cover opacity-90" />
          )}
          <span className="display relative text-[24vw] leading-none text-white/90 md:text-[13rem]">001</span>
        </div>
        <div className="flex flex-col justify-center gap-6 p-6 md:p-16">
          <span className="mono text-white/45">Current drop</span>
          <h2 className="display text-[clamp(2.6rem,7vw,6rem)] text-white">{title}</h2>
          <p className="mono text-white/55">{status}</p>
          <div className="h-[2px] w-full max-w-md bg-white/12">
            <div className="h-full bg-white" style={{ width: `${claimed}%` }} />
          </div>
          <AddToBag product={product} />
        </div>
      </div>
    </section>
  );
}
