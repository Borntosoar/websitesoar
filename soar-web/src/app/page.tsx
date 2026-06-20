import { SiteHeader } from "@/components/sections/site-header";
import { EntranceHero } from "@/components/sections/entrance-hero";
import { Hero } from "@/components/sections/hero";
import { Ticker } from "@/components/sections/ticker";
import { Featured } from "@/components/sections/featured";
import { ShopGrid } from "@/components/sections/shop-grid";
import { CollectionGrid } from "@/components/sections/collection-grid";
import { TheBox } from "@/components/sections/the-box";
import { Essentials } from "@/components/sections/essentials";
import { Drop } from "@/components/sections/drop";
import { CountdownCapture } from "@/components/sections/countdown-capture";
import { Manifesto } from "@/components/sections/manifesto";
import { TheFlock } from "@/components/sections/the-flock";
import { Journal } from "@/components/sections/journal";
import { FutureDrops } from "@/components/sections/future-drops";
import { Faq } from "@/components/sections/faq";
import { FinalCTA } from "@/components/sections/final-cta";
import { SiteFooter } from "@/components/sections/site-footer";

export default function Page() {
  return (
    <>
      {/* signature 3D studio entrance — 13+ gate + password `soar`, box breaks open */}
      <EntranceHero />
      <SiteHeader />
      {/* SectionNav, cursor, smooth-scroll, scroll-progress, cart & quick-view mount in Providers */}
      <main id="top">
        {/* Born To Soar architecture (Represent-style sequencing, original SOAR):
            hero → ticker → featured → shop modules → categories → the box film →
            essentials → drop → manifesto → community → journal → upcoming → faq → final */}
        <Hero />
        <Ticker />
        <Featured />
        <ShopGrid />
        <CollectionGrid />
        <TheBox />
        <Essentials />
        <Drop />
        <CountdownCapture />
        <Manifesto />
        <TheFlock />
        <Journal />
        <FutureDrops />
        <Faq />
        <FinalCTA />
      </main>
      <SiteFooter />
    </>
  );
}
