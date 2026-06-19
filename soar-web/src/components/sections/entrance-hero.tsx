"use client";

/**
 * SOAR — Opening cinematic + lock gate. A first-person journey up the SOAR road
 * through a starfield; lock mode collects a password (access) or email/phone
 * (get notified). On unlock the camera rushes the star, light floods, and the
 * monumental SOAR logo resolves before the screen lifts to the home. Monochrome.
 */

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { DropClock } from "@/components/ui/drop-clock";
import { Logo } from "@/components/ui/logo";
import { EntranceBackdrop } from "@/components/ui/entrance-backdrop";

const BreakthroughScene = dynamic(
  () => import("@/components/ui/breakthrough-scene").then((m) => m.BreakthroughScene),
  { ssr: false, loading: () => <EntranceBackdrop /> },
);

const PASS = "soar";
const KEY = "soar-gate-passed";
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Mode = "join" | "password";
type Channel = "email" | "phone";

export function EntranceHero() {
  const [entered, setEntered] = useState(false);
  const [flash, setFlash] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [gone, setGone] = useState(false);
  const [mode, setMode] = useState<Mode>("join");
  const [channel, setChannel] = useState<Channel>("email");
  const [value, setValue] = useState("");
  const [error, setError] = useState<"input" | "pass" | null>(null);
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
      setTimeout(() => inputRef.current?.focus(), 700);
    }
  }, []);

  function go() {
    setEntered(true);
    // travel up the S (~0–2.2s) → rise to the overhead reveal, road traces the
    // mark (~2–3.3s, held) → light floods → the single logo resolves → lift away
    setTimeout(() => setFlash(true), 3700);
    setTimeout(() => setFlash(false), 4300);
    setTimeout(() => setShowLogo(true), 4000);
    setTimeout(() => {
      try {
        sessionStorage.setItem(KEY, "1");
        sessionStorage.setItem("soar-age-ok", "1");
      } catch {}
      setReveal(true);
      document.body.classList.remove("gate-locked");
    }, 5700);
    setTimeout(() => setGone(true), 6900);
  }

  function validContact() {
    const v = value.trim();
    return channel === "email" ? emailRe.test(v) : v.replace(/\D/g, "").length >= 7;
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (mode === "join") {
      if (!validContact()) {
        setError("input");
        return;
      }
      try {
        localStorage.setItem("soar-account", JSON.stringify({ channel, value: value.trim() }));
        localStorage.setItem("soar-promo", "claimed");
      } catch {}
      setError(null);
      go();
    } else {
      if (value.trim().toLowerCase() === PASS) {
        setError(null);
        go();
      } else {
        setError("pass");
        inputRef.current?.select();
      }
    }
  }

  function swap(next: Mode) {
    setMode(next);
    setValue("");
    setError(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  if (gone) return null;

  const status =
    error === "input"
      ? channel === "email"
        ? "Enter a valid email"
        : "Enter a valid phone number"
      : error === "pass"
      ? "Incorrect password"
      : mode === "join"
      ? "Join the ascent — enter before the world arrives"
      : "Enter the password to begin";

  return (
    <div
      className={cn(
        "fixed inset-0 z-[120] overflow-hidden bg-black transition-transform [transition-duration:1200ms] [transition-timing-function:cubic-bezier(0.65,0,0.35,1)] will-change-transform",
        reveal ? "pointer-events-none -translate-y-full" : "translate-y-0",
      )}
    >
      {/* road to the stars */}
      <div className="absolute inset-0">
        <BreakthroughScene unlocked={entered} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_28%,transparent_45%,rgba(0,0,0,0.72))]" />

      {/* statement over the road */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-[14vh] flex flex-col items-center gap-2 px-6 text-center transition-all duration-500",
          entered ? "-translate-y-3 opacity-0" : "opacity-100",
        )}
      >
        <h2
          className="text-[clamp(2rem,7vw,4.2rem)] font-semibold leading-none tracking-[0.14em] text-white"
          style={{ textShadow: "0 0 44px rgba(150,170,255,0.4)" }}
        >
          BORN TO SOAR
        </h2>
        <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">The road ahead isn&apos;t for everyone</p>
        <p className="text-[11px] uppercase tracking-[0.18em] text-white/30">Where limits end · where potential begins</p>
      </div>

      {/* lock / get-notified gate */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 flex flex-col items-center gap-3.5 px-6 pb-[8vh] text-center text-white transition-all duration-500",
          entered ? "pointer-events-none translate-y-3 opacity-0" : "opacity-100",
        )}
      >
        <DropClock tone="light" className="mb-1" />

        <span className="text-[11px] uppercase tracking-[0.3em] text-white/45">
          {mode === "join" ? "Become part of the movement" : "Members — enter the password"}
        </span>

        {mode === "join" && (
          <div className="flex gap-1 text-[11px] uppercase tracking-[0.14em]">
            {(["email", "phone"] as Channel[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setChannel(c);
                  setValue("");
                  setError(null);
                  setTimeout(() => inputRef.current?.focus(), 50);
                }}
                className={cn("px-3 py-1 transition-colors", channel === c ? "bg-white text-black" : "text-white/45 hover:text-white")}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={onSubmit} className="flex w-full max-w-[360px] gap-2">
          <input
            ref={inputRef}
            type={mode === "password" ? "password" : channel === "email" ? "email" : "tel"}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(null);
            }}
            placeholder={mode === "password" ? "Password" : channel === "email" ? "Email address" : "Phone number"}
            aria-label={mode === "password" ? "Password" : channel === "email" ? "Email address" : "Phone number"}
            autoComplete={mode === "password" ? "off" : channel === "email" ? "email" : "tel"}
            spellCheck={false}
            className="min-w-0 flex-1 border-b border-white/35 bg-transparent px-1 py-2 text-center text-sm tracking-[0.12em] text-white outline-none placeholder:text-white/30 focus:border-white"
          />
          <button
            type="submit"
            className="whitespace-nowrap bg-white px-5 py-2.5 text-[12px] uppercase tracking-[0.15em] text-black transition-opacity hover:opacity-80"
          >
            {mode === "join" ? "Join" : "Begin ascent"}
          </button>
        </form>

        <p className="max-w-[360px] text-[11px] leading-snug text-white/40">
          By {mode === "join" ? "joining" : "entering"} you confirm you&apos;re 13 or older and agree to the{" "}
          <Link href="/privacy" target="_blank" className="underline underline-offset-2 hover:text-white">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms" target="_blank" className="underline underline-offset-2 hover:text-white">
            Terms
          </Link>
          .
        </p>

        <span className={cn("text-[11px] uppercase tracking-[0.14em]", error ? "text-white" : "text-white/40")}>{status}</span>

        <button
          type="button"
          onClick={() => swap(mode === "join" ? "password" : "join")}
          className="text-[11px] uppercase tracking-[0.14em] text-white/40 underline underline-offset-4 transition-colors hover:text-white"
        >
          {mode === "join" ? "Have a password? Enter" : "Get notified instead"}
        </button>
      </div>

      {/* reaching the star — white flash */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-white transition-opacity",
          flash ? "opacity-100 duration-500" : "opacity-0 duration-700",
        )}
      />

      {/* monumental logo reveal → lifts to the home */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-black transition-opacity duration-700",
          showLogo ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <motion.div
          initial={{ scale: 1.55, opacity: 0 }}
          animate={showLogo ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-[80vw] max-w-[640px]"
          style={{ filter: "drop-shadow(0 0 70px rgba(175,195,255,0.35))" }}
        >
          <Logo variant="white" priority className="h-auto w-full" />
        </motion.div>
      </div>
    </div>
  );
}
