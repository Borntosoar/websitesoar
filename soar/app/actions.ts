"use server";

import { cookies } from "next/headers";
import { createCart } from "@/lib/shopify";
import { ACCESS_COOKIE, accessToken } from "@/lib/access";

/** Server Action — keeps the Storefront token server-side. Returns the Shopify
 *  hosted checkout URL (or null if no store is connected). */
export async function startCheckout(lines: { merchandiseId: string; quantity: number }[]): Promise<string | null> {
  return createCart(lines);
}

export type WaitlistResult = "ok" | "invalid" | "error";

/** Capture a First Flight signup — the brand's #2 goal (owned audience).
 *  Stays headless: the signup becomes a real Shopify customer with marketing
 *  consent via the Admin API (preferred), or Klaviyo if configured. Returns
 *  "error" (never a silent success) when no backend is set, so the form can be
 *  honest instead of quietly dropping the email. */
export async function joinWaitlist(input: { email: string; phone?: string; sms?: boolean }): Promise<WaitlistResult> {
  const email = (input.email ?? "").trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return "invalid";
  // only attach phone/SMS consent when it's already E.164 (avoids Shopify rejects)
  const raw = input.phone?.trim();
  const phone = raw && /^\+[1-9]\d{6,14}$/.test(raw) ? raw : undefined;

  // 1) Shopify Admin API — capture as a marketing-consented customer (headless)
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  if (domain && adminToken) {
    try {
      const res = await fetch(`https://${domain}/admin/api/2024-10/graphql.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": adminToken },
        body: JSON.stringify({
          query: `mutation Create($input: CustomerInput!) {
            customerCreate(input: $input) { customer { id } userErrors { field message } }
          }`,
          variables: {
            input: {
              email,
              tags: ["First Flight", "Drop 001"],
              emailMarketingConsent: { marketingState: "SUBSCRIBED", marketingOptInLevel: "SINGLE_OPT_IN" },
              ...(phone ? { phone } : {}),
              ...(input.sms && phone ? { smsMarketingConsent: { marketingState: "SUBSCRIBED", marketingOptInLevel: "SINGLE_OPT_IN" } } : {}),
            },
          },
        }),
      });
      const json = await res.json().catch(() => null);
      const errs: { message: string }[] = json?.data?.customerCreate?.userErrors ?? [];
      // "already been taken" = they're already on the list → success for the user
      if (errs.length && !errs.some((e) => /taken|already/i.test(e.message))) {
        console.error("[waitlist] shopify userErrors", errs);
        return "error";
      }
      if (!res.ok && !errs.length) {
        console.error("[waitlist] shopify request failed", res.status);
        return "error";
      }
      return "ok";
    } catch (e) {
      console.error("[waitlist] shopify request threw", e);
      return "error";
    }
  }

  // 2) Klaviyo — if configured instead
  const key = process.env.KLAVIYO_PRIVATE_KEY;
  const listId = process.env.KLAVIYO_LIST_ID;
  if (key && listId) {
    try {
      await fetch("https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/", {
        method: "POST",
        headers: { Authorization: `Klaviyo-API-Key ${key}`, "Content-Type": "application/json", revision: "2024-10-15" },
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
                      ...(phone ? { phone_number: phone } : {}),
                      subscriptions: {
                        email: { marketing: { consent: "SUBSCRIBED" } },
                        ...(input.sms && phone ? { sms: { marketing: { consent: "SUBSCRIBED" } } } : {}),
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
      return "ok";
    } catch (e) {
      console.error("[waitlist] klaviyo request failed", e);
      return "error";
    }
  }

  // 3) Nothing configured — do NOT pretend success (the council's #1 fix)
  console.error("[waitlist] no capture backend — set SHOPIFY_ADMIN_ACCESS_TOKEN (or KLAVIYO_PRIVATE_KEY + KLAVIYO_LIST_ID)");
  return "error";
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
