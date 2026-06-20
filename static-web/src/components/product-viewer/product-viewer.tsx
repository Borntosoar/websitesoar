"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { flagship } from "@/lib/products";

function ViewerSkeleton() {
  return <div className="mono grid h-full w-full place-items-center bg-[#0a0a0a] text-white/40">Loading viewer…</div>;
}

// R3F can't SSR — load the canvas client-only, with a loading state (anti-pattern: none).
const ViewerScene = dynamic(() => import("./viewer-scene").then((m) => m.ViewerScene), {
  ssr: false,
  loading: () => <ViewerSkeleton />,
});

/** Static, monochrome stand-in for reduced-motion / no-WebGL (never a blank box). */
function StaticFallback() {
  return (
    <div className="relative grid h-full w-full place-items-center overflow-hidden bg-[#0a0a0a]">
      <div className="over text-[28vw] leading-none text-white/[0.08] md:text-[15rem]">STATIC</div>
      <span className="mono absolute bottom-4 left-4 text-white/30">3D paused</span>
    </div>
  );
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

const HOTSPOTS: [string, string][] = [
  ["Material", "Heavyweight 480GSM brushed loopback"],
  ["Fit", "Boxed body, dropped shoulder"],
  ["Make", "Cut & sewn — limited run"],
];

export function ProductViewer() {
  // First render = "3d" (matches SSR → no hydration mismatch); refine after mount.
  const [mode, setMode] = useState<"3d" | "lite" | "static">("3d");
  useEffect(() => {
    const reduce = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !hasWebGL()) setMode("static");
    else if (matchMedia("(max-width: 768px)").matches) setMode("lite");
  }, []);

  return (
    <section className="grid border-b border-black/14 md:grid-cols-2">
      <div className="relative aspect-square bg-[#0a0a0a] md:aspect-auto md:min-h-[82vh]">
        {mode === "static" ? <StaticFallback /> : <ViewerScene lite={mode === "lite"} />}
        {mode !== "static" && <span className="mono absolute left-4 top-4 text-white/40">Drag to rotate</span>}
      </div>
      <div className="flex flex-col justify-center gap-8 p-6 md:p-16">
        <span className="mono text-black/45">Flagship — inspect</span>
        <h2 className="over text-[clamp(2.4rem,6vw,5rem)]">{flagship.name}</h2>
        <div className="flex flex-col divide-y divide-black/12 border-y border-black/12">
          {HOTSPOTS.map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-6 py-4">
              <span className="mono shrink-0">{k}</span>
              <span className="text-right text-sm text-black/70">{v}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-6">
          <span className="over text-2xl tabular-nums">${flagship.price}</span>
          <a href={`/product/${flagship.handle}`} className="mono bg-black px-8 py-3.5 text-white transition-opacity hover:opacity-80">
            Add to bag
          </a>
        </div>
      </div>
    </section>
  );
}
