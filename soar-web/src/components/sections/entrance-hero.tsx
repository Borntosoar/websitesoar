"use client";

/**
 * SOAR — Entrance Hero. Gate + hero as ONE continuous 3D breakthrough.
 * Locked: the box, dim, password prompt. Correct password -> the scene ignites
 * (unlocked=true) and the hero copy resolves; scroll unlocks into the store.
 *
 * The password is client-side (ships in the bundle) — a drop splash, not real
 * security. For true gating use Shopify's storefront password page.
 */

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const BreakthroughScene = dynamic(
  () => import("@/components/ui/breakthrough-scene").then((m) => m.BreakthroughScene),
  { ssr: false },
);

const PASS = "ASCEND"; // change me
const KEY = "soar-gate-passed";
const BASE = "Access by invitation. Rise above to enter.";

export function EntranceHero() {
  const [entered, setEntered] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState(BASE);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let passed = false;
    try {
      passed = sessionStorage.getItem(KEY) === "1";
    } catch {}
    if (passed) setEntered(true);
    else setTimeout(() => inputRef.current?.focus(), 420);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("gate-locked", !entered);
    return () => document.body.classList.remove("gate-locked");
  }, [entered]);

  function enter() {
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
    setEntered(true);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if ((inputRef.current?.value || "").trim().toLowerCase() === PASS.toLowerCase()) {
      setError(false);
      enter();
    } else {
      setError(true);
      setMsg("Not yet — the box holds. Try again.");
      inputRef.current?.select();
    }
  }

  return (
    <section className="relative h-svh w-full overflow-hidden bg-espresso text-bone">
      <div className="absolute inset-0 z-0">
        <BreakthroughScene unlocked={entered} />
      </div>
      {/* vignette for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{ background: "radial-gradient(120% 90% at 50% 38%, transparent 40%, rgba(15,12,9,0.55) 100%)" }}
      />

      {/* LOCKED — the gate */}
      <div
        className={cn(
          "absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 px-6 text-center transition-all duration-700 ease-brand",
          entered ? "pointer-events-none -translate-y-3 opacity-0" : "opacity-100",
        )}
      >
        <span className="text-[11px] uppercase tracking-[0.24em] text-bone/55">Ascension Vol.01 — Members only</span>
        <h1 className="text-3xl font-medium leading-tight tracking-tight md:text-5xl">
          The box is locked.
          <br />
          <em className="font-serif font-normal italic">Break through.</em>
        </h1>
        <form onSubmit={onSubmit} noValidate className="mt-2 flex w-full max-w-[360px] gap-2.5">
          <input
            ref={inputRef}
            type="password"
            placeholder="Enter password"
            aria-label="Password"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            onChange={() => {
              if (error) {
                setError(false);
                setMsg(BASE);
              }
            }}
            className="min-w-0 flex-1 border border-bone/25 bg-espresso/40 px-5 py-3.5 text-sm text-bone outline-none backdrop-blur-sm transition-colors placeholder:text-bone/45 focus:border-bone"
          />
          <button type="submit" className="bg-bone px-6 py-3.5 text-[13px] font-medium text-ink transition-colors hover:bg-white">
            Enter
          </button>
        </form>
        <p aria-live="polite" className={cn("text-[11px] uppercase tracking-[0.14em]", error ? "text-[#C98A7A]" : "text-bone/55")}>
          {msg}
        </p>
        <button
          type="button"
          onClick={enter}
          className="text-[11px] uppercase tracking-[0.14em] text-bone/55 underline underline-offset-4 transition-colors hover:text-bone"
        >
          No password? Enter as guest →
        </button>
      </div>

      {/* UNLOCKED — the hero */}
      <div
        className={cn(
          "absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 px-6 text-center transition-all duration-1000 ease-brand",
          entered ? "opacity-100 delay-300" : "pointer-events-none translate-y-3 opacity-0",
        )}
      >
        <span className="text-[11px] uppercase tracking-[0.24em] text-bone/55">Minimalist streetwear — Est. MMXXIV</span>
        <h1 className="max-w-3xl text-4xl font-medium leading-[1.04] tracking-tight md:text-6xl">
          Growth begins where comfort <em className="font-serif font-normal italic">ends.</em>
        </h1>
        <p className="max-w-md text-bone/60">
          Premium essentials, released in limited drops. Quiet on the outside. Loud in the doing.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-2.5">
          <a href="#drop" className={buttonVariants({ variant: "bone" })}>
            Shop the drop
          </a>
          <a
            href="#world"
            className="border border-bone/25 px-7 py-3.5 text-[13px] font-medium text-bone transition-colors hover:bg-bone hover:text-ink"
          >
            Our world
          </a>
        </div>
      </div>

      <a
        href="#drop"
        className={cn(
          "absolute bottom-7 left-1/2 z-20 -translate-x-1/2 text-[11px] uppercase tracking-[0.18em] text-bone/55 transition-opacity duration-700",
          entered ? "opacity-100 delay-700" : "opacity-0",
        )}
      >
        Scroll ↓
      </a>
    </section>
  );
}
