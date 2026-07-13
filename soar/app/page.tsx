import EntranceGate from "./components/EntranceGate";
import NavBar from "./components/NavBar";
import GlitchHero from "./components/GlitchHero";
import MarqueeBanner from "./components/MarqueeBanner";
import DropStatement from "./components/DropStatement";
import ProductViewer from "./components/ProductViewer";
import DropInfo from "./components/DropInfo";
import EditorialGrid from "./components/EditorialGrid";
import NotifyAccess from "./components/NotifyAccess";
import CommunityBand from "./components/CommunityBand";
import SiteFooter from "./components/SiteFooter";

export default function Home() {
  return (
    <>
      <EntranceGate />
      <div className="flex min-h-screen flex-col bg-black">
        <NavBar />
        <main className="flex-1">
          <GlitchHero />
          <MarqueeBanner />
          <DropStatement />
          <ProductViewer />
          <DropInfo />
          <EditorialGrid />
          <NotifyAccess />
          <CommunityBand />
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
