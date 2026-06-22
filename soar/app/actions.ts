"use server";

import { cookies } from "next/headers";
import { createCart } from "@/lib/shopify";
import { ACCESS_COOKIE, accessToken } from "@/lib/access";

/** Server Action — keeps the Storefront token server-side. Returns the Shopify
 *  hosted checkout URL (or null if no store is connected). */
export async function startCheckout(lines: { merchandiseId: string; quantity: number }[]): Promise<string | null> {
  return createCart(lines);
}

/** Validate the access password server-side and, on success, set the gate
 *  cookie (httpOnly — the password never lives on the client). Returns ok so the
 *  entrance can play its breakthrough animation before navigating in. When no
 *  password is configured the gate is open (graceful fallback). */
export async function enterWithPassword(password: string): Promise<boolean> {
  const required = process.env.SOAR_ACCESS_PASSWORD;
  if (!required) return true; // gate disabled
  if (password !== required) return false;
  const jar = await cookies();
  jar.set(ACCESS_COOKIE, await accessToken(required), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return true;
}
