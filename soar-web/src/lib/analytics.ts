/**
 * SOAR — provider-agnostic analytics.
 *
 * Tiny, dependency-free, SSR-safe event tracker. Emits to the standard GA4
 * `dataLayer` (Google Tag Manager) and, if present, the `gtag` function — so a
 * real GA4 / Segment / GTM container id can be wired in `layout.tsx` later
 * WITHOUT touching any call sites. No network calls, no keys, never throws.
 */

export type TrackEvent =
  | { type: "product_view"; id: string; name: string; price: number }
  | { type: "add_to_cart"; id: string; qty: number; size?: string; price: number }
  | { type: "begin_checkout"; value: number; items: number }
  | { type: "begin_ascent" }
  | { type: "entrance_complete" };

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Fire an analytics event. SSR-safe and guaranteed never to throw. */
export function track(e: TrackEvent): void {
  if (typeof window === "undefined") return;
  try {
    (window.dataLayer ||= []).push({ event: e.type, ...e });
    window.gtag?.("event", e.type, e);
  } catch {
    // analytics must never break the app
  }
}
