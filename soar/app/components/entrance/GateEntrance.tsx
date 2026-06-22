"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { enterWithPassword } from "@/app/actions";
import logoWhite from "@/public/soar-logo-white.png";

const GateScene = dynamic(() => import("./GateScene").then((m) => m.GateScene), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#0b0a09]" />,
});

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

/** The gated threshold: minimal dark void, the SOAR mark, a password — then the
 *  breakthrough into the bright site. Server-validated (the password never
 *  touches the client). Honors prefers-reduced-motion. */
export function GateEntrance({ from = "/" }: { from?: string }) {
  const reduce = useReducedMotion() ?? false;
  const [pwd, setPwd] = useState("");
  const [entering, setEntering] = useState(false);
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);
  const [webgl, setWebgl] = useState(true);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setWebgl(hasWebGL());
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy || entering) return;
    setBusy(true);
    setErr(false);
    const ok = await enterWithPassword(pwd);
    if (!ok) {
      setErr(true);
      setBusy(false);
      inputRef.current?.focus();
      return;
    }
    setEntering(true);
    const dest = from.startsWith("/") && !from.startsWith("//") ? from : "/";
    setTimeout(() => window.location.assign(dest), reduce ? 250 : 1600);
  }

  const T = (d: number, delay = 0) => (reduce ? { duration: 0 } : { duration: d, ease: [0.7, 0, 0.3, 1] as const, delay });

  return (
    <main className="on-dark fixed inset-0 z-[100] overflow-hidden bg-[#0b0a09] text-white">
      {webgl && (
        <div className="absolute inset-0">
          <GateScene entering={entering} />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_46%,transparent_38%,rgba(0,0,0,0.82))]" />

      {/* center glow — breathes while idle, blooms on breakthrough */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[42vmin] w-[42vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(196,205,255,0.20), transparent 65%)" }}
        animate={entering ? { opacity: 1, scale: 3.4 } : reduce ? { opacity: 0.5, scale: 1 } : { opacity: [0.4, 0.6, 0.4], scale: [1, 1.06, 1] }}
        transition={entering ? T(1.4) : reduce ? { duration: 0 } : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="relative z-10 flex h-full flex-col items-center justify-center gap-7 px-6 text-center"
        animate={{ y: entering && !reduce ? -40 : 0, opacity: entering ? 0 : 1 }}
        transition={T(1.1)}
      >
        {/* the mark — scales through the viewport on breakthrough */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={entering ? { opacity: 0, scale: reduce ? 1 : 1.9 } : { opacity: 1, y: 0, scale: 1 }}
          transition={entering ? T(1.2) : T(1)}
        >
          <Image src={logoWhite} alt="SOAR" height={120} className="h-24 w-auto md:h-28" priority />
        </motion.div>

        <p className="mono text-white/45">Members only — Drop 001</p>

        <form onSubmit={onSubmit} className="flex w-full max-w-xs flex-col items-center gap-4">
          <div className="relative w-full">
            <input
              ref={inputRef}
              type="password"
              name="access-code"
              autoComplete="current-password"
              value={pwd}
              onChange={(e) => {
                setPwd(e.target.value);
                setErr(false);
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              required
              autoFocus
              placeholder="Access code"
              aria-label="Access code"
              aria-invalid={err}
              className="w-full border-b border-white/20 bg-transparent py-3 text-center tracking-[0.35em] text-white outline-none placeholder:tracking-[0.2em] placeholder:text-white/35"
            />
            <motion.span
              aria-hidden
              className="absolute inset-x-0 bottom-0 mx-auto h-px origin-center bg-white"
              initial={false}
              animate={{ scaleX: focused || err ? 1 : 0 }}
              transition={{ duration: reduce ? 0 : 0.35, ease: [0.7, 0, 0.3, 1] }}
              style={{ background: err ? "#fca5a5" : "#ffffff" }}
            />
          </div>
          <button type="submit" disabled={busy} className="mono mt-1 w-full bg-white py-3.5 text-black transition-opacity hover:opacity-85 disabled:opacity-50">
            {busy ? "Entering…" : "Enter ↑"}
          </button>
          <AnimatePresence>
            {err && (
              <motion.p role="alert" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mono text-red-300/80">
                Not on the list.
              </motion.p>
            )}
          </AnimatePresence>
        </form>

        <p className="mono max-w-xs leading-relaxed text-white/30">The road ahead isn&rsquo;t for everyone.</p>
      </motion.div>

      {/* breakthrough into the light — fades to paper, then navigates */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[#f4f3ef]"
        initial={{ opacity: 0 }}
        animate={{ opacity: entering ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 1.3, ease: [0.7, 0, 0.3, 1], delay: 0.35 }}
      />
    </main>
  );
}
