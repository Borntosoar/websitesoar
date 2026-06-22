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

export function Access() {
  const [done, setDone] = useState(false);
  const [t, setT] = useState({ d: "—", h: "—", m: "—", s: "—" });

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
    <section id="access" className="border-t border-line">
      <div className="wrap grid gap-14 py-24 md:grid-cols-[1.1fr_0.9fr] md:gap-20 md:py-36">
        {/* left — the pitch + countdown */}
        <div>
          <span className="mono text-ash">Next drop unlocks in</span>
          <div className="mt-6 flex gap-8 md:gap-12">
            {([["d", "Days"], ["h", "Hrs"], ["m", "Min"], ["s", "Sec"]] as const).map(([k, l]) => (
              <div key={l}>
                <div className="display text-[clamp(2.6rem,7vw,5rem)] tabular-nums">{t[k]}</div>
                <div className="mono mt-2 text-ash">{l}</div>
              </div>
            ))}
          </div>
          <h2 className="display mt-12 max-w-[16ch] text-[clamp(2rem,5vw,3.8rem)]">Members enter first.</h2>
        </div>

        {/* right — capture (owned audience) */}
        <div className="flex flex-col justify-center">
          {done ? (
            <p className="serif text-2xl italic">You&rsquo;re on the list. Rise above.</p>
          ) : (
            <form onSubmit={onSubmit} className="flex w-full max-w-md flex-col gap-5">
              <input type="email" required placeholder="Email address" aria-label="Email address" className="border-b border-line bg-transparent py-3 text-ink outline-none placeholder:text-ash focus:border-ink" />
              <input type="tel" placeholder="Phone (for drop alerts)" aria-label="Phone number" className="border-b border-line bg-transparent py-3 text-ink outline-none placeholder:text-ash focus:border-ink" />
              <label className="flex items-start gap-2.5 text-[12px] leading-snug text-ash">
                <input type="checkbox" required className="mt-0.5 accent-ink" /> I agree to the Privacy Policy and Terms of Service.
              </label>
              <label className="flex items-start gap-2.5 text-[12px] leading-snug text-ash">
                <input type="checkbox" className="mt-0.5 accent-ink" /> Send me drop announcements by email & SMS.
              </label>
              <button type="submit" className="mono mt-2 bg-ink py-4 text-paper transition-opacity hover:opacity-85">Request access</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
