"use client";

/**
 * SOAR — Studio Entrance (R3F). Black box made of PIXELS sits in a white 3D
 * studio cove. A white core light pulses from inside: on each press the pixels
 * push out and white shines through the gaps; the box shakes like something is
 * caged. On unlock the core floods white OUT of the box (engulfs the view), the
 * pixels scatter upward, and a bird flies up. Black & white only.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom as BloomEffect } from "@react-three/postprocessing";
import { useMemo, useRef, type MutableRefObject, type ReactNode } from "react";
import * as THREE from "three";

const easeOut = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

/* ---- pixel-shell box ---- */
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

function PixelBox({ boost }: { boost: MutableRefObject<number> }) {
  const { cells, step } = usePixels(1.6, 7);
  const ref = useRef<THREE.InstancedMesh>(null);
  const core = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#0a0a0a", roughness: 0.45, metalness: 0.15 }), []);

  useFrame(({ clock }) => {
    const inst = ref.current;
    if (!inst) return;
    const t = clock.getElapsedTime();
    const b = boost.current;
    const f = easeOut(b);
    // caged breathing — layered sines so the idle loops with no obvious beat or
    // seam. Something alive presses from inside and light leaks through the pixel
    // gaps, but the box never opens until the password unlocks it.
    const breath = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 0.9));
    const press1 = Math.pow(Math.max(0, Math.sin(t * 1.7)), 2);
    const press2 = Math.pow(Math.max(0, Math.sin(t * 2.6 + 1.3)), 4);
    const pulse = (press1 * 0.6 + press2 * 0.4) * breath; // organic, non-repeating-looking
    const shake = 0.009 * (0.4 + pulse);

    for (let k = 0; k < cells.length; k++) {
      const c = cells[k];
      const press = pulse * 0.06;
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
    inst.position.x = Math.sin(t * 31) * 0.02 * (0.3 + pulse);
    inst.position.z = Math.cos(t * 23) * 0.02 * (0.3 + pulse);

    if (light.current) light.current.intensity = 1.3 + pulse * 7 + f * 140;
    if (core.current) core.current.scale.setScalar(0.2 + pulse * 0.07 + f * 34);
  });

  return (
    <group position={[0, 0.05, 0]}>
      <instancedMesh ref={ref} args={[geo, mat, cells.length]} castShadow />
      <mesh ref={core}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      <pointLight ref={light} color="#ffffff" intensity={1.5} distance={9} decay={1.4} />
    </group>
  );
}

/* ---- bird (white, flies up on unlock) ---- */
function wingGeometry(sign: number) {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0, sign * 1.2, 0.06, -0.12, sign * 0.32, 0, -0.7], 3));
  g.setIndex([0, 1, 2]);
  g.computeVertexNormals();
  return g;
}
function Bird({ boost }: { boost: MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const lw = useRef<THREE.Mesh>(null);
  const rw = useRef<THREE.Mesh>(null);
  const lGeo = useMemo(() => wingGeometry(1), []);
  const rGeo = useMemo(() => wingGeometry(-1), []);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#0a0a0a", roughness: 0.6, side: THREE.DoubleSide, transparent: true }), []);
  useFrame(({ clock }) => {
    const b = boost.current;
    const f = easeOut(b);
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.scale.setScalar(Math.min(1, Math.max(0, b * 4 - 0.6)));
      group.current.position.set(0, 0.1 + f * 10, f * 0.4);
      group.current.rotation.x = -0.4 - f * 0.2;
      group.current.rotation.y = Math.sin(t * 1.6) * 0.16;
    }
    const flap = Math.sin(t * 18) * 0.7;
    if (lw.current) lw.current.rotation.z = flap;
    if (rw.current) rw.current.rotation.z = -flap;
    mat.opacity = b > 0.9 ? Math.max(0, 1 - (b - 0.9) / 0.1) : 1;
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
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, pointer.x * 0.22, 0.04);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -pointer.y * 0.1, 0.04);
  });
  return <group ref={ref}>{children}</group>;
}

function Scene({ unlocked }: { unlocked: boolean }) {
  const boost = useRef(0);
  useFrame((_, dt) => {
    boost.current = THREE.MathUtils.damp(boost.current, unlocked ? 1 : 0, 1.3, dt);
  });
  return (
    <>
      {/* studio cove (inverted sphere = seamless white surround) */}
      <mesh>
        <sphereGeometry args={[30, 32, 32]} />
        <meshBasicMaterial color="#eeeeee" side={THREE.BackSide} toneMapped={false} />
      </mesh>
      <ambientLight intensity={0.55} />
      <spotLight position={[2.5, 6, 4]} angle={0.5} penumbra={0.8} intensity={2.4} color="#ffffff" castShadow />
      <directionalLight position={[-4, 3, -3]} intensity={0.6} color="#ffffff" />
      <ContactShadows position={[0, -0.82, 0]} opacity={0.5} scale={9} blur={2.4} far={4} color="#000000" />
      <Rig>
        <PixelBox boost={boost} />
        <Bird boost={boost} />
      </Rig>
    </>
  );
}

export function BreakthroughScene({ unlocked = false }: { unlocked?: boolean }) {
  return (
    <Canvas shadows camera={{ position: [0, 0.6, 6.2], fov: 42 }} gl={{ antialias: true }} dpr={[1, 2]}>
      <Scene unlocked={unlocked} />
      <EffectComposer>
        <BloomEffect intensity={1.1} luminanceThreshold={0.9} luminanceSmoothing={0.4} mipmapBlur radius={0.8} />
      </EffectComposer>
    </Canvas>
  );
}
