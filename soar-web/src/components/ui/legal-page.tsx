import Link from "next/link";
import { type ReactNode } from "react";

/** Shared chrome for legal pages — minimal, readable, on-brand. */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <main className="min-h-svh bg-white text-black">
      <header className="border-b border-black/10">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4 md:px-8">
          <Link href="/" className="text-base font-semibold tracking-[0.22em]">
            SOAR<sup className="align-super text-[0.5em] opacity-60">®</sup>
          </Link>
          <Link href="/" className="text-[11px] uppercase tracking-[0.16em] text-black/55 transition-colors hover:text-black">
            ← Back to site
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
        <h1 className="text-[clamp(2.2rem,6vw,3.4rem)] font-semibold leading-none">{title}</h1>
        <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-black/45">Last updated {updated}</p>
        <div className="mt-10 space-y-4 text-sm leading-relaxed text-black/70 [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-black [&_h2]:mb-1 [&_h2]:mt-9 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-black [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-black">
          {children}
        </div>
      </article>

      <footer className="border-t border-black/10">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-6 gap-y-2 px-5 py-8 text-[11px] uppercase tracking-[0.14em] text-black/45 md:px-8">
          <Link href="/privacy" className="hover:text-black">Privacy</Link>
          <Link href="/terms" className="hover:text-black">Terms</Link>
          <Link href="/cookies" className="hover:text-black">Cookies</Link>
          <span className="ml-auto normal-case tracking-normal">© {new Date().getFullYear()} SOAR®</span>
        </div>
      </footer>
    </main>
  );
}
