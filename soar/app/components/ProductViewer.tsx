"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";
import type { SoarProduct } from "@/lib/shopify";

/** Garment from primitive geometries — capsule torso, cylinder sleeves, torus collar. */
function Garment() {
  const g = useRef<Group>(null);
  useFrame((_, dt) => { if (g.current) g.current.rotation.y += dt * 0.25; });
  return (
    <group ref={g} rotation={[0.1, 0, 0]}>
      <mesh>
        <capsuleGeometry args={[0.6, 1.1, 8, 24]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.85, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.34, 0.1, 12, 32]} />
        <meshStandardMaterial color="#111111" roughness={0.5} />
      </mesh>
      <mesh position={[-0.62, 0.15, 0]} rotation={[0, 0, Math.PI / 3.2]}>
        <cylinderGeometry args={[0.16, 0.2, 1.0, 16]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.6} />
      </mesh>
      <mesh position={[0.62, 0.15, 0]} rotation={[0, 0, -Math.PI / 3.2]}>
        <cylinderGeometry args={[0.16, 0.2, 1.0, 16]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.6} />
      </mesh>
    </group>
  );
}

export function ProductViewer({ product }: { product?: SoarProduct }) {
  const name = product?.title ?? "Ascension Hoodie";
  const price = product?.price ?? 280;
  return (
    <section className="relative grid border-y border-white/10 md:grid-cols-2">
      <div className="relative aspect-square bg-[#070707] md:aspect-auto md:min-h-[80vh]">
        <Canvas camera={{ position: [0, 0.4, 3.4], fov: 42 }} dpr={[1, 2]}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[3, 5, 4]} intensity={1.4} />
          <directionalLight position={[-4, -1, -3]} intensity={0.3} />
          <Garment />
          <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 2.6} maxPolarAngle={Math.PI / 1.7} />
        </Canvas>
        <span className="mono absolute left-4 top-4 text-white/40">Drag to rotate</span>
      </div>
      <div className="flex flex-col justify-center gap-7 p-6 md:p-16">
        <span className="mono text-white/45">The piece — inspect</span>
        <h2 className="display text-[clamp(2.4rem,6vw,5rem)] text-white">{name}</h2>
        <p className="max-w-md text-white/55">Heavyweight, architectural, built to outlast the moment. Rise above the disposable.</p>
        <div className="flex items-center gap-6">
          <span className="display text-2xl text-white">${price}</span>
          <a href="#drop" className="mono bg-white px-8 py-3.5 text-black transition-opacity hover:opacity-80">View drop</a>
        </div>
      </div>
    </section>
  );
}
