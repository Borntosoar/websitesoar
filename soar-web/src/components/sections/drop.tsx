import { Countdown } from "@/components/ui/countdown";
import { Reveal } from "@/components/ui/reveal";
import { buttonVariants } from "@/components/ui/button";

export function Drop() {
  return (
    <section id="drop" className="bg-espresso py-20 text-bone md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-12">
        <div className="mb-12 flex items-center justify-between border-b border-bone/15 pb-5 text-[11px] uppercase tracking-[0.17em] text-bone/55">
          <span>(01) The Drop</span>
          <span>This week — Vol.01</span>
        </div>
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr] md:items-start">
          <div>
            <span className="text-[11px] uppercase tracking-[0.17em] text-bone/55">Next drop in</span>
            <div className="mb-7 mt-4">
              <Countdown />
            </div>
            <h2 className="text-3xl font-medium tracking-tight md:text-4xl">
              Ascension <em className="font-serif font-normal italic">Vol.01</em>
            </h2>
            <p className="mt-4 max-w-md text-bone/60">
              Four numbered essentials. Two hundred of each, released together,
              once. When the timer reaches zero the drop goes live — and when
              they&apos;re gone, they&apos;re gone.
            </p>
            <a href="#shop" className={buttonVariants({ variant: "bone", className: "mt-7" })}>
              Preview the collection
            </a>
          </div>
          <Reveal delay={120}>
            <aside className="border border-bone/15 p-5">
              <div className="flex justify-between text-[11px] uppercase tracking-[0.17em] text-bone/55">
                <span>Lead piece</span>
                <span>Limited 200</span>
              </div>
              <div className="my-4 grid aspect-[16/10] place-items-center border border-bone/10 bg-white/[0.04]">
                <span className="font-serif text-5xl text-bone/40">S</span>
              </div>
              <div className="flex items-baseline justify-between">
                <h3 className="font-medium">Ascension Hoodie</h3>
                <span>$280</span>
              </div>
              <div className="mt-3 h-1 w-full bg-bone/15">
                <div className="h-full bg-bone" style={{ width: "92%" }} />
              </div>
              <span className="mt-2 block text-[11px] uppercase tracking-[0.17em] text-bone/55">
                184 / 200 reserved — one per customer
              </span>
            </aside>
          </Reveal>
        </div>
        <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-2 border-t border-bone/15 pt-6 text-[11px] uppercase tracking-[0.17em] text-bone/55">
          <li>Numbered &amp; authenticated</li>
          <li>Organic, traceable cloth</li>
          <li>30-day returns</li>
          <li>Secure checkout</li>
        </ul>
      </div>
    </section>
  );
}
