"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { joinWaitlist } from "@/app/actions";

// A real, shared drop time (ISO 8601, e.g. "2026-07-10T17:00:00Z"). Optional —
// when unset we don't fake a countdown.
const DROP_AT = process.env.NEXT_PUBLIC_NEXT_DROP_AT;
const target = DROP_AT ? new Date(DROP_AT) : null;
const hasTarget = target != null && !Number.isNaN(target.getTime());

export function Access() {
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [t, setT] = useState<{ d: string; h: string; m: string; s: string } | null>(null);
  const [live, setLive] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!hasTarget) return;
    const p = (v: number) => String(v).padStart(2, "0");
    const tick = () => {
      const diff = target!.getTime() - Date.now();
      if (diff <= 0) {
        setLive(true);
        setT({ d: "00", h: "00", m: "00", s: "00" });
        return;
      }
      const tot = Math.floor(diff / 1000);
      setT({ d: p(Math.floor(tot / 86400)), h: p(Math.floor((tot % 86400) / 3600)), m: p(Math.floor((tot % 3600) / 60)), s: p(tot % 60) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const sms = data.get("sms") === "on";
    setBusy(true);
    setErr("");
    const res = await joinWaitlist({ email, phone, sms });
    if (res !== "ok") {
      setErr(res === "invalid" ? "Enter a valid email address." : "Couldn’t add you just now — email soarnextlevel@gmail.com");
      setBusy(false);
      emailRef.current?.focus();
      return;
    }
    setDone(true);
  }

  const srSummary = hasTarget
    ? live
      ? "The drop is live now."
      : "The next drop opens soon. Join First Flight to get the access code first."
    : "The next drop date will be announced. Join First Flight to hear first.";

  return (
    <section id="access" className="on-dark border-t border-paper/10 bg-pitch text-paper">
      <div className="wrap grid gap-14 py-24 md:grid-cols-[1.1fr_0.9fr] md:gap-20 md:py-36">
        {/* left — drop status + pitch */}
        <div>
          {hasTarget && !live && (
            <>
              <span className="mono text-paper/55">Next drop in</span>
              <div className="mt-6 flex gap-8 md:gap-12" aria-hidden="true">
                {([["d", "Days"], ["h", "Hrs"], ["m", "Min"], ["s", "Sec"]] as const).map(([k, l]) => (
                  <div key={l}>
                    <div className="display text-[clamp(2.6rem,7vw,5rem)] tabular-nums">{t?.[k] ?? "—"}</div>
                    <div className="mono mt-2 text-paper/55">{l}</div>
                  </div>
                ))}
              </div>
            </>
          )}
          {hasTarget && live && (
            <>
              <span className="mono text-paper/55">The drop is</span>
              <p className="display mt-3 text-[clamp(2.6rem,7vw,5rem)]">Live now.</p>
            </>
          )}
          {!hasTarget && (
            <>
              <span className="mono text-paper/55">The next drop</span>
              <p className="display mt-3 max-w-[14ch] text-[clamp(2.2rem,6vw,4.4rem)]">To be announced.</p>
            </>
          )}
          <p className="sr-only">{srSummary}</p>

          <h2 className="display mt-12 max-w-[16ch] text-[clamp(2rem,5vw,3.8rem)]">Join First Flight.</h2>
          <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-paper/55">
            A small early list. You&rsquo;ll get the access code before anyone, and the next run before it sells out.
          </p>
        </div>

        {/* right — capture (owned audience) */}
        <div className="flex flex-col justify-center">
          {done ? (
            <p className="serif text-2xl italic" role="status">You&rsquo;re in. Welcome to First Flight.</p>
          ) : (
            <form onSubmit={onSubmit} noValidate className="flex w-full max-w-md flex-col gap-5">
              <label htmlFor="ff-email" className="sr-only">Email address</label>
              <input id="ff-email" ref={emailRef} type="email" name="email" required autoComplete="email" inputMode="email" spellCheck={false} placeholder="Email address" className="border-b border-paper/20 bg-transparent py-3 text-paper outline-none placeholder:text-paper/40 focus-visible:border-paper" />
              <label htmlFor="ff-phone" className="sr-only">Phone number (optional)</label>
              <input id="ff-phone" type="tel" name="phone" autoComplete="tel" inputMode="tel" placeholder="Phone (for drop alerts)" className="border-b border-paper/20 bg-transparent py-3 text-paper outline-none placeholder:text-paper/40 focus-visible:border-paper" />
              <label className="flex items-start gap-2.5 text-[12px] leading-snug text-paper/55">
                <input type="checkbox" name="terms" required className="mt-0.5 accent-paper" /> I agree to the Privacy Policy and Terms of Service.
              </label>
              <label className="flex items-start gap-2.5 text-[12px] leading-snug text-paper/55">
                <input type="checkbox" name="sms" className="mt-0.5 accent-paper" /> Send me drop announcements by email &amp; SMS.
              </label>
              {err && <p role="alert" className="mono text-[#d98a8a]">{err}</p>}
              <button type="submit" disabled={busy} className="mono mt-2 bg-paper py-4 text-ink transition-opacity hover:opacity-85 disabled:opacity-60">
                {busy ? "Joining…" : "Request access"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
