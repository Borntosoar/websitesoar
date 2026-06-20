// STATIC — mock catalogue (separate from SOAR). Real data arrives via Shopify
// Storefront once a STATIC store + token exist; the UI shape stays identical.
export type Product = {
  id: string;
  handle: string;
  name: string;
  price: number;
  category: string;
  sizes: string[];
  left: number;
  total: number;
  tag?: string;
  image?: string;
};

export const products: Product[] = [
  { id: "signal-hoodie", handle: "signal-hoodie", name: "SIGNAL HOODIE", price: 185, category: "Outerwear", sizes: ["S", "M", "L", "XL"], left: 23, total: 100, tag: "DROP 001" },
  { id: "noise-cargo", handle: "noise-cargo", name: "NOISE CARGO", price: 240, category: "Trousers", sizes: ["28", "30", "32", "34"], left: 8, total: 80 },
  { id: "cut-tee", handle: "cut-tee", name: "CUT TEE", price: 75, category: "Tops", sizes: ["S", "M", "L", "XL"], left: 0, total: 150 },
  { id: "static-jacket", handle: "static-jacket", name: "STATIC JACKET", price: 420, category: "Outerwear", sizes: ["S", "M", "L"], left: 41, total: 60, tag: "FLAGSHIP" },
  { id: "interference-pant", handle: "interference-pant", name: "INTERFERENCE PANT", price: 210, category: "Trousers", sizes: ["28", "30", "32"], left: 15, total: 90 },
  { id: "frequency-cap", handle: "frequency-cap", name: "FREQUENCY CAP", price: 60, category: "Accessories", sizes: ["OS"], left: 60, total: 200 },
];

export const flagship = products.find((p) => p.tag === "FLAGSHIP") ?? products[0];
export const drop = products[0];
export const byHandle = (h: string) => products.find((p) => p.handle === h);
