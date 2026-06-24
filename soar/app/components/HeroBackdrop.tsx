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

/** The hero's living backdrop — the procedural ascent scene when WebGL is
 *  available, the static mark otherwise. Decorative, so aria-hidden. */
export function HeroBackdrop() {
  const [webgl, setWebgl] = useState(true);
  useEffect(() => {
    setWebgl(hasWebGL());
  }, []);
  return <div aria-hidden className="absolute inset-0">{webgl ? <HeroScene /> : <StaticBackdrop />}</div>;
}
