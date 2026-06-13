"use client";

/**
 * THE BOX — in-page cinematic (react-three-fiber). Auto-plays on its own clock
 * like a looping film: the black pixel-box breathes and shakes, white pressure
 * builds and shines through the gaps, the breakthrough floods white, a bird
 * flies up — then the white recedes and the box re-forms. No scroll required.
 * Reports the active "chapter" word so the overlay stays in sync. Black & white.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom as BloomEffect } from "@react-three/postprocessing";
import { useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";

export const LOOP = 15; // seconds per cycle
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/* ---- pixel-shell box positions ---- */
function usePixels(size = 1.6, grid = 7) {
  return useMemo(() => {
    const cells: { pos: THREE.Vector3; nor: THREE.Vector3; rand: number }[] = [];
    const half = size / 2;
    const step = size / grid;
    const start = -half + step / 2;
    const faces = [
      { n: new THREE.Vector3(0, 0, 1), u: new THREE.Vector3(1, 0, 0), v: new THREE.Vector3(0, 1, 0) },
      { n: new THREE.Vector3(0, 0, -1), u: new THREE.Vector3(-1, 0, 0), v: new THREE.Vector3(0, 1, 0) },
      { n: new THREE.Vector3(1, 0, 0), u: new THREE.Vector3(0, 0, -1), v: new THREE.Vector3(0, 1, 0) },
      { n: new THREE.Vector3(-1, 0, 0), u: new THREE.Vector3(0, 0, 1), v: new THREE.Vector3(0, 1, 0) },
      { n: new THREE.Vector3(0, 1, 0), u: new THREE.Vector3(1, 0, 0), v: new THREE.Vector3(0, 0, -1) },
      { n: new THREE.Vector3(0, -1, 0), u: new THREE.Vector3(1, 0, 0), v: new THREE.Vector3(0, 0, 1) },
    ];
    faces.forEach((f) => {
      for (let i = 0; i < grid; i++)
        for (let j = 0; j < grid; j++) {
          const uu = start + i * step;
          const vv = start + j * step;
          const pos = new THREE.Vector3()
            .addScaledVector(f.u, uu)
            .addScaledVector(f.v, vv)
            .addScaledVector(f.n, half);
          cells.push({ pos, nor: f.n.clone(), rand: Math.random() });
        }
    });
    return { cells, step };
  }, [size, grid]);
}

function PixelBox({ onWord }: { onWord: (i: number) => void }) {
  const { cells, step } = usePixels(1.6, 7);
  const ref = useRef<THREE.InstancedMesh>(null);
  const core = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);
  const last = useRef(-1);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#0a0a0a", roughness: 0.45, metalness: 0.15 }), []);

  useFrame(({ clock }) => {
    const inst = ref.current;
    if (!inst) return;
    const t = clock.getElapsedTime();
    const p = (t % LOOP) / LOOP;

    // looping envelopes (all return to ~0 at the seam for a seamless cut)
    const tension = smooth(0.0, 0.5, p) * (1 - smooth(0.82, 1.0, p));
    const f = smooth(0.55, 0.74, p) * (1 - smooth(0.86, 0.99, p)); // breakthrough bump 0→1→0
    const pulse = Math.pow(Math.max(0, Math.sin(t * 2.4)), 3); // caged light pressing out
    const shake = (0.006 + 0.022 * tension) * (1 - f);

    for (let k = 0; k < cells.length; k++) {
      const c = cells[k];
      const press = pulse * (0.03 + 0.05 * tension);
      const sc = f * (1.4 + c.rand * 2.6);
      dummy.position.set(
        c.pos.x + c.nor.x * press + Math.sin(t * 30 + c.rand * 99) * shake + (c.rand - 0.5) * f * 1.4,
        c.pos.y + c.nor.y * press + sc * sc * 0.7,
        c.pos.z + c.nor.z * press + Math.cos(t * 27 + c.rand * 70) * shake + (c.rand - 0.5) * f * 1.4,
      );
      const s = step * 0.82 * (1 - Math.min(1, f * (c.rand + 0.25)));
      dummy.scale.setScalar(Math.max(0, s));
      dummy.rotation.set(f * c.rand * 6, f * c.rand * 5, 0);
      dummy.updateMatrix();
      inst.setMatrixAt(k, dummy.matrix);
    }
    inst.instanceMatrix.needsUpdate = true;
    inst.position.x = Math.sin(t * 31) * 0.02 * (0.3 + tension);
    inst.position.z = Math.cos(t * 23) * 0.02 * (0.3 + tension);

    if (light.current) light.current.intensity = 1.2 + pulse * (3 + tension * 6) + f * 120;
    if (core.current) core.current.scale.setScalar(0.18 + pulse * 0.05 * tension + f * 30);

    // report the active chapter word (cheap: only on change)
    const idx = p < 0.17 ? 0 : p < 0.33 ? 1 : p < 0.5 ? 2 : p < 0.62 ? 3 : p < 0.8 ? 4 : 5;
    if (idx !== last.current) {
      last.current = idx;
      onWord(idx);
    }
  });

  return (
    <group position={[0, 0.05, 0]}>
      <instancedMesh ref={ref} args={[geo, mat, cells.length]} castShadow />
      <mesh ref={core}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      <pointLight ref={light} color="#ffffff" intensity={1.2} distance={9} decay={1.4} />
    </group>
  );
}

