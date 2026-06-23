"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture, Environment, Lightformer } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const PLATE_Y = 1.15;
const easeOutExpo = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));

/** The SOAR mark as a polished‑metal plane reflecting a procedural studio
 *  environment — a slow sheen sweep, gentle float, parallax to the cursor, a
 *  scale‑in on mount and an emissive pulse on submit. */
function LogoPlate({ entering, reduce }: { entering: boolean; reduce: boolean }) {
  const tex = useTexture("/soar-logo-white.png");
  useEffect(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
  }, [tex]);

  const ref = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const intro = useRef(0);

  const [w, h] = useMemo(() => {
    const a = tex.image && tex.image.width ? tex.image.width / tex.image.height : 1.25;
    const W = 2.6;
    return [W, W / a] as const;
  }, [tex]);

  useFrame((state, dt) => {
    const g = ref.current;
    if (!g) return;
    intro.current = Math.min(1, intro.current + dt * (reduce ? 10 : 1.1));
    const e = easeOutExpo(intro.current);

    if (reduce) {
      g.position.y = PLATE_Y;
      g.scale.setScalar(1);
    } else {
      const t = state.clock.elapsedTime;
      g.position.y = PLATE_Y + Math.sin(t * 0.6) * 0.04;
      g.scale.setScalar(0.86 + 0.14 * e);
      const tx = state.pointer.y * 0.14;
      const ty = state.pointer.x * 0.24;
      g.rotation.x += (tx - g.rotation.x) * 0.05;
      g.rotation.y += (ty - g.rotation.y) * 0.05;
      g.rotation.z = Math.sin(t * 0.4) * 0.008;
    }
    if (mat.current) {
      const target = entering ? 0.75 : 0.18 * e; // pulse brighter on submit
      mat.current.emissiveIntensity += (target - mat.current.emissiveIntensity) * 0.06;
    }
  });

  return (
    <group ref={ref} position={[0, PLATE_Y, 0]}>
      {/* rim glow — a slightly larger duplicate silhouette, additive */}
      <mesh position={[0, 0, -0.02]} scale={1.03}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={tex} transparent opacity={0.13} color="#c9d0ff" blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>

      {/* the metal mark */}
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial
          ref={mat}
          map={tex}
          emissiveMap={tex}
          emissive="#ffffff"
          emissiveIntensity={0.18}
          transparent
          alphaTest={0.5}
          color="#eef0f6"
          metalness={0.72}
          roughness={0.3}
          envMapIntensity={1.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* faint floor reflection */}
      <mesh position={[0, -h, 0.001]} scale={[1, -1, 1]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={tex} transparent alphaTest={0.5} opacity={0.05} color="#aab2c8" depthWrite={false} />
      </mesh>
    </group>
  );
}

function Sheen({ reduce }: { reduce: boolean }) {
  const ref = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    const l = ref.current;
    if (!l) return;
    if (reduce) {
      l.position.set(2.4, PLATE_Y + 1.6, 2.8);
      return;
    }
    const t = state.clock.elapsedTime * 0.45;
    l.position.set(Math.cos(t) * 3.6, PLATE_Y + Math.sin(t) * 1.6, 2.8);
  });
  return <pointLight ref={ref} intensity={11} distance={14} color="#e6eaff" />;
}

function Dust({ reduce }: { reduce: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const N = 120;
  const SPREAD = 56;
  const arr = useMemo(() => {
    const p = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      p[i * 3] = (Math.random() - 0.5) * SPREAD;
      p[i * 3 + 1] = (Math.random() - 0.5) * SPREAD;
      p[i * 3 + 2] = -Math.random() * 34 - 6;
    }
    return p;
  }, []);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, [arr]);
  const matl = useMemo(() => new THREE.PointsMaterial({ color: "#ffffff", size: 0.045, transparent: true, opacity: 0.3, sizeAttenuation: true, depthWrite: false }), []);
  const tick = useRef(0);
  useFrame((state, dt) => {
    const pts = ref.current;
    if (!pts || reduce) return;
    pts.rotation.y += (state.pointer.x * 0.05 - pts.rotation.y) * 0.03;
    if ((tick.current = (tick.current + 1) % 2) !== 0) return; // update every other frame
    const d = Math.min(dt, 0.05) * 2;
    for (let i = 0; i < N; i++) {
      let y = arr[i * 3 + 1] + d * 0.9;
      if (y > SPREAD / 2) y -= SPREAD;
      arr[i * 3 + 1] = y;
    }
    (geo.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
  });
  return <points ref={ref} geometry={geo} material={matl} />;
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
  const [lite, setLite] = useState(false);
  useEffect(() => {
    setLite(reduce || window.innerWidth < 768 || (navigator.hardwareConcurrency || 8) <= 4);
  }, [reduce]);

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      dpr={lite ? [1, 1.4] : [1, 1.75]}
      gl={{ antialias: !lite, powerPreference: "high-performance" }}
      frameloop={reduce ? "demand" : "always"}
    >
      <color attach="background" args={["#0b0a09"]} />
      <fogExp2 attach="fog" args={["#0b0a09", 0.02]} />
      <ambientLight intensity={0.32} />
      <directionalLight position={[2, 4, 5]} intensity={0.55} color="#eef1ff" />
      <Sheen reduce={reduce} />

      <Suspense fallback={null}>
        <LogoPlate entering={entering} reduce={reduce} />
        {/* procedural studio environment — what makes the mark read as metal */}
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={2.4} color="#ffffff" position={[0, 3.5, 5]} scale={[7, 3.5, 1]} target={[0, PLATE_Y, 0]} />
          <Lightformer form="rect" intensity={0.7} color="#b9c2e8" position={[-5, 1, 3]} scale={[3, 4, 1]} target={[0, PLATE_Y, 0]} />
          <Lightformer form="ring" intensity={1.1} color="#ffffff" position={[4, -1.5, 3]} scale={3} target={[0, PLATE_Y, 0]} />
        </Environment>
      </Suspense>

      <Dust reduce={reduce} />
      <Rig entering={entering} reduce={reduce} />
    </Canvas>
  );
}
