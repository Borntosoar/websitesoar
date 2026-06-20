"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

/** Placeholder garment — a faceted form (drop in a real GLB next, loaded under
 *  <Suspense> with drei useProgress). Slow auto-rotate; drag to inspect. */
function Piece({ detail }: { detail: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.18; });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.35, detail]} />
      <meshStandardMaterial color="#141414" roughness={0.45} metalness={0.15} flatShading />
    </mesh>
  );
}

/** `lite` (phones) drops dpr, antialias, the accent light and geometry detail to
 *  protect battery / low-end GPUs — per the 3d-web-experience playbook. */
export function ViewerScene({ lite = false }: { lite?: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.6], fov: 42 }}
      dpr={lite ? [1, 1.5] : [1, 2]}
      gl={{ antialias: !lite, powerPreference: "high-performance" }}
      performance={{ min: 0.5 }}
    >
      <color attach="background" args={["#0a0a0a"]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 3]} intensity={1.3} color="#ffffff" />
      {!lite && <directionalLight position={[-5, -2, -4]} intensity={0.4} color="#00f0ff" />}
      <Piece detail={lite ? 0 : 1} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 2.7}
        maxPolarAngle={Math.PI / 1.7}
        rotateSpeed={0.6}
      />
    </Canvas>
  );
}
