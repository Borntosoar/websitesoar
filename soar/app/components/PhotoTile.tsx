import { Figure } from "./Figure";

type Fit = "longsleeve" | "tee" | "shorts";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// A campaign tile. Real photography when we have it (`image`); otherwise a
// stylized silhouette on a studio sweep as an honest placeholder until the shot
// for that piece lands.
export function PhotoTile({
  image,
  fit = "longsleeve",
  flip = false,
  tone = "dark",
  position = "object-center",
  eyebrow,
  title,
  cta,
  href,
  aspect = "aspect-[3/4]",
  className = "",
}: {
  image?: string;
  fit?: Fit;
  flip?: boolean;
  tone?: "light" | "dark";
  position?: string;
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
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={title ?? ""}
          loading="lazy"
          className={`photo-grade absolute inset-0 h-full w-full object-cover ${position} transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]`}
        />
      ) : (
        <>
          <div className={`absolute inset-0 ${dark ? "bg-gradient-to-b from-[#26231f] to-[#0c0b0a]" : "bg-gradient-to-b from-[#eceae4] to-[#cbc7bd]"}`} />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: dark
              ? "radial-gradient(120% 65% at 50% 12%, rgba(244,243,239,0.16), transparent 60%)"
              : "radial-gradient(120% 70% at 50% 8%, rgba(255,255,255,0.5), transparent 55%)" }}
          />
          <Figure fit={fit} flip={flip} className={`absolute bottom-0 left-1/2 h-[92%] w-auto -translate-x-1/2 ${dark ? "text-paper/85" : "text-ink/80"}`} />
        </>
      )}

      {/* unifying grade — vignette so bright-studio + dark-garage shots read as one shoot */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(115% 95% at 50% 32%, transparent 44%, rgba(8,7,6,0.5))" }}
      />
      {/* grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />
      {(title || cta) && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/65 to-transparent" />}

      {(eyebrow || title || cta) && (
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center px-4 pb-7 text-center text-paper">
          {eyebrow && <span className="mono mb-2 text-paper/85">{eyebrow}</span>}
          {title && <span className="display text-[clamp(1.1rem,2vw,1.7rem)] leading-tight drop-shadow">{title}</span>}
          {cta && <span className="mono mt-3 border-b border-paper/80 pb-1 transition-colors group-hover:border-paper">{cta}</span>}
        </div>
      )}
    </Wrapper>
  );
}
