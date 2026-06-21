"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export type AscentMode = "idle" | "travel" | "arrived" | "leave";

// the road traces an S as it climbs toward the monument + stars (the logo)
const CURVE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0.0, -2.4, 15),
  new THREE.Vector3(3.4, -1.7, 7),
  new THREE.Vector3(-3.6, -0.6, -3),
  new THREE.Vector3(-3.2, 0.8, -14),
  new THREE.Vector3(2.8, 2.0, -24),
  new THREE.Vector3(3.0, 3.2, -34),
  new THREE.Vector3(0.0, 4.4, -45),
]);
const U: Record<AscentMode, number> = { idle: 0.03, travel: 0.8, arrived: 0.86, leave: 0.99 };
const LIFT: Record<AscentMode, number> = { idle: 0, travel: 0, arrived: 1, leave: 0.25 };

function buildRoad(width: number, segments: number) {
  const pts = CURVE.getSpacedPoints(segments);
  const positions: number[] = [];
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
  }
  for (let i = 0; i < segments; i++) {
    const a = i * 2, b = i * 2 + 1, c = i * 2 + 2, d = i * 2 + 3;
    indices.push(a, b, c, b, d, c);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}

function Road() {
  const geo = useMemo(() => buildRoad(4.8, 200), []);
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial color="#14151b" emissive="#2b3360" emissiveIntensity={0.55} roughness={0.85} metalness={0.2} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Monument() {
  const end = useMemo(() => CURVE.getPointAt(1), []);
  return (
    <group position={[end.x, end.y, end.z - 2]}>
      {[-3, 3].map((x, i) => (
        <mesh key={i} position={[x, 6, 0]}>
          <boxGeometry args={[1.2, 14, 1.2]} />
          <meshStandardMaterial color="#0e0f14" emissive="#aab4e0" emissiveIntensity={0.7} />
        </mesh>
      ))}
      <mesh position={[0, 13.2, 0]}>
        <boxGeometry args={[8.4, 1.4, 1.4]} />
        <meshStandardMaterial color="#0e0f14" emissive="#aab4e0" emissiveIntensity={0.7} />
      </mesh>
    </group>
  );
}

function Stars() {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const n = 1400;
    const p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      p[i * 3] = (Math.random() - 0.5) * 100;
      p[i * 3 + 1] = Math.random() * 64 - 6;
      p[i * 3 + 2] = -Math.random() * 130 - 8;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    return g;
  }, []);
  const mat = useMemo(() => new THREE.PointsMaterial({ color: "#ffffff", size: 0.08, transparent: true, opacity: 0.7, sizeAttenuation: true, depthWrite: false }), []);
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.z = clock.elapsedTime * 0.006; });
  return <points ref={ref} geometry={geo} material={mat} />;
}

function Rig({ mode }: { mode: AscentMode }) {
  const { camera, pointer } = useThree();
  const mid = useMemo(() => CURVE.getPointAt(0.5), []);
  const u = useRef(0.03);
  const lift = useRef(0);
  const p = useMemo(() => new THREE.Vector3(), []);
  const ahead = useMemo(() => new THREE.Vector3(), []);
  const onRoad = useMemo(() => new THREE.Vector3(), []);
  const over = useMemo(() => new THREE.Vector3(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  useFrame((_, dt) => {
    const ku = Math.min(1, (mode === "leave" ? 0.05 : 0.02) * dt * 60);
    u.current += (U[mode] - u.current) * ku;
    lift.current += (LIFT[mode] - lift.current) * Math.min(1, 0.03 * dt * 60);
    const uu = Math.min(0.985, u.current);
    CURVE.getPointAt(uu, p);
    CURVE.getPointAt(Math.min(0.999, uu + 0.05), ahead);
    onRoad.set(p.x - pointer.x * 0.5, p.y + 0.55 - pointer.y * 0.25, p.z + 1.7);
    over.set(mid.x, mid.y + 34, mid.z + 8);
    target.copy(onRoad).lerp(over, lift.current);
    camera.position.lerp(target, 0.1);
    look.copy(ahead).lerp(mid, lift.current);
    camera.lookAt(look);
  });
  return null;
}

export function AscentScene({ mode, lite }: { mode: AscentMode; lite: boolean }) {
  return (
    <Canvas camera={{ position: [0, -1.5, 16], fov: 62 }} dpr={lite ? [1, 1.5] : [1, 2]} gl={{ antialias: !lite }}>
      <color attach="background" args={["#050507"]} />
      <fog attach="fog" args={["#050507", 22, 82]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 7, 5]} intensity={1.0} color="#eef1f6" />
      <Stars />
      <Road />
      <Monument />
      <Rig mode={mode} />
    </Canvas>
  );
}
