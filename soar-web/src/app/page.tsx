import { SiteHeader } from "@/components/sections/site-header";
import { HeroClient } from "@/components/ui/hero-client";
import { Marquee } from "@/components/sections/marquee";
import { Drop } from "@/components/sections/drop";
import { Shop } from "@/components/sections/shop";
import { World } from "@/components/sections/world";
import { Strip } from "@/components/sections/strip";
import { List } from "@/components/sections/list";
import { SiteFooter } from "@/components/sections/site-footer";

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        {/* dark 3D breakthrough */}
        <HeroClient />
        {/* light */}
        <Marquee />
        {/* dark */}
        <Drop />
        {/* light */}
        <Shop />
        {/* light */}
        <World />
        {/* dark */}
        <Strip />
        {/* light */}
        <List />
      </main>
      {/* dark */}
      <SiteFooter />
    </>
  );
}
