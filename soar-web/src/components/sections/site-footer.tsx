"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Reveal } from "@/components/ui/reveal";

const cols: [string, [string, string][]][] = [
  ["Shop", [["New Arrivals", "#shop"], ["Collections", "#collection"], ["The Drop", "#drop"], ["Upcoming", "#upcoming"]]],
  ["House", [["The Box", "#the-box"], ["The Code", "#manifesto"], ["The Flock", "#community"], ["Journal", "#journal"]]],
  ["Support", [["FAQ", "#faq"], ["Contact", "mailto:soarnextlevel@gmail.com"], ["Shipping & Returns", "#faq"], ["Size Guide", "#faq"]]],
  ["Legal", [["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"], ["Cookie Policy", "/cookies"]]],
];

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const cls =
    "group/link inline-flex items-center gap-1.5 text-sm text-bone/55 transition-colors duration-300 hover:text-bone";
  const inner = (
    <>
      <span className="h-px w-0 bg-bone/40 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/link:w-3" />
      {children}
    </>
  );
  if (href.startsWith("/"))
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  return (
    <a href={href} className={cls}>
      {inner}
    </a>
  );
}

function FooterSignup() {
  return (
    <form
      className="flex flex-col gap-2.5"
      onSubmit={(e) => {
        e.preventDefault();
        const f = e.currentTarget;
        const note = f.querySelector("[data-note]") as HTMLElement | null;
        if (note) note.textContent = "You're in — check your inbox for 10% off.";
        f.reset();
      }}
      noValidate
    >
      <p className="mb-4 text-[15px] leading-relaxed text-bone/65 md:text-base">
        <strong className="font-medium text-bone">Get 10% off your first order</strong> — join the list for early drop
        access.
      </p>
      <div className="flex gap-2 border-b border-bone/20 pb-2 transition-colors focus-within:border-bone">
        <input
          type="email"
          required
          placeholder="Email address"
          aria-label="Email address"
          className="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-base text-bone outline-none transition-colors placeholder:text-bone/40 md:text-sm"
        />
        <button
          type="submit"
          className="shrink-0 px-2 py-2.5 text-[11px] uppercase tracking-[0.2em] text-bone transition-colors hover:text-stone active:scale-[0.98]"
        >
          Join
        </button>
      </div>
      <p data-note className="mt-3 text-[11px] uppercase tracking-[0.14em] text-bone/45">
        No noise — only ascent. Unsubscribe anytime.
      </p>
    </form>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-espresso px-5 pb-[max(env(safe-area-inset-bottom),2.25rem)] pt-24 text-bone md:px-12 md:pt-32">
      {/* light from dark — faint radial rising from the base */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] bg-[radial-gradient(70%_80%_at_50%_120%,rgba(255,255,255,0.06),transparent)]"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Top band: the invitation — eyebrow + signup, beside a quiet line */}
        <div className="grid gap-x-12 gap-y-12 border-b border-bone/15 pb-16 md:grid-cols-[1fr_1.1fr] md:pb-20">
          <Reveal>
            <span className="text-[11px] uppercase tracking-[0.34em] text-bone/45">The flight list</span>
            <p className="mt-6 max-w-sm text-[clamp(1.5rem,3.5vw,2.25rem)] font-semibold leading-[1.05] tracking-[-0.01em] text-bone">
              Join the <span className="font-serif italic font-normal text-bone/85">ascent</span>.
            </p>
          </Reveal>
          <Reveal delay={120} className="flex flex-col justify-end">
            <FooterSignup />
          </Reveal>
        </div>

        {/* Directory: wordmark + refined link columns */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 pt-16 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] md:pt-20">
          <div className="col-span-2 flex flex-col gap-6 md:col-span-1">
            <a href="#top" className="inline-block" aria-label="SOAR home">
              <Logo variant="white" className="h-14 w-auto md:h-16" />
            </a>
            <p className="max-w-xs text-[13px] leading-relaxed text-bone/45">
              Growth begins where comfort ends.
            </p>
          </div>
          {cols.map(([heading, links], i) => (
            <Reveal key={heading} delay={60 + i * 60}>
              <nav className="flex flex-col gap-3.5">
                <span className="mb-2 text-[11px] uppercase tracking-[0.34em] text-bone/45">{heading}</span>
                {links.map(([label, href]) => (
                  <FooterLink key={label} href={href}>
                    {label}
                  </FooterLink>
                ))}
              </nav>
            </Reveal>
          ))}
        </div>

        {/* Legal + social rows */}
        <div className="mt-20 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-bone/15 pt-8 text-[11px] uppercase tracking-[0.14em] text-bone/50 md:mt-24">
          <span className="tabular-nums">© {year} SOAR® — Made to rise</span>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center transition-colors hover:text-bone md:min-h-0"
            >
              Instagram
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center transition-colors hover:text-bone md:min-h-0"
            >
              TikTok
            </a>
            <Link href="/privacy" className="inline-flex min-h-11 items-center transition-colors hover:text-bone md:min-h-0">
              Privacy
            </Link>
            <Link href="/terms" className="inline-flex min-h-11 items-center transition-colors hover:text-bone md:min-h-0">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
