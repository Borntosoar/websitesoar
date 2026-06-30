// SOAR — Shopify Storefront API client (headless). Reads credentials from env;
// never fabricated. `isShopifyConfigured` lets pages fall back to placeholder
// content gracefully instead of crashing when no store is connected yet.

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
export const SHOPIFY_API_VERSION = "2024-10"; // bump periodically; Shopify deprecates ~12mo

export const isShopifyConfigured = Boolean(domain && token);

export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  opts?: { revalidate?: number },
): Promise<T> {
  if (!domain || !token) {
    throw new Error("Shopify is not configured (SHOPIFY_STORE_DOMAIN / SHOPIFY_STOREFRONT_ACCESS_TOKEN).");
  }
  const res = await fetch(`https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    // reads can be cached (ISR); mutations pass no opts → no-store
    ...(opts?.revalidate != null ? { next: { revalidate: opts.revalidate } } : { cache: "no-store" }),
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
  image?: string;
  images: string[];
  description?: string;
  productType?: string;
  available: boolean;
  total: number;
  variantId?: string;
  colorways?: { name: string; hex: string; image: string }[];
  variants: SoarVariant[];
};

type ProductNode = {
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

const PRODUCT_FIELDS = `
  id handle title description productType totalInventory
  featuredImage { url }
  images(first: 6) { edges { node { url } } }
  variants(first: 12) { edges { node { id title availableForSale quantityAvailable price { amount } } } }
`;

function mapProduct(n: ProductNode): SoarProduct {
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
}

/** Source of truth for the drop. ISR-cached (~60s) so the homepage stays static. */
export async function getProducts(first = 12): Promise<SoarProduct[]> {
  const data = await shopifyFetch<{ products: { edges: { node: ProductNode }[] } }>(
    `query Products($first: Int!) {
      products(first: $first, sortKey: CREATED_AT, reverse: true) {
        edges { node { ${PRODUCT_FIELDS} } }
      }
    }`,
    { first },
    { revalidate: 60 },
  );
  return data.products.edges.map(({ node }) => mapProduct(node));
}

/** Single product for the PDP route. Falls back to the curated content. */
export async function getProductByHandle(handle: string): Promise<SoarProduct | null> {
  if (!isShopifyConfigured) return FALLBACK_PRODUCTS.find((p) => p.handle === handle) ?? null;
  try {
    const data = await shopifyFetch<{ productByHandle: ProductNode | null }>(
      `query Product($handle: String!) {
        productByHandle(handle: $handle) { ${PRODUCT_FIELDS} }
      }`,
      { handle },
      { revalidate: 60 },
    );
    return data.productByHandle ? mapProduct(data.productByHandle) : FALLBACK_PRODUCTS.find((p) => p.handle === handle) ?? null;
  } catch {
    return FALLBACK_PRODUCTS.find((p) => p.handle === handle) ?? null;
  }
}

/** Create a Shopify cart and return its hosted checkout URL. Quantities are
 *  clamped server-side (defensive — never trust the client). Returns null when
 *  no store is connected (or on error) so the UI degrades gracefully. */
export async function createCart(lines: { merchandiseId: string; quantity: number }[]): Promise<string | null> {
  const clean = lines
    .filter((l) => typeof l.merchandiseId === "string" && l.merchandiseId.startsWith("gid://"))
    .map((l) => ({ merchandiseId: l.merchandiseId, quantity: Math.max(1, Math.min(25, Math.floor(Number(l.quantity)) || 1)) }));
  if (!isShopifyConfigured || clean.length === 0) return null;
  try {
    const data = await shopifyFetch<{ cartCreate: { cart: { checkoutUrl: string } | null; userErrors: { message: string }[] } }>(
      `mutation CartCreate($lines: [CartLineInput!]!) {
        cartCreate(input: { lines: $lines }) {
          cart { checkoutUrl }
          userErrors { message }
        }
      }`,
      { lines: clean },
    );
    return data.cartCreate?.cart?.checkoutUrl ?? null;
  } catch {
    return null;
  }
}

/** Curated fallback content — the REAL Drop 001 garments, so the site is fully
 *  designed even before the Storefront API is wired or photography is uploaded.
 *  Live Shopify data always takes precedence when configured. */
export const FALLBACK_PRODUCTS: SoarProduct[] = [
  {
    id: "fallback-trucker",
    handle: "the-trucker-jacket",
    title: "The Trucker Jacket",
    price: 230,
    image: "/lookbook/jacket-front.webp",
    images: [
      "/lookbook/jacket-front.webp",
      "/lookbook/jacket-grey.webp",
      "/lookbook/jacket-back.webp",
      "/lookbook/jacket-blue.webp",
      "/lookbook/jacket-olive.webp",
    ],
    colorways: [
      { name: "Washed Grey", hex: "#7c7873", image: "/lookbook/jacket-front.webp" },
      { name: "Indigo", hex: "#3f4d66", image: "/lookbook/jacket-blue.webp" },
      { name: "Olive", hex: "#4d5040", image: "/lookbook/jacket-olive.webp" },
    ],
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
