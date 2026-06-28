import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/app/components/Nav";
import { Footer } from "@/app/components/Footer";
import { ProductChapter } from "@/app/components/ProductChapter";
import { isShopifyConfigured, getProducts, getProductByHandle, FALLBACK_PRODUCTS, type SoarProduct } from "@/lib/shopify";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://borntosoar.com";

async function allProducts(): Promise<SoarProduct[]> {
  if (isShopifyConfigured) {
    try {
      return await getProducts(20);
    } catch {
      return FALLBACK_PRODUCTS;
    }
  }
  return FALLBACK_PRODUCTS;
}

export async function generateStaticParams() {
  const products = await allProducts();
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const p = await getProductByHandle(handle);
  if (!p) return { title: "Not found", robots: { index: false } };
  const description = (p.description ?? `${p.title} — SOAR Drop 001.`).slice(0, 155);
  return {
    title: p.title,
    description,
    alternates: { canonical: `/products/${p.handle}` },
    openGraph: { title: `${p.title} — SOAR`, description, type: "website" },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) notFound();

  const others = (await allProducts())
    .filter((p) => p.handle !== handle)
    .slice(0, 2)
    .map((p) => ({ title: p.title, href: `/products/${p.handle}` }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    ...(product.images.length ? { image: product.images } : {}),
    brand: { "@type": "Brand", name: "SOAR" },
    category: product.productType,
    offers: {
      "@type": "Offer",
      priceCurrency: "CAD",
      price: product.price,
      availability: product.available ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
      url: `${base}/products/${product.handle}`,
    },
  };

  return (
    <>
      <Nav />
      <main id="main" className="pt-24 md:pt-28">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div className="wrap pt-6">
          <a href="/#collection" className="mono text-ash transition-colors hover:text-ink">← Collection</a>
        </div>
        <ProductChapter product={product} index={0} total={1} others={others} />
      </main>
      <Footer />
    </>
  );
}
