import { Reveal } from "./Reveal";
import { BoxMark } from "./BoxMark";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// Two full-bleed campaign banners over real photography (Represent move) — the
// shop and First Flight, each on a Drop 001 shot with the box→bird mark as a
// quiet watermark. No blank fills.
function Banner({ href, image, eyebrow, title, cta }: { href: string; image: string; eyebrow: string; title: string; cta: string }) {
  return (
    <a href={href} className="group on-dark relative flex min-h-[66svh] flex-col justify-end overflow-hidden p-10 text-paper md:min-h-[80svh] md:p-14">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt="" loading="lazy" decoding="async" className="photo-grade absolute inset-0 h-full w-full object-cover object-top transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/25" />
      <div aria-hidden className="pointer-events-none absolute -right-8 -top-6 opacity-[0.1] transition-transform duration-700 ease-out group-hover:-translate-x-1 group-hover:-translate-y-1">
        <BoxMark className="h-[30vmin] w-[30vmin] text-paper" />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-screen" style={{ backgroundImage: GRAIN }} />
      <Reveal>
        <p className="mono text-paper/80">{eyebrow}</p>
        <h2 className="display mt-3 text-[clamp(2.4rem,5vw,4.6rem)] drop-shadow">{title}</h2>
        <span className="mono mt-7 inline-block border border-paper/50 px-10 py-3.5 transition-colors group-hover:bg-paper group-hover:text-ink">{cta}</span>
      </Reveal>
    </a>
  );
}

export function SplitBanner() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      <Banner href="#collection" image="/lookbook/jacket-front.webp" eyebrow="Designed in Alberta, Canada" title="Collection One" cta="Shop the drop" />
      <Banner href="#access" image="/lookbook/jacket-back.webp" eyebrow="Members go first" title="First Flight" cta="Join the list" />
    </section>
  );
}
