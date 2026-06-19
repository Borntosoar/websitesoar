"use client";

import { useEffect, useState } from "react";

function nextDrop() {
  const now = new Date();
  const t = new Date(now);
  t.setHours(11, 0, 0, 0);
  let add = (4 - t.getDay() + 7) % 7; // Thursday
  if (add === 0 && now.getTime() >= t.getTime()) add = 7;
  t.setDate(t.getDate() + add);
  return t;
}

const pad = (v: number) => (v < 10 ? "0" : "") + v;

/** Live countdown to the next Thursday 11:00 (local). */
export function Countdown() {
  const [t, setT] = useState({ d: "00", h: "00", m: "00", s: "00" });

  useEffect(() => {
    let target = nextDrop();
    const tick = () => {
      let diff = +target - Date.now();
      if (diff <= 0) {
        target = nextDrop();
        diff = +target - Date.now();
      }
      const tot = Math.floor(diff / 1000);
      setT({
        d: pad(Math.floor(tot / 86400)),
        h: pad(Math.floor((tot % 86400) / 3600)),
        m: pad(Math.floor((tot % 3600) / 60)),
        s: pad(tot % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const Unit = ({ n, l }: { n: string; l: string }) => (
    <div className="flex flex-col gap-2">
      <span className="text-[clamp(1.75rem,9vw,2.25rem)] font-medium leading-none tracking-tight tabular-nums md:text-6xl">
        {n}
      </span>
      <span className="text-[11px] uppercase tracking-[0.17em] text-bone/55">{l}</span>
    </div>
  );

  return (
    <div className="flex gap-5 md:gap-7">
      <Unit n={t.d} l="Days" />
      <Unit n={t.h} l="Hrs" />
      <Unit n={t.m} l="Min" />
      <Unit n={t.s} l="Sec" />
    </div>
  );
}
