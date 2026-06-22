// SOAR — Shopify Storefront API client. Reads credentials from env; never
// fabricated. `isShopifyConfigured` lets pages fall back to placeholder content
// gracefully instead of crashing when no store is connected yet.

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_VERSION = "2024-10";

export const isShopifyConfigured = Boolean(domain && token);

export async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  if (!isShopifyConfigured) {
    throw new Error(
      "Shopify is not configured. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN (see .env.example).",
    );
  }
  const res = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token as string,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Shopify request failed: ${res.status}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0]?.message ?? "Shopify GraphQL error");
  return json.data as T;
}

export type SoarVariant = { id: string; size: string; available: boolean; price: number; quantity: number };

export type SoarProduct = {
  id: string;
  handle: string;
  title: string;
  price: number;
  /** Featured product image URL (undefined until photography is uploaded). */
  image?: string;
  images: string[];
  description?: string;
  productType?: string;
  available: boolean;
  total: number;
  /** First sellable variant — the default add-to-bag target. */
  variantId?: string;
  variants: SoarVariant[];
};

type ProductsResponse = {
  products: {
    edges: {
      node: {
        id: string;
        handle: string;
        title: string;
        description: string | null;
        productType: string | null;
        totalInventory: number | null;
        featuredImage: { url: string } | null;
        images: { edges: { node: { url: string } }[] };
        variants: { edges: { node: { id: string; title: string; availableForSale: boolean; quantityAvailable: number | null; price: { amount: string } } }[] };
      };
    }[];
  };
};

/** Source of truth for the drop: product chapters, sizes, price, availability. */
export async function getProducts(first = 12): Promise<SoarProduct[]> {
  const data = await shopifyFetch<ProductsResponse>(
    `query Products($first: Int!) {
      products(first: $first, sortKey: CREATED_AT, reverse: true) {
        edges { node {
          id handle title description productType totalInventory
          featuredImage { url }
          images(first: 6) { edges { node { url } } }
          variants(first: 12) { edges { node { id title availableForSale quantityAvailable price { amount } } } }
        } }
      }
    }`,
    { first },
  );
  return data.products.edges.map(({ node: n }) => {
    const variants: SoarVariant[] = n.variants.edges.map(({ node: v }) => ({
      id: v.id,
      size: v.title,
      available: v.availableForSale,
      price: Number(v.price.amount ?? 0),
      quantity: v.quantityAvailable ?? 0,
    }));
    const firstSellable = variants.find((v) => v.available) ?? variants[0];
    const images = n.images.edges.map((e) => e.node.url);
    return {
      id: n.id,
      handle: n.handle,
      title: n.title,
      total: n.totalInventory ?? 0,
      image: n.featuredImage?.url ?? images[0],
      images,
      description: n.description ?? undefined,
      productType: n.productType ?? undefined,
      available: variants.some((v) => v.available),
      price: firstSellable?.price ?? 0,
      variantId: firstSellable?.id,
      variants,
    };
  });
}

/** Create a Shopify cart from line items and return its hosted checkout URL.
 *  Returns null when no store is connected (or on error) so the UI degrades
 *  gracefully instead of throwing during a user action. Runs server-side only. */
export async function createCart(lines: { merchandiseId: string; quantity: number }[]): Promise<string | null> {
  if (!isShopifyConfigured || lines.length === 0) return null;
  try {
    const data = await shopifyFetch<{ cartCreate: { cart: { checkoutUrl: string } | null; userErrors: { message: string }[] } }>(
      `mutation CartCreate($lines: [CartLineInput!]!) {
        cartCreate(input: { lines: $lines }) {
          cart { checkoutUrl }
          userErrors { message }
        }
      }`,
      { lines },
    );
    return data.cartCreate?.cart?.checkoutUrl ?? null;
  } catch {
    return null;
  }
}

/** Curated fallback content — the REAL Drop 001 garments, so the site is fully
 *  designed even before the Storefront API is wired or photography is uploaded.
 *  Live Shopify data (getProducts) always takes precedence when configured. */
export const FALLBACK_PRODUCTS: SoarProduct[] = [
  {
    id: "fallback-trucker",
    handle: "the-trucker-jacket",
    title: "The Trucker Jacket",
    price: 230,
    images: [],
    productType: "Outerwear",
    description:
      "Heavyweight structured denim, cut clean and square. It holds its shape, softens with wear, and keeps the hardware tonal and the branding hidden. Drawn in Alberta, Canada.",
    available: true,
    total: 200,
    variantId: undefined,
    variants: ["S", "M", "L", "XL"].map((s) => {
      const q = ({ S: 50, M: 4, L: 50, XL: 17 } as Record<string, number>)[s] ?? 0;
      return { id: `fb-tj-${s}`, size: s, available: q > 0, price: 230, quantity: q };
    }),
  },
  {
    id: "fallback-longsleeve",
    handle: "long-sleeve",
    title: "Long Sleeve",
    price: 80,
    images: [],
    productType: "Tops",
    description:
      "The one you reach for first. Heavyweight cotton with a relaxed drape and a neckline that keeps its shape, wash after wash. Quiet enough to go with anything.",
    available: true,
    total: 200,
    variantId: undefined,
    variants: ["S", "M", "L", "XL"].map((s) => {
      const q = ({ S: 50, M: 50, L: 9, XL: 50 } as Record<string, number>)[s] ?? 0;
      return { id: `fb-ls-${s}`, size: s, available: q > 0, price: 80, quantity: q };
    }),
  },
  {
    id: "fallback-shorts",
    handle: "utility-shorts",
    title: "Utility Shorts",
    price: 50,
    images: [],
    productType: "Bottoms",
    description:
      "Cut for range, finished matte. A technical weave with a tailored length, clean pockets, and nothing extra. Built to move, and to last.",
    available: true,
    total: 200,
    variantId: undefined,
    variants: ["S", "M", "L", "XL"].map((s) => {
      const q = ({ S: 0, M: 50, L: 6, XL: 50 } as Record<string, number>)[s] ?? 0;
      return { id: `fb-sh-${s}`, size: s, available: q > 0, price: 50, quantity: q };
    }),
  },
];
