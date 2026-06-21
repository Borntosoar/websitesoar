"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type * as THREE from "three";
import gsap from "gsap";
import { motion } from "framer-motion";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uIntensity;
  varying vec2 vUv;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  void main() {
    vec2 uv = vUv;
    float band = floor(uv.y * 90.0);
    float lineNoise = random(vec2(band, floor(uTime * 30.0)));
    float shift = (lineNoise - 0.5) * 0.2 * uIntensity;

    float grain = random(uv * 800.0 + uTime);
    float base = mix(0.015, 0.85, grain) * uIntensity;

    vec3 col = vec3(base);
    float rTear = step(0.965, random(vec2(band, floor(uTime * 24.0))));
    float bTear = step(0.965, random(vec2(band + 11.0, floor(uTime * 24.0))));
    col.r += rTear * uIntensity * 0.9;
    col.b += bTear * uIntensity * 0.9;

    col += shift * 0.4;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function GlitchPlane({ onSettled }: { onSettled: () => void }) {
  const { viewport } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const initialUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: 1 },
    }),
    []
  );

  useFrame((state) => {
    const material = materialRef.current;
    if (!material) return;
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  useEffect(() => {
    const material = materialRef.current;
    if (!material) return;
    const tween = gsap.to(material.uniforms.uIntensity, {
      value: 0,
      duration: 1.5,
      delay: 0.35,
      ease: "power3.out",
      onComplete: onSettled,
    });
    return () => {
      tween.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={initialUniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}

export default function GlitchHero() {
  const [settled, setSettled] = useState(false);

  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0">
        <Canvas
          gl={{ antialias: false }}
          camera={{ position: [0, 0, 1], fov: 50 }}
        >
          <GlitchPlane onSettled={() => setSettled(true)} />
        </Canvas>
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={settled ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="font-display select-none text-[16vw] leading-[0.85] tracking-tight text-white mix-blend-difference sm:text-[13vw] md:text-[10vw]"
        >
          STATIC
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={settled ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mt-6 max-w-md text-xs uppercase tracking-[0.35em] text-white/60 sm:text-sm"
        >
          Everything is noise until you cut through it.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={settled ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-col items-center gap-2"
        >
          <span className="h-10 w-px bg-white/30" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
            Scroll
          </span>
        </motion.div>
      </div>
    </section>
  );
}
