"use client";

/**
 * SOAR — Entrance Scene (R3F, WebGL + bloom).
 * Locked: the box trembles from inside. Unlock (`unlocked` -> damped boost):
 * the lid blows off and a BIRD soars up and OUT of the box, wings beating,
 * with a burst of sparks — colour cycling amber<->electric.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import { EffectComposer, Bloom as BloomEffect } from "@react-three/postprocessing";
import { useMemo, useRef, type MutableRefObject, type ReactNode } from "react";
import * as THREE from "three";

const BONE = "#E7E2D7";

function useGlowTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(243,238,227,0.95)");
    g.addColorStop(0.4, "rgba(230,197,102,0.25)");
    g.addColorStop(1, "rgba(230,197,102,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

function wingGeometry(sign: number) {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0, sign * 1.25, 0.06, -0.12, sign * 0.34, 0, -0.74], 3));
  g.setIndex([0, 1, 2]);
  g.computeVertexNormals();
  return g;
}

const easeOut = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

function PressureBox({ boost }: { boost: MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const lid = useRef<THREE.Group>(null);
  const inner = useRef<THREE.PointLight>(null);
  useFrame(({ clock }, dt) => {
    const t = clock.getElapsedTime();
    const b = boost.current;
    const f = easeOut(b);
    const locked = 1 - Math.min(1, b * 1.4);
    if (group.current) {
      group.current.rotation.y += dt * 0.1;
      const s = 0.014 * locked;
      group.current.position.x = Math.sin(t * 33) * s + Math.sin(t * 19) * s * 0.6;
      group.current.position.z = Math.cos(t * 27) * s;
    }
    if (shell.current) shell.current.scale.setScalar(1 + (0.02 + 0.015 * Math.max(0, Math.sin(t * 7))) * locked);
    if (lid.current) {
      lid.current.position.y = 0.88 + Math.abs(Math.sin(t * 14)) * 0.02 * locked + f * 1.6;
      lid.current.position.x = f * 1.3;
      lid.current.rotation.z = -f * 1.1;
      lid.current.rotation.x = f * 0.5;
    }
    if (inner.current) {
      const mix = 0.5 + 0.5 * Math.sin(t * 0.7);
      inner.current.color.setHSL(0.13 + (0.62 - 0.13) * mix, 0.85, 0.55);
      inner.current.intensity = (1.8 + Math.sin(t * 9) * 0.9) * locked + 9 * f;
    }
  });
  return (
    <group ref={group}>
      <mesh ref={shell}>
        <boxGeometry args={[1.7, 1.7, 1.7]} />
        <meshStandardMaterial color="#2A251F" roughness={1} transparent opacity={0.32} />
        <Edges threshold={15} color={BONE} />
      </mesh>
      <group ref={lid} position={[0, 0.88, 0]}>
        <mesh>
          <boxGeometry args={[1.72, 0.06, 1.72]} />
          <meshStandardMaterial color="#2A251F" transparent opacity={0.4} />
          <Edges threshold={15} color={BONE} />
        </mesh>
      </group>
      <pointLight ref={inner} color="#E6C566" intensity={1.8} distance={6} decay={1.8} />
    </group>
  );
}

function Bird({ boost }: { boost: MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const lw = useRef<THREE.Mesh>(null);
  const rw = useRef<THREE.Mesh>(null);
  const lGeo = useMemo(() => wingGeometry(1), []);
  const rGeo = useMemo(() => wingGeometry(-1), []);
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#F1EEE6", emissive: "#E6C566", emissiveIntensity: 0.6, roughness: 0.5, side: THREE.DoubleSide, transparent: true }),
    [],
  );
  useFrame(({ clock }) => {
    const b = boost.current;
    const f = easeOut(b);
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.scale.setScalar(Math.min(1.1, b * 5));
      group.current.position.set(0, -0.1 + f * 9.2, f * 0.6);
      group.current.rotation.x = -0.35 - f * 0.2;
      group.current.rotation.y = Math.sin(t * 1.5) * 0.15;
    }
    const flap = Math.sin(t * 16) * (0.5 + 0.4 * b);
    if (lw.current) lw.current.rotation.z = flap;
    if (rw.current) rw.current.rotation.z = -flap;
    const mix = 0.5 + 0.5 * Math.sin(t * 0.7);
    mat.emissive.setHSL(0.13 + (0.62 - 0.13) * mix, 0.85, 0.55);
    mat.opacity = b > 0.85 ? Math.max(0, 1 - (b - 0.85) / 0.15) : 1;
  });
  return (
    <group ref={group} scale={0} position={[0, -0.1, 0]}>
      <mesh ref={lw} geometry={lGeo} material={mat} />
      <mesh ref={rw} geometry={rGeo} material={mat} />
      <mesh position={[0, 0, -0.18]} rotation={[Math.PI, 0, 0]} material={mat}>
        <coneGeometry args={[0.12, 0.7, 6]} />
      </mesh>
    </group>
  );
}

function Sparks({ boost }: { boost: MutableRefObject<number> }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const seeds = useMemo(
    () => Array.from({ length: 24 }, () => ({ dx: (Math.random() - 0.5) * 2.2, dz: (Math.random() - 0.5) * 2.2, dy: 2 + Math.random() * 3, phase: Math.random() })),
    [],
  );
  useFrame(({ clock }) => {
    const b = boost.current;
    const t = clock.getElapsedTime();
    seeds.forEach((s, i) => {
      const m = refs.current[i];
      if (!m) return;
      const p = Math.min(1, Math.max(0, b * 1.3 - s.phase * 0.3));
      m.position.set(s.dx * p, 0.1 + s.dy * p - p * p * 1.2, s.dz * p);
      const mm = m.material as THREE.MeshBasicMaterial;
      const mix = 0.5 + 0.5 * Math.sin(t * 0.7);
      mm.color.setHSL(0.13 + (0.62 - 0.13) * mix, 0.85, 0.55);
      mm.opacity = p > 0 && p < 1 ? Math.sin(p * Math.PI) * 0.9 : 0;
    });
  });
  return (
    <group>
      {seeds.map((_, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el; }}>
          <sphereGeometry args={[0.035, 6, 6]} />
          <meshBasicMaterial color="#E6C566" transparent opacity={0} />
        </mesh>
      ))}
    </group>
  );
}

function Bloom({ boost }: { boost: MutableRefObject<number> }) {
  const tex = useGlowTexture();
  const light = useRef<THREE.PointLight>(null);
  const spr = useRef<THREE.Sprite>(null);
  useFrame(({ clock }) => {
    const b = boost.current;
    if (light.current) light.current.intensity = 4 + b * 12 + Math.sin(clock.getElapsedTime() * 0.6) * 1.2;
    if (spr.current) (spr.current.material as THREE.SpriteMaterial).opacity = 0.3 + b * 0.5;
  });
  return (
    <group position={[0, 1.4, 0]}>
      <pointLight ref={light} color="#F3EEE3" intensity={4} distance={10} decay={1.6} />
      <sprite ref={spr} scale={[6.5, 6.5, 1]}>
        <spriteMaterial map={tex} transparent opacity={0.3} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
    </group>
  );
}

function Rig({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, pointer.x * 0.26, 0.04);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -pointer.y * 0.13, 0.04);
  });
  return <group ref={ref}>{children}</group>;
}

function Scene({ unlocked }: { unlocked: boolean }) {
  const boost = useRef(0);
  useFrame((_, dt) => {
    boost.current = THREE.MathUtils.damp(boost.current, unlocked ? 1 : 0, 1.6, dt);
  });
  return (
    <Rig>
      <gridHelper args={[16, 32, "#3A332A", "#2A251F"]} position={[0, -0.9, 0]} />
      <PressureBox boost={boost} />
      <Bird boost={boost} />
      <Sparks boost={boost} />
      <Bloom boost={boost} />
    </Rig>
  );
}

export function BreakthroughScene({ unlocked = false }: { unlocked?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 1.4, 6.4], fov: 42 }} gl={{ antialias: true }} dpr={[1, 2]}>
      <color attach="background" args={["#1F1B16"]} />
      <fog attach="fog" args={["#1F1B16", 7, 16]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 6, 4]} intensity={0.45} color={BONE} />
      <Scene unlocked={unlocked} />
      <EffectComposer>
        <BloomEffect intensity={1.1} luminanceThreshold={0.15} luminanceSmoothing={0.5} mipmapBlur radius={0.85} />
      </EffectComposer>
    </Canvas>
  );
}
