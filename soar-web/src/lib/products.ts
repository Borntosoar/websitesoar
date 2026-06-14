export type Product = {
  id: string;
  name: string;
  code: string;
  price: number;
  category: string;
  tag?: string;
};

/** Original SOAR pieces — names carry the box→breakthrough language. */
export const products: Product[] = [
  { id: "ascension-hoodie", name: "Ascension Hoodie", code: "001", price: 180, category: "Hoodies", tag: "Drop 001" },
  { id: "escape-tee", name: "Escape Tee", code: "002", price: 70, category: "Tees" },
  { id: "flight-sweatpants", name: "Flight Sweatpants", code: "003", price: 140, category: "Sweatpants" },
  { id: "rise-bomber", name: "Rise Bomber", code: "004", price: 320, category: "Outerwear", tag: "Limited" },
  { id: "free-bird-cap", name: "Free Bird Cap", code: "005", price: 55, category: "Accessories" },
  { id: "limitless-crew", name: "Limitless Crewneck", code: "006", price: 160, category: "Hoodies" },
  { id: "ascend-short", name: "Ascend Shorts", code: "007", price: 95, category: "Shorts" },
  { id: "horizon-tee", name: "Horizon Tee", code: "008", price: 70, category: "Tees" },
];

const featured = new Set(["ascension-hoodie", "rise-bomber", "flight-sweatpants", "escape-tee"]);
export const bestSellers = products.filter((p) => featured.has(p.id));
