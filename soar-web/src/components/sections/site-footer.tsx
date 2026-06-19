"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/logo";

const cols: [string, [string, string][]][] = [
  ["Shop", [["New Arrivals", "#shop"], ["Collections", "#collection"], ["The Drop", "#drop"], ["Upcoming", "#upcoming"]]],
  ["House", [["The Box", "#the-box"], ["The Code", "#manifesto"], ["The Flock", "#community"], ["Journal", "#journal"]]],
  ["Support", [["FAQ", "#faq"], ["Contact", "mailto:soarnextlevel@gmail.com"], ["Shipping & Returns", "#faq"], ["Size Guide", "#faq"]]],
  ["Legal", [["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"], ["Cookie Policy", "/cookies"]]],
];

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const cls = "text-sm text-bone/60 transition-colors hover:text-bone";
  if (href.startsWith("/")) return <Link href={href} className={cls}>{children}</Link>;
  return <a href={href} className={cls}>{children}</a>;
}

function FooterSignup() {
  return (
    <form
      className="mb-14 flex max-w-xl flex-col gap-2.5 border-b border-bone/15 pb-12 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        const f = e.currentTarget;
        const note = f.querySelector("[data-note]") as HTMLElement | null;
        if (note) note.textContent = "You're in — check your inbox for 10% off.";
        f.reset();
      }}
      noValidate
    >
      <div className="flex-1">
        <p className="mb-3 text-sm text-bone/70">
          <strong className="font-medium text-bone">Get 10% off your first order</strong> — join the list for early drop
          access.
        </p>
        <div className="flex gap-2">
          <input
            type="email"
            required
            placeholder="Email address"
            aria-label="Email address"
            className="min-w-0 flex-1 border border-bone/20 bg-transparent px-4 py-3 text-base text-bone outline-none transition-colors placeholder:text-bone/40 focus:border-bone md:text-sm"
          />
          <button type="submit" className="bg-bone px-5 py-3 text-[13px] font-medium text-ink transition-colors hover:bg-white active:scale-[0.98] transition-transform">
            Join
          </button>
        </div>
        <p data-note className="mt-2 text-[11px] uppercase tracking-[0.14em] text-bone/50">
          No noise — only ascent. Unsubscribe anytime.
        </p>
      </div>
    </form>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-espresso px-5 pb-[max(env(safe-area-inset-bottom),2.25rem)] pt-20 text-bone md:px-12">
      <div className="mx-auto max-w-7xl">
        <FooterSignup />
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <a href="#top" className="col-span-2 md:col-span-1" aria-label="SOAR home">
            <Logo variant="white" className="h-14 w-auto md:h-16" />
          </a>
          {cols.map(([heading, links]) => (
            <nav key={heading} className="flex flex-col gap-3">
              <span className="mb-1 text-[11px] uppercase tracking-[0.17em] text-bone/55">{heading}</span>
              {links.map(([label, href]) => (
                <FooterLink key={label} href={href}>
                  {label}
                </FooterLink>
              ))}
            </nav>
          ))}
        </div>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-bone/15 pt-6 text-[11px] uppercase tracking-[0.14em] text-bone/55">
          <span>© {year} SOAR® — Made to rise</span>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center transition-colors hover:text-bone md:min-h-0">Instagram</a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center transition-colors hover:text-bone md:min-h-0">TikTok</a>
            <Link href="/privacy" className="inline-flex min-h-11 items-center transition-colors hover:text-bone md:min-h-0">Privacy</Link>
            <Link href="/terms" className="inline-flex min-h-11 items-center transition-colors hover:text-bone md:min-h-0">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
