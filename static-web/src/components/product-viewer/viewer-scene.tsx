"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

/** Placeholder garment — a faceted form (the real GLB garment is a drop-in next
 *  step once provided). Slow auto-rotate; drag to inspect. */
function Piece() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.18; });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.35, 1]} />
      <meshStandardMaterial color="#141414" roughness={0.45} metalness={0.15} flatShading />
    </mesh>
  );
}

export function ViewerScene() {
  return (
    <Canvas camera={{ position: [0, 0, 4.6], fov: 42 }} dpr={[1, 2]} gl={{ antialias: true }}>
      <color attach="background" args={["#0a0a0a"]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 3]} intensity={1.3} color="#ffffff" />
      <directionalLight position={[-5, -2, -4]} intensity={0.4} color="#00f0ff" />
      <Piece />
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
