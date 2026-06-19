"use client";

/**
 * SOAR — Entrance background: the road to the monument. A wide, premium,
 * futuristic road stretches to the horizon under a faint starfield; white neon
 * edges and scrolling lane dashes pull you forward. The SOAR logo stands as a
 * monument above the far horizon. On unlock the journey accelerates and the
 * monument rushes the camera. Monochrome, cinematic. (Gate/flow unchanged.)
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { EffectComposer, Bloom as BloomEffect } from "@react-three/postprocessing";
import { useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import logoWhite from "@/assets/soar-logo-white.png";

const easeIn = (t: number) => t * t;
const ROAD_W = 14;
const FAR = -220;
const NEAR = 18;
const LOGO_FAR = -150;

function Road() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, (FAR + NEAR) / 2]}>
        <planeGeometry args={[ROAD_W, NEAR - FAR]} />
        <meshStandardMaterial color="#0a0a0e" roughness={0.32} metalness={0.6} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} rotation={[-Math.PI / 2, 0, 0]} position={[(s * ROAD_W) / 2, 0.02, (FAR + NEAR) / 2]}>
          <planeGeometry args={[0.12, NEAR - FAR]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
      ))}
      {/* soft inner guide lines */}
      {[-0.34, 0.34].map((s) => (
        <mesh key={s} rotation={[-Math.PI / 2, 0, 0]} position={[s * ROAD_W, 0.015, (FAR + NEAR) / 2]}>
          <planeGeometry args={[0.05, NEAR - FAR]} />
          <meshBasicMaterial color="#9fb0ff" transparent opacity={0.35} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function Dashes({ boost }: { boost: MutableRefObject<number> }) {
  const N = 30;
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const zs = useMemo(() => Array.from({ length: N }, (_, i) => NEAR - (i * (NEAR - FAR)) / N), []);
  const geo = useMemo(() => new THREE.PlaneGeometry(0.24, 3.4), []);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#ffffff", toneMapped: false }), []);
  useFrame((_, dt) => {
    const inst = ref.current;
    if (!inst) return;
    const sp = Math.min(0.05, dt) * (16 + easeIn(boost.current) * 130);
    for (let i = 0; i < N; i++) {
      zs[i] += sp;
      if (zs[i] > NEAR) zs[i] = FAR + (zs[i] - NEAR);
      dummy.position.set(0, 0.03, zs[i]);
      dummy.rotation.set(-Math.PI / 2, 0, 0);
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
    }
    inst.instanceMatrix.needsUpdate = true;
  });
  return <instancedMesh ref={ref} args={[geo, mat, N]} />;
}

function Monument({ boost }: { boost: MutableRefObject<number> }) {
  const tex = useTexture(logoWhite.src);
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const f = easeIn(boost.current);
    if (ref.current) {
      ref.current.position.z = LOGO_FAR + f * (12 - LOGO_FAR); // rush toward the camera
      ref.current.position.y = 7.5 - f * 5.8 + Math.sin(clock.elapsedTime * 0.5) * 0.1;
    }
  });
  return (
    <mesh ref={ref} position={[0, 7.5, LOGO_FAR]}>
      <planeGeometry args={[19, (19 * 359) / 430]} />
      <meshBasicMaterial map={tex} transparent toneMapped={false} alphaTest={0.03} />
    </mesh>
  );
}

function Sky() {
  const geo = useMemo(() => {
    const n = 1100;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 160;
      pos[i * 3 + 1] = Math.random() * 50 + 3;
      pos[i * 3 + 2] = -Math.random() * 220 + 10;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  const mat = useMemo(() => new THREE.PointsMaterial({ color: "#ffffff", size: 0.12, sizeAttenuation: true, transparent: true, opacity: 0.7, depthWrite: false }), []);
  return <points geometry={geo} material={mat} />;
}

function Motes({ boost }: { boost: MutableRefObject<number> }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const n = 90;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = Math.random() * 6;
      pos[i * 3 + 2] = -Math.random() * 60 + 12;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  const mat = useMemo(() => new THREE.PointsMaterial({ color: "#cdd6ff", size: 0.05, transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending }), []);
  useFrame((_, dt) => {
    const pos = geo.attributes.position.array as Float32Array;
    const sp = Math.min(0.05, dt) * (6 + easeIn(boost.current) * 60);
    for (let i = 0; i < pos.length; i += 3) {
      pos[i + 2] += sp;
      if (pos[i + 2] > 14) pos[i + 2] = -60;
    }
    geo.attributes.position.needsUpdate = true;
  });
  return <points ref={ref} geometry={geo} material={mat} />;
}

function Rig() {
  const { camera, pointer } = useThree();
  useFrame(() => {
    camera.position.x += (pointer.x * 0.9 - camera.position.x) * 0.04;
    camera.position.y += (1.3 - pointer.y * 0.4 - camera.position.y) * 0.04;
    camera.lookAt(pointer.x * 0.6, 4 - pointer.y * 0.4, -80);
  });
  return null;
}

function Scene({ unlocked }: { unlocked: boolean }) {
  const boost = useRef(0);
  useFrame((_, dt) => {
    boost.current = THREE.MathUtils.damp(boost.current, unlocked ? 1 : 0, 1.0, dt);
  });
  return (
    <>
      <color attach="background" args={["#040407"]} />
      <fog attach="fog" args={["#040407", 30, 150]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[0, 8, 6]} intensity={0.7} color="#aeb8ff" />
      <Sky />
      <Road />
      <Dashes boost={boost} />
      <Motes boost={boost} />
      <Monument boost={boost} />
      <Rig />
    </>
  );
}

export function BreakthroughScene({ unlocked = false }: { unlocked?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 1.3, 9], fov: 62 }} gl={{ antialias: true }} dpr={[1, 2]}>
      <Scene unlocked={unlocked} />
      <EffectComposer>
        <BloomEffect intensity={1.35} luminanceThreshold={0.55} luminanceSmoothing={0.5} mipmapBlur radius={0.82} />
      </EffectComposer>
    </Canvas>
  );
}
