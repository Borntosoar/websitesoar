export type Product = {
  id: string;
  name: string;
  code: string;
  price: number;
  category: string;
  tag?: string;
  /** Drop a real/AI photo at /public/products/<id>.jpg and set this to use it. */
  image?: string;
  sizes: string[];
  description: string;
  details: string[];
  edition: number;
  left: number;
  related: string[];
};

const APPAREL = ["S", "M", "L", "XL"];
const ONE = ["OS"];

/** Original SOAR pieces — names carry the box→breakthrough language. */
export const products: Product[] = [
  {
    id: "ascension-hoodie",
    name: "Ascension Hoodie",
    code: "001",
    price: 180,
    category: "Hoodies",
    tag: "Drop 001",
    sizes: APPAREL,
    description: "A heavyweight hood built for the long climb — structured, quiet, made to be lived in.",
    details: ["480gsm organic cotton loopback", "Boxy, considered fit", "Numbered 1 of 200", "Made in Portugal"],
    edition: 200,
    left: 38,
    related: ["flight-sweatpants", "escape-tee", "rise-bomber"],
  },
  {
    id: "escape-tee",
    name: "Escape Tee",
    code: "002",
    price: 70,
    category: "Tees",
    sizes: APPAREL,
    description: "The first step out of the box. A dense, structured tee that holds its line.",
    details: ["240gsm combed cotton", "Relaxed boxy fit", "Embossed mark at hem", "Made in Portugal"],
    edition: 300,
    left: 121,
    related: ["ascension-hoodie", "horizon-tee", "free-bird-cap"],
  },
  {
    id: "flight-sweatpants",
    name: "Flight Sweatpants",
    code: "003",
    price: 140,
    category: "Sweatpants",
    sizes: APPAREL,
    description: "Tapered, weighted, and quiet. Movement without noise.",
    details: ["480gsm organic loopback", "Tapered with ribbed cuff", "Numbered 1 of 200", "Made in Portugal"],
    edition: 200,
    left: 52,
    related: ["ascension-hoodie", "limitless-crew", "ascend-short"],
  },
  {
    id: "rise-bomber",
    name: "Rise Bomber",
    code: "004",
    price: 320,
    category: "Outerwear",
    tag: "Limited",
    sizes: APPAREL,
    description: "The outer shell of the ascent — weather-ready, architectural, built to outlast seasons.",
    details: ["Water-repellent dry twill", "Ribbed collar, cuff & hem", "Numbered 1 of 120", "Made in Japan"],
    edition: 120,
    left: 14,
    related: ["ascension-hoodie", "flight-sweatpants", "free-bird-cap"],
  },
  {
    id: "free-bird-cap",
    name: "Free Bird Cap",
    code: "005",
    price: 55,
    category: "Accessories",
    sizes: ONE,
    description: "Low-profile, unstructured. The mark sits where the sky begins.",
    details: ["Garment-washed cotton", "Adjustable strap", "Tonal embroidered mark", "One size"],
    edition: 400,
    left: 233,
    related: ["escape-tee", "horizon-tee", "ascension-hoodie"],
  },
  {
    id: "limitless-crew",
    name: "Limitless Crewneck",
    code: "006",
    price: 160,
    category: "Hoodies",
    sizes: APPAREL,
    description: "No hood, no noise — a clean crew with weight and structure.",
    details: ["480gsm organic loopback", "Ribbed collar, cuff & hem", "Numbered 1 of 200", "Made in Portugal"],
    edition: 200,
    left: 67,
    related: ["flight-sweatpants", "ascension-hoodie", "escape-tee"],
  },
  {
    id: "ascend-short",
    name: "Ascend Shorts",
    code: "007",
    price: 95,
    category: "Shorts",
    sizes: APPAREL,
    description: "Built for the warm season of the climb. Weighted, tapered, considered.",
    details: ["400gsm organic terry", "Mid-length, tapered", "Numbered 1 of 250", "Made in Portugal"],
    edition: 250,
    left: 88,
    related: ["escape-tee", "free-bird-cap", "horizon-tee"],
  },
  {
    id: "horizon-tee",
    name: "Horizon Tee",
    code: "008",
    price: 70,
    category: "Tees",
    sizes: APPAREL,
    description: "Open-sky lightweight tee. The line between where you are and where you're going.",
    details: ["220gsm combed cotton", "Clean straight fit", "Tonal mark at nape", "Made in Portugal"],
    edition: 300,
    left: 140,
    related: ["escape-tee", "free-bird-cap", "ascension-hoodie"],
  },
];

const byId = new Map(products.map((p) => [p.id, p]));
export const getProduct = (id: string) => byId.get(id);

const featured = new Set(["ascension-hoodie", "rise-bomber", "flight-sweatpants", "escape-tee"]);
export const bestSellers = products.filter((p) => featured.has(p.id));
