"use client";

import { useEffect, useState } from "react";

function useCountdown(hoursFromNow: number) {
  const [target] = useState(() => Date.now() + hoursFromNow * 60 * 60 * 1000);
  const [remaining, setRemaining] = useState(hoursFromNow * 60 * 60 * 1000);

  useEffect(() => {
    const id = setInterval(() => setRemaining(target - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);

  const clamped = Math.max(remaining, 0);
  const hours = Math.floor(clamped / (1000 * 60 * 60));
  const minutes = Math.floor((clamped / (1000 * 60)) % 60);
  const seconds = Math.floor((clamped / 1000) % 60);
  return { hours, minutes, seconds };
}

export default function NotifyAccess() {
  const { hours, minutes, seconds } = useCountdown(71);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeUpdates, setAgreeUpdates] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !phone || !agreeTerms) return;
    setSubmitted(true);
  }

  return (
    <section
      id="access"
      className="relative w-full bg-[#0a0a0a] px-6 py-24 md:px-10"
    >
      <div className="mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-2 lg:items-center lg:gap-24">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/40">
            Drop 003 — Access Closed
          </p>
          <h2 className="font-display mt-4 text-4xl leading-[0.95] tracking-tight text-white sm:text-5xl md:text-6xl">
            Request
            <br />
            Early Access
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/50">
            Drop 003 isn&apos;t open. Get on the list now and we&apos;ll send
            your access password the moment it does.
          </p>

          <div className="mt-10 flex gap-6 sm:gap-10">
            {[
              { value: hours, label: "Hours" },
              { value: minutes, label: "Min" },
              { value: seconds, label: "Sec" },
            ].map((unit) => (
              <div key={unit.label} className="flex flex-col items-start">
                <span className="font-display text-3xl tracking-tight text-white sm:text-4xl">
                  {String(unit.value).padStart(2, "0")}
                </span>
                <span className="mt-1 text-[10px] uppercase tracking-[0.3em] text-white/40">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-white/10 bg-black/40 p-6 sm:p-10">
          {submitted ? (
            <div className="flex h-full flex-col items-start justify-center gap-3 py-12">
              <span className="font-display text-2xl tracking-tight text-white">
                You&apos;re on the list.
              </span>
              <p className="max-w-sm text-sm text-white/50">
                We&apos;ll send your access password the moment the drop
                opens. Keep your notifications on.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-[10px] uppercase tracking-[0.3em] text-white/40"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="border-b border-white/20 bg-transparent py-2 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/60"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="phone"
                  className="text-[10px] uppercase tracking-[0.3em] text-white/40"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="border-b border-white/20 bg-transparent py-2 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/60"
                />
              </div>

              <label className="flex items-start gap-3 text-xs text-white/50">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 border border-white/30 bg-transparent accent-white"
                />
                I agree to the Privacy Policy and Terms of Service.
              </label>

              <label className="flex items-start gap-3 text-xs text-white/50">
                <input
                  type="checkbox"
                  checked={agreeUpdates}
                  onChange={(e) => setAgreeUpdates(e.target.checked)}
                  className="mt-0.5 h-4 w-4 border border-white/30 bg-transparent accent-white"
                />
                Notify me by push, email, and text for early access drops.
              </label>

              <button
                type="submit"
                className="mt-2 w-full rounded-full bg-white px-8 py-3 text-xs uppercase tracking-[0.3em] text-black transition-opacity hover:opacity-80"
              >
                Request Access
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
