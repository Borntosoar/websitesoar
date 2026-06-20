"use client";

/**
 * SOAR — Ascent Road (entrance). The road IS the logo: a wide premium road that
 * traces an S as it climbs out of darkness and opens into a starfield, the SOAR
 * mark glowing where the road leads. Subtle white neon edge lines (emissive +
 * bloom), monochrome, no gaming aesthetic. Near the top the camera lifts to
 * reveal the path has been an S the whole time. Camera modes:
 *   idle    — gateway: hold at the road's start, the mark far and faint
 *   travel  — first-person flythrough up the S
 *   arrived — lift to the overhead reveal (the S resolves), the mark blazes (auth)
 *   leave   — accelerate up into the stars (final transition)
 * Hardened per 3d-web-experience: loading state, mobile lite tier, and a static
 * fallback for reduced-motion / missing WebGL.
 */

import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { EffectComposer, Bloom as BloomEffect } from "@react-three/postprocessing";
import { Suspense, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";
import logoWhite from "@/assets/soar-logo-white.png";
import { EntranceBackdrop } from "@/components/ui/entrance-backdrop";

export type AscentMode = "idle" | "travel" | "arrived" | "leave";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

// the road traces an S, rising toward the stars (the logo)
const CURVE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0.0, -2.4, 15),
  new THREE.Vector3(3.4, -1.7, 7),
  new THREE.Vector3(-3.6, -0.6, -3),
  new THREE.Vector3(-3.2, 0.8, -14),
  new THREE.Vector3(2.8, 2.0, -24),
  new THREE.Vector3(3.0, 3.2, -34),
  new THREE.Vector3(0.0, 4.4, -45),
]);

// per-mode camera target along the curve + overhead-reveal lift
const U: Record<AscentMode, number> = { idle: 0.03, travel: 0.8, arrived: 0.86, leave: 0.99 };
const LIFT: Record<AscentMode, number> = { idle: 0, travel: 0, arrived: 1, leave: 0.25 };

function roadTexture() {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 512;
  const ctx = c.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#17181b";
    ctx.fillRect(0, 0, 128, 512);
    for (let i = 0; i < 2400; i++) {
      const g = (Math.random() < 0.5 ? 8 + Math.random() * 16 : 42 + Math.random() * 52) | 0;
      ctx.fillStyle = `rgba(${g},${g},${g + 2},${0.2 + Math.random() * 0.4})`;
      ctx.fillRect(Math.random() * 128, Math.random() * 512, 1, Math.random() < 0.3 ? 2 : 1);
    }
    // worn painted edge lines — the neon that traces the S (emissiveMap picks these up)
    for (let y = 0; y < 512; y++) {
      const a = 0.45 + Math.random() * 0.18 - (Math.random() < 0.06 ? 0.34 : 0);
      ctx.fillStyle = `rgba(220,225,235,${Math.max(0, a)})`;
      ctx.fillRect(9, y, 3, 1);
      ctx.fillRect(116, y, 3, 1);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1, 8);
  t.anisotropy = 8;
  return t;
}

