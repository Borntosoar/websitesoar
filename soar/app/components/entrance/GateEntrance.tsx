"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { enterWithPassword, joinWaitlist } from "@/app/actions";
import { EASE_QUIET as EASE } from "@/lib/motion";

const EXIT_MS = 1400; // kept in step with the fade-to-dark below

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="M3 3l18 18" />}
    </svg>
  );
}

/** The gated threshold — a full-screen SOAR logo-motion film, with the access
 *  code and a First Flight sign-up for anyone without one. Password is
 *  server-validated; it never touches the client. */
export function GateEntrance({ from = "/" }: { from?: string }) {
  const reduce = useReducedMotion() ?? false;
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const [entering, setEntering] = useState(false);
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // First Flight sign-up
  const [email, setEmail] = useState("");
  const [signup, setSignup] = useState<"idle" | "busy" | "ok" | "invalid" | "error">("idle");

  useEffect(() => {
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

  async function onSignup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (signup === "busy") return;
    setSignup("busy");
    const res = await joinWaitlist({ email });
    setSignup(res === "ok" ? "ok" : res === "invalid" ? "invalid" : "error");
  }

  return (
    <main className="on-dark fixed inset-0 z-[100] overflow-hidden bg-[#0b0a09] text-white">
      {/* the SOAR logo-motion film */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src="/soar-entrance.mp4" type="video/mp4" />
      </video>

      {/* dim + vignette so the UI stays legible over any frame */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_30%,rgba(0,0,0,0.15),rgba(0,0,0,0.55)_70%,rgba(0,0,0,0.88))]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
      {/* film grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-soft-light"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />

      <motion.div
        className="relative z-10 flex h-full flex-col items-center justify-end px-5 pb-[7vh] text-center"
        animate={{ opacity: entering ? 0 : 1, y: entering && !reduce ? -14 : 0 }}
        transition={{ duration: reduce ? 0 : 1.0, ease: EASE }}
      >
       <motion.div
         initial={reduce ? false : { opacity: 0, y: 16 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: reduce ? 0 : 1.1, ease: EASE, delay: 0.35 }}
         className="w-full max-w-[360px] rounded-[2px] border border-white/12 bg-black/40 px-7 py-8 backdrop-blur-md"
       >
        <p className="serif text-[clamp(1.25rem,3vw,1.7rem)] italic text-white/85">Welcome to SOAR</p>
        <p className="mono mt-2 text-white/45">Members enter here</p>

        {/* access code */}
        <form onSubmit={onSubmit} className="mt-7 flex w-full flex-col items-center gap-5">
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
              placeholder="Access code"
              aria-invalid={err}
              style={{ touchAction: "manipulation" }}
              className="field-bare h-11 w-full border-b border-white/20 bg-transparent px-9 text-center text-[16px] tracking-[0.3em] text-white outline-none placeholder:tracking-[0.2em] placeholder:text-white/35"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide code" : "Show code"}
              tabIndex={-1}
              className="absolute right-0 top-1/2 flex h-11 w-9 -translate-y-1/2 items-center justify-center text-white/35 transition-colors hover:text-white/70"
            >
              <EyeIcon off={show} />
            </button>
            <motion.span
              aria-hidden
              className="absolute inset-x-0 bottom-0 mx-auto h-px origin-center"
              initial={false}
              animate={{ scaleX: focused || err ? 1 : 0 }}
              transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
              style={{ background: err ? "rgba(220,150,150,0.85)" : "rgba(255,255,255,0.75)" }}
            />
          </motion.div>

          <button type="submit" disabled={busy} className="mono flex min-h-[44px] items-center tracking-[0.3em] text-white/70 transition-colors hover:text-white disabled:opacity-50">
            {busy ? "Entering…" : "Enter"}
          </button>

          <p role="alert" aria-live="assertive" className="mono min-h-[1.1em] text-white/45">
            <AnimatePresence>
              {err && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  That code isn&rsquo;t right.
                </motion.span>
              )}
            </AnimatePresence>
          </p>
        </form>

        {/* divider */}
        <div className="my-5 flex w-full items-center gap-3">
          <span className="h-px flex-1 bg-white/15" />
          <span className="mono text-white/40">or</span>
          <span className="h-px flex-1 bg-white/15" />
        </div>

        {/* First Flight sign-up */}
        <div className="min-h-[78px] w-full">
          {signup === "ok" ? (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="serif text-[15px] italic text-white/85">
              You&rsquo;re on the list — we&rsquo;ll send the code first.
            </motion.p>
          ) : (
            <form onSubmit={onSignup} className="flex w-full flex-col items-center gap-3">
              <p className="mono text-white/55">No code yet? Join First Flight</p>
              <div className="flex w-full items-center border-b border-white/20">
                <label htmlFor="ff-email" className="sr-only">Email address</label>
                <input
                  id="ff-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (signup !== "idle" && signup !== "busy") setSignup("idle");
                  }}
                  required
                  placeholder="Email address"
                  className="field-bare h-11 w-full bg-transparent px-1 text-[16px] text-white outline-none placeholder:text-white/35"
                />
                <button type="submit" disabled={signup === "busy"} className="mono shrink-0 px-2 text-white/70 transition-colors hover:text-white disabled:opacity-50">
                  {signup === "busy" ? "…" : "Join"}
                </button>
              </div>
              <p aria-live="polite" className="mono min-h-[1.1em] text-white/45">
                {signup === "invalid" && "Enter a valid email."}
                {signup === "error" && "Hmm — try again in a moment."}
              </p>
            </form>
          )}
        </div>
       </motion.div>

        <p className="mono absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] text-white/25">Born to soar</p>
      </motion.div>

      {/* calm fade into the dark site (no flash), then navigate */}
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
