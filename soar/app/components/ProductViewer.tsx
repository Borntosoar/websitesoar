"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";

function GarmentMesh() {
  return (
    <group position={[0, -0.2, 0]}>
      <mesh position={[0, 0.65, 0]}>
        <capsuleGeometry args={[0.55, 0.85, 8, 16]} />
        <meshStandardMaterial color="#121212" roughness={0.55} metalness={0.15} />
      </mesh>
      <mesh position={[-0.78, 0.55, 0]} rotation={[0, 0, Math.PI / 2.6]}>
        <cylinderGeometry args={[0.16, 0.2, 0.85, 12]} />
        <meshStandardMaterial color="#121212" roughness={0.55} metalness={0.15} />
      </mesh>
      <mesh position={[0.78, 0.55, 0]} rotation={[0, 0, -Math.PI / 2.6]}>
        <cylinderGeometry args={[0.16, 0.2, 0.85, 12]} />
        <meshStandardMaterial color="#121212" roughness={0.55} metalness={0.15} />
      </mesh>
      <mesh position={[0, 1.32, 0]}>
        <torusGeometry args={[0.32, 0.07, 12, 24]} />
        <meshStandardMaterial color="#121212" roughness={0.5} metalness={0.15} />
      </mesh>
    </group>
  );
}

export default function ProductViewer() {
  return (
    <section
      id="drop"
      className="relative h-[80vh] w-full bg-[#0a0a0a] sm:h-[85vh]"
    >
      <Canvas camera={{ position: [0, 1, 3.6], fov: 35 }}>
        <ambientLight intensity={0.45} />
        <directionalLight position={[3, 4, 2]} intensity={1.2} />
        <directionalLight position={[-3, -2, -2]} intensity={0.3} />
        <GarmentMesh />
        <ContactShadows
          position={[0, -0.55, 0]}
          opacity={0.55}
          scale={6}
          blur={2.4}
        />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1.1}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>

      <div className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-1 px-6 text-center">
        <span className="text-[10px] uppercase tracking-[0.35em] text-white/40">
          Drag to rotate
        </span>
        <span className="font-display text-sm tracking-tight text-white/80">
          ASCENT JACKET 001
        </span>
      </div>
    </section>
  );
}
