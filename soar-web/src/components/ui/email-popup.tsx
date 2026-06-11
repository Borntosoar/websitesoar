"use client";

/** 10%-off email capture popup — appears once per session, ~6s after the
 *  entrance is passed. Demo-mode (wire Klaviyo keys in sections/list.tsx). */

import { useEffect, useRef, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const KEY = "soar-popup-seen";
const GATE = "soar-gate-passed";

export function EmailPopup() {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {}
    if (seen) return;
    const id = setInterval(() => {
      let passed = false;
      try {
        passed = sessionStorage.getItem(GATE) === "1";
      } catch {}
      if (passed) {
        clearInterval(id);
        setTimeout(() => setOpen(true), 6000);
      }
    }, 800);
    return () => clearInterval(id);
  }, []);

  function close() {
    setOpen(false);
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const v = (inputRef.current?.value || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      setError(true);
      inputRef.current?.focus();
      return;
    }
    setError(false);
    setDone(true);
    setTimeout(close, 2600);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[150] grid place-items-center bg-espresso/55 px-5 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Get 10% off"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="relative w-full max-w-md border border-ink/10 bg-oat p-8 text-ink shadow-2xl md:p-10">
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center opacity-60 transition-opacity hover:opacity-100"
        >
          <X size={16} strokeWidth={1.6} />
        </button>
        <span className="text-[11px] uppercase tracking-[0.22em] text-taupe">The List</span>
        {done ? (
          <p className="mt-3 text-xl font-medium">
            You&apos;re in. <em className="font-serif italic">Check your inbox for 10% off.</em>
          </p>
        ) : (
          <>
            <h3 className="mt-2 text-2xl font-medium leading-tight tracking-tight md:text-3xl">
              10% off your first piece.
            </h3>
            <p className="mt-2 text-sm text-ink/65">
              Join the list — early drop access, members-only releases, and 10% off your first
              order.
            </p>
            <form onSubmit={onSubmit} noValidate className="mt-5 flex gap-2">
              <input
                ref={inputRef}
                type="email"
                placeholder="Email address"
                aria-label="Email address"
                onChange={() => setError(false)}
                className={cn(
                  "min-w-0 flex-1 border bg-paper px-4 py-3 text-sm outline-none transition-colors placeholder:text-taupe",
                  error ? "border-[#9A3B2A]" : "border-ink/20 focus:border-ink",
                )}
              />
              <button
                type="submit"
                className="bg-ink px-5 py-3 text-[13px] font-medium text-oat transition-colors hover:bg-espresso"
              >
                Get 10% off
              </button>
            </form>
            <p className={cn("mt-2 text-[11px] uppercase tracking-[0.14em]", error ? "text-[#9A3B2A]" : "text-taupe")}>
              {error ? "Enter a valid email." : "No noise — only ascent. Unsubscribe anytime."}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
