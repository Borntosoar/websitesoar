import NavBar from "./components/NavBar";
import GlitchHero from "./components/GlitchHero";
import ProductViewer from "./components/ProductViewer";
import DropInfo from "./components/DropInfo";
import EditorialGrid from "./components/EditorialGrid";
import NotifyAccess from "./components/NotifyAccess";
import CommunityBand from "./components/CommunityBand";
import SiteFooter from "./components/SiteFooter";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <NavBar />
      <main className="flex-1">
        <GlitchHero />
        <ProductViewer />
        <DropInfo />
        <EditorialGrid />
        <NotifyAccess />
        <CommunityBand />
      </main>
      <SiteFooter />
    </div>
  );
}
