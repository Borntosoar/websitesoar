import { SiteHeader } from "@/components/sections/site-header";
import { EntranceHero } from "@/components/sections/entrance-hero";
import { Marquee } from "@/components/sections/marquee";
import { CampaignOne, CampaignTwo, CategorySplit } from "@/components/sections/campaigns";
import { Drop } from "@/components/sections/drop";
import { Shop } from "@/components/sections/shop";
import { World } from "@/components/sections/world";
import { Strip } from "@/components/sections/strip";
import { List } from "@/components/sections/list";
import { SiteFooter } from "@/components/sections/site-footer";
import { EmailPopup } from "@/components/ui/email-popup";

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        {/* 3D entrance — vibrating box, password, arrow burst, SOAR hovering */}
        <EntranceHero />
        <Marquee />
        {/* premium-streetwear home rhythm: campaign -> drop -> rail -> split -> campaign */}
        <CampaignOne />
        <Drop />
        <Shop />
        <CategorySplit />
        <CampaignTwo />
        <World />
        <Strip />
        <List />
      </main>
      <SiteFooter />
      <EmailPopup />
    </>
  );
}
