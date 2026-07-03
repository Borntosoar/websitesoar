import { Nav } from "./components/Nav";
import { EarthHero } from "./components/earth/EarthHero";
import { ProductRow } from "./components/ProductRow";
import { TileRow } from "./components/TileRow";
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

function fitOf(type?: string): "longsleeve" | "tee" | "shorts" {
  return type === "Outerwear" ? "longsleeve" : type === "Bottoms" ? "shorts" : "tee";
}

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

  // campaign tiles — real photography when we have it (the jacket), a stylized
  // silhouette placeholder for pieces not yet shot.
  const tiles = drop.map((p, i) => ({
    image: p.image,
    fit: fitOf(p.productType),
    tone: "dark" as const,
    flip: i === 2,
    position: "object-top",
    eyebrow: p.productType ?? "Drop 001",
    title: p.title,
    cta: "Shop",
    href: `/products/${p.handle}`,
  }));

  return (
    <>
      <Nav />
      <main id="main">
        <EarthHero />
        <ProductRow products={drop} />
        <TileRow id="lookbook" heading="The lookbook" sub="Collection One · Worn" items={tiles} />
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
