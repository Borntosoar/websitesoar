"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// the S-road climbs from the foreground up toward the north star (the SOAR mark)
const CURVE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, -3.2, 15),
  new THREE.Vector3(3.4, -2.4, 8),
  new THREE.Vector3(-3.4, -1.4, 1),
  new THREE.Vector3(-2.8, -0.4, -8),
  new THREE.Vector3(2.6, 0.7, -17),
  new THREE.Vector3(0.4, 1.8, -27),
]);
const STAR = CURVE.getPointAt(1).clone().add(new THREE.Vector3(0, 1.5, -2));

function buildRoad(width: number, segments: number) {
  const pts = CURVE.getSpacedPoints(segments);
  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const up = new THREE.Vector3(0, 1, 0);
  const tan = new THREE.Vector3();
  const side = new THREE.Vector3();
  for (let i = 0; i <= segments; i++) {
    const p = pts[i];
    CURVE.getTangentAt(i / segments, tan);
    side.copy(tan).cross(up).normalize().multiplyScalar(width / 2);
    positions.push(p.x - side.x, p.y - side.y, p.z - side.z);
    positions.push(p.x + side.x, p.y + side.y, p.z + side.z);
    // brightens from near-black (foreground) toward white (the star) — light from dark
    const g = 0.04 + Math.pow(i / segments, 1.6) * 0.85;
    colors.push(g, g, g, g, g, g);
  }
  for (let i = 0; i < segments; i++) {
    const a = i * 2, b = i * 2 + 1, c = i * 2 + 2, d = i * 2 + 3;
    indices.push(a, b, c, b, d, c);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geo.setIndex(indices);
  return geo;
}

function Road() {
  const geo = useMemo(() => buildRoad(2.7, 180), []);
  return (
    <mesh geometry={geo}>
      <meshBasicMaterial vertexColors transparent opacity={0.6} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

function radialTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.18, "rgba(255,255,255,0.55)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function NorthStar({ reduce }: { reduce: boolean }) {
  const glow = useMemo(radialTexture, []);
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current || reduce) return;
    const p = 1 + Math.sin(state.clock.elapsedTime * 1.3) * 0.06;
    ref.current.scale.setScalar(p);
  });
  return (
    <group position={STAR}>
      <group ref={ref}>
        {/* soft halo */}
        <sprite scale={[5, 5, 1]}>
          <spriteMaterial map={glow} transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} />
        </sprite>
        {/* four-point sparkle, echoing the logo's star */}
        <mesh>
          <planeGeometry args={[0.13, 2.4]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <mesh>
          <planeGeometry args={[2.4, 0.13]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    </group>
  );
}

function Stars({ reduce }: { reduce: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const N = 420;
  const geo = useMemo(() => {
    const p = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      p[i * 3] = (Math.random() - 0.5) * 90;
      p[i * 3 + 1] = Math.random() * 50 - 10;
      p[i * 3 + 2] = -Math.random() * 80 - 5;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    return g;
  }, []);
  const mat = useMemo(() => new THREE.PointsMaterial({ color: "#ffffff", size: 0.09, transparent: true, opacity: 0.65, sizeAttenuation: true, depthWrite: false }), []);
  useFrame((state) => {
    if (!ref.current || reduce) return;
    ref.current.rotation.z = state.clock.elapsedTime * 0.004;
  });
  return <points ref={ref} geometry={geo} material={mat} />;
}

function Rig({ reduce }: { reduce: boolean }) {
  const { camera } = useThree();
  useFrame((state) => {
    const lx = 0,
      ly = 1.7,
      lz = -22;
    if (reduce) {
      camera.position.set(0, -1.4, 17);
      camera.lookAt(lx, ly, lz);
      return;
    }
    const t = state.clock.elapsedTime;
    const tx = Math.sin(t * 0.09) * 0.7 + state.pointer.x * 0.9;
    const ty = -1.4 + Math.sin(t * 0.12) * 0.3 - state.pointer.y * 0.4;
    camera.position.x += (tx - camera.position.x) * 0.02;
    camera.position.y += (ty - camera.position.y) * 0.02;
    camera.position.z = 17;
    camera.lookAt(lx, ly, lz);
  });
  return null;
}

export function HeroScene() {
  const reduce = useReducedMotion() ?? false;
  return (
    <Canvas
      camera={{ position: [0, -1.4, 17], fov: 56 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      frameloop={reduce ? "demand" : "always"}
    >
      <color attach="background" args={["#0b0a09"]} />
      <fogExp2 attach="fog" args={["#0b0a09", 0.022]} />
      <Stars reduce={reduce} />
      <Road />
      <NorthStar reduce={reduce} />
      <Rig reduce={reduce} />
    </Canvas>
  );
}
