"use client";

/**
 * SOAR — Entrance: the S-road to the stars. A matte, asphalt-real road curves
 * upward in a dramatic S, climbing out of darkness into a starfield that grows
 * brighter as you ascend. On unlock you travel up the S; the camera then lifts
 * to a near-overhead view where the whole road traces the SOAR swoosh — the
 * painted edge lines glow so the mark reads — before the light floods and the
 * single logo resolves in the overlay. Monochrome, luxury, no neon.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom as BloomEffect } from "@react-three/postprocessing";
import { useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

// a dramatic S that rises toward the stars (the logo's swoosh)
const CURVE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0.0, -2.4, 15),
  new THREE.Vector3(3.4, -1.7, 7),
  new THREE.Vector3(-3.6, -0.6, -3),
  new THREE.Vector3(-3.2, 0.8, -14),
  new THREE.Vector3(2.8, 2.0, -24),
  new THREE.Vector3(3.0, 3.2, -34),
  new THREE.Vector3(0.0, 4.4, -45),
]);

type Phase = { elapsed: number; climb: number; lift: number; bright: number };

function roadTexture() {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 512;
  const ctx = c.getContext("2d");
  if (ctx) {
    // neutral dark asphalt
    ctx.fillStyle = "#17181b";
    ctx.fillRect(0, 0, 128, 512);
    // aggregate speckle — light & dark flecks (matte, real tarmac)
    for (let i = 0; i < 2600; i++) {
      const x = Math.random() * 128;
      const y = Math.random() * 512;
      const g = (Math.random() < 0.5 ? 8 + Math.random() * 16 : 42 + Math.random() * 52) | 0;
      ctx.fillStyle = `rgba(${g},${g},${g + 2},${0.22 + Math.random() * 0.4})`;
      ctx.fillRect(x, y, 1, Math.random() < 0.3 ? 2 : 1);
    }
    // fine neutral grain (no colour cast — pure monochrome)
    const img = ctx.getImageData(0, 0, 128, 512);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = ((Math.random() * 10) - 5) | 0;
      d[i] += n;
      d[i + 1] += n;
      d[i + 2] += n;
    }
    ctx.putImageData(img, 0, 0);
    // worn painted edge lines (the lane that traces the S)
    for (let y = 0; y < 512; y++) {
      const a = 0.4 + Math.random() * 0.16 - (Math.random() < 0.06 ? 0.32 : 0);
      ctx.fillStyle = `rgba(214,217,224,${Math.max(0, a)})`;
      ctx.fillRect(9, y, 3, 1);
      ctx.fillRect(116, y, 3, 1);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1, 8);
  t.anisotropy = 8;
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
    const a = i * 2, b = i * 2 + 1, cc = i * 2 + 2, dd = i * 2 + 3;
    indices.push(a, b, cc, b, dd, cc);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}

function Road({ phase }: { phase: MutableRefObject<Phase> }) {
  const geo = useMemo(() => buildRoad(4.8, 240), []);
  const tex = useMemo(() => roadTexture(), []);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(() => {
    // the painted lines glow at the overhead reveal so the swoosh reads
    if (matRef.current) matRef.current.emissiveIntensity = phase.current.bright * 0.85;
  });
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial
        ref={matRef}
        map={tex}
        emissiveMap={tex}
        emissive="#b9bfcb"
        emissiveIntensity={0}
        color="#1b1c20"
        roughness={0.86}
        metalness={0.16}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Stars({ phase }: { phase: MutableRefObject<Phase> }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const n = 1700;
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
  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: "#ffffff",
        size: 0.05,
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    [],
  );
  useFrame(({ clock }) => {
    const f = phase.current.climb;
    mat.opacity = 0.18 + f * 0.82; // appear as you climb
    mat.size = 0.05 + f * 0.32; // and grow
    if (ref.current) ref.current.rotation.z = clock.elapsedTime * 0.006;
  });
  return <points ref={ref} geometry={geo} material={mat} />;
}

function Rig({ phase }: { phase: MutableRefObject<Phase> }) {
  const { camera, pointer } = useThree();
  const mid = useMemo(() => CURVE.getPointAt(0.5), []);
  const p = useMemo(() => new THREE.Vector3(), []);
  const ahead = useMemo(() => new THREE.Vector3(), []);
  const onRoad = useMemo(() => new THREE.Vector3(), []);
  const over = useMemo(() => new THREE.Vector3(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    const { climb, lift } = phase.current;
    const u = Math.min(0.985, climb * 0.86);
    CURVE.getPointAt(u, p);
    CURVE.getPointAt(Math.min(0.999, u + 0.05), ahead);
    // first-person — just above the deck, looking up the road (subtle parallax)
    onRoad.set(p.x - pointer.x * 0.5, p.y + 0.55 - pointer.y * 0.25, p.z + 1.7);
    // the reveal — rise high over the middle of the S and look down the whole road
    over.set(mid.x, mid.y + 36, mid.z + 6);
    target.copy(onRoad).lerp(over, lift);
    camera.position.lerp(target, 0.1);
    look.copy(ahead).lerp(mid, lift);
    camera.lookAt(look);
  });
  return null;
}

function Scene({ unlocked }: { unlocked: boolean }) {
  const phase = useRef<Phase>({ elapsed: 0, climb: 0, lift: 0, bright: 0 });
  useFrame((_, dt) => {
    const ph = phase.current;
    ph.elapsed += unlocked ? Math.min(dt, 0.05) : 0;
    const e = ph.elapsed;
    ph.climb = easeInOut(clamp01(e / 2.2)); // travel up the S (done ~2.2s)
    ph.lift = smooth(2.0, 3.2, e); // then rise to the overhead reveal (held to the flash)
    ph.bright = smooth(1.7, 2.9, e); // painted lines warm up so the swoosh reads
  });
  return (
    <>
      <color attach="background" args={["#050507"]} />
      <fog attach="fog" args={["#050507", 20, 80]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 7, 5]} intensity={1.0} color="#eef1f6" />
      <directionalLight position={[-5, 2, -6]} intensity={0.45} color="#c2c8d6" />
      <Stars phase={phase} />
      <Road phase={phase} />
      <Rig phase={phase} />
    </>
  );
}

export function BreakthroughScene({ unlocked = false }: { unlocked?: boolean }) {
  return (
    <Canvas camera={{ position: [0, -1.5, 16], fov: 60 }} gl={{ antialias: true }} dpr={[1, 2]}>
      <Scene unlocked={unlocked} />
      <EffectComposer>
        <BloomEffect intensity={0.65} luminanceThreshold={0.75} luminanceSmoothing={0.4} mipmapBlur radius={0.7} />
      </EffectComposer>
    </Canvas>
  );
}
