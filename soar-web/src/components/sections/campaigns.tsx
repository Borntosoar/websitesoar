"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";
import { Magnetic } from "@/components/ui/magnetic";
import { buttonVariants } from "@/components/ui/button";

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

function CampaignBlock({
  eyebrow,
  title,
  cta,
  href,
  tone,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  cta: string;
  href: string;
  tone: "dawn" | "dusk";
  align?: "center" | "left";
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const grainY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const bg =
    tone === "dawn"
      ? "radial-gradient(110% 90% at 50% 100%, rgba(230,197,102,0.22), transparent 55%), linear-gradient(180deg, #2A251F 0%, #1F1B16 100%)"
      : "radial-gradient(90% 70% at 80% 0%, rgba(231,226,215,0.10), transparent 50%), linear-gradient(160deg, #262119 0%, #17140F 80%)";

  return (
    <section ref={ref} className="relative h-[88svh] w-full overflow-hidden text-bone" style={{ background: bg }}>
      <motion.div
        aria-hidden
        className="absolute inset-0 opacity-[0.05] mix-blend-screen"
        style={{ y: grainY, backgroundImage: NOISE }}
      />
      <motion.div
        style={{ y: contentY }}
        className={
          "relative z-10 flex h-full flex-col justify-end gap-4 px-6 pb-14 md:px-12 md:pb-16 " +
          (align === "center" ? "items-center text-center" : "items-start text-left")
        }
      >
        <Reveal>
          <span className="text-[11px] uppercase tracking-[0.24em] text-bone/60">{eyebrow}</span>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="max-w-3xl text-4xl font-medium leading-[1.02] tracking-tight md:text-6xl">{title}</h2>
        </Reveal>
        <Reveal delay={160}>
          <Magnetic>
            <a href={href} className={buttonVariants({ variant: "paper" })}>
              {cta}
            </a>
          </Magnetic>
        </Reveal>
      </motion.div>
    </section>
  );
}

export function CampaignOne() {
  return (
    <CampaignBlock
      eyebrow="Campaign — SS26"
      title="Built by three. Worn by everyone still waiting on results."
      cta="Shop Ascension Vol.01"
      href="#shop"
      tone="dawn"
    />
  );
}

export function CampaignTwo() {
  return (
    <CampaignBlock
      eyebrow="The Standard"
      title="Small details, added up. That's the whole strategy."
      cta="Our world"
      href="#world"
      tone="dusk"
      align="left"
    />
  );
}

const tiles = [
  { label: "Hoodies", note: "600gsm organic", href: "#shop", g: "linear-gradient(165deg,#EDE9DF, #D8D2C2)" },
  { label: "Outerwear", note: "Japanese dry twill", href: "#shop", g: "linear-gradient(165deg,#E3DECF, #C9C2AE)" },
] as const;

export function CategorySplit() {
  return (
    <section className="grid md:grid-cols-2">
      {tiles.map((t, i) => (
        <a
          key={t.label}
          href={t.href}
          className="group relative flex h-[62svh] flex-col justify-end overflow-hidden p-8 text-ink md:p-10"
          style={{ background: t.g }}
        >
          <span className="absolute right-6 top-2 select-none font-serif text-[9rem] italic leading-none text-ink/[0.07] transition-transform duration-700 group-hover:-translate-y-2">
            {i === 0 ? "I" : "II"}
          </span>
          <span className="text-[11px] uppercase tracking-[0.2em] text-ink/55">{t.note}</span>
          <span className="mt-1 text-3xl font-medium tracking-tight md:text-4xl">{t.label}</span>
          <span className="mt-3 text-[12px] uppercase tracking-[0.14em] underline underline-offset-4 opacity-70 transition-opacity group-hover:opacity-100">
            Shop now
          </span>
        </a>
      ))}
    </section>
  );
}
