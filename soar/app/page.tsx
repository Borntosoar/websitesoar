import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { ProductRow } from "./components/ProductRow";
import { Campaign } from "./components/Campaign";
import { Lookbook } from "./components/Lookbook";
import { SplitBanner } from "./components/SplitBanner";
import { AscentSequence } from "./components/AscentSequence";
import { Manifesto } from "./components/Manifesto";
import { Story } from "./components/Story";
import { Access } from "./components/Access";
import { FAQ } from "./components/FAQ";
import { Footer } from "./components/Footer";
import type { Metadata } from "next";
import { isShopifyConfigured, getProducts, FALLBACK_PRODUCTS, type SoarProduct } from "@/lib/shopify";

export const metadata: Metadata = {
  title: "Collection One — Drop 001",
  description:
    "The Trucker Jacket, Long Sleeve, and Utility Shorts — an edition of 200, individually numbered. Designed in Alberta, Canada.",
  alternates: { canonical: "/" },
};

export default async function Home() {
  // Live Shopify data is the source of truth; fall back to the curated Drop 001
  // content so the site is fully designed before the store is wired.
  let products: SoarProduct[] = [];
  if (isShopifyConfigured) {
    try {
      products = await getProducts(8);
    } catch {
      products = [];
    }
  }
  if (products.length === 0) products = FALLBACK_PRODUCTS;
  const drop = [...products].sort((a, b) => b.price - a.price).slice(0, 3);

  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <ProductRow products={drop} />
        <Campaign products={drop} />
        <Lookbook products={drop} />
        <SplitBanner />
        <AscentSequence />
        <Manifesto />
        <Story />
        <Access />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
