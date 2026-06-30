"use client";

import { useState } from "react";
import { Figure } from "./Figure";

type Fit = "longsleeve" | "tee" | "shorts";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// A free AI model photo, generated client-side (the user's browser fetches it —
// not gated by our build network). Forced to grayscale so it stays on-brand B&W.
// The Figure silhouette underneath is the instant fallback / loading state, and
// the permanent fallback if the image fails. Swap for real photography later.
export function modelUrl(fit: Fit, tone: "light" | "dark", seed: number) {
  const outfit =
    fit === "shorts"
      ? "an oversized t-shirt, baggy shorts and chunky sneakers"
      : fit === "tee"
        ? "an oversized t-shirt, baggy trousers and chunky sneakers"
        : "an oversized long-sleeve top, baggy trousers and chunky sneakers";
  const light = tone === "dark" ? "dark studio, dramatic low-key lighting" : "minimal light grey studio, soft high-key lighting";
  const prompt = `black and white editorial fashion photograph, full body, a stylish model wearing ${outfit}, ${light}, high-fashion streetwear campaign, film grain, monochrome, plain background, no text`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=600&height=800&nologo=true&seed=${seed}&model=flux`;
}

export function PhotoTile({
  fit = "longsleeve",
  flip = false,
  tone = "light",
  seed = 1,
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
  seed?: number;
  eyebrow?: string;
  title?: string;
  cta?: string;
  href?: string;
  aspect?: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const dark = tone === "dark";
  const Wrapper: "a" | "div" = href ? "a" : "div";

  return (
    <Wrapper {...(href ? { href } : {})} className={`group relative block overflow-hidden ${aspect} ${className}`}>
      {/* fallback: studio sweep + silhouette (instant; stays if the photo fails) */}
      <div className={`absolute inset-0 ${dark ? "bg-gradient-to-b from-[#26231f] to-[#0c0b0a]" : "bg-gradient-to-b from-[#eceae4] to-[#cbc7bd]"}`} />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: dark
          ? "radial-gradient(120% 65% at 50% 12%, rgba(244,243,239,0.18), transparent 60%)"
          : "radial-gradient(120% 70% at 50% 8%, rgba(255,255,255,0.5), transparent 55%)" }}
      />
      <Figure fit={fit} flip={flip} className={`absolute bottom-0 left-1/2 h-[92%] w-auto -translate-x-1/2 ${dark ? "text-paper/85" : "text-ink/80"}`} />

      {/* real AI model photo (client-fetched), grayscale to stay on brand */}
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={modelUrl(fit, dark ? "dark" : "light", seed)}
          alt=""
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover object-top grayscale contrast-[1.05] transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}

      {/* grain */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 ${dark ? "opacity-[0.08] mix-blend-screen" : "opacity-[0.05] mix-blend-multiply"}`}
        style={{ backgroundImage: GRAIN }}
      />
      {(title || cta) && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />}

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
