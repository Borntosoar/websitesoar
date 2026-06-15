// Headless Shopify — Storefront API (client-side safe; uses a PUBLIC token).
// Configure via env: NEXT_PUBLIC_SHOPIFY_DOMAIN + NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN.
// Without them the site falls back to local data and the placeholder checkout.

const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = "2024-10";

export const shopifyEnabled = Boolean(domain && token);

async function storefront<T>(query: string, variables?: Record<string, unknown>): Promise<T | null> {
  if (!shopifyEnabled) return null;
  try {
    const res = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token as string,
      },
      body: JSON.stringify({ query, variables }),
    });
    const json = await res.json();
    return json.data as T;
  } catch {
    return null;
  }
}

/** handle → (size → variant GID). Used to map the local cart to real Shopify
 *  variants at checkout. Cached for the session. */
let variantCache: Map<string, Map<string, string>> | null = null;

export async function fetchVariantMap(): Promise<Map<string, Map<string, string>>> {
  if (variantCache) return variantCache;
  const data = await storefront<{
    products: { edges: { node: { handle: string; variants: { edges: { node: { id: string; selectedOptions: { name: string; value: string }[] } }[] } } }[] };
  }>(`{
    products(first: 50) {
      edges { node {
        handle
        variants(first: 25) { edges { node { id selectedOptions { name value } } } }
      } }
    }
  }`);
  const map = new Map<string, Map<string, string>>();
  for (const p of data?.products.edges ?? []) {
    const sizes = new Map<string, string>();
    for (const v of p.node.variants.edges) {
      const size = v.node.selectedOptions.find((o) => o.name.toLowerCase() === "size")?.value ?? "OS";
      sizes.set(size, v.node.id);
    }
    map.set(p.node.handle, sizes);
  }
  variantCache = map;
  return map;
}

/** Create a Shopify cart and return its hosted checkout URL. */
export async function createCheckout(lines: { merchandiseId: string; quantity: number }[]): Promise<string | null> {
  const data = await storefront<{ cartCreate: { cart: { checkoutUrl: string } | null; userErrors: { message: string }[] } }>(
    `mutation Create($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart { checkoutUrl }
        userErrors { message }
      }
    }`,
    { lines },
  );
  return data?.cartCreate?.cart?.checkoutUrl ?? null;
}
