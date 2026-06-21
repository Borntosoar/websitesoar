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

export type SoarProduct = {
  id: string;
  handle: string;
  title: string;
  price: number;
  image?: string;
  available: boolean;
  total: number;
  variantId?: string;
};

type ProductsResponse = {
  products: {
    edges: {
      node: {
        id: string;
        handle: string;
        title: string;
        totalInventory: number | null;
        featuredImage: { url: string } | null;
        variants: { edges: { node: { id: string; availableForSale: boolean; price: { amount: string } } }[] };
      };
    }[];
  };
};

/** Source of truth for drop name, claimed %, and the editorial grid. */
export async function getProducts(first = 12): Promise<SoarProduct[]> {
  const data = await shopifyFetch<ProductsResponse>(
    `query Products($first: Int!) {
      products(first: $first, sortKey: CREATED_AT, reverse: true) {
        edges { node {
          id handle title totalInventory
          featuredImage { url }
          variants(first: 1) { edges { node { id availableForSale price { amount } } } }
        } }
      }
    }`,
    { first },
  );
  return data.products.edges.map(({ node: n }) => {
    const v = n.variants.edges[0]?.node;
    return {
      id: n.id,
      handle: n.handle,
      title: n.title,
      total: n.totalInventory ?? 0,
      image: n.featuredImage?.url,
      available: v?.availableForSale ?? false,
      price: Number(v?.price.amount ?? 0),
      variantId: v?.id,
    };
  });
}
