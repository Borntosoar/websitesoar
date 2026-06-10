"use client";

/**
 * SOAR — Entrance Gate (password)
 * The streetwear-website "password / coming-soon gate" pattern, themed to the
 * soar-brand bible: the gate IS the box; the password is your breakthrough.
 * Correct password -> the box cracks, a fragment displaces, the mark ascends,
 * light blooms -> the site reveals.
 *
 * NOTE: client-side only (the password ships in the bundle) — a drop-culture
 * splash for exclusivity, NOT real security. For true gating use Shopify's
 * storefront password page or a server check.
 */

import { useEffect, useRef, useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";

const PASS = "ASCEND"; // change me
const KEY = "soar-gate-passed";
const BASE_MSG = "Access by invitation. Rise above to enter.";

export function EntranceGate() {
  const [open, setOpen] = useState(true);
  const [unlocking, setUnlocking] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState(BASE_MSG);
  const [gone, setGone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let passed = false;
    try {
      passed = sessionStorage.getItem(KEY) === "1";
    } catch {}
    if (passed) setOpen(false);
    else setTimeout(() => inputRef.current?.focus(), 350);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) {
      const id = setTimeout(() => setGone(true), 850);
      return () => clearTimeout(id);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function enter(skipAnim: boolean) {
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (skipAnim || reduce) {
      setOpen(false);
      return;
    }
    setUnlocking(true);
    setTimeout(() => setOpen(false), 1500);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const v = (inputRef.current?.value || "").trim();
    if (v.toLowerCase() === PASS.toLowerCase()) {
      setError(false);
      enter(false);
    } else {
      setError(true);
      setMsg("Not yet — the box holds. Try again.");
      inputRef.current?.select();
    }
  }

  function skip() {
    enter(true);
    setTimeout(
      () => document.getElementById("list")?.scrollIntoView({ behavior: "smooth" }),
      120,
    );
  }

  if (gone) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Enter SOAR"
      className={cn(
        "fixed inset-0 z-[200] grid place-items-center bg-espresso px-6 text-center text-bone transition-opacity duration-700 ease-brand",
        open ? "opacity-100" : "pointer-events-none opacity-0",
        unlocking && "is-unlocking",
      )}
    >
      <div className="flex w-full max-w-[440px] flex-col items-center gap-4">
        <span className="text-[11px] uppercase tracking-[0.24em] text-bone/55">SOAR®</span>

        <svg
          className="gate-symbol w-[clamp(140px,30vw,196px)] overflow-visible"
          viewBox="0 0 200 220"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="gate-bloom" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#F3EEE3" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#F3EEE3" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle className="gs-light" cx="100" cy="72" r="74" fill="url(#gate-bloom)" />
          <g className="gs-stroke">
            <path d="M60 200 L140 200 L140 130 L60 130 Z" />
            <path d="M60 130 L80 112 L160 112 L140 130" />
            <path d="M140 200 L160 182 L160 112" />
          </g>
          <path className="gs-crack gs-stroke" d="M100 130 L106 150 L96 168 L102 200" strokeWidth="1.1" />
          <path className="gs-crack gs-stroke" d="M80 124 L120 124" strokeWidth="1.1" />
          <path className="gs-frag gs-stroke" d="M126 112 L160 112 L150 130 Z" />
          <g className="gs-bird">
            <path d="M100 96 L112 120 L88 120 Z" fill="#E7E2D7" />
          </g>
        </svg>

        <p className="text-[11px] uppercase tracking-[0.17em] text-bone/55">
          Ascension Vol.01 — Members only
        </p>
        <h2 className="text-2xl font-medium leading-tight tracking-tight md:text-3xl">
          The box is locked.
          <br />
          <em className="font-serif font-normal italic">Break through.</em>
        </h2>

        <form onSubmit={onSubmit} noValidate className="mt-1 flex w-full max-w-[360px] gap-2.5">
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
                setMsg(BASE_MSG);
              }
            }}
            className="min-w-0 flex-1 border border-bone/20 bg-transparent px-5 py-3.5 text-sm text-bone outline-none transition-colors placeholder:text-bone/45 focus:border-bone"
          />
          <button
            type="submit"
            className="bg-bone px-6 py-3.5 text-[13px] font-medium text-ink transition-colors hover:bg-white"
          >
            Enter
          </button>
        </form>

        <p
          aria-live="polite"
          className={cn(
            "min-h-[1.2em] text-[11px] uppercase tracking-[0.14em]",
            error ? "text-[#C98A7A]" : "text-bone/55",
          )}
        >
          {msg}
        </p>

        <button
          type="button"
          onClick={skip}
          className="text-[11px] uppercase tracking-[0.14em] text-bone/55 underline underline-offset-4 transition-colors hover:text-bone"
        >
          No password? Join the list for the next drop →
        </button>
      </div>
    </div>
  );
}
