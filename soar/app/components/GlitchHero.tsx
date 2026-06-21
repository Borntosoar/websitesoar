"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// Banded RGB-tear glitch that resolves to clean black as uIntensity -> 0.
const fragmentShader = /* glsl */ `
  precision highp float;
  uniform float uIntensity;
  uniform float uTime;
  varying vec2 vUv;
  float rand(vec2 c){ return fract(sin(dot(c, vec2(12.9898, 78.233))) * 43758.5453); }
  void main() {
    vec2 uv = vUv;
    float bands = 24.0;
    float by = floor(uv.y * bands);
    float seed = by + floor(uTime * 13.0);
    float tear = (rand(vec2(seed, 0.0)) - 0.5) * step(0.55, rand(vec2(seed, 1.0))) * 0.30 * uIntensity;
    float x = uv.x + tear;
    float st = rand(vec2(floor(x * 240.0), seed));
    float lit = smoothstep(0.80, 1.0, st) * uIntensity;
    vec3 col = vec3(lit);
    float tline = step(0.965, rand(vec2(seed, 3.0)));
    col += tline * vec3(0.0, 0.85, 1.0) * uIntensity * 0.55 * step(0.5, fract(x));
    col += tline * vec3(1.0, 0.0, 0.42) * uIntensity * 0.45 * step(0.5, fract(x + 0.27));
    col *= uIntensity;
    gl_FragColor = vec4(col, 1.0);
  }
`;

function GlitchPlane({ onSettle }: { onSettle: () => void }) {
  const uniforms = useMemo(() => ({ uIntensity: { value: 1 }, uTime: { value: 0 } }), []);
  useEffect(() => {
    const tween = gsap.to(uniforms.uIntensity, { value: 0, duration: 2.0, ease: "power2.inOut", onComplete: onSettle });
    return () => { tween.kill(); };
  }, [uniforms, onSettle]);
  useFrame((_, dt) => { uniforms.uTime.value += dt; });
  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} />
    </mesh>
  );
}

export function GlitchHero() {
  const [settled, setSettled] = useState(false);
  return (
    <section className="relative h-svh w-full overflow-hidden bg-black">
      <div className="absolute inset-0">
        <Canvas gl={{ antialias: false }} dpr={[1, 2]} camera={{ position: [0, 0, 1] }}>
          <GlitchPlane onSettle={() => setSettled(true)} />
        </Canvas>
      </div>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <AnimatePresence>
          {settled && (
            <motion.div
              key="wordmark"
              initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="display text-[clamp(4rem,22vw,18rem)] text-white">SOAR</h1>
              <p className="mono mt-6 text-white/60">Growth begins where comfort ends.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
