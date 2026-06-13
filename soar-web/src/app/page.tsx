import { SiteHeader } from "@/components/sections/site-header";
import { EntranceHero } from "@/components/sections/entrance-hero";
import { Hero } from "@/components/sections/hero";
import { Featured } from "@/components/sections/featured";
import { TheBox } from "@/components/sections/the-box";
import { CollectionGrid } from "@/components/sections/collection-grid";
import { Drop } from "@/components/sections/drop";
import { TheFlock } from "@/components/sections/the-flock";
import { FutureDrops } from "@/components/sections/future-drops";
import { FinalCTA } from "@/components/sections/final-cta";
import { SiteFooter } from "@/components/sections/site-footer";
import { SectionNav } from "@/components/ui/section-nav";

export default function Page() {
  return (
    <>
      {/* signature 3D studio entrance — password `soar`, white floods out of the box */}
      <EntranceHero />
      <SiteHeader />
      <SectionNav />
      <main id="top">
        {/* Born To Soar architecture: hero -> featured drop -> the box narrative ->
            collection -> live drop -> the flock -> upcoming -> final flight */}
        <Hero />
        <Featured />
        <TheBox />
        <CollectionGrid />
        <Drop />
        <TheFlock />
        <FutureDrops />
        <FinalCTA />
      </main>
      <SiteFooter />
    </>
  );
}