/* ---- bird (flies up during the breakthrough) ---- */
function wingGeometry(sign: number) {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0, sign * 1.2, 0.06, -0.12, sign * 0.32, 0, -0.7], 3));
  g.setIndex([0, 1, 2]);
  g.computeVertexNormals();
  return g;
}
function Bird() {
  const group = useRef<THREE.Group>(null);
  const lw = useRef<THREE.Mesh>(null);
  const rw = useRef<THREE.Mesh>(null);
  const lGeo = useMemo(() => wingGeometry(1), []);
  const rGeo = useMemo(() => wingGeometry(-1), []);
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#0a0a0a", roughness: 0.6, side: THREE.DoubleSide, transparent: true }),
    [],
  );
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const p = (t % LOOP) / LOOP;
    const appear = smooth(0.7, 0.78, p);
    const rise = smooth(0.72, 0.96, p);
    const fade = 1 - smooth(0.88, 0.98, p);
    if (group.current) {
      group.current.scale.setScalar(appear * fade);
      group.current.position.set(0, 0.1 + rise * 9, rise * 0.4);
      group.current.rotation.x = -0.4 - rise * 0.2;
      group.current.rotation.y = Math.sin(t * 1.6) * 0.16;
    }
    const flap = Math.sin(t * 18) * 0.7;
    if (lw.current) lw.current.rotation.z = flap;
    if (rw.current) rw.current.rotation.z = -flap;
    mat.opacity = fade;
  });
  return (
    <group ref={group} scale={0} position={[0, 0.1, 0]}>
      <mesh ref={lw} geometry={lGeo} material={mat} />
      <mesh ref={rw} geometry={rGeo} material={mat} />
    </group>
  );
}

function Rig({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, pointer.x * 0.18, 0.04);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -pointer.y * 0.08, 0.04);
  });
  return <group ref={ref}>{children}</group>;
}

function Scene({ onWord }: { onWord: (i: number) => void }) {
  return (
    <>
      {/* studio cove (inverted sphere = seamless white surround) */}
      <mesh>
        <sphereGeometry args={[30, 32, 32]} />
        <meshBasicMaterial color="#f1f1f1" side={THREE.BackSide} toneMapped={false} />
      </mesh>
      <ambientLight intensity={0.55} />
      <spotLight position={[2.5, 6, 4]} angle={0.5} penumbra={0.8} intensity={2.4} color="#ffffff" castShadow />
      <directionalLight position={[-4, 3, -3]} intensity={0.6} color="#ffffff" />
      <ContactShadows position={[0, -0.82, 0]} opacity={0.5} scale={9} blur={2.4} far={4} color="#000000" />
      <Rig>
        <PixelBox onWord={onWord} />
        <Bird />
      </Rig>
    </>
  );
}

export function BoxChapterScene({ active, onWord }: { active: boolean; onWord: (i: number) => void }) {
  return (
    <Canvas
      shadows
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0.55, 6], fov: 42 }}
      gl={{ antialias: true }}
      dpr={[1, 2]}
    >
      <Scene onWord={onWord} />
      <EffectComposer>
        <BloomEffect intensity={1.0} luminanceThreshold={0.9} luminanceSmoothing={0.4} mipmapBlur radius={0.8} />
      </EffectComposer>
    </Canvas>
  );
}
