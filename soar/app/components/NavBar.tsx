export function NavBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="wrap flex items-center justify-between py-4">
        <a href="/" className="display text-lg text-white" aria-label="SOAR home">SOAR</a>
        <nav className="hidden gap-8 md:flex" aria-label="Primary">
          <a className="mono text-white/70 transition-colors hover:text-white" href="#drop">Drop</a>
          <a className="mono text-white/70 transition-colors hover:text-white" href="#editorial">Editorial</a>
          <a className="mono text-white/70 transition-colors hover:text-white" href="#access">Access</a>
        </nav>
        <button className="mono text-white/70 transition-colors hover:text-white" type="button">Bag (0)</button>
      </div>
    </header>
  );
}
