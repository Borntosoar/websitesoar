import { SiteHeader } from "@/components/site-header";
import { GlitchHero } from "@/components/hero/glitch-hero";
import { DropStrip } from "@/components/sections/drop-strip";
import { ProductViewer } from "@/components/product-viewer/product-viewer";
import { EditorialGrid } from "@/components/sections/editorial-grid";
import { CommunityBand } from "@/components/sections/community-band";
import { SiteFooter } from "@/components/site-footer";

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* glitch hero → one drop at scale → R3F inspect → strict index grid → hype band */}
        <GlitchHero />
        <DropStrip />
        <ProductViewer />
        <EditorialGrid />
        <CommunityBand />
      </main>
      <SiteFooter />
    </>
  );
}
