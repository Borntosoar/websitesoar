export default function NavBar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 mix-blend-difference md:px-10">
      <span className="font-display text-lg tracking-tight text-white">
        STATIC
      </span>
      <nav className="hidden items-center gap-8 text-xs uppercase tracking-[0.25em] text-white md:flex">
        <a href="#drop">Drops</a>
        <a href="#archive">Archive</a>
        <a href="#access">Access</a>
      </nav>
      <span className="text-xs uppercase tracking-[0.25em] text-white">
        Bag (0)
      </span>
    </header>
  );
}