function buildRoad(width: number, segments: number) {
  const pts = CURVE.getSpacedPoints(segments);
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const up = new THREE.Vector3(0, 1, 0);
  const tan = new THREE.Vector3();
  const side = new THREE.Vector3();
  for (let i = 0; i <= segments; i++) {
    const p = pts[i];
    CURVE.getTangentAt(i / segments, tan);
    side.copy(tan).cross(up).normalize().multiplyScalar(width / 2);
    positions.push(p.x - side.x, p.y - side.y, p.z - side.z);
    positions.push(p.x + side.x, p.y + side.y, p.z + side.z);
    uvs.push(0, i / segments, 1, i / segments);
  }
  for (let i = 0; i < segments; i++) {
    const a = i * 2, b = i * 2 + 1, cc = i * 2 + 2, dd = i * 2 + 3;
    indices.push(a, b, cc, b, dd, cc);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}

function Road({ glow }: { glow: MutableRefObject<number> }) {
  const geo = useMemo(() => buildRoad(4.8, 240), []);
  const tex = useMemo(() => roadTexture(), []);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(() => {
    if (mat.current) mat.current.emissiveIntensity = 0.3 + glow.current * 0.9;
  });
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial
        ref={mat}
        map={tex}
        emissiveMap={tex}
        emissive="#cfe0ff"
        emissiveIntensity={0.3}
        color="#1b1c20"
        roughness={0.86}
        metalness={0.16}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function StarLogo({ glow }: { glow: MutableRefObject<number> }) {
  const tex = useLoader(THREE.TextureLoader, logoWhite.src);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const end = useMemo(() => CURVE.getPointAt(1), []);
  useFrame(() => {
    if (mat.current) mat.current.emissiveIntensity = 0.5 + glow.current * 2.3;
  });
  return (
    <mesh position={[end.x, end.y + 2.6, end.z - 3]}>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial
        ref={mat}
        map={tex}
        emissiveMap={tex}
        emissive="#ffffff"
        emissiveIntensity={0.5}
        transparent
        alphaTest={0.3}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

function Stars({ glow, count }: { glow: MutableRefObject<number>; count: number }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = Math.random() * 64 - 6;
      pos[i * 3 + 2] = -Math.random() * 130 - 8;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count]);
  const mat = useMemo(
    () => new THREE.PointsMaterial({ color: "#ffffff", size: 0.06, transparent: true, opacity: 0.22, depthWrite: false, sizeAttenuation: true }),
    [],
  );
  useFrame(({ clock }) => {
    const f = glow.current;
    mat.opacity = 0.22 + f * 0.7;
    mat.size = 0.06 + f * 0.3;
    if (ref.current) ref.current.rotation.z = clock.elapsedTime * 0.006;
  });
  return <points ref={ref} geometry={geo} material={mat} />;
}

function Rig({ mode, glow }: { mode: AscentMode; glow: MutableRefObject<number> }) {
  const { camera, pointer } = useThree();
  const mid = useMemo(() => CURVE.getPointAt(0.5), []);
  const u = useRef(0.03);
  const lift = useRef(0);
  const p = useMemo(() => new THREE.Vector3(), []);
  const ahead = useMemo(() => new THREE.Vector3(), []);
  const onRoad = useMemo(() => new THREE.Vector3(), []);
  const over = useMemo(() => new THREE.Vector3(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  useFrame((_, dt) => {
    const ku = Math.min(1, (mode === "leave" ? 0.05 : 0.02) * dt * 60);
    u.current += (U[mode] - u.current) * ku;
    lift.current += (LIFT[mode] - lift.current) * Math.min(1, 0.03 * dt * 60);
    const uu = Math.min(0.985, u.current);
    CURVE.getPointAt(uu, p);
    CURVE.getPointAt(Math.min(0.999, uu + 0.05), ahead);
    onRoad.set(p.x - pointer.x * 0.5, p.y + 0.55 - pointer.y * 0.25, p.z + 1.7);
    over.set(mid.x, mid.y + 34, mid.z + 8); // the overhead reveal of the S
    target.copy(onRoad).lerp(over, lift.current);
    camera.position.lerp(target, 0.1);
    look.copy(ahead).lerp(mid, lift.current);
    camera.lookAt(look);
    glow.current = clamp01(uu / 0.86); // the mark + stars blaze as the road climbs
  });
  return null;
}

function Scene({ mode, lite }: { mode: AscentMode; lite: boolean }) {
  const glow = useRef(0);
  return (
    <>
      <color attach="background" args={["#050507"]} />
      <fog attach="fog" args={["#050507", 22, 82]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 7, 5]} intensity={1.0} color="#eef1f6" />
      <directionalLight position={[-5, 2, -6]} intensity={0.45} color="#c2c8d6" />
      <Stars glow={glow} count={lite ? 800 : 1700} />
      <Road glow={glow} />
      <Suspense fallback={null}>
        <StarLogo glow={glow} />
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
      camera={{ position: [0, -1.5, 16], fov: 62 }}
      gl={{ antialias: !lite, powerPreference: "high-performance" }}
      dpr={lite ? [1, 1.5] : [1, 2]}
      performance={{ min: 0.5 }}
    >
      <Scene mode={mode} lite={lite} />
      <EffectComposer>
        <BloomEffect intensity={0.68} luminanceThreshold={0.62} luminanceSmoothing={0.4} mipmapBlur radius={0.7} />
      </EffectComposer>
    </Canvas>
  );
}
