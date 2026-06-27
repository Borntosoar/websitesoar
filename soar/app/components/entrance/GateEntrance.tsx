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
const EXIT_MS = 1400; // kept in step with the fade-to-light below

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="M3 3l18 18" />}
    </svg>
  );
}

/** The gated threshold — simple, still, expensive. The SOAR mark renders in 3D
 *  (GateScene); this overlays the calm UI. Server-validated; password never
 *  touches the client. */
export function GateEntrance({ from = "/" }: { from?: string }) {
  const reduce = useReducedMotion() ?? false;
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
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
    setTimeout(() => window.location.assign(dest), reduce ? 250 : EXIT_MS);
  }

  return (
    <main className="on-dark fixed inset-0 z-[100] overflow-hidden bg-[#0b0a09] text-white">
      {webgl && (
        <div aria-hidden="true" className="absolute inset-0 opacity-70">
          <GateScene entering={entering} />
        </div>
      )}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(125%_95%_at_50%_42%,rgba(255,255,255,0.045),transparent_38%,rgba(0,0,0,0.92))]" />
      {/* film grain — kills the plastic CG look */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-soft-light"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />

      <motion.div
        className="relative z-10 flex h-full flex-col items-center px-6 text-center"
        animate={{ opacity: entering ? 0 : 1, y: entering && !reduce ? -14 : 0 }}
        transition={{ duration: reduce ? 0 : 1.0, ease: EASE }}
      >
        {/* logo stage — the 3D mark renders here; flat image only when no WebGL */}
        <div className="flex h-[52vh] w-full items-end justify-center pb-2">
          {!webgl && (
            <motion.div initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : 1.1, ease: EASE, delay: 0.1 }}>
              <Image src={logoWhite} alt="SOAR" height={84} className="h-16 w-auto md:h-[76px]" priority />
            </motion.div>
          )}
        </div>

        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduce ? 0 : 1.2, ease: EASE, delay: 0.35 }}
          className="serif mt-5 text-[clamp(1.4rem,3.4vw,2rem)] italic text-white/80"
        >
          Welcome.
        </motion.p>

        <form onSubmit={onSubmit} className="mt-10 flex w-full max-w-[280px] flex-col items-center gap-6">
          <label htmlFor="soar-access" className="sr-only">Access code</label>
          <motion.div className="relative w-full" animate={err && !reduce ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}>
            <input
              id="soar-access"
              ref={inputRef}
              type={show ? "text" : "password"}
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
              aria-invalid={err}
              style={{ touchAction: "manipulation" }}
              className="field-bare h-11 w-full border-b border-white/15 bg-transparent px-9 text-center text-[16px] tracking-[0.3em] text-white outline-none placeholder:tracking-[0.2em] placeholder:text-white/30"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide code" : "Show code"}
              tabIndex={-1}
              className="absolute right-0 top-1/2 flex h-11 w-9 -translate-y-1/2 items-center justify-center text-white/30 transition-colors hover:text-white/70"
            >
              <EyeIcon off={show} />
            </button>
            <motion.span
              aria-hidden
              className="absolute inset-x-0 bottom-0 mx-auto h-px origin-center"
              initial={false}
              animate={{ scaleX: focused || err ? 1 : 0 }}
              transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
              style={{ background: err ? "rgba(220,150,150,0.85)" : "rgba(255,255,255,0.7)" }}
            />
          </motion.div>

          <button type="submit" disabled={busy} className="mono flex min-h-[44px] items-center tracking-[0.3em] text-white/65 transition-colors hover:text-white disabled:opacity-50">
            {busy ? "Entering…" : "Enter"}
          </button>

          {/* persistent live region — no layout shift, announced on error */}
          <p role="alert" aria-live="assertive" className="mono min-h-[1.1em] text-white/40">
            <AnimatePresence>
              {err && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  That code isn&rsquo;t right.
                </motion.span>
              )}
            </AnimatePresence>
          </p>
        </form>

        <p className="mono absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] text-white/20">Born to soar</p>
      </motion.div>

      {/* calm fade straight into the dark hero (no white flash), then navigate */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[#0b0a09]"
        initial={{ opacity: 0 }}
        animate={{ opacity: entering ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 1.1, ease: EASE, delay: 0.15 }}
      />
    </main>
  );
}
