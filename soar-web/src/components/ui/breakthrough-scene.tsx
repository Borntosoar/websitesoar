"use client";

/**
 * SOAR — Entrance: the S-road to the stars. A textured (not gamey), low-neon road
 * curves upward in the shape of an S, climbing out of darkness into a starfield
 * that grows brighter as you ascend. On unlock you travel up the S; near the top
 * the camera lifts to an overhead view where the path reads as the SOAR mark, then
 * the light floods (the single logo resolves in the overlay). Monochrome, luxury.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom as BloomEffect } from "@react-three/postprocessing";
import { useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";

const easeIn = (t: number) => t * t;
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// an S that rises toward the stars (the logo's swoosh)
const CURVE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0.2, -1.6, 13),
  new THREE.Vector3(2.2, -1.2, 5),
  new THREE.Vector3(-2.2, -0.4, -5),
  new THREE.Vector3(-2.6, 0.7, -16),
  new THREE.Vector3(1.6, 1.9, -27),
  new THREE.Vector3(2.0, 3.0, -38),
  new THREE.Vector3(0, 3.9, -50),
]);

function roadTexture() {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 512;
  const ctx = c.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#0c0c10";
    ctx.fillRect(0, 0, 128, 512);
    // fine matte grain (not tiled "game" pattern)
    const img = ctx.getImageData(0, 0, 128, 512);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() * 14) | 0;
      d[i] += n;
      d[i + 1] += n;
      d[i + 2] += n + 3;
    }
    ctx.putImageData(img, 0, 0);
    // soft inlaid edge lines (subtle, not neon)
    ctx.fillStyle = "rgba(190,200,230,0.22)";
    ctx.fillRect(8, 0, 3, 512);
    ctx.fillRect(117, 0, 3, 512);
    // faint centre seam
    ctx.fillStyle = "rgba(150,165,210,0.08)";
    ctx.fillRect(63, 0, 2, 512);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1, 7);
  t.anisotropy = 4;
  return t;
}

function buildRoad(width: number, segments: number) {
  const pts = CURVE.getSpacedPoints(segments);
  const positions: number[] = [];
  const uvs: number[] = [];
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
    uvs.push(0, i / segments, 1, i / segments);
  }
  for (let i = 0; i < segments; i++) {
    const a = i * 2, b = i * 2 + 1, c = i * 2 + 2, d = i * 2 + 3;
    indices.push(a, b, c, b, d, c);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}

function Road() {
  const geo = useMemo(() => buildRoad(4.6, 220), []);
  const tex = useMemo(() => roadTexture(), []);
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial map={tex} color="#15151b" roughness={0.82} metalness={0.25} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Stars({ boost }: { boost: MutableRefObject<number> }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const n = 1600;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 90;
      pos[i * 3 + 1] = Math.random() * 60 - 6;
      pos[i * 3 + 2] = -Math.random() * 120 - 8;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  const mat = useMemo(() => new THREE.PointsMaterial({ color: "#ffffff", size: 0.05, transparent: true, opacity: 0.18, depthWrite: false, sizeAttenuation: true }), []);
  useFrame(({ clock }) => {
    const f = easeIn(boost.current);
    mat.opacity = 0.18 + f * 0.82; // appear as you climb
    mat.size = 0.05 + f * 0.32; // grow
    if (ref.current) ref.current.rotation.z = clock.elapsedTime * 0.006;
  });
  return <points ref={ref} geometry={geo} material={mat} />;
}

function Rig({ boost }: { boost: MutableRefObject<number> }) {
  const { camera, pointer } = useThree();
  const p = useMemo(() => new THREE.Vector3(), []);
  const ahead = useMemo(() => new THREE.Vector3(), []);
  const mid = useMemo(() => CURVE.getPoint(0.5), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    const f = easeIn(boost.current);
    const t = Math.min(0.97, 0.02 + f * 0.9);
    CURVE.getPointAt(t, p);
    CURVE.getPointAt(Math.min(0.999, t + 0.04), ahead);
    const oh = smooth(0.8, 1, f); // lift to overhead near the top
    // on-road camera
    target.set(p.x + pointer.x * 0.6, p.y + 0.7 - pointer.y * 0.3, p.z + 1.6);
    // overhead camera (above the S, looking down)
    target.x += (mid.x - target.x) * oh;
    target.y += (mid.y + 26 - target.y) * oh;
    target.z += (mid.z + 2 - target.z) * oh;
    camera.position.lerp(target, 0.08);
    look.copy(ahead).lerp(mid, oh);
    camera.lookAt(look);
  });
  return null;
}

function Scene({ unlocked }: { unlocked: boolean }) {
  const boost = useRef(0);
  useFrame((_, dt) => {
    boost.current = THREE.MathUtils.damp(boost.current, unlocked ? 1 : 0, 0.85, dt);
  });
  return (
    <>
      <color attach="background" args={["#04040a"]} />
      <fog attach="fog" args={["#04040a", 16, 64]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 7, 5]} intensity={1.1} color="#c9d2ff" />
      <directionalLight position={[-5, 2, -6]} intensity={0.5} color="#7d8ad0" />
      <Stars boost={boost} />
      <Road />
      <Rig boost={boost} />
    </>
  );
}

export function BreakthroughScene({ unlocked = false }: { unlocked?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 13], fov: 60 }} gl={{ antialias: true }} dpr={[1, 2]}>
      <Scene unlocked={unlocked} />
      <EffectComposer>
        <BloomEffect intensity={0.65} luminanceThreshold={0.75} luminanceSmoothing={0.4} mipmapBlur radius={0.7} />
      </EffectComposer>
    </Canvas>
  );
}
