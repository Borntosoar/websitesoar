const STOREFRONT_API_VERSION = "2025-01";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export const isShopifyConfigured = Boolean(domain && storefrontToken);

type ShopifyFetchOptions = {
  query: string;
  variables?: Record<string, unknown>;
};

type ShopifyResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

export async function shopifyFetch<T>({
  query,
  variables,
}: ShopifyFetchOptions): Promise<T> {
  if (!isShopifyConfigured) {
    throw new Error(
      "Shopify is not configured. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local — see .env.example."
    );
  }

  const res = await fetch(
    `https://${domain}/api/${STOREFRONT_API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontToken as string,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    }
  );

  const body = (await res.json()) as ShopifyResponse<T>;

  if (body.errors?.length) {
    throw new Error(body.errors.map((error) => error.message).join("; "));
  }

  if (!body.data) {
    throw new Error("Shopify Storefront API returned no data.");
  }

  return body.data;
}

const PRODUCTS_QUERY = `
  query Products($first: Int!) {
    products(first: $first) {
      nodes {
        id
        handle
        title
        descriptionHtml
        availableForSale
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 1) {
          nodes {
            url
            altText
          }
        }
      }
    }
  }
`;

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  descriptionHtml: string;
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
  images: { nodes: { url: string; altText: string | null }[] };
};

export async function getProducts(first = 12): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{ products: { nodes: ShopifyProduct[] } }>({
    query: PRODUCTS_QUERY,
    variables: { first },
  });
  return data.products.nodes;
}
