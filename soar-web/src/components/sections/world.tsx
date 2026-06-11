import { Reveal } from "@/components/ui/reveal";
import { RevealWords } from "@/components/ui/reveal-words";

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
        <RevealWords
          className="text-3xl font-medium leading-[1.12] tracking-tight md:text-5xl xl:text-6xl"
          text="We don't make clothes. We make reminders that nothing grows inside comfort."
          accentWord="reminders"
        />
        <div className="mt-12 grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
          <Reveal>
            <p className="text-ink/70 md:text-lg">
              Three friends, same struggle: putting in the work and not seeing the result —
              yet. SOAR is the all-or-nothing answer. Every piece is cut from heavyweight
              organic cloth, finished by hand, numbered. No logos for the sake of logos. No
              noise — only intent.
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
