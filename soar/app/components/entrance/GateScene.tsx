"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const N = 700;
const SPREAD = 64;

/** A quiet field of light rising through the dark — the only motif. On "enter"
 *  it accelerates upward and the camera presses forward: the breakthrough. */
function Field({ entering }: { entering: boolean }) {
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
    () => new THREE.PointsMaterial({ color: "#ffffff", size: 0.07, transparent: true, opacity: 0.72, sizeAttenuation: true, depthWrite: false }),
    [],
  );

  useFrame((state, dt) => {
    const pts = ref.current;
    if (!pts) return;
    const speed = entering ? 34 : 2.1;
    const d = Math.min(dt, 0.05);
    for (let i = 0; i < N; i++) {
      let y = arr[i * 3 + 1] + d * speed;
      if (y > SPREAD / 2) y -= SPREAD;
      arr[i * 3 + 1] = y;
    }
    (geo.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
    // gentle pointer parallax
    pts.rotation.x += (state.pointer.y * 0.08 - pts.rotation.x) * 0.04;
    pts.rotation.y += (state.pointer.x * 0.08 - pts.rotation.y) * 0.04;
  });

  return <points ref={ref} geometry={geo} material={mat} />;
}

function Rig({ entering }: { entering: boolean }) {
  const { camera } = useThree();
  useFrame(() => {
    const targetZ = entering ? 0.5 : 9;
    camera.position.z += (targetZ - camera.position.z) * 0.045;
  });
  return null;
}

export function GateScene({ entering }: { entering: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 9], fov: 60 }} dpr={[1, 2]} gl={{ antialias: true }}>
      <color attach="background" args={["#0b0a09"]} />
      <fog attach="fog" args={["#0b0a09", 14, 52]} />
      <Field entering={entering} />
      <Rig entering={entering} />
    </Canvas>
  );
}
