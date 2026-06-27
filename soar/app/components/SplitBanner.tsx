import { Reveal } from "./Reveal";
import { BoxMark } from "./BoxMark";
import { Starfield } from "./Starfield";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

function Banner({
  href,
  eyebrow,
  title,
  cta,
  dark,
}: {
  href: string;
  eyebrow: string;
  title: string;
  cta: string;
  dark?: boolean;
}) {
  const text = dark ? "text-paper" : "text-ink";
  const markTone = dark ? "text-paper/[0.09]" : "text-ink/[0.06]";
  const border = dark ? "border-paper/55 hover:bg-paper hover:text-ink" : "border-ink/40 hover:bg-ink hover:text-paper";
  return (
    <div className={`relative flex min-h-[78svh] flex-col justify-end overflow-hidden p-10 md:p-14 ${dark ? "bg-pitch" : "bg-panel"} ${text} ${dark ? "on-dark" : ""}`}>
      {/* atmosphere */}
      {dark && (
        <>
          <Starfield className="pointer-events-none absolute inset-0 h-full w-full text-paper/45" />
          <div
            className="pointer-events-none absolute right-[16%] top-[18%] h-40 w-40 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(230,234,255,0.22), transparent 68%)" }}
          />
        </>
      )}
      <div aria-hidden className="pointer-events-none absolute -right-10 -top-8">
        <BoxMark className={`h-[34vmin] w-[34vmin] ${markTone}`} />
      </div>
      <div aria-hidden className={`pointer-events-none absolute inset-0 ${dark ? "opacity-[0.06] mix-blend-screen" : "opacity-[0.035] mix-blend-multiply"}`} style={{ backgroundImage: GRAIN }} />

      <Reveal>
        <p className="mono opacity-70">{eyebrow}</p>
        <h3 className="display mt-4 text-[clamp(2.4rem,5vw,4.6rem)]">{title}</h3>
        <a href={href} className={`mono mt-8 inline-block border px-10 py-3.5 transition-colors ${border}`}>
          {cta}
        </a>
      </Reveal>
    </div>
  );
}

export function SplitBanner() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      <Banner href="#collection" eyebrow="Designed in Alberta, Canada" title="Collection One" cta="Shop the drop" />
      <Banner href="#access" eyebrow="Members go first" title="First Flight" cta="Join the list" dark />
    </section>
  );
}
