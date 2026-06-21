import Link from "next/link";
import { drop } from "@/lib/products";

/** One drop, full architectural scale. No competing cards. */
export function DropStrip() {
  const pct = Math.round((1 - drop.left / drop.total) * 100);
  return (
    <section id="drop" className="border-b border-black/14">
      <div className="grid md:grid-cols-2">
        <div className="relative flex aspect-[4/5] items-end overflow-hidden bg-black p-6 md:aspect-auto md:min-h-[82vh] md:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_38%,#191919,#000)]" />
          <span className="over relative text-[24vw] leading-none text-white/90 md:text-[13rem]">001</span>
        </div>
        <div className="flex flex-col justify-center gap-6 p-6 md:p-16">
          <span className="mono text-black/45">Current drop</span>
          <h2 className="over text-[clamp(2.6rem,7vw,6rem)]">{drop.name}</h2>
          <p className="mono text-black/55">
            <span className="tabular-nums">{drop.left}/{drop.total}</span> remaining · {pct}% claimed
          </p>
          <div className="h-[2px] w-full max-w-md bg-black/12">
            <div className="h-full bg-black" style={{ width: `${pct}%` }} />
          </div>
          <Link href={`/product/${drop.handle}`} className="mono mt-2 w-fit bg-black px-8 py-3.5 text-white transition-opacity hover:opacity-80">
            Enter drop
          </Link>
        </div>
      </div>
    </section>
  );
}
