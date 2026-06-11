import { SiteHeader } from "@/components/sections/site-header";
import { EntranceHero } from "@/components/sections/entrance-hero";
import { Marquee } from "@/components/sections/marquee";
import { CampaignOne, CampaignTwo, CategorySplit } from "@/components/sections/campaigns";
import { Drop } from "@/components/sections/drop";
import { Shop } from "@/components/sections/shop";
import { Lookbook } from "@/components/sections/lookbook";
import { World } from "@/components/sections/world";
import { Stats } from "@/components/sections/stats";
import { Strip } from "@/components/sections/strip";
import { List } from "@/components/sections/list";
import { SiteFooter } from "@/components/sections/site-footer";
import { EmailPopup } from "@/components/ui/email-popup";

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        {/* signature 3D breakthrough entrance */}
        <EntranceHero />
        <Marquee />
        {/* campaign-led rhythm: campaign -> categories -> drop -> grid -> lookbook -> campaign */}
        <CampaignOne />
        <CategorySplit />
        <Drop />
        <Shop />
        <Lookbook />
        <CampaignTwo />
        <World />
        <Stats />
        <Strip />
        <List />
      </main>
      <SiteFooter />
      <EmailPopup />
    </>
  );
}
