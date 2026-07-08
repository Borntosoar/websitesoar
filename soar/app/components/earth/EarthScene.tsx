"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture, Stars, Billboard } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const R = 2;
const SUN = new THREE.Vector3(0.45, 0.22, 1.0).normalize();
const ATMO = new THREE.Color("#d6dce6");
const IGNITE = new THREE.Vector3(0.08, 0.02, 1).normalize(); // the SOAR mark / chain-reaction origin, front of the globe
const ROT0 = 4.0; // start longitude so a landmass (not the dark Pacific) faces the camera at ignition
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const sstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// All motion is a pure function of this time, so an offline capture can drive the
// scene frame-accurately (window.__capture / __CAP_T). Live: the clock; reduced
// motion: a fixed lit, pulled-back still.
function timeOf(clock: THREE.Clock, reduce: boolean) {
  const w = typeof window !== "undefined" ? (window as unknown as { __capture?: boolean; __CAP_T?: number }) : undefined;
  if (w && w.__capture) return w.__CAP_T || 0;
  if (reduce) return 6.5;
  return clock.elapsedTime;
}

const EARTH_VERT = /* glsl */ `
  varying vec2 vUv; varying vec3 vN; varying vec3 vView;
  void main(){
    vUv = uv;
    vN = normalize(mat3(modelMatrix) * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vView = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }`;

const EARTH_FRAG = /* glsl */ `
  uniform sampler2D uDay; uniform sampler2D uNight;
  uniform vec3 uSun; uniform vec3 uAtmo;
  uniform float uRipple; uniform vec3 uRippleDir;
  varying vec2 vUv; varying vec3 vN; varying vec3 vView;
  void main(){
    vec3 N = normalize(vN);
    float sun = dot(N, normalize(uSun));
    float day = smoothstep(-0.1, 0.45, sun);
    vec3 dayC = texture2D(uDay, vUv).rgb;
    dayC = pow(dayC, vec3(0.85)) * 1.2;                 // silver continents vs charcoal ocean
    vec3 nightC = texture2D(uNight, vUv).rgb;
    vec3 surf = mix(nightC * 2.8, dayC * (0.3 + 0.8 * day), day);
    float term = smoothstep(0.32, 0.0, abs(sun));       // the day/night line
    surf += nightC * term * 1.5;                        // cities blaze across the terminator (light from darkness)
    if (uRipple <= 1.0) {
      float ang = acos(clamp(dot(N, normalize(uRippleDir)), -1.0, 1.0));
      float band = smoothstep(0.05, 0.0, abs(ang - uRipple * 3.14159));
      surf += band * (1.0 - uRipple) * 1.25;            // crisp wavefront racing out
      surf += smoothstep(0.12, 0.0, ang) * pow(max(0.0, 1.0 - uRipple * 3.0), 3.0) * 1.7; // ignition point
    }
    float fres = pow(1.0 - max(dot(N, normalize(vView)), 0.0), 3.0);
    surf += fres * uAtmo * (0.35 + 0.65 * day);
    gl_FragColor = vec4(surf, 1.0);
  }`;

const ATMO_VERT = EARTH_VERT;
const ATMO_FRAG = /* glsl */ `
  uniform vec3 uAtmo; uniform vec3 uSun;
  varying vec3 vN; varying vec3 vView;
  void main(){
    vec3 N = normalize(vN);
    float rim = pow(1.0 - max(dot(N, normalize(vView)), 0.0), 2.6);
    float lit = 0.4 + 0.6 * smoothstep(-0.3, 0.5, dot(N, normalize(uSun)));
    gl_FragColor = vec4(uAtmo, rim * lit);
  }`;

