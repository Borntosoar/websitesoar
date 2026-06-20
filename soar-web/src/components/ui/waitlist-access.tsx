"use client";

/**
 * SOAR — WaitlistAccess. Pre-launch / sold-out EXCLUSIVE ACCESS request.
 * Not a promo — this is earned entry ahead of the public. Captures email +
 * phone + consent and stores the request locally.
 *
 * NOTE: the single-use early-access password is issued via Shopify Email/Flow
 * in Phase 2 (backend). This component captures the request only — it never
 * fabricates or reveals a key in the UI.
 */

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function WaitlistAccess({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [tos, setTos] = useState(false);
  const [mktg, setMktg] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  // Escape to close + autofocus the email on open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => emailRef.current?.focus(), 80);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open, onClose]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!emailRe.test(email.trim())) return setErr("Enter a valid email address.");
    if (phone.replace(/\D/g, "").length < 7) return setErr("Enter a valid phone number.");
    if (!tos) return setErr("Please accept the Privacy Policy and Terms of Service.");
    try {
      localStorage.setItem("soar-waitlist", JSON.stringify({ email: email.trim(), phone: phone.trim(), mktg }));
    } catch {}
    setErr(null);
    setDone(true);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Request access"
            className="fixed left-1/2 top-1/2 z-[151] w-[calc(100%-2rem)] max-w-[400px] -translate-x-1/2 -translate-y-1/2 border border-white/15 bg-black/70 text-white backdrop-blur-md"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-1 top-1 grid h-11 w-11 place-items-center text-white/50 transition-colors hover:text-white"
            >
              <X size={18} strokeWidth={1.6} />
            </button>

            <div className="px-7 pt-10 pb-[max(env(safe-area-inset-bottom),1.5rem)] text-center">
              {done ? (
                <>
                  <span className="text-[11px] uppercase tracking-[0.34em] text-white/45">Access requested</span>
                  <h2 className="mt-4 text-[clamp(1.5rem,5vw,2rem)] font-semibold leading-[1.05] tracking-[-0.01em]">
                    You&apos;re on the list.
                  </h2>
                  <p className="mx-auto mt-3 max-w-[20rem] text-sm leading-relaxed text-white/55">
                    Access is earned — yours is held. Watch your inbox for the key that opens the drop ahead of the public.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-6 text-[11px] uppercase tracking-[0.16em] text-white/50 underline underline-offset-4 transition-colors hover:text-white"
                  >
                    Return to the runway
                  </button>
                </>
              ) : (
                <>
                  <span className="text-[11px] uppercase tracking-[0.34em] text-white/45">Early access</span>
                  <h2 className="mt-4 text-[clamp(1.6rem,5vw,2.2rem)] font-semibold leading-[1.02] tracking-[-0.01em]">
                    Request <span className="font-serif font-normal italic">access</span>.
                  </h2>
                  <p className="mx-auto mt-3 max-w-[20rem] text-sm leading-relaxed text-white/55">
                    The drop opens to the few before the many. Claim your place and rise ahead of the public.
                  </p>

                  <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3 text-left">
                    <input
                      ref={emailRef}
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErr(null);
                      }}
                      placeholder="Email address"
                      aria-label="Email address"
                      autoComplete="email"
                      spellCheck={false}
                      className="w-full border-b border-white/25 bg-transparent py-2.5 text-sm tracking-[0.04em] text-white outline-none placeholder:text-white/35 focus:border-white"
                    />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setErr(null);
                      }}
                      placeholder="Phone number"
                      aria-label="Phone number"
                      autoComplete="tel"
                      spellCheck={false}
                      className="w-full border-b border-white/25 bg-transparent py-2.5 text-sm tracking-[0.04em] text-white outline-none placeholder:text-white/35 focus:border-white"
                    />

                    <label className="mt-2 flex items-start gap-2.5 text-[11px] leading-snug text-white/55">
                      <input
                        type="checkbox"
                        checked={tos}
                        onChange={(e) => {
                          setTos(e.target.checked);
                          setErr(null);
                        }}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-white"
                      />
                      <span>
                        I agree to the{" "}
                        <Link href="/privacy" target="_blank" className="underline hover:text-white">
                          Privacy Policy
                        </Link>{" "}
                        and{" "}
                        <Link href="/terms" target="_blank" className="underline hover:text-white">
                          Terms of Service
                        </Link>
                        .
                      </span>
                    </label>
                    <label className="flex items-start gap-2.5 text-[11px] leading-snug text-white/55">
                      <input
                        type="checkbox"
                        checked={mktg}
                        onChange={(e) => setMktg(e.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-white"
                      />
                      <span>I agree to receive brand updates and early access announcements.</span>
                    </label>

                    <button
                      type="submit"
                      className="mt-4 w-full bg-white py-3.5 text-[12px] uppercase tracking-[0.2em] text-black transition-transform hover:opacity-90 active:scale-[0.98]"
                    >
                      Request access
                    </button>

                    <p className={cn("min-h-[1rem] text-center text-[11px] uppercase tracking-[0.14em]", err ? "text-white" : "text-white/35")}>
                      {err ?? "Access is granted, not sold."}
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
