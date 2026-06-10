"use client";

/**
 * SOAR — Breakthrough Hero
 * --------------------------------------------------------------------------
 * An on-brand adaptation of a 3D hero, rebuilt to the SOAR brand bible
 * (see the `soar-brand` skill). The original reference was a neon WebGPU
 * "cyberpunk" hero; that fails the SOAR Brand Test (loud / flashy / excessive
 * colour). This version keeps the *idea* — a cinematic 3D moment — but renders
 * the core brand symbol instead: a FRACTURED BOX (limitation) with an ASCENDING
 * MARK breaking upward into warm light — "breakthrough, not flight", light
 * emerging from darkness. Standard WebGL (no WebGPU), muted espresso/bone,
 * quiet motion. prefers-reduced-motion friendly.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Edges } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";

/* Soft warm radial sprite = the light emerging from darkness. */
function useGlowTexture() {
  return useMemo(() => {
    const size = 128;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );
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

/* The fractured box — the invisible limitation, under tension. */
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
        <meshStandardMaterial
          color="#2A251F"
          roughness={1}
          metalness={0}
          transparent
          opacity={0.35}
        />
        <Edges threshold={15} color={edge} />
      </mesh>
      {/* a displaced fragment — the crack opening at the top */}
      <mesh position={[0.5, 1.05, -0.35]} rotation={[0.5, 0.4, 0.3]}>
        <boxGeometry args={[0.7, 0.05, 0.7]} />
        <meshStandardMaterial color="#2A251F" transparent opacity={0.4} />
        <Edges threshold={15} color={edge} />
      </mesh>
    </group>
  );
}

/* The ascending mark — the SOAR triangle breaking upward, fading as it frees. */
function AscendingMark() {
  const ref = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = (clock.getElapsedTime() * 0.16) % 1; // slow ascent loop
    ref.current.position.y = THREE.MathUtils.lerp(0.4, 3.1, t);
    if (matRef.current) matRef.current.opacity = Math.sin(t * Math.PI);
  });
  return (
    <Float speed={1.1} rotationIntensity={0.18} floatIntensity={0.35}>
      <group ref={ref}>
        <mesh>
          {/* 3 radial segments = a triangular mark (the SOAR logo form) */}
          <coneGeometry args={[0.34, 0.62, 3]} />
          <meshStandardMaterial
            ref={matRef}
            color="#F1EEE6"
            emissive="#E7E2D7"
            emissiveIntensity={0.35}
            roughness={0.6}
            transparent
            opacity={0}
          />
        </mesh>
      </group>
    </Float>
  );
}

/* Warm point light + additive bloom sprite at the breakthrough. */
function Breakthrough() {
  const tex = useGlowTexture();
  const light = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    if (light.current)
      light.current.intensity = 6 + Math.sin(clock.getElapsedTime() * 0.6) * 1.4;
  });
  return (
    <group position={[0, 1.7, 0]}>
      <pointLight ref={light} color="#F3EEE3" intensity={6} distance={9} decay={1.6} />
      <sprite scale={[6, 6, 1]}>
        <spriteMaterial
          map={tex}
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  );
}

/* Gentle pointer parallax. */
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

export default function HeroBreakthrough() {
  const titleWords = useMemo(
    () => "Growth begins where comfort ends".split(" "),
    [],
  );
  const subtitle = "Premium essentials, released in limited drops.";
  const [visibleWords, setVisibleWords] = useState(0);
  const [subtitleVisible, setSubtitleVisible] = useState(false);

  useEffect(() => {
    if (visibleWords < titleWords.length) {
      const id = setTimeout(() => setVisibleWords((v) => v + 1), 360);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setSubtitleVisible(true), 500);
    return () => clearTimeout(id);
  }, [visibleWords, titleWords.length]);

  return (
    <div className="relative h-svh w-full overflow-hidden bg-espresso">
      {/* Copy overlay */}
      <div className="pointer-events-none absolute inset-0 z-40 flex flex-col items-center justify-center px-8 text-center">
        <h1 className="flex flex-wrap justify-center gap-x-3 text-4xl font-medium tracking-tight text-bone md:text-6xl xl:text-7xl">
          {titleWords.map((word, i) => (
            <span
              key={i}
              className={i < visibleWords ? "fade-in" : "opacity-0"}
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              {word === "ends" ? (
                <em className="font-serif font-normal italic">ends.</em>
              ) : (
                word
              )}
            </span>
          ))}
        </h1>
        <p
          className={`mt-5 max-w-md text-sm text-bone/60 md:text-base ${
            subtitleVisible ? "fade-in-subtitle" : "opacity-0"
          }`}
        >
          {subtitle}
        </p>
      </div>

      <button className="explore-btn" type="button">
        Shop the drop
        <span className="explore-arrow">
          <svg
            width="20"
            height="20"
            viewBox="0 0 22 22"
            fill="none"
            className="arrow-svg"
            aria-hidden="true"
          >
            <path d="M11 5V17" stroke="#E7E2D7" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M6 12L11 17L16 12" stroke="#E7E2D7" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      <Canvas camera={{ position: [0, 1.2, 6], fov: 42 }} gl={{ antialias: true }} dpr={[1, 2]}>
        <color attach="background" args={["#1F1B16"]} />
        <fog attach="fog" args={["#1F1B16", 6, 14]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 6, 4]} intensity={0.5} color="#E7E2D7" />
        <Rig>
          <FracturedBox />
          <AscendingMark />
          <Breakthrough />
        </Rig>
      </Canvas>
    </div>
  );
}
