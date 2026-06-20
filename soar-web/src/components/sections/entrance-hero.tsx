"use client";

/**
 * SOAR — Cinematic entrance (stage 1). The threshold, not a website.
 *   gateway → BORN TO SOAR + BEGIN ASCENT (the road waits in the distance)
 *   ascent  → the camera travels the wide road toward the monumental SOAR arch
 *   auth    → at the monument, the ENTER SOAR form (email/phone/password + 2
 *             consents) — best-effort Shopify customer creation
 *   leaving → light floods, the screen lifts to the home
 * Monochrome. Skippable. Reduced-motion + no-WebGL take a fast, static path.
 */

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { DropClock } from "@/components/ui/drop-clock";
import { Logo } from "@/components/ui/logo";
import { EntranceBackdrop } from "@/components/ui/entrance-backdrop";
import { createCustomer } from "@/lib/shopify";
import type { AscentMode } from "@/components/ui/ascent-road";

const AscentRoad = dynamic(() => import("@/components/ui/ascent-road").then((m) => m.AscentRoad), {
  ssr: false,
  loading: () => <EntranceBackdrop />,
});

const KEY = "soar-gate-passed";
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Stage = "gateway" | "ascent" | "auth" | "leaving";

export function EntranceHero() {
  const [stage, setStage] = useState<Stage>("gateway");
  const [gone, setGone] = useState(false);
  const [flash, setFlash] = useState(false);
  const [reveal, setReveal] = useState(false);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [tos, setTos] = useState(false);
  const [mktg, setMktg] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const reduce = useRef(false);

  useEffect(() => {
    let passed = false;
    try {
      passed = sessionStorage.getItem(KEY) === "1";
    } catch {}
    reduce.current = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (passed) {
      setGone(true);
      document.body.classList.remove("gate-locked");
    } else {
      document.body.classList.add("gate-locked");
    }
  }, []);

  function pass() {
    try {
      sessionStorage.setItem(KEY, "1");
      sessionStorage.setItem("soar-age-ok", "1");
    } catch {}
    setReveal(true);
    document.body.classList.remove("gate-locked");
    setTimeout(() => setGone(true), 1200);
  }

  function begin() {
    if (reduce.current) {
      setStage("auth");
      return;
    }
    setStage("ascent");
    setTimeout(() => setStage("auth"), 3800);
  }

  async function enter(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!emailRe.test(email.trim())) return setErr("Enter a valid email");
    if (password.trim().length < 4) return setErr("Choose a password (4+ characters)");
    if (!tos) return setErr("Please accept the Privacy Policy and Terms");
    setErr(null);
    setBusy(true);
    try {
      localStorage.setItem("soar-account", JSON.stringify({ email: email.trim(), phone: phone.trim(), mktg }));
      if (mktg) localStorage.setItem("soar-promo", "claimed");
    } catch {}
    try {
      await createCustomer({ email: email.trim(), password: password.trim(), phone: phone.trim() || undefined, acceptsMarketing: mktg });
    } catch {}
    setBusy(false);
    setStage("leaving");
    if (reduce.current) return pass();
    setTimeout(() => setFlash(true), 700);
    setTimeout(() => pass(), 1500);
  }

  if (gone) return null;

  const mode: AscentMode = stage === "gateway" ? "idle" : stage === "ascent" ? "travel" : stage === "auth" ? "arrived" : "leave";

  return (
    <div
      className={cn(
        "fixed inset-0 z-[120] overflow-hidden bg-black transition-transform [transition-duration:1200ms] [transition-timing-function:cubic-bezier(0.65,0,0.35,1)] will-change-transform",
        reveal ? "pointer-events-none -translate-y-full" : "translate-y-0",
      )}
    >
      {/* the road to the monument */}
      <div className="absolute inset-0">
        <AscentRoad mode={mode} />
      </div>
      {/* portal vignette — the opening to another level */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_42%,transparent_40%,rgba(0,0,0,0.8))]" />

      {/* skip — never block repeat visitors / accessibility */}
      {stage !== "leaving" && (
        <button
          type="button"
          onClick={pass}
          className="absolute right-5 top-[calc(env(safe-area-inset-top)+1.1rem)] z-20 inline-flex h-11 items-center text-[11px] uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-white"
        >
          Skip →
        </button>
      )}

      <AnimatePresence mode="wait">
        {stage === "gateway" && (
          <motion.div
            key="gateway"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 pb-[env(safe-area-inset-bottom)] text-center text-white"
          >
            <DropClock tone="light" className="mb-1" />
            <h1
              className="text-[clamp(2.6rem,9vw,6rem)] font-semibold leading-none tracking-[0.12em]"
              style={{ textShadow: "0 0 48px rgba(150,170,255,0.35)" }}
            >
              BORN TO SOAR
            </h1>
            <p className="text-[12px] uppercase tracking-[0.28em] text-white/55">The road ahead isn&apos;t for everyone</p>
            <p className="max-w-md text-[12px] uppercase tracking-[0.18em] text-white/35">
              This is where limits end. This is where potential begins.
            </p>
            <button
              type="button"
              onClick={begin}
              className="mt-4 bg-white px-10 py-4 text-[12px] uppercase tracking-[0.2em] text-black transition-transform hover:opacity-90 active:scale-[0.98]"
            >
              Begin ascent
            </button>
            <button
              type="button"
              onClick={pass}
              className="text-[11px] uppercase tracking-[0.14em] text-white/30 underline underline-offset-4 transition-colors hover:text-white"
            >
              Already a member — skip
            </button>
          </motion.div>
        )}

        {stage === "auth" && (
          <motion.div
            key="auth"
            initial={{ opacity: 0, y: 22, scale: 1.03 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center justify-center px-6 pb-[env(safe-area-inset-bottom)]"
          >
            <form
              onSubmit={enter}
              className="w-full max-w-[380px] border border-white/15 bg-black/55 p-6 text-white backdrop-blur-md"
            >
              <div className="mb-5 text-center">
                <span className="text-[11px] uppercase tracking-[0.3em] text-white/45">You&apos;ve reached</span>
                <Logo variant="white" className="mx-auto mt-2 h-7 w-auto" />
              </div>

              <div className="flex flex-col gap-3">
                {[
                  { v: email, set: setEmail, type: "email", ph: "Email address", ac: "email" },
                  { v: phone, set: setPhone, type: "tel", ph: "Phone number (optional)", ac: "tel" },
                  { v: password, set: setPassword, type: "password", ph: "Create a password", ac: "new-password" },
                ].map((f) => (
                  <input
                    key={f.ph}
                    type={f.type}
                    value={f.v}
                    onChange={(e) => {
                      f.set(e.target.value);
                      setErr(null);
                    }}
                    placeholder={f.ph}
                    aria-label={f.ph}
                    autoComplete={f.ac}
                    spellCheck={false}
                    className="w-full border-b border-white/25 bg-transparent py-2.5 text-sm tracking-[0.04em] text-white outline-none placeholder:text-white/35 focus:border-white"
                  />
                ))}
              </div>

              <label className="mt-4 flex items-start gap-2.5 text-left text-[11px] leading-snug text-white/55">
                <input type="checkbox" checked={tos} onChange={(e) => { setTos(e.target.checked); setErr(null); }} className="mt-0.5 h-4 w-4 shrink-0 accent-white" />
                <span>
                  I agree to the{" "}
                  <Link href="/privacy" target="_blank" className="underline hover:text-white">Privacy Policy</Link> and{" "}
                  <Link href="/terms" target="_blank" className="underline hover:text-white">Terms of Service</Link>.
                </span>
              </label>
              <label className="mt-2.5 flex items-start gap-2.5 text-left text-[11px] leading-snug text-white/55">
                <input type="checkbox" checked={mktg} onChange={(e) => setMktg(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-white" />
                <span>I agree to receive brand updates and early access announcements.</span>
              </label>

              <button
                type="submit"
                disabled={busy}
                className="mt-5 w-full bg-white py-3.5 text-[12px] uppercase tracking-[0.2em] text-black transition-transform hover:opacity-90 active:scale-[0.98] disabled:opacity-70"
              >
                {busy ? "Entering…" : "Enter SOAR"}
              </button>

              <p className={cn("mt-3 min-h-[1rem] text-center text-[11px] uppercase tracking-[0.14em]", err ? "text-white" : "text-white/0")}>
                {err ?? "."}
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* light floods on entry */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-white transition-opacity",
          flash ? "opacity-100 duration-500" : "opacity-0 duration-700",
        )}
      />
    </div>
  );
}
