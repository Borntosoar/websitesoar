"use client";

import { useEffect, useState } from "react";
import { shopifyEnabled, fetchProducts, type SfProduct } from "@/lib/shopify";
import type { Product } from "@/lib/products";

/** Maps a live Shopify product to the UI Product shape (+ variant GIDs). */
function toProduct(s: SfProduct, i: number): Product {
  const variantBySize: Record<string, string> = {};
  s.variants.forEach((v) => {
    variantBySize[v.size] = v.id;
  });
  return {
    id: s.handle,
    handle: s.handle,
    name: s.title,
    code: String(i + 1).padStart(3, "0"),
    price: Math.round(s.price),
    category: s.productType || "Apparel",
    tag: s.tag,
    image: s.image,
    sizes: s.variants.map((v) => v.size),
    description: s.description.slice(0, 180),
    details: [],
    // Honest scarcity: `left` is the REAL remaining stock; `edition` is the real
    // original run only when the store set `custom.edition_size`. 0 = unknown run
    // (sentinel) — never copy stock into edition, which would force a fake 100% bar.
    edition: s.editionSize ?? 0,
    left: s.total ?? 0,
    related: [],
    variantBySize,
  };
}

let cache: Product[] | null = null;
let pending: Promise<Product[]> | null = null;

/** Returns the live Shopify catalog, or null while loading / if unavailable
 *  (callers fall back to the local placeholder catalog). */
export function useCatalog(): Product[] | null {
  const [items, setItems] = useState<Product[] | null>(cache);

  useEffect(() => {
    if (!shopifyEnabled || cache) return;
    if (!pending) {
      pending = fetchProducts()
        .then((list) => {
          cache = list.map(toProduct);
          return cache;
        })
        .catch(() => {
          cache = [];
          return cache;
        });
    }
    pending.then(setItems);
  }, []);

  return items && items.length ? items : null;
}
