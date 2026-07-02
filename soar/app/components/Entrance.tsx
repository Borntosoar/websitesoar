"use client";

import { useEffect, useRef, useState } from "react";

// The Ascent — SOAR's signature arrival. Shown once per session on the
// homepage: a live warp starfield flies up toward the emblem's four-point star
// (the vanishing point), the mark emerges from darkness, the star ignites, then
// the whole scene warps THROUGH the star and cross-dissolves into the hero.
// Skippable (tap / Skip / Esc), reduced-motion and returning visitors skip it
// entirely, and the site renders beneath so the LCP is never blocked.
const LOGO = "/soar-logo-white.png";
const SEEN = "soar-entered";
const FINALE_AT = 2900; // ms — the scene has ignited; begin the warp-through
const LEAVE_MS = 900; // must match the .soar-entrance transition duration

export function Entrance() {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const emblemRef = useRef<HTMLImageElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const st = useRef({ leaving: false, leaveStart: 0 });

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN) === "1";
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      try {
        sessionStorage.setItem(SEEN, "1");
      } catch {}
      return;
    }
    setShow(true);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!show) return;
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const context = canvasEl.getContext("2d");
    if (!context) return;
    const cv: HTMLCanvasElement = canvasEl;
    const g: CanvasRenderingContext2D = context;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let vx = window.innerWidth * 0.5;
    let vy = window.innerHeight * 0.5;
    let MAXR = Math.hypot(window.innerWidth, window.innerHeight);
    let raf = 0;
    let start = 0;
    let last = 0;

    function size() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      cv.width = Math.floor(w * dpr);
      cv.height = Math.floor(h * dpr);
      cv.style.width = w + "px";
      cv.style.height = h + "px";
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      MAXR = Math.hypot(w, h);
      const el = emblemRef.current;
      if (el) {
        vx = el.offsetLeft + 0.884 * el.offsetWidth; // the emblem's four-point star
        vy = el.offsetTop + 0.265 * el.offsetHeight;
        if (glowRef.current) {
          glowRef.current.style.left = vx + "px";
          glowRef.current.style.top = vy + "px";
        }
        if (overlayRef.current) overlayRef.current.style.transformOrigin = `${vx}px ${vy}px`;
      }
    }
    size();
    window.addEventListener("resize", size);

    const stars = Array.from({ length: 260 }, () => ({
      a: Math.random() * Math.PI * 2,
      r: Math.random(),
      s: 0.1 + Math.random() * 0.32,
      w: 0.6 + Math.random() * 1.6,
      b: 0.3 + Math.random() * 0.7,
    }));

    function gspeed(elapsed: number) {
      if (st.current.leaving) return 1.8 + Math.min(1, (performance.now() - st.current.leaveStart) / 700) * 4.4;
      if (elapsed < 1200) return 0.25 + (elapsed / 1200) * 0.35;
      if (elapsed < 2300) return 0.6 + ((elapsed - 1200) / 1100) * 0.5;
      if (elapsed < FINALE_AT) return 1.1 + ((elapsed - 2300) / (FINALE_AT - 2300)) * 0.7;
      return 1.8;
    }

    function frame(now: number) {
      if (!start) {
        start = now;
        last = now;
      }
      const elapsed = now - start;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const gs = gspeed(elapsed);
      const w = window.innerWidth;
      const hgt = window.innerHeight;
      g.clearRect(0, 0, w, hgt);
      g.lineCap = "round";
      const cap = Math.min(1, 0.45 + gs * 0.4);
      for (const s of stars) {
        s.r += s.s * gs * dt;
        if (s.r >= 1) s.r -= 1;
        const rad = s.r * MAXR;
        const fade = Math.sin(Math.PI * s.r);
        const a = fade * s.b * cap;
        if (a < 0.012) continue;
        const ca = Math.cos(s.a);
        const sa = Math.sin(s.a);
        const len = Math.min(rad, s.s * gs * dt * MAXR * 1.3 + 2.5);
        g.strokeStyle = `rgba(255,255,255,${a.toFixed(3)})`;
        g.lineWidth = s.w;
        g.beginPath();
        g.moveTo(vx + ca * (rad - len), vy + sa * (rad - len));
        g.lineTo(vx + ca * rad, vy + sa * rad);
        g.stroke();
      }
      if (elapsed >= FINALE_AT && !st.current.leaving) finish();
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") finish();
    }
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  function finish() {
    if (st.current.leaving) return;
    st.current.leaving = true;
    st.current.leaveStart = performance.now();
    setLeaving(true);
    try {
      sessionStorage.setItem(SEEN, "1");
    } catch {}
    document.documentElement.style.overflow = "";
    window.setTimeout(() => setShow(false), LEAVE_MS);
  }

  if (!show) return null;
  return (
    <div
      ref={overlayRef}
      className={`soar-entrance${leaving ? " is-leaving" : ""}`}
      onClick={finish}
      role="dialog"
      aria-label="SOAR intro"
    >
      <canvas ref={canvasRef} aria-hidden="true" />
      <div className="e-grain" aria-hidden="true" />
      <div className="e-vignette" aria-hidden="true" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={emblemRef} src={LOGO} alt="SOAR" className="e-emblem" />
      <div ref={glowRef} className="e-glow" aria-hidden="true" />
      <button type="button" className="e-skip mono" onClick={finish}>
        Skip
      </button>
    </div>
  );
}
