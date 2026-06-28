import type { MetadataRoute } from "next";
import { isShopifyConfigured, getProducts, FALLBACK_PRODUCTS, type SoarProduct } from "@/lib/shopify";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://borntosoar.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products: SoarProduct[] = FALLBACK_PRODUCTS;
  if (isShopifyConfigured) {
    try {
      products = await getProducts(20);
    } catch {
      products = FALLBACK_PRODUCTS;
    }
  }
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    ...products.map((p) => ({
      url: `${base}/products/${p.handle}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
