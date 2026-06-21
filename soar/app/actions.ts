"use server";

import { createCart } from "@/lib/shopify";

/** Server Action — keeps the Storefront token server-side. Returns the Shopify
 *  hosted checkout URL (or null if no store is connected). */
export async function startCheckout(lines: { merchandiseId: string; quantity: number }[]): Promise<string | null> {
  return createCart(lines);
}
