import Image from "next/image";
import soarLogo from "@/public/soar-logo.png";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="wrap py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Image src={soarLogo} alt="SOAR" height={64} className="h-14 w-auto" priority={false} />
            <p className="serif mt-6 max-w-xs text-xl italic text-ink/80">Born to soar.</p>
          </div>

          <nav className="flex flex-col gap-3">
            <span className="mono mb-1 text-ash">Collection</span>
            <a href="#collection" className="text-[15px] text-ink/75 hover:text-ink">The Trucker Jacket</a>
            <a href="#collection" className="text-[15px] text-ink/75 hover:text-ink">Long Sleeve</a>
            <a href="#collection" className="text-[15px] text-ink/75 hover:text-ink">Utility Shorts</a>
          </nav>

          <nav className="flex flex-col gap-3">
            <span className="mono mb-1 text-ash">Brand</span>
            <a href="#approach" className="text-[15px] text-ink/75 hover:text-ink">The approach</a>
            <a href="#story" className="text-[15px] text-ink/75 hover:text-ink">The origin</a>
            <a href="#access" className="text-[15px] text-ink/75 hover:text-ink">First Flight</a>
            <a href="mailto:soarnextlevel@gmail.com" className="text-[15px] text-ink/75 hover:text-ink">Contact</a>
          </nav>
        </div>

        <div className="rule mt-16" />
        <div className="mt-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <span className="mono text-ash">© {new Date().getFullYear()} SOAR — All rights reserved</span>
          <span className="mono text-ash">Designed in Alberta · Canada</span>
        </div>
      </div>
    </footer>
  );
}
