import { Reveal } from "@/components/ui/reveal";

const tenets = [
  ["01", "Discomfort is the tuition"],
  ["02", "Quiet outside, loud within"],
  ["03", "Rise, then reach back — a share of every drop funds youth programs"],
] as const;

export function World() {
  return (
    <section id="world" className="bg-oat py-24 text-ink md:py-40">
      <div className="mx-auto max-w-7xl px-5 md:px-12">
        <div className="mb-14 flex items-center justify-between border-b border-ink/10 pb-5 text-[11px] uppercase tracking-[0.17em] text-taupe">
          <span>(03) Our World</span>
          <span>The meaning</span>
        </div>
        <Reveal>
          <h2 className="text-3xl font-medium leading-[1.08] tracking-tight md:text-5xl xl:text-6xl">
            We don&apos;t make clothes.
            <br />
            We make <em className="font-serif font-normal italic">reminders</em> that
            <br />
            nothing grows inside comfort.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
          <Reveal>
            <p className="text-ink/70 md:text-lg">
              Every piece is cut from heavyweight organic cloth, finished by hand,
              numbered, and built to outlast the season that chased it. No logos for
              the sake of logos. No noise — only intent.
            </p>
          </Reveal>
          <div>
            {tenets.map(([n, t], i) => (
              <Reveal key={n} delay={i * 90}>
                <div className="flex items-baseline gap-5 border-t border-ink/10 py-4">
                  <span className="text-[11px] uppercase tracking-[0.17em] text-taupe">{n}</span>
                  <span className="md:text-lg">{t}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
