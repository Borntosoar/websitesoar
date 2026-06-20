export function SiteFooter() {
  return (
    <footer className="bg-white text-black">
      <div className="frame py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <span className="over text-3xl leading-none">STATIC</span>
            <p className="mono mt-4 text-black/50">Cut through the noise.</p>
          </div>
          <div>
            <h4 className="mono mb-4 text-black/50">Shop</h4>
            <ul className="mono space-y-2"><li><a href="#shop">The Index</a></li><li><a href="#drop">Drop 001</a></li></ul>
          </div>
          <div>
            <h4 className="mono mb-4 text-black/50">Info</h4>
            <ul className="mono space-y-2"><li><a href="#">Shipping</a></li><li><a href="#">Returns</a></li></ul>
          </div>
          <div>
            <h4 className="mono mb-4 text-black/50">Connect</h4>
            <ul className="mono space-y-2"><li><a href="#">Instagram</a></li><li><a href="#">Waitlist</a></li></ul>
          </div>
        </div>
        <div className="mono mt-16 flex flex-wrap justify-between gap-4 border-t border-black/12 pt-6 text-black/40">
          <span>© {new Date().getFullYear()} STATIC</span>
          <span>All signals reserved</span>
        </div>
      </div>
    </footer>
  );
}
