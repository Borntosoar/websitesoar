"use client";

/**
 * SOAR — Entrance: "the road to the stars" (R3F). A glowing S-curved road (the
 * logo's swoosh) rises through a starfield toward a bright star. Idle: you sit at
 * the road's start, looking up it. On unlock you travel up the road, accelerating
 * toward the star — then the white light floods in. Monochrome.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom as BloomEffect } from "@react-three/postprocessing";
import { useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";

const easeIn = (t: number) => t * t;

// S-curved road that swooshes up toward the star (echoes the logo mark).
const CURVE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, -1.4, 12),
  new THREE.Vector3(-1.5, -0.9, 3),
  new THREE.Vector3(1.2, -0.1, -7),
  new THREE.Vector3(-0.7, 1.1, -19),
  new THREE.Vector3(0.4, 2.5, -33),
  new THREE.Vector3(0, 3.6, -49),
]);
const STAR = new THREE.Vector3(0, 4.1, -54);

function Road() {
  const core = useMemo(() => new THREE.TubeGeometry(CURVE, 180, 0.045, 8, false), []);
  const halo = useMemo(() => new THREE.TubeGeometry(CURVE, 180, 0.17, 8, false), []);
  return (
    <group>
      <mesh geometry={halo}>
        <meshBasicMaterial color="#aab8ff" transparent opacity={0.12} toneMapped={false} />
      </mesh>
      <mesh geometry={core}>
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
    </group>
  );
}

function Flow({ boost }: { boost: MutableRefObject<number> }) {
  const N = 90;
  const params = useMemo(() => Array.from({ length: N }, (_, i) => i / N), []);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    return g;
  }, []);
  const mat = useMemo(
    () => new THREE.PointsMaterial({ color: "#ffffff", size: 0.1, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending }),
    [],
  );
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame((_, dt) => {
    const pos = geo.attributes.position.array as Float32Array;
    const speed = Math.min(0.05, dt) * (0.06 + easeIn(boost.current) * 0.6);
    for (let i = 0; i < N; i++) {
      params[i] = (params[i] + speed) % 1;
      CURVE.getPointAt(params[i], v);
      pos[i * 3] = v.x;
      pos[i * 3 + 1] = v.y;
      pos[i * 3 + 2] = v.z;
    }
    geo.attributes.position.needsUpdate = true;
  });
  return <points geometry={geo} material={mat} />;
}

function Star({ boost }: { boost: MutableRefObject<number> }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.scale.setScalar(0.5 + Math.sin(clock.elapsedTime * 2) * 0.08 + easeIn(boost.current) * 0.8);
  });
  return (
    <mesh ref={ref} position={STAR}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshBasicMaterial color="#ffffff" toneMapped={false} />
    </mesh>
  );
}

function Field() {
  const geo = useMemo(() => {
    const n = 1400;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 64;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 42 + 2;
      pos[i * 3 + 2] = -Math.random() * 82 + 12;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  const mat = useMemo(() => new THREE.PointsMaterial({ color: "#ffffff", size: 0.06, transparent: true, opacity: 0.8, depthWrite: false }), []);
  const ref = useRef<THREE.Points>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.elapsedTime * 0.005;
  });
  return <points ref={ref} geometry={geo} material={mat} />;
}

function Rig({ boost }: { boost: MutableRefObject<number> }) {
  const { camera, pointer } = useThree();
  const p = useMemo(() => new THREE.Vector3(), []);
  const ahead = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    const f = easeIn(boost.current);
    const t = Math.min(0.985, 0.015 + f * 0.95);
    CURVE.getPointAt(t, p);
    CURVE.getPointAt(Math.min(0.999, t + 0.03), ahead);
    target.set(p.x + pointer.x * 0.7, p.y + 0.55 - pointer.y * 0.35, p.z + 1.5);
    camera.position.lerp(target, 0.1);
    look.copy(ahead).lerp(STAR, f);
    camera.lookAt(look);
  });
  return null;
}

function Scene({ unlocked }: { unlocked: boolean }) {
  const boost = useRef(0);
  useFrame((_, dt) => {
    boost.current = THREE.MathUtils.damp(boost.current, unlocked ? 1 : 0, 0.9, dt);
  });
  return (
    <>
      <color attach="background" args={["#04050a"]} />
      <fog attach="fog" args={["#04050a", 14, 62]} />
      <Field />
      <Road />
      <Flow boost={boost} />
      <Star boost={boost} />
      <Rig boost={boost} />
    </>
  );
}

export function BreakthroughScene({ unlocked = false }: { unlocked?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 13], fov: 58 }} gl={{ antialias: true }} dpr={[1, 2]}>
      <Scene unlocked={unlocked} />
      <EffectComposer>
        <BloomEffect intensity={1.5} luminanceThreshold={0.5} luminanceSmoothing={0.5} mipmapBlur radius={0.8} />
      </EffectComposer>
    </Canvas>
  );
}
