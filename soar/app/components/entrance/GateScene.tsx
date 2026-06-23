"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const N = 170;
const SPREAD = 64;

/** A quiet field of light rising through the dark — the only motif. On "enter"
 *  it accelerates upward and the camera presses forward: the breakthrough.
 *  Honors prefers-reduced-motion (renders a static field, no camera move). */
function Field({ entering, reduce }: { entering: boolean; reduce: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const arr = useMemo(() => {
    const p = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      p[i * 3] = (Math.random() - 0.5) * SPREAD;
      p[i * 3 + 1] = (Math.random() - 0.5) * SPREAD;
      p[i * 3 + 2] = -Math.random() * 50 - 2;
    }
    return p;
  }, []);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, [arr]);
  const mat = useMemo(
    () => new THREE.PointsMaterial({ color: "#ffffff", size: 0.05, transparent: true, opacity: 0.4, sizeAttenuation: true, depthWrite: false }),
    [],
  );

  useFrame((state, dt) => {
    const pts = ref.current;
    if (!pts || reduce) return;
    const speed = entering ? 8 : 1.1;
    const d = Math.min(dt, 0.05);
    for (let i = 0; i < N; i++) {
      let y = arr[i * 3 + 1] + d * speed;
      if (y > SPREAD / 2) y -= SPREAD;
      arr[i * 3 + 1] = y;
    }
    (geo.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
    pts.rotation.x += (state.pointer.y * 0.08 - pts.rotation.x) * 0.04;
    pts.rotation.y += (state.pointer.x * 0.08 - pts.rotation.y) * 0.04;
  });

  return <points ref={ref} geometry={geo} material={mat} />;
}

function Rig({ entering, reduce }: { entering: boolean; reduce: boolean }) {
  const { camera } = useThree();
  useFrame(() => {
    if (reduce) return;
    const targetZ = entering ? 0.5 : 9;
    camera.position.z += (targetZ - camera.position.z) * 0.045;
  });
  return null;
}

export function GateScene({ entering }: { entering: boolean }) {
  const reduce = useReducedMotion() ?? false;
  return (
    <Canvas camera={{ position: [0, 0, 9], fov: 60 }} dpr={[1, 2]} gl={{ antialias: true }} frameloop={reduce ? "demand" : "always"}>
      <color attach="background" args={["#0b0a09"]} />
      <fog attach="fog" args={["#0b0a09", 14, 52]} />
      <Field entering={entering} reduce={reduce} />
      <Rig entering={entering} reduce={reduce} />
    </Canvas>
  );
}
