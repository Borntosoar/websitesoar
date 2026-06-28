"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { BoxMark } from "./BoxMark";

function StaticBackdrop() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <BoxMark className="h-[46vmin] w-[46vmin] text-paper/[0.08]" />
    </div>
  );
}

const HeroScene = dynamic(() => import("./HeroScene").then((m) => m.HeroScene), {
  ssr: false,
  loading: () => <StaticBackdrop />,
});

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

/** The hero's living backdrop — shows the static mark first, then swaps in the
 *  procedural scene once the browser is idle (so the heavy 3D never competes with
 *  hydration/interactivity). Static fallback when WebGL is unavailable. */
export function HeroBackdrop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!hasWebGL()) return; // stays on the static mark
    const start = () => setShow(true);
    type RIC = (cb: () => void, opts?: { timeout: number }) => number;
    const ric = (window as unknown as { requestIdleCallback?: RIC }).requestIdleCallback;
    if (ric) {
      const id = ric(start, { timeout: 1500 });
      return () => (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(start, 800);
    return () => window.clearTimeout(id);
  }, []);

  return <div aria-hidden className="absolute inset-0">{show ? <HeroScene /> : <StaticBackdrop />}</div>;
}
