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

const EASE = [0.22, 0.61, 0.36, 1] as const; // calm ease-out

/** The gated threshold — simple, still, expensive. Deep black, the mark, a quiet
 *  code field. Server-validated (the password never touches the client). */
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
    setTimeout(() => window.location.assign(dest), reduce ? 250 : 1400);
  }

  return (
    <main className="on-dark fixed inset-0 z-[100] overflow-hidden bg-[#0b0a09] text-white">
      {webgl && (
        <div className="absolute inset-0 opacity-70">
          <GateScene entering={entering} />
        </div>
      )}
      {/* soft, expensive vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(125%_95%_at_50%_42%,rgba(255,255,255,0.045),transparent_38%,rgba(0,0,0,0.92))]" />

      <motion.div
        className="relative z-10 flex h-full flex-col items-center px-6 text-center"
        animate={{ opacity: entering ? 0 : 1, y: entering && !reduce ? -14 : 0 }}
        transition={{ duration: reduce ? 0 : 1.0, ease: EASE }}
      >
        {/* logo stage — the 3D mark renders here; flat image only when no WebGL */}
        <div className="flex h-[52vh] w-full items-end justify-center pb-2">
          {!webgl && (
            <motion.div initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}>
              <Image src={logoWhite} alt="SOAR" height={84} className="h-16 w-auto md:h-[76px]" priority />
            </motion.div>
          )}
        </div>

        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.35 }}
          className="serif mt-5 text-[clamp(1.4rem,3.4vw,2rem)] italic text-white/80"
        >
          Welcome.
        </motion.p>

        <form onSubmit={onSubmit} className="mt-10 flex w-full max-w-[260px] flex-col items-center gap-7">
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
              className="field-bare w-full border-b border-white/15 bg-transparent pb-3 text-center text-[15px] tracking-[0.4em] text-white outline-none placeholder:tracking-[0.25em] placeholder:text-white/30"
            />
            <motion.span
              aria-hidden
              className="absolute inset-x-0 bottom-0 mx-auto h-px origin-center"
              initial={false}
              animate={{ scaleX: focused || err ? 1 : 0 }}
              transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
              style={{ background: err ? "rgba(220,180,180,0.8)" : "rgba(255,255,255,0.7)" }}
            />
          </div>

          <button type="submit" disabled={busy} className="mono tracking-[0.3em] text-white/65 transition-colors hover:text-white disabled:opacity-50">
            {busy ? "One moment…" : "Enter"}
          </button>

          <AnimatePresence>
            {err && (
              <motion.p role="alert" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mono text-white/40">
                That code isn&rsquo;t right.
              </motion.p>
            )}
          </AnimatePresence>
        </form>

        <p className="mono absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] text-white/20">Born to soar</p>
      </motion.div>

      {/* calm fade into the light, then navigate */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[#f4f3ef]"
        initial={{ opacity: 0 }}
        animate={{ opacity: entering ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 1.2, ease: EASE, delay: 0.2 }}
      />
    </main>
  );
}
