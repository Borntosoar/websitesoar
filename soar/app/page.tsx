import { Nav } from "./components/Nav";
import { RepresentHero } from "./components/RepresentHero";
import { ProductRow } from "./components/ProductRow";
import { TileRow } from "./components/TileRow";
import { SplitBanner } from "./components/SplitBanner";
import { Manifesto } from "./components/Manifesto";
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

  // campaign tiles — a real B&W AI model photo per piece (browser-fetched), with
  // the silhouette as the instant fallback. Swaps for real photography later.
  const tiles = drop.map((p, i) => ({
    fit: fitOf(p.productType),
    tone: (i === 1 ? "dark" : "light") as "light" | "dark",
    seed: 13 + i * 9,
    flip: i === 2,
    eyebrow: p.productType ?? "Drop 001",
    title: p.title,
    cta: "Shop",
    href: `/products/${p.handle}`,
  }));

  return (
    <>
      <Nav />
      <main id="main">
        <RepresentHero />
        <ProductRow products={drop} />
        <TileRow id="lookbook" heading="The lookbook" sub="Collection One · Worn" items={tiles} />
        <SplitBanner />
        <Manifesto />
        <Access />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
