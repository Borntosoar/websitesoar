"use client";

/**
 * SOAR — Studio entrance (fixed overlay). Create an account with email or phone
 * (or enter with a member password). Confirm 13+ and the policies; the box
 * breaks open, the bird climbs, "SOAR" resolves, then a clean fade to the home.
 */

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { DropClock } from "@/components/ui/drop-clock";

const BreakthroughScene = dynamic(
  () => import("@/components/ui/breakthrough-scene").then((m) => m.BreakthroughScene),
  { ssr: false },
);

const PASS = "soar";
const KEY = "soar-gate-passed";
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Mode = "join" | "password";
type Channel = "email" | "phone";

export function EntranceHero() {
  const [entered, setEntered] = useState(false);
  const [showWord, setShowWord] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [gone, setGone] = useState(false);
  const [mode, setMode] = useState<Mode>("join");
  const [channel, setChannel] = useState<Channel>("email");
  const [value, setValue] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<"input" | "agree" | "pass" | null>(null);
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
    setTimeout(() => setShowWord(true), 2400);
    setTimeout(() => {
      try {
        sessionStorage.setItem(KEY, "1");
        sessionStorage.setItem("soar-age-ok", "1");
      } catch {}
      setReveal(true);
      document.body.classList.remove("gate-locked");
    }, 3300);
    setTimeout(() => setGone(true), 4100);
  }

  function validContact() {
    const v = value.trim();
    return channel === "email" ? emailRe.test(v) : v.replace(/\D/g, "").length >= 7;
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!agree) {
      setError("agree");
      return;
    }
    if (mode === "join") {
      if (!validContact()) {
        setError("input");
        return;
      }
      try {
        localStorage.setItem("soar-account", JSON.stringify({ channel, value: value.trim() }));
        localStorage.setItem("soar-promo", "claimed"); // already captured — don't double-nag
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
    error === "agree"
      ? "Please confirm you're 13 or older"
      : error === "input"
      ? channel === "email"
        ? "Enter a valid email"
        : "Enter a valid phone number"
      : error === "pass"
      ? "Incorrect password"
      : mode === "join"
      ? "10% off your first order when you join"
      : "Enter the members password";

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

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(125%_100%_at_50%_42%,transparent_55%,rgba(0,0,0,0.13))]" />

      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-white transition-opacity",
          entered ? "opacity-100 delay-[1300ms] [transition-duration:1500ms]" : "opacity-0 duration-300",
        )}
      />

      {/* gate UI */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 flex flex-col items-center gap-3.5 px-6 pb-[8vh] text-center text-black transition-all duration-500",
          entered ? "pointer-events-none translate-y-3 opacity-0" : "opacity-100",
        )}
      >
        <DropClock tone="dark" className="mb-1" />

        <span className="text-[11px] uppercase tracking-[0.3em] text-black/50">
          {mode === "join" ? "Create your account — join the flight" : "Members"}
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
                className={cn(
                  "px-3 py-1 transition-colors",
                  channel === c ? "bg-black text-white" : "text-black/45 hover:text-black",
                )}
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
            className="min-w-0 flex-1 border-b border-black/40 bg-transparent px-1 py-2 text-center text-sm tracking-[0.12em] text-black outline-none placeholder:text-black/30 focus:border-black"
          />
          <button
            type="submit"
            className="whitespace-nowrap bg-black px-5 py-2.5 text-[12px] uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-80"
          >
            {mode === "join" ? "Join" : "Enter"}
          </button>
        </form>

        <label className="flex max-w-[360px] items-start gap-2 text-left text-[11px] leading-snug text-black/55">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => {
              setAgree(e.target.checked);
              setError(null);
            }}
            className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-black"
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
            {mode === "join" ? ", and to receive SOAR updates." : "."}
          </span>
        </label>

        <span className={cn("text-[11px] uppercase tracking-[0.14em]", error ? "text-black" : "text-black/40")}>
          {status}
        </span>

        <button
          type="button"
          onClick={() => swap(mode === "join" ? "password" : "join")}
          className="text-[11px] uppercase tracking-[0.14em] text-black/40 underline underline-offset-4 transition-colors hover:text-black"
        >
          {mode === "join" ? "Have a password? Enter" : "Create an account"}
        </button>
      </div>

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
