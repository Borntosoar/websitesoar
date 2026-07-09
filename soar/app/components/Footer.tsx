import Image from "next/image";
import soarLogo from "@/public/soar-mark.png";

function Col({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <nav className="flex flex-col gap-3" aria-label={title}>
      <span className="mono mb-1 text-ash">{title}</span>
      {links.map(([label, href]) => (
        <a key={label} href={href} className="text-[14px] text-ink/75 transition-colors hover:text-ink">{label}</a>
      ))}
    </nav>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line">
      <div className="wrap py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
          {/* First Flight signup (the loyalty block) */}
          <div>
            <span className="mono text-ash">Join First Flight</span>
            <p className="serif mt-3 max-w-[24ch] text-lg italic text-ink/85">Members get the access code, and the next drop, first.</p>
            <a href="/#access" className="mono mt-5 inline-flex items-center gap-2 text-ink transition-all hover:gap-3">→ Sign up</a>
          </div>

          <Col
            title="Help"
            links={[
              ["Shipping & Returns", "/policies#shipping"],
              ["Contact", "mailto:soarnextlevel@gmail.com"],
            ]}
          />
          <Col
            title="SOAR"
            links={[
              ["The Collection", "/#collection"],
              ["The approach", "/#approach"],
              ["On the name", "/#name"],
              ["The origin", "/#story"],
            ]}
          />
          <Col
            title="Legal"
            links={[
              ["Terms", "/policies#terms"],
              ["Privacy", "/policies#privacy"],
            ]}
          />

          <div className="flex flex-col gap-3">
            <span className="mono text-ash">Country</span>
            <span className="text-[14px] text-ink/75">CA / CAD · English</span>
            <Image src={soarLogo} alt="SOAR" height={48} className="mt-5 h-10 w-auto" />
            <span className="mono mt-1 text-ash">Born to soar.</span>
          </div>
        </div>

        <div className="rule mt-14" />
        <div className="mt-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <span className="mono text-ash">© {year} SOAR — All rights reserved</span>
          <span className="mono text-ash">Designed in Alberta · Canada</span>
        </div>
      </div>
    </footer>
  );
}
