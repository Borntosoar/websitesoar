"use client";

import { useState, type FormEvent } from "react";
import { buttonVariants } from "@/components/ui/button";

// Set real keys to go live; otherwise the form runs in demo mode.
const KLAVIYO = { publicKey: "YOUR_KLAVIYO_PUBLIC_KEY", listId: "YOUR_LIST_ID" };

export function List() {
  const [msg, setMsg] = useState("Early access + back-in-stock. Unsubscribe anytime.");
  const [state, setState] = useState<"idle" | "ok" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState("error");
      setMsg("Enter a valid email to begin the ascent.");
      return;
    }
    const live = KLAVIYO.publicKey.indexOf("YOUR_") !== 0;
    if (!live) {
      setState("ok");
      setMsg("On the list. Watch your inbox.");
      form.reset();
      return;
    }
    setMsg("Joining…");
    try {
      const attrs: Record<string, string> = { email };
      if (phone) attrs.phone_number = phone;
      const res = await fetch(
        `https://a.klaviyo.com/client/subscriptions/?company_id=${encodeURIComponent(KLAVIYO.publicKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", revision: "2024-10-15" },
          body: JSON.stringify({
            data: {
              type: "subscription",
              attributes: {
                custom_source: "SOAR Website",
                profile: { data: { type: "profile", attributes: attrs } },
              },
              relationships: { list: { data: { type: "list", id: KLAVIYO.listId } } },
            },
          }),
        },
      );
      if (res.ok || res.status === 202) {
        setState("ok");
        setMsg("On the list. Watch your inbox.");
        form.reset();
      } else {
        setState("error");
        setMsg("Something went wrong — please try again.");
      }
    } catch {
      setState("error");
      setMsg("Network error — please try again.");
    }
  }

  return (
    <section id="list" className="bg-paper py-20 text-ink md:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-2 md:items-center md:px-12">
        <div>
          <p className="text-[11px] uppercase tracking-[0.17em] text-taupe">
            (04) The List — powered by Klaviyo
          </p>
          <h2 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl">
            Get on the <em className="font-serif font-normal italic">list.</em>
          </h2>
          <p className="mt-4 max-w-md text-ink/70">
            Early access to every drop, members-only releases, and back-in-stock
            alerts. No noise — only ascent.
          </p>
        </div>
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-2.5">
          <input
            name="email"
            type="email"
            placeholder="Email address"
            required
            aria-label="Email address"
            className="border border-ink/20 bg-oat px-5 py-3.5 text-sm outline-none transition-colors placeholder:text-taupe focus:border-ink"
          />
          <input
            name="phone"
            type="tel"
            placeholder="Phone — SMS, optional"
            aria-label="Phone for SMS, optional"
            className="border border-ink/20 bg-oat px-5 py-3.5 text-sm outline-none transition-colors placeholder:text-taupe focus:border-ink"
          />
          <button type="submit" className={buttonVariants({ className: "justify-center" })}>
            Join the list
          </button>
          <p
            className={
              "mt-1 text-[11px] uppercase tracking-[0.14em] " +
              (state === "error" ? "text-[#9A3B2A]" : state === "ok" ? "text-ink" : "text-taupe")
            }
            aria-live="polite"
          >
            {msg}
          </p>
        </form>
      </div>
    </section>
  );
}
