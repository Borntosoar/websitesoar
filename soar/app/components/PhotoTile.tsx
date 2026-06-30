import { Figure } from "./Figure";

type Fit = "longsleeve" | "tee" | "shorts";

// A "campaign photo" tile — a stylish figure on a lit studio sweep with grain,
// vignette and a grounding shadow, with an optional overlaid label + link.
// Concept stand-in for real photography; reused across hero, tiles and banners.
export function PhotoTile({
  fit = "longsleeve",
  flip = false,
  tone = "light",
  eyebrow,
  title,
  cta,
  href,
  aspect = "aspect-[3/4]",
  className = "",
}: {
  fit?: Fit;
  flip?: boolean;
  tone?: "light" | "dark";
  eyebrow?: string;
  title?: string;
  cta?: string;
  href?: string;
  aspect?: string;
  className?: string;
}) {
  const dark = tone === "dark";
  const Wrapper: "a" | "div" = href ? "a" : "div";

  return (
    <Wrapper {...(href ? { href } : {})} className={`group relative block overflow-hidden ${aspect} ${className}`}>
      {/* studio backdrop */}
      <div className={`absolute inset-0 ${dark ? "bg-gradient-to-b from-[#26231f] to-[#0c0b0a]" : "bg-gradient-to-b from-[#eceae4] to-[#cbc7bd]"}`} />
      {/* light sweep */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: dark
          ? "radial-gradient(120% 65% at 50% 12%, rgba(244,243,239,0.20), transparent 60%)"
          : "radial-gradient(120% 70% at 50% 8%, rgba(255,255,255,0.55), transparent 55%)" }}
      />
      {/* the figure */}
      <Figure fit={fit} flip={flip} className={`absolute bottom-0 left-1/2 h-[92%] w-auto -translate-x-1/2 transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03] ${dark ? "text-paper/90" : "text-ink/85"}`} />
      {/* grounding shadow */}
      <div className={`pointer-events-none absolute inset-x-[28%] bottom-[5%] h-5 rounded-[50%] blur-md ${dark ? "bg-black/55" : "bg-ink/25"}`} />
      {/* grain */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 ${dark ? "opacity-[0.08] mix-blend-screen" : "opacity-[0.05] mix-blend-multiply"}`}
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />
      {/* bottom legibility scrim when there's text */}
      {(title || cta) && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 to-transparent" />}

      {/* overlay copy */}
      {(eyebrow || title || cta) && (
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-4 pb-7 text-center text-paper">
          {eyebrow && <span className="mono mb-2 text-paper/80">{eyebrow}</span>}
          {title && <span className="display text-[clamp(1.1rem,2vw,1.7rem)] leading-tight">{title}</span>}
          {cta && <span className="mono mt-3 border-b border-paper/70 pb-1 transition-colors group-hover:border-paper">{cta}</span>}
        </div>
      )}
    </Wrapper>
  );
}
