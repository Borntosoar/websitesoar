import { NavBar } from "./components/NavBar";
import { GlitchHero } from "./components/GlitchHero";
import { ProductViewer } from "./components/ProductViewer";
import { DropInfo } from "./components/DropInfo";
import { EditorialGrid } from "./components/EditorialGrid";
import { NotifyAccess } from "./components/NotifyAccess";
import { CommunityBand } from "./components/CommunityBand";
import { SiteFooter } from "./components/SiteFooter";
import { Entrance } from "./components/entrance/Entrance";
import { isShopifyConfigured, getProducts, type SoarProduct } from "@/lib/shopify";

export default async function Home() {
  // getProducts() is the source of truth; fall back to placeholder content
  // (never crash the homepage just because credentials aren't set).
  let products: SoarProduct[] = [];
  if (isShopifyConfigured) {
    try {
      products = await getProducts(8);
    } catch {
      products = [];
    }
  }
  const lead = products[0];

  return (
    <>
      <Entrance />
      <NavBar />
      <main>
        <GlitchHero />
        <ProductViewer product={lead} />
        <DropInfo product={lead} />
        <EditorialGrid products={products} />
        <NotifyAccess />
        <CommunityBand />
      </main>
      <SiteFooter />
    </>
  );
}
