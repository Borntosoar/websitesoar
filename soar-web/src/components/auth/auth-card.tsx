"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/ui/magnetic";
import {
  firebaseReady,
  loginEmail,
  signupEmail,
  signInGoogle,
  signInApple,
  makeRecaptcha,
  sendOtp,
} from "@/lib/firebase";
import type { ConfirmationResult } from "firebase/auth";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const strengthOf = (pw: string) =>
  [pw.length >= 8, /[A-Z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)].filter(Boolean).length;
const STR_LABEL = ["Too weak", "Weak", "Fair", "Strong", "Excellent"];

type Mode = "login" | "signup";
type Method = "email" | "phone";

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1A6.2 6.2 0 1 1 12 5.8a5.6 5.6 0 0 1 4 1.5l2.7-2.6A9.9 9.9 0 1 0 12 22c5.7 0 9.5-4 9.5-9.6 0-.65-.07-1.14-.16-1.64H12z" />
    </svg>
  );
}
function AppleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white" aria-hidden>
      <path d="M16.4 12.7c0-2.2 1.8-3.2 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.6.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.5 0-2.8.8-3.6 2.2-1.5 2.7-.4 6.6 1.1 8.8.7 1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7s1.7.7 2.8.7c1.2 0 1.9-1.1 2.6-2.1.8-1.2 1.2-2.3 1.2-2.4 0 0-2.3-.9-2.3-3.6zM14.3 6.3c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.6.6-1 1.6-.9 2.6 1 .1 2-.5 2.5-1.2z" />
    </svg>
  );
}

