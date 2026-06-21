import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/14 bg-white/90 backdrop-blur">
      <div className="frame flex items-center justify-between py-4">
        <Link href="/" className="over text-[18px] leading-none" aria-label="STATIC home">STATIC</Link>
        <nav className="hidden gap-8 md:flex" aria-label="Primary">
          <a className="mono" href="#drop">Drop</a>
          <a className="mono" href="#shop">Shop</a>
          <a className="mono" href="#archive">Archive</a>
        </nav>
        <a className="mono" href="#bag">Bag (0)</a>
      </div>
    </header>
  );
}
