export default function SiteFooter() {
  return (
    <footer className="w-full bg-black px-6 py-12 md:px-10">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-10 sm:flex-row sm:justify-between">
        <div>
          <span className="font-display text-lg tracking-tight text-white">
            SOAR
          </span>
          <p className="mt-2 max-w-xs text-xs leading-relaxed text-white/40">
            Growth begins where comfort ends.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 text-xs uppercase tracking-[0.25em] text-white/50 sm:grid-cols-3">
          <div className="flex flex-col gap-3">
            <span className="text-white/30">Shop</span>
            <a href="#drop">Drops</a>
            <a href="#archive">Archive</a>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-white/30">Account</span>
            <a href="#access">Request Access</a>
            <a href="#access">Member Password</a>
          </div>
          <div className="col-span-2 flex flex-col gap-3 sm:col-span-1">
            <span className="text-white/30">Legal</span>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-[1600px] flex-col-reverse items-start justify-between gap-4 border-t border-white/10 pt-6 text-[10px] uppercase tracking-[0.25em] text-white/30 sm:flex-row sm:items-center">
        <span>© {new Date().getFullYear()} SOAR. All rights reserved.</span>
        <span>Password protected. Pre-launch.</span>
      </div>
    </footer>
  );
}
