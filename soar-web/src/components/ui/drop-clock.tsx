"use client";

import { Fragment, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function nextDrop() {
  const now = new Date();
  const t = new Date(now);
  t.setHours(11, 0, 0, 0);
  let add = (4 - t.getDay() + 7) % 7; // Thursday 11:00 local
  if (add === 0 && now.getTime() >= t.getTime()) add = 7;
  t.setDate(t.getDate() + add);
  return t;
}
const pad = (v: number) => (v < 10 ? "0" : "") + v;

/** Digital countdown to the next drop. */
export function DropClock({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
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

  const digit = tone === "dark" ? "text-black" : "text-white";
  const muted = tone === "dark" ? "text-black/45" : "text-white/45";
  const units: [keyof typeof t, string][] = [
    ["d", "Days"],
    ["h", "Hrs"],
    ["m", "Min"],
    ["s", "Sec"],
  ];

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <span className={cn("text-[10px] uppercase tracking-[0.34em]", muted)}>Next drop</span>
      <div className="flex items-start font-mono tabular-nums">
        {units.map(([k, l], i) => (
          <Fragment key={k}>
            {i > 0 && (
              <span className={cn("px-1.5 pt-0.5 text-2xl leading-none [animation:clock-blink_1s_step-end_infinite] md:text-3xl", muted)}>
                :
              </span>
            )}
            <div className="flex w-10 flex-col items-center md:w-12">
              <span className={cn("text-[clamp(1.5rem,7vw,1.875rem)] font-semibold leading-none md:text-4xl", digit)}>{t[k]}</span>
              <span className={cn("mt-1.5 text-[9px] uppercase tracking-[0.18em]", muted)}>{l}</span>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
