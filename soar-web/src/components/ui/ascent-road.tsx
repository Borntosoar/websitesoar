"use client";

/**
 * SOAR — Ascent Road (entrance, stage 1). A wide, straight, premium road recedes
 * to the horizon where a monumental SOAR arch stands; faint white neon edge lines
 * guide the eye. Monochrome, subtle — no gaming aesthetic. Camera modes:
 *   idle    — gateway: hold at the road's start, the monument far and faint
 *   travel  — fly forward down the road toward the monument
 *   arrived — hold at the monument (auth)
 *   leave   — accelerate through the arch (final transition)
 * Hardened per 3d-web-experience: loading state, mobile lite tier, and a static
 * fallback for reduced-motion / missing WebGL. (Custom GLSL shaders + particle
 * dissolve are a stage-2 refinement; neon here is emissive + bloom.)
 */

import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { EffectComposer, Bloom as BloomEffect } from "@react-three/postprocessing";
import { Suspense, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";
import logoWhite from "@/assets/soar-logo-white.png";
import { EntranceBackdrop } from "@/components/ui/entrance-backdrop";

export type AscentMode = "idle" | "travel" | "arrived" | "leave";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
// camera target Z/Y per mode (road runs along -Z; monument arch at z ≈ -118)
const TZ: Record<AscentMode, number> = { idle: 12, travel: -86, arrived: -96, leave: -150 };
const TY: Record<AscentMode, number> = { idle: 2.4, travel: 2.2, arrived: 3.4, leave: 4.4 };

function roadTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#141519";
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 5200; i++) {
      const g = (Math.random() < 0.5 ? 8 + Math.random() * 16 : 38 + Math.random() * 46) | 0;
      ctx.fillStyle = `rgba(${g},${g},${g + 2},${0.16 + Math.random() * 0.34})`;
      ctx.fillRect(Math.random() * 256, Math.random() * 256, 1, Math.random() < 0.3 ? 2 : 1);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(4, 40);
  t.anisotropy = 8;
  return t;
}

function Road() {
  const tex = useMemo(() => roadTexture(), []);
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, -110]}>
        <planeGeometry args={[16, 300]} />
        <meshStandardMaterial map={tex} color="#1a1b1f" roughness={0.9} metalness={0.1} />
      </mesh>
      {[-7.3, 7.3].map((x, i) => (
        <mesh key={i} rotation-x={-Math.PI / 2} position={[x, 0.04, -110]}>
          <planeGeometry args={[0.12, 300]} />
          <meshStandardMaterial color="#000000" emissive="#eaf0ff" emissiveIntensity={2.2} toneMapped={false} />
        </mesh>
      ))}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.03, -110]}>
        <planeGeometry args={[0.06, 300]} />
        <meshStandardMaterial color="#000000" emissive="#aab6e0" emissiveIntensity={0.5} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Monument({ glow }: { glow: MutableRefObject<number> }) {
  const tex = useLoader(THREE.TextureLoader, logoWhite.src);
  const mark = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(() => {
    if (mark.current) mark.current.emissiveIntensity = 0.55 + glow.current * 1.9;
  });
  return (
    <group position={[0, 0, -118]}>
      {[-6.2, 6.2].map((x, i) => (
        <mesh key={i} position={[x, 9, 0]}>
          <boxGeometry args={[2.2, 18, 2.2]} />
          <meshStandardMaterial color="#0e0f12" roughness={0.7} metalness={0.3} emissive="#5566aa" emissiveIntensity={0.05} />
        </mesh>
      ))}
      <mesh position={[0, 18.6, 0]}>
        <boxGeometry args={[16.6, 2.4, 2.6]} />
        <meshStandardMaterial color="#0e0f12" roughness={0.7} metalness={0.3} />
      </mesh>
      {/* the SOAR mark — emissive, set within the arch */}
      <mesh position={[0, 10, 0.7]}>
        <planeGeometry args={[9, 9]} />
        <meshStandardMaterial
          ref={mark}
          map={tex}
          emissiveMap={tex}
          emissive="#ffffff"
          emissiveIntensity={0.6}
          transparent
          alphaTest={0.32}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function Stars({ count }: { count: number }) {
  const geo = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 130;
      pos[i * 3 + 1] = Math.random() * 52 + 4;
      pos[i * 3 + 2] = -Math.random() * 190 - 10;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count]);
  const mat = useMemo(
    () => new THREE.PointsMaterial({ color: "#ffffff", size: 0.12, transparent: true, opacity: 0.5, depthWrite: false, sizeAttenuation: true }),
    [],
  );
  return <points geometry={geo} material={mat} />;
}

function Rig({ mode, glow }: { mode: AscentMode; glow: MutableRefObject<number> }) {
  const { camera, pointer } = useThree();
  const pos = useMemo(() => new THREE.Vector3(0, TY.idle, TZ.idle), []);
  const look = useMemo(() => new THREE.Vector3(0, 4, -118), []);
  useFrame((_, dt) => {
    const k = Math.min(1, (mode === "leave" ? 0.06 : mode === "travel" ? 0.02 : 0.045) * dt * 60);
    pos.z += (TZ[mode] - pos.z) * k;
    pos.y += (TY[mode] - pos.y) * Math.min(1, 0.04 * dt * 60);
    pos.x += (pointer.x * 0.8 - pos.x) * Math.min(1, 0.05 * dt * 60);
    camera.position.copy(pos);
    look.set(pointer.x * 0.5, 4 - pointer.y * 0.3, -118);
    camera.lookAt(look);
    glow.current = clamp01((12 - pos.z) / 108); // brightens as the monument nears
  });
  return null;
}

function Scene({ mode, lite }: { mode: AscentMode; lite: boolean }) {
  const glow = useRef(0);
  return (
    <>
      <color attach="background" args={["#050507"]} />
      <fog attach="fog" args={["#050507", 28, 155]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 10, 2]} intensity={0.9} color="#eef1f6" />
      <Stars count={lite ? 700 : 1500} />
      <Road />
      <Suspense fallback={null}>
        <Monument glow={glow} />
      </Suspense>
      <Rig mode={mode} glow={glow} />
    </>
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

export function AscentRoad({ mode }: { mode: AscentMode }) {
  const [fallback] = useState(
    () => (typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches) || !hasWebGL(),
  );
  const [lite] = useState(() => typeof matchMedia !== "undefined" && matchMedia("(max-width: 768px)").matches);

  if (fallback) return <EntranceBackdrop />;

  return (
    <Canvas
      camera={{ position: [0, 2.4, 12], fov: 62 }}
      gl={{ antialias: !lite, powerPreference: "high-performance" }}
      dpr={lite ? [1, 1.5] : [1, 2]}
      performance={{ min: 0.5 }}
    >
      <Scene mode={mode} lite={lite} />
      <EffectComposer>
        <BloomEffect intensity={0.7} luminanceThreshold={0.6} luminanceSmoothing={0.4} mipmapBlur radius={0.7} />
      </EffectComposer>
    </Canvas>
  );
}
