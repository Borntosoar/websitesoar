"use client";

/**
 * SOAR — CountdownCapture (§2.6). A distinct mid-scroll band: the live drop
 * countdown + a 10%-off email/phone capture. Stores the claim so checkout
 * auto-applies SOAR10 (see cart.tsx). Never gates content. Monochrome.
 */

import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { DropClock } from "@/components/ui/drop-clock";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type Channel = "email" | "phone";

export function CountdownCapture() {
  const [channel, setChannel] = useState<Channel>("email");
  const [value, setValue] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState(false);

  function valid() {
    const v = value.trim();
    return channel === "email" ? emailRe.test(v) : v.replace(/\D/g, "").length >= 7;
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!valid()) return setErr(true);
    try {
      localStorage.setItem("soar-account", JSON.stringify({ channel, value: value.trim() }));
      localStorage.setItem("soar-promo", "claimed"); // → cart auto-applies SOAR10
    } catch {}
    setErr(false);
    setDone(true);
  }

  return (
    <section id="access" className="border-y border-white/10 bg-black px-6 py-24 text-white md:py-32">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-7 text-center">
        <span className="text-[11px] uppercase tracking-[0.34em] text-white/45">Drop 001 access</span>
        <DropClock tone="light" />
        <h2 className="max-w-3xl text-[clamp(1.9rem,5.5vw,3.6rem)] font-semibold leading-[0.98] tracking-[-0.01em]">
          Get <span className="font-serif font-normal italic">10% off</span> your first drop.
        </h2>
        <p className="max-w-md text-[15px] leading-relaxed text-white/55 md:text-base">
          Join the list for early access and the code at checkout. No noise — only the rise.
        </p>

        {done ? (
          <p className="text-[12px] uppercase tracking-[0.2em] text-white/75">You&apos;re on the list — 10% waiting at checkout.</p>
        ) : (
          <>
            <div className="flex gap-1 text-[11px] uppercase tracking-[0.14em]">
              {(["email", "phone"] as Channel[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setChannel(c);
                    setValue("");
                    setErr(false);
                  }}
                  className={cn("px-3 py-1.5 transition-colors", channel === c ? "bg-white text-black" : "text-white/45 hover:text-white")}
                >
                  {c}
                </button>
              ))}
            </div>
            <form onSubmit={onSubmit} className="flex w-full max-w-[420px] gap-2">
              <input
                type={channel === "email" ? "email" : "tel"}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setErr(false);
                }}
                placeholder={channel === "email" ? "Email address" : "Phone number"}
                aria-label={channel === "email" ? "Email address" : "Phone number"}
                autoComplete={channel}
                spellCheck={false}
                className="min-w-0 flex-1 border-b border-white/30 bg-transparent px-1 py-3.5 text-center text-sm tracking-[0.06em] text-white outline-none placeholder:text-white/35 focus:border-white"
              />
              <button
                type="submit"
                className="whitespace-nowrap bg-white px-7 py-3.5 text-[12px] uppercase tracking-[0.15em] text-black transition-transform hover:opacity-90 active:scale-[0.98]"
              >
                Claim 10%
              </button>
            </form>
            <p className={cn("text-[11px] uppercase tracking-[0.14em]", err ? "text-white" : "text-white/35")}>
              {err ? (channel === "email" ? "Enter a valid email" : "Enter a valid phone number") : "Applied automatically at checkout"}
            </p>
          </>
        )}
      </div>
    </section>
  );
}
