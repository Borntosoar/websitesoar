// STATIC — Shopify Storefront API (commerce engine only). Separate store/token
// from SOAR. Without env it returns null and the UI falls back to mock data.
const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = "2024-10";

export const shopifyEnabled = Boolean(domain && token);

async function storefront<T>(query: string, variables?: Record<string, unknown>): Promise<T | null> {
  if (!shopifyEnabled) return null;
  try {
    const res = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": token as string },
      body: JSON.stringify({ query, variables }),
    });
    const json = await res.json();
    return json.data as T;
  } catch {
    return null;
  }
}

/** Create a STATIC cart and return its hosted checkout URL (Shopify handles checkout). */
export async function createCheckout(lines: { merchandiseId: string; quantity: number }[]): Promise<string | null> {
  const data = await storefront<{ cartCreate: { cart: { checkoutUrl: string } | null } }>(
    `mutation Create($lines: [CartLineInput!]!) { cartCreate(input: { lines: $lines }) { cart { checkoutUrl } } }`,
    { lines },
  );
  return data?.cartCreate?.cart?.checkoutUrl ?? null;
}
