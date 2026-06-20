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

/** Create a Shopify cart and return its hosted checkout URL. Optionally
 *  auto-applies discount codes (e.g. the claimed 10%-off "SOAR10"). An unknown
 *  or inactive code is ignored by Shopify — it never blocks checkout. */
export async function createCheckout(
  lines: { merchandiseId: string; quantity: number }[],
  discountCodes?: string[],
): Promise<string | null> {
  const data = await storefront<{ cartCreate: { cart: { checkoutUrl: string } | null; userErrors: { message: string }[] } }>(
    `mutation Create($lines: [CartLineInput!]!, $discountCodes: [String!]) {
      cartCreate(input: { lines: $lines, discountCodes: $discountCodes }) {
        cart { checkoutUrl }
        userErrors { message }
      }
    }`,
    { lines, discountCodes: discountCodes && discountCodes.length ? discountCodes : null },
  );
  return data?.cartCreate?.cart?.checkoutUrl ?? null;
}

/** E.164-ish phone, or undefined (Shopify rejects malformed numbers). */
function e164(raw?: string): string | undefined {
  if (!raw) return undefined;
  const d = raw.replace(/[^\d+]/g, "");
  return /^\+?[1-9]\d{6,14}$/.test(d) ? (d.startsWith("+") ? d : "+" + d) : undefined;
}

/** Create a Shopify customer (Storefront customerCreate) from the entrance auth.
 *  Best-effort: needs the Storefront token to allow unauthenticated customer
 *  writes; otherwise it's a no-op and the lead is still captured locally. */
export async function createCustomer(input: {
  email: string;
  password: string;
  phone?: string;
  acceptsMarketing?: boolean;
}): Promise<{ ok: boolean; message?: string }> {
  const phone = e164(input.phone);
  const data = await storefront<{
    customerCreate: { customer: { id: string } | null; customerUserErrors: { message: string }[] };
  }>(
    `mutation Create($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer { id }
        customerUserErrors { message }
      }
    }`,
    { input: { email: input.email, password: input.password, acceptsMarketing: !!input.acceptsMarketing, ...(phone ? { phone } : {}) } },
  );
  if (!data) return { ok: false, message: "offline" };
  const errs = data.customerCreate?.customerUserErrors;
  if (errs && errs.length) return { ok: false, message: errs[0].message };
  return { ok: Boolean(data.customerCreate?.customer) };
}

export type SfVariant = { id: string; size: string; price: number; available: boolean };
export type SfProduct = {
  handle: string;
  title: string;
  description: string;
  productType: string;
  price: number;
  image?: string;
  tag?: string;
  /** REAL remaining inventory from Shopify (totalInventory). */
  total: number;
  /** Original run size, from the `custom.edition_size` product metafield.
   *  Undefined when the store owner hasn't set it — never inferred from stock. */
  editionSize?: number;
  variants: SfVariant[];
};

/** Fetch the live catalog from Shopify (display + checkout). */
export async function fetchProducts(): Promise<SfProduct[]> {
  type Node = {
    handle: string; title: string; description: string; productType: string; tags: string[]; totalInventory: number;
    editionSize: { value: string } | null;
    featuredImage: { url: string } | null;
    variants: { edges: { node: { id: string; title: string; availableForSale: boolean; price: { amount: string }; selectedOptions: { name: string; value: string }[] } }[] };
  };
  const data = await storefront<{ products: { edges: { node: Node }[] } }>(`{
    products(first: 30, sortKey: CREATED_AT, reverse: true) {
      edges { node {
        handle title description productType tags totalInventory
        editionSize: metafield(namespace: "custom", key: "edition_size") { value }
        featuredImage { url }
        variants(first: 25) { edges { node { id title availableForSale price { amount } selectedOptions { name value } } } }
      } }
    }
  }`);
  if (!data) return [];
  return data.products.edges.map(({ node: n }) => {
    // Original run size from the `custom.edition_size` metafield — only trust a
    // positive integer; otherwise leave undefined (never derive it from stock).
    const ed = n.editionSize ? Math.floor(Number(n.editionSize.value)) : NaN;
    const editionSize = Number.isFinite(ed) && ed > 0 ? ed : undefined;
    return {
    handle: n.handle,
    title: n.title,
    description: (n.description || "").trim(),
    productType: n.productType || "",
    image: n.featuredImage?.url,
    tag: n.tags && n.tags.length ? n.tags[0] : undefined,
    total: n.totalInventory ?? 0,
    editionSize,
    price: n.variants.edges.length ? Number(n.variants.edges[0].node.price.amount) : 0,
    variants: n.variants.edges.map(({ node: v }) => ({
      id: v.id,
      size: v.selectedOptions.find((o) => o.name.toLowerCase() === "size")?.value || v.title,
      price: Number(v.price.amount),
      available: v.availableForSale,
    })),
    };
  });
}
