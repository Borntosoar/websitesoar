export function SiteFooter() {
  return (
    <footer className="bg-black">
      <div className="wrap py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <span className="display text-3xl text-white">SOAR</span>
            <p className="mono mt-4 text-white/45">Made to rise.</p>
          </div>
          <div>
            <h4 className="mono mb-4 text-white/45">Shop</h4>
            <ul className="mono space-y-2 text-white/70"><li><a href="#drop">Drop 001</a></li><li><a href="#editorial">Editorial</a></li></ul>
          </div>
          <div>
            <h4 className="mono mb-4 text-white/45">Info</h4>
            <ul className="mono space-y-2 text-white/70"><li><a href="#access">Access</a></li><li><a href="#">Shipping</a></li></ul>
          </div>
          <div>
            <h4 className="mono mb-4 text-white/45">Connect</h4>
            <ul className="mono space-y-2 text-white/70"><li><a href="#">Instagram</a></li><li><a href="#access">Waitlist</a></li></ul>
          </div>
        </div>
        <p className="mono mt-12 max-w-xl text-white/35">Pre-launch — the store is password protected. Request access above to enter early.</p>
        <div className="mono mt-8 flex flex-wrap justify-between gap-4 border-t border-white/10 pt-6 text-white/40">
          <span>© {new Date().getFullYear()} SOAR</span>
          <span>Born to soar</span>
        </div>
      </div>
    </footer>
  );
}
