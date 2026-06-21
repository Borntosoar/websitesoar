import { NavBar } from "./components/NavBar";
import { GlitchHero } from "./components/GlitchHero";
import { ProductViewer } from "./components/ProductViewer";
import { DropInfo } from "./components/DropInfo";
import { EditorialGrid } from "./components/EditorialGrid";
import { NotifyAccess } from "./components/NotifyAccess";
import { CommunityBand } from "./components/CommunityBand";
import { SiteFooter } from "./components/SiteFooter";

export default function Home() {
  return (
    <>
      <NavBar />
      <main>
        <GlitchHero />
        <ProductViewer />
        <DropInfo />
        <EditorialGrid />
        <NotifyAccess />
        <CommunityBand />
      </main>
      <SiteFooter />
    </>
  );
}
