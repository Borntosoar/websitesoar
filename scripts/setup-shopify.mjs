#!/usr/bin/env node
/**
 * SOAR — one-shot Shopify headless setup.
 *
 * Creates the 8 SOAR products (with Size variants), publishes them to the Online
 * Store, and generates a public Storefront API token for the headless site.
 *
 * USAGE (Node 18+):
 *   1) Shopify admin → Settings → Apps and sales channels → Develop apps →
 *      Create an app → Configure Admin API scopes: enable
 *        write_products, read_products, read_publications, write_publications
 *      Also under "Storefront API", allow it. Install the app, copy the
 *      Admin API access token (starts with shpat_...).
 *   2) Run:
 *        SHOPIFY_ADMIN_TOKEN=shpat_xxx node scripts/setup-shopify.mjs
 *   3) Paste the printed STOREFRONT TOKEN into Vercel as
 *        NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN
 *      (NEXT_PUBLIC_SHOPIFY_DOMAIN is already n06e1d-pn.myshopify.com)
 */

const DOMAIN = process.env.SHOPIFY_DOMAIN || "n06e1d-pn.myshopify.com";
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const API = "2024-10";

if (!ADMIN_TOKEN) {
  console.error("✗ Set SHOPIFY_ADMIN_TOKEN (shpat_...). See the header of this file.");
  process.exit(1);
}

async function admin(query, variables) {
  const res = await fetch(`https://${DOMAIN}/admin/api/${API}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": ADMIN_TOKEN },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors, null, 2));
  return json.data;
}

const APPAREL = ["S", "M", "L", "XL"];
const ONE = ["OS"];
const products = [
  { handle: "ascension-hoodie", title: "Ascension Hoodie", type: "Hoodies", price: 180, sizes: APPAREL, tags: ["Drop 001"], desc: "A heavyweight hood built for the long climb — structured, quiet, made to be lived in." },
  { handle: "escape-tee", title: "Escape Tee", type: "Tees", price: 70, sizes: APPAREL, tags: [], desc: "The first step out of the box. A dense, structured tee that holds its line." },
  { handle: "flight-sweatpants", title: "Flight Sweatpants", type: "Sweatpants", price: 140, sizes: APPAREL, tags: [], desc: "Tapered, weighted, and quiet. Movement without noise." },
  { handle: "rise-bomber", title: "Rise Bomber", type: "Outerwear", price: 320, sizes: APPAREL, tags: ["Limited"], desc: "The outer shell of the ascent — weather-ready, architectural, built to outlast seasons." },
  { handle: "free-bird-cap", title: "Free Bird Cap", type: "Accessories", price: 55, sizes: ONE, tags: [], desc: "Low-profile, unstructured. The mark sits where the sky begins." },
  { handle: "limitless-crewneck", title: "Limitless Crewneck", type: "Hoodies", price: 160, sizes: APPAREL, tags: [], desc: "No hood, no noise — a clean crew with weight and structure." },
  { handle: "ascend-shorts", title: "Ascend Shorts", type: "Shorts", price: 95, sizes: APPAREL, tags: [], desc: "Built for the warm season of the climb. Weighted, tapered, considered." },
  { handle: "horizon-tee", title: "Horizon Tee", type: "Tees", price: 70, sizes: APPAREL, tags: [], desc: "Open-sky lightweight tee. The line between where you are and where you're going." },
];

const PRODUCT_SET = `mutation productSet($input: ProductSetInput!) {
  productSet(synchronous: true, input: $input) {
    product { id handle }
    userErrors { field message }
  }
}`;

async function getOnlineStorePublicationId() {
  const data = await admin(`{ publications(first: 20) { nodes { id name } } }`);
  const pub = data.publications.nodes.find((p) => /online store/i.test(p.name));
  return pub ? pub.id : null;
}

async function run() {
  console.log(`→ Store: ${DOMAIN}`);
  const pubId = await getOnlineStorePublicationId();
  console.log(pubId ? `→ Online Store publication: ${pubId}` : "! No Online Store publication found (will still create products)");

  for (const p of products) {
    const input = {
      handle: p.handle,
      title: p.title,
      descriptionHtml: `<p>${p.desc}</p>`,
      productType: p.type,
      vendor: "SOAR",
      status: "ACTIVE",
      tags: p.tags,
      productOptions: [{ name: "Size", position: 1, values: p.sizes.map((s) => ({ name: s })) }],
      variants: p.sizes.map((s) => ({ price: String(p.price), optionValues: [{ optionName: "Size", name: s }] })),
    };
    const data = await admin(PRODUCT_SET, { input });
    const errs = data.productSet.userErrors;
    if (errs && errs.length) {
      console.log(`  ✗ ${p.title}: ${errs.map((e) => e.message).join("; ")}`);
      continue;
    }
    const id = data.productSet.product.id;
    console.log(`  ✓ ${p.title} (${id})`);
    if (pubId) {
      await admin(
        `mutation pub($id: ID!, $input: [PublicationInput!]!) { publishablePublish(id: $id, input: $input) { userErrors { message } } }`,
        { id, input: [{ publicationId: pubId }] },
      );
    }
  }

  const tok = await admin(`mutation { storefrontAccessTokenCreate(input: { title: "SOAR Headless" }) {
    storefrontAccessToken { accessToken } userErrors { field message }
  } }`);
  const t = tok.storefrontAccessTokenCreate;
  if (t.userErrors && t.userErrors.length) {
    console.log("! Storefront token:", t.userErrors.map((e) => e.message).join("; "));
  } else {
    console.log("\n========================================");
    console.log("STOREFRONT TOKEN (set as NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN in Vercel):");
    console.log(t.storefrontAccessToken.accessToken);
    console.log("NEXT_PUBLIC_SHOPIFY_DOMAIN=" + DOMAIN);
    console.log("========================================\n");
  }
  console.log("Done.");
}

run().catch((e) => {
  console.error("✗ Failed:", e.message);
  process.exit(1);
});
