"use client";

/**
 * SOAR — living 3D auth entrance (R3F). Black → star → particle burst that
 * assembles into the logo → the logo extrudes into a metallic 3D object that
 * rotates while the camera drifts; cursor drives parallax + reflections; bloom.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture, RoundedBox } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import logoWhite from "@/assets/soar-logo-white.png";

const DUR = 4.0;
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const LW = 2.3;
const LH = LW * (359 / 430);

function BgStars() {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const n = 700;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 9 + Math.random() * 16;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.5;
      pos[i * 3 + 2] = r * Math.cos(ph) - 6;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  const mat = useMemo(() => new THREE.PointsMaterial({ color: "#8fa7ff", size: 0.03, transparent: true, opacity: 0.5, depthWrite: false }), []);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.01;
  });
  return <points ref={ref} geometry={geo} material={mat} />;
}

function Burst() {
  const ref = useRef<THREE.Points>(null);
  const { dir, target } = useMemo(() => {
    const n = 300;
    const dir = new Float32Array(n * 3);
    const target = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const v = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
      dir.set([v.x, v.y, v.z], i * 3);
      target.set([(Math.random() - 0.5) * LW * 1.05, (Math.random() - 0.5) * LH * 1.05, (Math.random() - 0.5) * 0.3], i * 3);
    }
    return { dir, target };
  }, []);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(dir.length), 3));
    return g;
  }, [dir]);
  const mat = useMemo(() => new THREE.PointsMaterial({ color: "#ffffff", size: 0.05, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }), []);
  const _v = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ clock }) => {
    const p = clock.elapsedTime / DUR;
    const pos = geo.attributes.position.array as Float32Array;
    const out = smooth(0.02, 0.42, p); // shoot out
    const conv = smooth(0.42, 0.86, p); // converge to logo
    const R = 5.5;
    for (let i = 0; i < pos.length; i += 3) {
      const ox = dir[i] * R * out, oy = dir[i + 1] * R * out, oz = dir[i + 2] * R * out;
      pos[i] = ox + (target[i] - ox) * conv;
      pos[i + 1] = oy + (target[i + 1] - oy) * conv;
      pos[i + 2] = oz + (target[i + 2] - oz) * conv;
    }
    geo.attributes.position.needsUpdate = true;
    mat.opacity = (smooth(0.03, 0.2, p) * (1 - smooth(0.8, 1, p))) * 0.95;
    void _v;
  });
  return <points geometry={geo} material={mat} />;
}

function StarCore() {
  const ref = useRef<THREE.Mesh>(null);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#ffffff", toneMapped: false, transparent: true }), []);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const p = t / DUR;
    const s = (0.06 + Math.abs(Math.sin(t * 3)) * 0.03) * (1 - smooth(0.18, 0.5, p));
    if (ref.current) ref.current.scale.setScalar(Math.max(0.0001, s));
    mat.opacity = 1 - smooth(0.2, 0.5, p);
  });
  return (
    <mesh ref={ref} material={mat}>
      <sphereGeometry args={[1, 20, 20]} />
    </mesh>
  );
}

function LogoObject() {
  const tex = useTexture(logoWhite.src);
  const group = useRef<THREE.Group>(null);
  const faceMat = useRef<THREE.MeshStandardMaterial>(null);
  const { pointer } = useThree();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const p = t / DUR;
    const g = group.current;
    if (!g) return;
    const s = smooth(0.55, 0.95, p);
    g.scale.set(s, s, Math.max(0.0001, smooth(0.62, 1.05, p))); // extrude depth in
    const spin = Math.max(0, p - 0.72) * 1.2 + Math.max(0, t - DUR) * 0.18;
    g.rotation.y = Math.sin(spin) * 0.5 + pointer.x * 0.4;
    g.rotation.x = -pointer.y * 0.28;
    g.position.y = Math.sin(t * 0.6) * 0.04;
    if (faceMat.current) faceMat.current.emissiveIntensity = (1.2 + Math.sin(t * 1.6) * 0.45) * smooth(0.6, 0.95, p);
  });
  return (
    <group ref={group} scale={0}>
      <RoundedBox args={[LW * 1.16, LH * 1.32, 0.42]} radius={0.1} smoothness={4}>
        <meshStandardMaterial color="#0b0b14" metalness={0.96} roughness={0.22} />
      </RoundedBox>
      <mesh position={[0, 0, 0.23]}>
        <planeGeometry args={[LW, LH]} />
        <meshStandardMaterial
          ref={faceMat}
          map={tex}
          emissive={"#ffffff"}
          emissiveMap={tex}
          emissiveIntensity={1.4}
          transparent
          alphaTest={0.04}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function CursorLight() {
  const ref = useRef<THREE.PointLight>(null);
  const { pointer } = useThree();
  useFrame(() => {
    if (ref.current) {
      ref.current.position.x += (pointer.x * 5 - ref.current.position.x) * 0.06;
      ref.current.position.y += (pointer.y * 4 - ref.current.position.y) * 0.06;
    }
  });
  return <pointLight ref={ref} position={[3, 3, 4]} intensity={55} distance={18} color="#cfe0ff" />;
}

function Rig({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, pointer.x * 0.12 + Math.sin(clock.elapsedTime * 0.12) * 0.06, 0.04);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -pointer.y * 0.06, 0.04);
  });
  return (
    <group ref={ref} position={[0, 0.85, 0]}>
      {children}
    </group>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#05060c"]} />
      <fog attach="fog" args={["#05060c", 9, 22]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[-4, 5, -3]} intensity={1.4} color="#9bb4ff" />
      <CursorLight />
      <BgStars />
      <Rig>
        <StarCore />
        <Burst />
        <LogoObject />
      </Rig>
    </>
  );
}

export function AuthScene() {
  return (
    <Canvas camera={{ position: [0, 0, 6.4], fov: 42 }} gl={{ antialias: true }} dpr={[1, 2]}>
      <Scene />
      <EffectComposer>
        <Bloom intensity={1.3} luminanceThreshold={0.6} luminanceSmoothing={0.5} mipmapBlur radius={0.85} />
      </EffectComposer>
    </Canvas>
  );
}
