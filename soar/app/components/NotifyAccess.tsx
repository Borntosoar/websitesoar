"use client";

import { useEffect, useState, type FormEvent } from "react";

function nextThursday() {
  const now = new Date();
  const t = new Date(now);
  t.setHours(11, 0, 0, 0);
  let add = (4 - t.getDay() + 7) % 7;
  if (add === 0 && now.getTime() >= t.getTime()) add = 7;
  t.setDate(t.getDate() + add);
  return t;
}

export function NotifyAccess() {
  const [done, setDone] = useState(false);
  const [t, setT] = useState({ d: "00", h: "00", m: "00", s: "00" });

  useEffect(() => {
    const target = nextThursday();
    const p = (v: number) => String(v).padStart(2, "0");
    const tick = () => {
      let diff = +target - Date.now();
      if (diff < 0) diff = 0;
      const tot = Math.floor(diff / 1000);
      setT({ d: p(Math.floor(tot / 86400)), h: p(Math.floor((tot % 86400) / 3600)), m: p(Math.floor((tot % 3600) / 60)), s: p(tot % 60) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDone(true);
  }

  return (
    <section id="access" className="border-y border-white/10 bg-black">
      <div className="wrap flex flex-col items-center gap-8 py-24 text-center md:py-32">
        <span className="mono text-white/45">Next drop</span>
        <div className="flex gap-6 md:gap-10">
          {([["d", "Days"], ["h", "Hrs"], ["m", "Min"], ["s", "Sec"]] as const).map(([k, l]) => (
            <div key={l} className="text-center">
              <div className="display text-[clamp(2.4rem,6vw,4rem)] tabular-nums text-white">{t[k]}</div>
              <div className="mono mt-2 text-white/40">{l}</div>
            </div>
          ))}
        </div>
        <h2 className="display max-w-3xl text-[clamp(1.9rem,5vw,3.4rem)] text-white">Rise above the box.</h2>
        {done ? (
          <p className="mono text-white/70">You&rsquo;re on the list.</p>
        ) : (
          <form onSubmit={onSubmit} className="flex w-full max-w-md flex-col gap-3">
            <input type="email" required placeholder="Email address" aria-label="Email address" className="border-b border-white/30 bg-transparent py-3 text-center text-white outline-none placeholder:text-white/40 focus:border-white" />
            <input type="tel" placeholder="Phone number" aria-label="Phone number" className="border-b border-white/30 bg-transparent py-3 text-center text-white outline-none placeholder:text-white/40 focus:border-white" />
            <label className="mono flex items-start gap-2 text-left normal-case tracking-normal text-white/55">
              <input type="checkbox" required className="mt-1" /> I agree to the Privacy Policy and Terms of Service.
            </label>
            <label className="mono flex items-start gap-2 text-left normal-case tracking-normal text-white/55">
              <input type="checkbox" className="mt-1" /> I agree to receive drop announcements.
            </label>
            <button className="mono mt-2 bg-white py-3.5 text-black transition-opacity hover:opacity-80" type="submit">Request access</button>
          </form>
        )}
      </div>
    </section>
  );
}
