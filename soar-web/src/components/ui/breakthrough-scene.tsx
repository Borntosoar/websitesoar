"use client";

/**
 * SOAR — Studio Entrance (R3F). A black box made of PIXELS sits in a premium
 * white studio cove. A caged white light presses from inside (idle loop). On
 * unlock the core floods white OUT of the box, the pixels fracture upward, and a
 * bird breaks free and climbs — breakthrough, then flight. Black & white only.
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
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#0b0b0b", roughness: 0.38, metalness: 0.22 }),
    [],
  );

  useFrame(({ clock }) => {
    const inst = ref.current;
    if (!inst) return;
    const t = clock.getElapsedTime();
    const b = boost.current;
    const f = easeOut(b);
    // caged breathing — layered sines so the idle loops with no obvious beat/seam
    const breath = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 0.9));
    const press1 = Math.pow(Math.max(0, Math.sin(t * 1.7)), 2);
    const press2 = Math.pow(Math.max(0, Math.sin(t * 2.6 + 1.3)), 4);
    const pulse = (press1 * 0.6 + press2 * 0.4) * breath;
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

/* ---- bird: low-poly body + head + tail + flapping swept wings ---- */
function buildWing(sign: number) {
  const s = sign;
  const g = new THREE.BufferGeometry();
  const v = new Float32Array([
    0, 0, 0.12, //0 shoulder front
    0, 0, -0.22, //1 shoulder back
    s * 0.5, 0.0, 0.02, //2 mid leading
    s * 0.55, 0.0, -0.28, //3 mid trailing
    s * 1.05, 0.05, -0.04, //4 outer leading
    s * 1.0, 0.04, -0.3, //5 tip / outer trailing
  ]);
  g.setAttribute("position", new THREE.BufferAttribute(v, 3));
  g.setIndex([0, 2, 1, 1, 2, 3, 2, 4, 3, 3, 4, 5]);
  g.computeVertexNormals();
  return g;
}

function Bird({ boost }: { boost: MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const lw = useRef<THREE.Group>(null);
  const rw = useRef<THREE.Group>(null);
  const lGeo = useMemo(() => buildWing(1), []);
  const rGeo = useMemo(() => buildWing(-1), []);
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#080808", roughness: 0.5, metalness: 0.1, side: THREE.DoubleSide, transparent: true }),
    [],
  );

  useFrame(({ clock }) => {
    const b = boost.current;
    const f = easeOut(b);
    const t = clock.getElapsedTime();
    if (group.current) {
      const appear = Math.min(1, Math.max(0, b * 3.5 - 0.5));
      group.current.scale.setScalar(appear * 0.95);
      group.current.position.set(Math.sin(t * 0.8) * 0.16 * f, 0.05 + f * 11, f * 0.5);
      group.current.rotation.x = -0.5 - f * 0.3; // pitch up into the climb
      group.current.rotation.z = Math.sin(t * 1.1) * 0.18; // gentle bank
      group.current.rotation.y = Math.sin(t * 0.7) * 0.12;
      mat.opacity = b > 0.92 ? Math.max(0, 1 - (b - 0.92) / 0.08) : 1;
    }
    const flap = Math.sin(t * 15);
    const lift = 0.5 + flap * 0.85; // raised → lowered wingbeat
    if (lw.current) {
      lw.current.rotation.z = lift;
      lw.current.rotation.y = flap * 0.1;
    }
    if (rw.current) {
      rw.current.rotation.z = -lift;
      rw.current.rotation.y = -flap * 0.1;
    }
  });

  return (
    <group ref={group} scale={0} position={[0, 0.1, 0]}>
      <mesh material={mat} scale={[0.16, 0.16, 0.5]}>
        <sphereGeometry args={[1, 16, 12]} />
      </mesh>
      <mesh material={mat} position={[0, 0.03, 0.42]} scale={0.12}>
        <sphereGeometry args={[1, 14, 12]} />
      </mesh>
      <mesh material={mat} position={[0, 0, -0.5]} rotation={[0.18, 0, 0]} scale={[0.2, 0.02, 0.24]}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
      <group ref={lw} position={[0.05, 0.02, 0]}>
        <mesh geometry={lGeo} material={mat} />
      </group>
      <group ref={rw} position={[-0.05, 0.02, 0]}>
        <mesh geometry={rGeo} material={mat} />
      </group>
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
        <meshBasicMaterial color="#f0f0f0" side={THREE.BackSide} toneMapped={false} />
      </mesh>
      <ambientLight intensity={0.5} />
      {/* key */}
      <spotLight position={[3, 6.5, 4.5]} angle={0.5} penumbra={1} intensity={2.6} color="#ffffff" castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0002} />
      {/* rim / back edge light */}
      <directionalLight position={[-3, 4, -5]} intensity={1.1} color="#ffffff" />
      {/* low fill */}
      <directionalLight position={[0, -2, 4]} intensity={0.25} color="#ffffff" />
      <ContactShadows position={[0, -0.82, 0]} opacity={0.42} scale={11} blur={3} far={4.5} resolution={512} color="#000000" />
      <Rig>
        <PixelBox boost={boost} />
        <Bird boost={boost} />
      </Rig>
    </>
  );
}

export function BreakthroughScene({ unlocked = false }: { unlocked?: boolean }) {
  return (
    <Canvas shadows camera={{ position: [0, 0.5, 5.9], fov: 40 }} gl={{ antialias: true }} dpr={[1, 2]}>
      <Scene unlocked={unlocked} />
      <EffectComposer>
        <BloomEffect intensity={1.0} luminanceThreshold={0.9} luminanceSmoothing={0.4} mipmapBlur radius={0.85} />
      </EffectComposer>
    </Canvas>
  );
}
