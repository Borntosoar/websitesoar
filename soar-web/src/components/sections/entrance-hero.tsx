"use client";

/**
 * SOAR — Studio entrance (fixed overlay). Confirm 13+ and the password `soar`;
 * the box breaks open, the bird climbs, "SOAR" resolves, then a clean fade to
 * the home beneath. Black & white.
 */

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";

const BreakthroughScene = dynamic(
  () => import("@/components/ui/breakthrough-scene").then((m) => m.BreakthroughScene),
  { ssr: false },
);

const PASS = "soar";
const KEY = "soar-gate-passed";

export function EntranceHero() {
  const [entered, setEntered] = useState(false);
  const [showWord, setShowWord] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [gone, setGone] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<"age" | "pass" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let passed = false;
    try {
      passed = sessionStorage.getItem(KEY) === "1";
    } catch {}
    if (passed) {
      setGone(true);
      document.body.classList.remove("gate-locked");
    } else {
      document.body.classList.add("gate-locked");
      setTimeout(() => inputRef.current?.focus(), 500);
    }
  }, []);

  function go() {
    setEntered(true);
    setTimeout(() => setShowWord(true), 1500);
    setTimeout(() => {
      try {
        sessionStorage.setItem(KEY, "1");
        sessionStorage.setItem("soar-age-ok", "1");
      } catch {}
      setReveal(true);
      document.body.classList.remove("gate-locked");
    }, 2900);
    setTimeout(() => setGone(true), 3800);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!agree) {
      setError("age");
      return;
    }
    if ((inputRef.current?.value || "").trim().toLowerCase() === PASS) {
      setError(null);
      go();
    } else {
      setError("pass");
      inputRef.current?.select();
    }
  }

  if (gone) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[120] bg-white transition-opacity duration-700",
        reveal ? "pointer-events-none opacity-0" : "opacity-100",
      )}
    >
      <div className="absolute inset-0">
        <BreakthroughScene unlocked={entered} />
      </div>

      {/* subtle cinematic vignette for premium framing */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(125%_100%_at_50%_42%,transparent_55%,rgba(0,0,0,0.13))]" />

      {/* white veil floods in to guarantee a clean white */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-white transition-opacity",
          entered ? "opacity-100 delay-300 [transition-duration:1600ms]" : "opacity-0 duration-300",
        )}
      />

      {/* gate UI */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 px-6 pb-[10vh] text-center text-black transition-all duration-500",
          entered ? "pointer-events-none translate-y-3 opacity-0" : "opacity-100",
        )}
      >
        <span className="text-[11px] uppercase tracking-[0.3em] text-black/50">Born to soar — members only</span>
        <form onSubmit={onSubmit} className="flex w-full max-w-[340px] gap-2">
          <input
            ref={inputRef}
            type="password"
            placeholder="Password"
            aria-label="Password"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            onChange={() => setError(null)}
            className="min-w-0 flex-1 border-b border-black/40 bg-transparent px-1 py-2 text-center text-sm tracking-[0.2em] text-black outline-none placeholder:text-black/30 focus:border-black"
          />
          <button
            type="submit"
            className="bg-black px-5 py-2.5 text-[12px] uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-80"
          >
            Enter
          </button>
        </form>

        {/* 13+ age confirmation + legal */}
        <label className="flex max-w-[340px] items-start gap-2 text-left text-[11px] leading-snug text-black/55">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => {
              setAgree(e.target.checked);
              setError(null);
            }}
            className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-black"
            aria-label="I am 13 or older and accept the policies"
          />
          <span>
            I&apos;m 13 or older and agree to the{" "}
            <Link href="/privacy" target="_blank" className="underline underline-offset-2 hover:text-black">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms" target="_blank" className="underline underline-offset-2 hover:text-black">
              Terms
            </Link>
            .
          </span>
        </label>

        <span className={cn("text-[11px] uppercase tracking-[0.14em]", error ? "text-black" : "text-black/40")}>
          {error === "age" ? "Please confirm you're 13 or older" : error === "pass" ? "Try again" : "The box is locked"}
        </span>
      </div>

      {/* SOAR wordmark resolves on the white */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-700",
          showWord && !reveal ? "opacity-100" : "opacity-0",
        )}
      >
        <span className="text-[18vw] font-semibold leading-none tracking-[0.12em] text-black md:text-[12rem]">SOAR</span>
      </div>
    </div>
  );
}
