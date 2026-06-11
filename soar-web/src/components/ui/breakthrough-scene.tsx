"use client";

/**
 * SOAR — Entrance Scene (R3F, standard WebGL).
 * LOCKED: the box trembles from INSIDE — walls pulse outward, interior light
 * strains against the seams, a high-tech scanner ring sweeps the box on a grid
 * floor. Something in there wants out.
 * UNLOCKED (`unlocked` -> damped boost 0..1): the lid fragment blows off and a
 * stream of glowing arrows RUSHES out of the top while the light blooms.
 * Amber-on-espresso — vibrant, but still "light emerging from darkness".
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import { useMemo, useRef, type MutableRefObject, type ReactNode } from "react";
import * as THREE from "three";

const BONE = "#E7E2D7";
const AMBER = "#E6C566";

function useGlowTexture() {
  return useMemo(() => {
    const size = 128;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(243,238,227,0.95)");
    g.addColorStop(0.4, "rgba(230,197,102,0.25)");
    g.addColorStop(1, "rgba(230,197,102,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

/* The box — trembling from the inside while locked; lid blows off on unlock. */
function PressureBox({ boost }: { boost: MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const lid = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.PointLight>(null);

  useFrame(({ clock }, dt) => {
    const t = clock.getElapsedTime();
    const b = boost.current;
    const locked = 1 - b;

    if (group.current) {
      group.current.rotation.y += dt * 0.1;
      // vibration: tiny high-frequency shake, strongest while locked
      const s = 0.012 * locked;
      group.current.position.x = Math.sin(t * 31) * s + Math.sin(t * 17) * s * 0.6;
      group.current.position.z = Math.cos(t * 27) * s;
    }
    if (shell.current) {
      // walls bulge outward in pulses — pressure from inside
      const bulge = 1 + (0.02 + 0.015 * Math.max(0, Math.sin(t * 7))) * locked;
      shell.current.scale.setScalar(bulge);
    }
    if (lid.current) {
      // locked: lid rattles. unlocked: blown off and aside.
      lid.current.position.y = 0.83 + Math.abs(Math.sin(t * 14)) * 0.025 * locked + b * 1.15;
      lid.current.position.x = b * 0.9;
      lid.current.rotation.z = -b * 0.9 + Math.sin(t * 14) * 0.01 * locked;
      lid.current.rotation.x = b * 0.4;
      const m = lid.current.material as THREE.MeshStandardMaterial;
      m.opacity = 0.4 * (1 - b * 0.55);
    }
    if (inner.current) {
      // interior light strains at the seams, then floods on unlock
      inner.current.intensity = (1.6 + Math.sin(t * 9) * 0.9 + Math.sin(t * 23) * 0.4) * locked + 10 * b;
    }
  });

  return (
    <group ref={group}>
      <mesh ref={shell}>
        <boxGeometry args={[1.6, 1.6, 1.6]} />
        <meshStandardMaterial color="#2A251F" roughness={1} transparent opacity={0.32} />
        <Edges threshold={15} color={BONE} />
      </mesh>
      {/* lid */}
      <mesh ref={lid} position={[0, 0.83, 0]}>
        <boxGeometry args={[1.62, 0.06, 1.62]} />
        <meshStandardMaterial color="#2A251F" transparent opacity={0.4} />
        <Edges threshold={15} color={BONE} />
      </mesh>
      {/* the pressure inside */}
      <pointLight ref={inner} color={AMBER} intensity={1.6} distance={5} decay={1.8} />
    </group>
  );
}

/* High-tech: a scanner ring sweeping the box + a faint grid floor. */
function Scanner({ boost }: { boost: MutableRefObject<number> }) {
  const ring = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ring.current) {
      ring.current.position.y = -0.8 + ((t * 0.55) % 2.4);
      const m = ring.current.material as THREE.MeshBasicMaterial;
      m.opacity = (0.4 - Math.abs(ring.current.position.y - 0.2) * 0.18) * (1 - boost.current * 0.6);
      ring.current.rotation.z = t * 0.4;
    }
  });
  return (
    <>
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.55, 0.012, 8, 64]} />
        <meshBasicMaterial color={AMBER} transparent opacity={0.35} />
      </mesh>
      <gridHelper args={[14, 28, "#3A332A", "#2A251F"]} position={[0, -0.82, 0]} />
    </>
  );
}