function Earth({ reduce }: { reduce: boolean }) {
  const [day, night, normal, spec, clouds] = useTexture([
    "/textures/earth-day.jpg",
    "/textures/earth-night.jpg",
    "/textures/earth-normal.jpg",
    "/textures/earth-spec.jpg",
    "/textures/earth-clouds.jpg",
  ]);
  const logo = useTexture("/soar-logo-white.png");
  const flare = useTexture("/textures/flare.png");
  const flashRef = useRef<THREE.MeshBasicMaterial>(null);
  const flareRef = useRef<THREE.MeshBasicMaterial>(null);
  useEffect(() => {
    logo.colorSpace = THREE.SRGBColorSpace;
    logo.anisotropy = 8;
    for (const t of [day, night, spec, clouds]) t.colorSpace = THREE.SRGBColorSpace;
    for (const t of [day, night, normal, spec, clouds]) {
      t.anisotropy = 8;
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.generateMipmaps = false;
      t.needsUpdate = true;
    }
  }, [day, night, normal, spec, clouds]);

  const earthRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: EARTH_VERT,
        fragmentShader: EARTH_FRAG,
        uniforms: {
          uDay: { value: day },
          uNight: { value: night },
          uSun: { value: SUN },
          uAtmo: { value: ATMO },
          uRipple: { value: 2 },
          uRippleDir: { value: IGNITE },
        },
      }),
    [day, night],
  );
  const atmoMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: ATMO_VERT,
        fragmentShader: ATMO_FRAG,
        uniforms: { uAtmo: { value: ATMO }, uSun: { value: SUN } },
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    [],
  );

  useFrame((state) => {
    const t = timeOf(state.clock, reduce);
    const w = typeof window !== "undefined" ? (window as unknown as { __ROT0?: number }) : undefined;
    const rot0 = w && w.__ROT0 != null ? w.__ROT0 : ROT0;
    if (earthRef.current) earthRef.current.rotation.y = t * 0.03 + rot0;
    if (cloudRef.current) cloudRef.current.rotation.y = t * 0.043 + rot0;
    // the chain reaction sweeps the globe from the SOAR ignition at ~1.5s
    let r = 2;
    if (t >= 1.5 && t < 3.7) r = (t - 1.5) / 2.2;
    mat.uniforms.uRipple.value = r;
    // the SOAR mark fades in, ignites at 1.5s, then fades
    const em = t < 1.5 ? sstep(0.5, 1.5, t) * 0.42 : Math.pow(Math.max(0, 1 - (t - 1.5) * 1.25), 2) * 0.98;
    if (flashRef.current) flashRef.current.opacity = reduce ? 0 : em;
    // anamorphic lens flare peaks on the ignition
    if (flareRef.current) {
      const fl = t >= 1.35 && t < 2.9 ? Math.pow(Math.max(0, 1 - Math.abs(t - 1.65) * 1.5), 2) : 0;
      flareRef.current.opacity = reduce ? 0 : fl * 0.9;
    }
  });

  return (
    <group>
      <group rotation={[0, 0, 0.41]}>
        <mesh ref={earthRef} material={mat}>
          <sphereGeometry args={[R, 128, 128]} />
        </mesh>
        <mesh ref={cloudRef} scale={1.012}>
          <sphereGeometry args={[R, 72, 72]} />
          <meshStandardMaterial map={clouds} alphaMap={clouds} transparent opacity={0.3} color="#c8c8c8" depthWrite={false} roughness={1} metalness={0} />
        </mesh>
        <mesh scale={1.16} material={atmoMat}>
          <sphereGeometry args={[R, 64, 64]} />
        </mesh>
      </group>
      {/* the SOAR mark on the globe — the chain reaction ignites from it */}
      <Billboard position={[IGNITE.x * R * 1.02, IGNITE.y * R * 1.02, IGNITE.z * R * 1.02]}>
        <mesh>
          <planeGeometry args={[0.66, 0.55]} />
          <meshBasicMaterial ref={flashRef} map={logo} transparent opacity={0} depthWrite={false} toneMapped={false} blending={THREE.AdditiveBlending} />
        </mesh>
      </Billboard>
      {/* anamorphic lens flare across the ignition — the cinematic beat */}
      <Billboard position={[IGNITE.x * R * 1.06, IGNITE.y * R * 1.06, IGNITE.z * R * 1.06]}>
        <mesh>
          <planeGeometry args={[3.6, 0.9]} />
          <meshBasicMaterial ref={flareRef} map={flare} transparent opacity={0} depthWrite={false} toneMapped={false} blending={THREE.AdditiveBlending} />
        </mesh>
      </Billboard>
    </group>
  );
}

function Rig({ reduce }: { reduce: boolean }) {
  const { camera } = useThree();
  useFrame((state) => {
    const t = timeOf(state.clock, reduce);
    // film arc: a slow push while SOAR ignites, then a dramatic ascent to space
    const z = t < 1.5 ? 4.3 - (t / 1.5) * 0.5 : 3.8 + easeOut(Math.min(1, (t - 1.5) / 5)) * 6.0;
    camera.position.z = z;
    camera.position.x = Math.sin(t * 0.06) * 0.5;
    camera.position.y = Math.cos(t * 0.05) * 0.3;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export function EarthScene({ active = true }: { active?: boolean }) {
  const reduce = useReducedMotion() ?? false;
  const [lite, setLite] = useState(false);
  const [cap, setCap] = useState(false);
  useEffect(() => {
    setLite(window.innerWidth < 768 || (navigator.hardwareConcurrency || 8) <= 4);
    if (new URLSearchParams(window.location.search).has("capture")) {
      (window as unknown as { __capture?: boolean }).__capture = true;
      setCap(true);
    }
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 3.6], fov: 42 }}
      dpr={cap ? 1 : lite ? [1, 1.4] : [1, 1.9]}
      gl={{ antialias: !lite, powerPreference: "high-performance", preserveDrawingBuffer: cap }}
      frameloop={cap ? "always" : reduce || !active ? "demand" : "always"}
    >
      <color attach="background" args={["#050507"]} />
      <ambientLight intensity={0.06} />
      <directionalLight position={SUN.toArray()} intensity={1.5} color="#ffffff" />
      <Suspense fallback={null}>
        <Earth reduce={reduce} />
      </Suspense>
      <Stars radius={90} depth={60} count={lite ? 1800 : 4200} factor={3.2} saturation={0} fade speed={reduce ? 0 : 0.4} />
    </Canvas>
  );
}