export function AuthCard({ onLegal }: { onLegal: (k: "privacy" | "terms") => void }) {
  const [mode, setMode] = useState<Mode>("login");
  const [method, setMethod] = useState<Method>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [remember, setRemember] = useState(true);
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(0);
  const [success, setSuccess] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);

  const str = strengthOf(password);

  function fail(msg: string) {
    setBusy(false);
    setError(msg);
    setShake((s) => s + 1);
  }
  function win() {
    setBusy(false);
    setError(null);
    setSuccess(true);
  }

  async function submitEmail(e: FormEvent) {
    e.preventDefault();
    if (!emailRe.test(email)) return fail("Enter a valid email address.");
    if (password.length < 6) return fail("Password must be at least 6 characters.");
    if (mode === "signup" && !agree) return fail("Please accept the Privacy Policy and Terms.");
    setBusy(true);
    setError(null);
    try {
      if (mode === "login") await loginEmail(email, password, remember);
      else await signupEmail(email, password, remember);
      win();
    } catch (err) {
      const code = (err as Error).message;
      if (code === "not-configured") return win(); // demo mode
      fail(code.includes("auth/") ? code.replace("Firebase: Error ", "").replace(/\(auth\/(.+)\)\.?/, "$1").replace(/-/g, " ") : "Something went wrong. Try again.");
    }
  }

  async function oauth(p: "google" | "apple") {
    if (mode === "signup" && !agree) return fail("Please accept the Privacy Policy and Terms.");
    setBusy(true);
    setError(null);
    try {
      await (p === "google" ? signInGoogle() : signInApple());
      win();
    } catch (err) {
      if ((err as Error).message === "not-configured") return win();
      fail(`Couldn't continue with ${p === "google" ? "Google" : "Apple"}.`);
    }
  }

  async function submitPhone(e: FormEvent) {
    e.preventDefault();
    if (mode === "signup" && !agree) return fail("Please accept the Privacy Policy and Terms.");
    setBusy(true);
    setError(null);
    try {
      if (!otpSent) {
        if (phone.replace(/\D/g, "").length < 7) return fail("Enter a valid phone number.");
        if (!firebaseReady) {
          setBusy(false);
          setOtpSent(true);
          return;
        }
        const verifier = makeRecaptcha("recaptcha-soar");
        const conf = await sendOtp(phone.startsWith("+") ? phone : `+1${phone.replace(/\D/g, "")}`, verifier);
        setConfirmation(conf);
        setBusy(false);
        setOtpSent(true);
      } else {
        if (otp.replace(/\D/g, "").length < 6) return fail("Enter the 6-digit code.");
        if (!firebaseReady) return win();
        await confirmation?.confirm(otp);
        win();
      }
    } catch {
      fail("Verification failed. Check the number and code.");
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-[420px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] p-10 text-center backdrop-blur-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
          className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white text-black shadow-[0_0_50px_-6px_rgba(155,180,255,0.9)]"
        >
          <Check size={30} strokeWidth={2.4} />
        </motion.div>
        <h3 className="mt-5 text-xl font-semibold text-white">You&apos;re in.</h3>
        <p className="mt-1 text-sm text-white/55">Welcome to the flight{firebaseReady ? "" : " (demo mode — connect Firebase to go live)"}.</p>
        <a href="/" className="mt-6 inline-block rounded-full bg-white px-6 py-2.5 text-[13px] font-medium text-black">Enter SOAR</a>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={shake}
      animate={shake ? { x: [0, -9, 8, -6, 5, 0] } : {}}
      transition={{ duration: 0.4 }}
      className="relative w-full max-w-[420px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-2xl md:p-7"
      style={{ boxShadow: "0 30px 80px -30px rgba(120,150,255,0.35), inset 0 1px 0 rgba(255,255,255,0.08)" }}
    >
      {/* mode tabs */}
      <div className="mb-5 grid grid-cols-2 gap-1 rounded-full border border-white/10 bg-black/30 p-1 text-[12px] uppercase tracking-[0.12em]">
        {(["login", "signup"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setError(null); setOtpSent(false); }}
            className={cn("rounded-full py-2 transition-colors", mode === m ? "bg-white text-black" : "text-white/55 hover:text-white")}
          >
            {m === "login" ? "Log in" : "Create"}
          </button>
        ))}
      </div>

      {/* method toggle */}
      <div className="mb-4 flex justify-center gap-4 text-[11px] uppercase tracking-[0.14em]">
        {(["email", "phone"] as Method[]).map((mm) => (
          <button key={mm} onClick={() => { setMethod(mm); setError(null); setOtpSent(false); }} className={cn("pb-1 transition-colors", method === mm ? "border-b border-white text-white" : "text-white/40 hover:text-white/70")}>
            {mm}
          </button>
        ))}
      </div>

      {method === "email" ? (
        <form onSubmit={submitEmail} className="flex flex-col gap-3">
          <Field label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
              placeholder="you@email.com"
              autoComplete="email"
              className={inputCls}
            />
          </Field>
          <Field label="Password">
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                placeholder="••••••••"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                className={cn(inputCls, "pr-11")}
              />
              <button type="button" onClick={() => setShowPw((v) => !v)} aria-label="Toggle password" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/45 hover:text-white">
                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </Field>

          {mode === "signup" && password.length > 0 && (
            <div>
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className={cn("h-1 flex-1 rounded-full transition-colors", i < str ? "bg-[#9bb4ff]" : "bg-white/10")} />
                ))}
              </div>
              <p className="mt-1 text-[11px] text-white/45">{STR_LABEL[str]}</p>
            </div>
          )}

          {mode === "login" && (
            <div className="flex items-center justify-between text-[12px]">
              <label className="flex cursor-pointer items-center gap-2 text-white/55">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-3.5 w-3.5 accent-white" />
                Remember me
              </label>
              <button type="button" className="text-white/55 underline-offset-2 hover:text-white hover:underline">Forgot?</button>
            </div>
          )}

          {mode === "signup" && <Consent agree={agree} setAgree={setAgree} onLegal={onLegal} />}

          {error && <p className="text-[12px] text-[#ff8a8a]">{error}</p>}

          <Magnetic className="mt-1 block">
            <button type="submit" disabled={busy} className={btnPrimary}>
              {busy ? <Loader2 size={16} className="animate-spin" /> : mode === "login" ? "Log in" : "Create account"}
            </button>
          </Magnetic>
        </form>
      ) : (
        <form onSubmit={submitPhone} className="flex flex-col gap-3">
          <Field label={otpSent ? "Verification code" : "Phone number"}>
            {!otpSent ? (
              <input type="tel" value={phone} onChange={(e) => { setPhone(e.target.value); setError(null); }} placeholder="+1 555 000 0000" autoComplete="tel" className={inputCls} />
            ) : (
              <input inputMode="numeric" value={otp} onChange={(e) => { setOtp(e.target.value); setError(null); }} placeholder="6-digit code" className={cn(inputCls, "tracking-[0.4em]")} />
            )}
          </Field>
          {mode === "signup" && !otpSent && <Consent agree={agree} setAgree={setAgree} onLegal={onLegal} />}
          {error && <p className="text-[12px] text-[#ff8a8a]">{error}</p>}
          <Magnetic className="mt-1 block">
            <button type="submit" disabled={busy} className={btnPrimary}>
              {busy ? <Loader2 size={16} className="animate-spin" /> : otpSent ? "Verify & continue" : "Send code"}
            </button>
          </Magnetic>
          {otpSent && <button type="button" onClick={() => setOtpSent(false)} className="text-[12px] text-white/45 hover:text-white">Use a different number</button>}
        </form>
      )}

      {/* divider */}
      <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-white/30">
        <span className="h-px flex-1 bg-white/10" /> or <span className="h-px flex-1 bg-white/10" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => oauth("google")} disabled={busy} className={btnGlass}>
          <GoogleMark /> Google
        </button>
        <button onClick={() => oauth("apple")} disabled={busy} className={btnGlass}>
          <AppleMark /> Apple
        </button>
      </div>

      {!firebaseReady && (
        <p className="mt-4 text-center text-[10px] uppercase tracking-[0.14em] text-white/25">Demo mode — add Firebase keys to go live</p>
      )}
      <div id="recaptcha-soar" />
    </motion.div>
  );
}

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/30 focus:border-[#9bb4ff]/60 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(155,180,255,0.12)]";
const btnPrimary =
  "flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-[13px] font-semibold text-black transition-all hover:shadow-[0_0_40px_-8px_rgba(155,180,255,0.9)] disabled:opacity-60";
const btnGlass =
  "flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-3 text-[13px] font-medium text-white transition-colors hover:bg-white/[0.08] disabled:opacity-60";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-white/45">{label}</span>
      {children}
    </label>
  );
}

function Consent({ agree, setAgree, onLegal }: { agree: boolean; setAgree: (v: boolean) => void; onLegal: (k: "privacy" | "terms") => void }) {
  return (
    <label className="flex items-start gap-2 text-[11px] leading-snug text-white/55">
      <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-white" />
      <span>
        I&apos;m 13+ and agree to the{" "}
        <button type="button" onClick={() => onLegal("privacy")} className="text-white underline underline-offset-2">Privacy Policy</button>{" "}
        and{" "}
        <button type="button" onClick={() => onLegal("terms")} className="text-white underline underline-offset-2">Terms</button>.
      </span>
    </label>
  );
}
