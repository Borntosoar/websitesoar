"use client";

/**
 * SOAR — Breakthrough Scene (reusable R3F).
 * Standard WebGL. `unlocked` ramps a 0..1 "boost" that brightens the light,
 * strengthens the bloom, and quickens the ascent — the breakthrough igniting.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Edges } from "@react-three/drei";
import { useMemo, useRef, type MutableRefObject, type ReactNode } from "react";
import * as THREE from "three";

function useGlowTexture() {
  return useMemo(() => {
    const size = 128;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(243,238,227,0.9)");
    g.addColorStop(0.4, "rgba(231,226,215,0.22)");
    g.addColorStop(1, "rgba(231,226,215,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

function FracturedBox() {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.12;
  });
  const edge = "#E7E2D7";
  return (
    <group ref={group}>
      <mesh>
        <boxGeometry args={[1.6, 1.6, 1.6]} />
        <meshStandardMaterial color="#2A251F" roughness={1} metalness={0} transparent opacity={0.35} />
        <Edges threshold={15} color={edge} />
      </mesh>
      <mesh position={[0.5, 1.05, -0.35]} rotation={[0.5, 0.4, 0.3]}>
        <boxGeometry args={[0.7, 0.05, 0.7]} />
        <meshStandardMaterial color="#2A251F" transparent opacity={0.4} />
        <Edges threshold={15} color={edge} />
      </mesh>
    </group>
  );
}

function AscendingMark({ boost }: { boost: MutableRefObject<number> }) {
  const ref = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const b = boost.current;
    const t = (clock.getElapsedTime() * (0.16 + b * 0.16)) % 1;
    ref.current.position.y = THREE.MathUtils.lerp(0.4, 3.1, t);
    if (matRef.current) matRef.current.opacity = Math.sin(t * Math.PI) * (0.8 + b * 0.2);
  });
  return (
    <Float speed={1.1} rotationIntensity={0.18} floatIntensity={0.35}>
      <group ref={ref}>
        <mesh>
          <coneGeometry args={[0.34, 0.62, 3]} />
          <meshStandardMaterial ref={matRef} color="#F1EEE6" emissive="#E7E2D7" emissiveIntensity={0.35} roughness={0.6} transparent opacity={0} />
        </mesh>
      </group>
    </Float>
  );
}

function Breakthrough({ boost }: { boost: MutableRefObject<number> }) {
  const tex = useGlowTexture();
  const light = useRef<THREE.PointLight>(null);
  const spr = useRef<THREE.Sprite>(null);
  useFrame(({ clock }) => {
    const b = boost.current;
    if (light.current) light.current.intensity = 6 + b * 9 + Math.sin(clock.getElapsedTime() * 0.6) * 1.4;
    if (spr.current) (spr.current.material as THREE.SpriteMaterial).opacity = 0.5 + b * 0.35;
  });
  return (
    <group position={[0, 1.7, 0]}>
      <pointLight ref={light} color="#F3EEE3" intensity={6} distance={9} decay={1.6} />
      <sprite ref={spr} scale={[6, 6, 1]}>
        <spriteMaterial map={tex} transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
    </group>
  );
}

function Rig({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, pointer.x * 0.3, 0.04);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -pointer.y * 0.15, 0.04);
  });
  return <group ref={ref}>{children}</group>;
}

function Scene({ unlocked }: { unlocked: boolean }) {
  const boost = useRef(0);
  useFrame((_, dt) => {
    boost.current = THREE.MathUtils.damp(boost.current, unlocked ? 1 : 0, 2.2, dt);
  });
  return (
    <Rig>
      <FracturedBox />
      <AscendingMark boost={boost} />
      <Breakthrough boost={boost} />
    </Rig>
  );
}

export function BreakthroughScene({ unlocked = false }: { unlocked?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 1.2, 6], fov: 42 }} gl={{ antialias: true }} dpr={[1, 2]}>
      <color attach="background" args={["#1F1B16"]} />
      <fog attach="fog" args={["#1F1B16", 6, 14]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 6, 4]} intensity={0.5} color="#E7E2D7" />
      <Scene unlocked={unlocked} />
    </Canvas>
  );
}
