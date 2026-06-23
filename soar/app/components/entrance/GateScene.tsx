"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

const PLATE_Y = 1.15; // sits in the upper-middle; the UI reads below it

/** The SOAR mark as a softly-lit metallic plate floating in the dark — parallax
 *  to the cursor, a slow sheen sweeping across it, a gentle float. */
function LogoPlate({ reduce }: { reduce: boolean }) {
  const tex = useTexture("/soar-logo-white.png");
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const ref = useRef<THREE.Group>(null);

  const [w, h] = useMemo(() => {
    const a = tex.image && tex.image.width ? tex.image.width / tex.image.height : 1.25;
    const W = 2.6;
    return [W, W / a] as const;
  }, [tex]);

  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    if (reduce) {
      g.position.y = PLATE_Y;
      return;
    }
    const t = state.clock.elapsedTime;
    g.position.y = PLATE_Y + Math.sin(t * 0.6) * 0.04;
    const tx = state.pointer.y * 0.16;
    const ty = state.pointer.x * 0.26;
    g.rotation.x += (tx - g.rotation.x) * 0.05;
    g.rotation.y += (ty - g.rotation.y) * 0.05;
    g.rotation.z = Math.sin(t * 0.4) * 0.008;
  });

  return (
    <group ref={ref} position={[0, PLATE_Y, 0]}>
      {/* the mark, lit + faintly self-emissive so it never goes fully dark.
          alphaTest cleanly cuts the transparent ground — no visible plate. */}
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial
          map={tex}
          emissive="#ffffff"
          emissiveMap={tex}
          emissiveIntensity={0.32}
          transparent
          alphaTest={0.45}
          metalness={0.6}
          roughness={0.36}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/** A point light that orbits slowly to draw a sheen across the metallic mark. */
function Sheen({ reduce }: { reduce: boolean }) {
  const ref = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    const l = ref.current;
    if (!l) return;
    if (reduce) {
      l.position.set(2.4, PLATE_Y + 1.6, 2.6);
      return;
    }
    const t = state.clock.elapsedTime * 0.5;
    l.position.set(Math.cos(t) * 3.6, PLATE_Y + Math.sin(t) * 1.6, 2.6);
  });
  return <pointLight ref={ref} intensity={16} distance={13} color="#e3e7ff" />;
}

function Dust({ reduce }: { reduce: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const N = 140;
  const SPREAD = 58;
  const arr = useMemo(() => {
    const p = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      p[i * 3] = (Math.random() - 0.5) * SPREAD;
      p[i * 3 + 1] = (Math.random() - 0.5) * SPREAD;
      p[i * 3 + 2] = -Math.random() * 38 - 4;
    }
    return p;
  }, []);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, [arr]);
  const mat = useMemo(() => new THREE.PointsMaterial({ color: "#ffffff", size: 0.045, transparent: true, opacity: 0.34, sizeAttenuation: true, depthWrite: false }), []);
  useFrame((state, dt) => {
    const pts = ref.current;
    if (!pts || reduce) return;
    const d = Math.min(dt, 0.05);
    for (let i = 0; i < N; i++) {
      let y = arr[i * 3 + 1] + d * 0.9;
      if (y > SPREAD / 2) y -= SPREAD;
      arr[i * 3 + 1] = y;
    }
    (geo.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
    pts.rotation.y += (state.pointer.x * 0.05 - pts.rotation.y) * 0.03;
  });
  return <points ref={ref} geometry={geo} material={mat} />;
}

function Rig({ entering, reduce }: { entering: boolean; reduce: boolean }) {
  const { camera } = useThree();
  useFrame(() => {
    if (reduce) return;
    const z = entering ? 4.4 : 8;
    camera.position.z += (z - camera.position.z) * 0.04;
  });
  return null;
}

export function GateScene({ entering }: { entering: boolean }) {
  const reduce = useReducedMotion() ?? false;
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 2]} gl={{ antialias: true }} frameloop={reduce ? "demand" : "always"}>
      <color attach="background" args={["#0b0a09"]} />
      <fog attach="fog" args={["#0b0a09", 10, 40]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[2, 4, 5]} intensity={0.75} color="#eef1ff" />
      <Sheen reduce={reduce} />
      <Suspense fallback={null}>
        <LogoPlate reduce={reduce} />
      </Suspense>
      <Dust reduce={reduce} />
      <Rig entering={entering} reduce={reduce} />
    </Canvas>
  );
}
