"use server";

import { cookies } from "next/headers";
import { createCart } from "@/lib/shopify";
import { ACCESS_COOKIE, accessToken } from "@/lib/access";

/** Server Action — keeps the Storefront token server-side. Returns the Shopify
 *  hosted checkout URL (or null if no store is connected). */
export async function startCheckout(lines: { merchandiseId: string; quantity: number }[]): Promise<string | null> {
  return createCart(lines);
}

/** Capture a waitlist signup (owned audience — the brand's #2 goal). Wired for
 *  Klaviyo when KLAVIYO_PRIVATE_KEY + KLAVIYO_LIST_ID are set; otherwise
 *  validates and returns ok so the form works before the integration is added. */
export async function joinWaitlist(input: { email: string; phone?: string; sms?: boolean }): Promise<boolean> {
  const email = (input.email ?? "").trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return false;

  const key = process.env.KLAVIYO_PRIVATE_KEY;
  const listId = process.env.KLAVIYO_LIST_ID;
  if (!key || !listId) return true; // integration not wired yet — accept gracefully

  try {
    await fetch("https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/", {
      method: "POST",
      headers: {
        Authorization: `Klaviyo-API-Key ${key}`,
        "Content-Type": "application/json",
        revision: "2024-10-15",
      },
      body: JSON.stringify({
        data: {
          type: "profile-subscription-bulk-create-job",
          attributes: {
            profiles: {
              data: [
                {
                  type: "profile",
                  attributes: {
                    email,
                    ...(input.phone ? { phone_number: input.phone.trim() } : {}),
                    subscriptions: {
                      email: { marketing: { consent: "SUBSCRIBED" } },
                      ...(input.sms && input.phone ? { sms: { marketing: { consent: "SUBSCRIBED" } } } : {}),
                    },
                  },
                },
              ],
            },
          },
          relationships: { list: { data: { type: "list", id: listId } } },
        },
      }),
    });
    return true;
  } catch {
    return true; // never block the user on a downstream hiccup
  }
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
