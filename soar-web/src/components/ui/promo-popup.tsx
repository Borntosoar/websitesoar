"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";

const KEY = "soar-promo";
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 10%-off welcome popup. Captures email or phone; appears once after the
 *  visitor passes the entrance, unless already claimed/dismissed. */
export function PromoPopup() {
  const [open, setOpen] = useState(false);
  const [channel, setChannel] = useState<"email" | "phone">("email");
  const [value, setValue] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY)) return; // claimed or dismissed
    } catch {}
    const poll = setInterval(() => {
      let passed = false;
      try {
        passed = sessionStorage.getItem("soar-gate-passed") === "1";
      } catch {}
      if (passed) {
        clearInterval(poll);
        timer.current = setTimeout(() => setOpen(true), 6000);
      }
    }, 800);
    return () => {
      clearInterval(poll);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function dismiss() {
    setOpen(false);
    try {
      localStorage.setItem(KEY, "dismissed");
    } catch {}
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const v = value.trim();
    const ok = channel === "email" ? emailRe.test(v) : v.replace(/\D/g, "").length >= 7;
    if (!ok) {
      setError(true);
      return;
    }
    try {
      localStorage.setItem(KEY, "claimed");
    } catch {}
    setDone(true);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[134] bg-espresso/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
          />
          <motion.div
            role="dialog"
            aria-label="10% off"
            className="fixed left-1/2 top-1/2 z-[135] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 bg-oat text-ink"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
          >
            <button onClick={dismiss} aria-label="Close" className="absolute right-3 top-3 grid h-9 w-9 place-items-center text-ink/50 transition-colors hover:text-ink">
              <X size={18} strokeWidth={1.6} />
            </button>

            <div className="px-7 pb-8 pt-10 text-center">
              {/* bird-and-box mark */}
              <svg viewBox="0 0 64 64" className="mx-auto mb-4 h-9 w-9" aria-hidden>
                <path d="M13 39 C24 24 28 24 32 33 C36 24 40 24 51 39" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              {done ? (
                <>
                  <h2 className="text-[clamp(1.6rem,5vw,2.2rem)] font-semibold leading-tight">Welcome to the flight.</h2>
                  <p className="mt-2 text-sm text-ink/60">Use this code at checkout for 10% off your first order.</p>
                  <div className="mx-auto mt-5 w-fit border border-dashed border-ink/40 px-6 py-3 text-lg font-semibold tracking-[0.3em]">
                    SOAR10
                  </div>
                  <button onClick={() => setOpen(false)} className="mt-6 text-[11px] uppercase tracking-[0.16em] text-ink/50 underline underline-offset-4 hover:text-ink">
                    Start exploring
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-[clamp(1.7rem,5vw,2.4rem)] font-semibold leading-[1.05]">
                    10% off your
                    <br />
                    first ascent
                  </h2>
                  <p className="mt-3 text-sm text-ink/60">
                    Join the flight for early access to every drop — and 10% off your first order.
                  </p>

                  <div className="mt-5 flex justify-center gap-1 text-[11px] uppercase tracking-[0.14em]">
                    {(["email", "phone"] as const).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setChannel(c);
                          setValue("");
                          setError(false);
                        }}
                        className={cn("px-3 py-1 transition-colors", channel === c ? "bg-ink text-oat" : "text-ink/45 hover:text-ink")}
                      >
                        {c}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={onSubmit} className="mt-3 flex flex-col gap-2">
                    <input
                      type={channel === "email" ? "email" : "tel"}
                      value={value}
                      onChange={(e) => {
                        setValue(e.target.value);
                        setError(false);
                      }}
                      placeholder={channel === "email" ? "Email address" : "Phone number"}
                      aria-label={channel === "email" ? "Email address" : "Phone number"}
                      className="w-full border border-ink/20 bg-transparent px-4 py-3 text-center text-sm tracking-[0.1em] outline-none transition-colors placeholder:text-ink/35 focus:border-ink"
                    />
                    <button type="submit" className="bg-ink py-3 text-[13px] font-medium uppercase tracking-[0.12em] text-oat transition-colors hover:bg-espresso">
                      Claim 10% off
                    </button>
                  </form>
                  <p className={cn("mt-2 text-[11px] uppercase tracking-[0.12em]", error ? "text-ink" : "text-ink/45")}>
                    {error ? `Enter a valid ${channel}` : "No noise — only ascent. Unsubscribe anytime."}
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
