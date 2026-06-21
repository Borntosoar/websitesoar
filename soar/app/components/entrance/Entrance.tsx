"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { AscentMode } from "./AscentScene";

const AscentScene = dynamic(() => import("./AscentScene").then((m) => m.AscentScene), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black" />,
});

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

type Stage = "gateway" | "ascent" | "leaving" | "gone";

/** Cinematic entrance, gated by sessionStorage. Returning visitors skip straight
 *  to the homepage. Reduced-motion / no-WebGL bypass the flythrough. */
export function Entrance() {
  const [stage, setStage] = useState<Stage>("gateway");
  const [show, setShow] = useState(true);
  const [lite] = useState(() => typeof matchMedia !== "undefined" && matchMedia("(max-width: 768px)").matches);
  const reduce = useRef(false);

  useEffect(() => {
    let entered = false;
    try { entered = sessionStorage.getItem("soar-entered") === "1"; } catch {}
    reduce.current = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (entered || !hasWebGL()) {
      setShow(false);
      setStage("gone");
      return;
    }
    document.documentElement.style.overflow = "hidden";
    return () => { document.documentElement.style.overflow = ""; };
  }, []);

  function finish() {
    try { sessionStorage.setItem("soar-entered", "1"); } catch {}
    document.documentElement.style.overflow = "";
    setStage("gone");
    setTimeout(() => setShow(false), 1200);
  }
  function begin() {
    if (reduce.current) return finish();
    setStage("ascent");
    setTimeout(() => setStage("leaving"), 3600);
    setTimeout(finish, 4600);
  }

  if (!show) return null;
  const mode: AscentMode = stage === "gateway" ? "idle" : stage === "ascent" ? "travel" : stage === "leaving" ? "leave" : "arrived";

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black"
      animate={{ y: stage === "gone" ? "-100%" : 0 }}
      transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
    >
      <div className="absolute inset-0">
        <AscentScene mode={mode} lite={lite} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_42%,transparent_42%,rgba(0,0,0,0.78))]" />
      {stage !== "leaving" && stage !== "gone" && (
        <button onClick={finish} className="mono absolute right-5 top-5 z-10 text-white/40 transition-colors hover:text-white">Skip →</button>
      )}
      <AnimatePresence>
        {stage === "gateway" && (
          <motion.div
            key="gateway"
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center text-white"
          >
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="display text-[clamp(2.6rem,9vw,6rem)]"
              style={{ textShadow: "0 0 48px rgba(150,170,255,0.35)" }}
            >
              Born to soar
            </motion.h1>
            <p className="mono text-white/55">The road ahead isn&rsquo;t for everyone.</p>
            <p className="mono max-w-md text-white/35">This is where limits end. This is where potential begins.</p>
            <button onClick={begin} className="mono mt-4 bg-white px-10 py-4 text-black transition-opacity hover:opacity-90">Begin ascent</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