/* The burst: arrows rushing out of the top once unlocked. */
const ARROWS = 26;
function ArrowBurst({ boost }: { boost: MutableRefObject<number> }) {
  const refs = useRef<(THREE.Group | null)[]>([]);
  const seeds = useMemo(
    () =>
      Array.from({ length: ARROWS }, (_, i) => ({
        speed: 1.6 + (i % 5) * 0.55 + Math.random() * 0.7,
        phase: Math.random() * 4,
        dx: (Math.random() - 0.5) * 1.1,
        dz: (Math.random() - 0.5) * 1.1,
        drift: (Math.random() - 0.5) * 0.35,
        scale: 0.55 + Math.random() * 0.65,
      })),
    [],
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const b = boost.current;
    seeds.forEach((s, i) => {
      const g = refs.current[i];
      if (!g) return;
      // each arrow loops up from inside the box; visible only as boost rises
      const cycle = 4 / s.speed;
      const p = ((t + s.phase) % cycle) / cycle; // 0..1
      const y = 0.2 + p * 5.2;
      g.position.set(s.dx + s.drift * p * 3, y, s.dz);
      g.scale.setScalar(s.scale * (0.7 + b * 0.5));
      const mat = (g.children[0] as THREE.Mesh).material as THREE.MeshStandardMaterial;
      mat.opacity = b * Math.sin(p * Math.PI) * 0.95;
      mat.emissiveIntensity = 0.6 + b * 1.6;
    });
  });

  return (
    <group>
      {seeds.map((_, i) => (
        <group
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          position={[0, -2, 0]}
        >
          <mesh>
            <coneGeometry args={[0.09, 0.34, 4]} />
            <meshStandardMaterial color={BONE} emissive={AMBER} emissiveIntensity={0.6} transparent opacity={0} depthWrite={false} />
          </mesh>
          {/* tail */}
          <mesh position={[0, -0.28, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.3, 4]} />
            <meshBasicMaterial color={AMBER} transparent opacity={0.35} depthWrite={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* The breakthrough light above the box. */
function Bloom({ boost }: { boost: MutableRefObject<number> }) {
  const tex = useGlowTexture();
  const light = useRef<THREE.PointLight>(null);
  const spr = useRef<THREE.Sprite>(null);
  useFrame(({ clock }) => {
    const b = boost.current;
    if (light.current) light.current.intensity = 4 + b * 12 + Math.sin(clock.getElapsedTime() * 0.6) * 1.2;
    if (spr.current) (spr.current.material as THREE.SpriteMaterial).opacity = 0.35 + b * 0.5;
  });
  return (
    <group position={[0, 2.1, 0]}>
      <pointLight ref={light} color="#F3EEE3" intensity={4} distance={10} decay={1.6} />
      <sprite ref={spr} scale={[6.5, 6.5, 1]}>
        <spriteMaterial map={tex} transparent opacity={0.35} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
    </group>
  );
}

function Rig({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, pointer.x * 0.28, 0.04);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -pointer.y * 0.14, 0.04);
  });
  return <group ref={ref}>{children}</group>;
}

function Scene({ unlocked }: { unlocked: boolean }) {
  const boost = useRef(0);
  useFrame((_, dt) => {
    boost.current = THREE.MathUtils.damp(boost.current, unlocked ? 1 : 0, 2.4, dt);
  });
  return (
    <Rig>
      <PressureBox boost={boost} />
      <Scanner boost={boost} />
      <ArrowBurst boost={boost} />
      <Bloom boost={boost} />
    </Rig>
  );
}

export function BreakthroughScene({ unlocked = false }: { unlocked?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 1.3, 6.2], fov: 42 }} gl={{ antialias: true }} dpr={[1, 2]}>
      <color attach="background" args={["#1F1B16"]} />
      <fog attach="fog" args={["#1F1B16", 6.5, 15]} />
      <ambientLight intensity={0.32} />
      <directionalLight position={[3, 6, 4]} intensity={0.45} color={BONE} />
      <Scene unlocked={unlocked} />
    </Canvas>
  );
}
