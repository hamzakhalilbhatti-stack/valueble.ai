"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  BufferGeometry,
  Float32BufferAttribute,
  LineBasicMaterial,
  LineLoop,
  Vector3,
  type DirectionalLight,
  type Group,
  type Mesh,
  type MeshStandardMaterial,
  type PointLight,
} from "three";
import { ACCENT, ORBITS, orbitPosition, sceneAt } from "./stages";

/**
 * THE ORBIT — structural foundation (Milestone 1).
 *
 * Deliberately unfinished: block-form satellites, flat materials, no particles
 * or internal animation. The only thing being judged here is whether the
 * composition reads as ONE ecosystem with THREE connected capabilities before
 * any copy is involved. Detail comes after that is confirmed.
 */

const WORLD_RADIUS = 2.4;

/* ── Orbit paths ───────────────────────────────────────────────────
   Thin rings, drawn progressively as `orbitReveal` rises. */

function OrbitPath({
  index,
  revealRef,
}: {
  index: number;
  revealRef: React.RefObject<number>;
}) {
  const o = ORBITS[index];
  const ref = useRef<LineLoop>(null);

  // Built as a real THREE.LineLoop and mounted via <primitive>. Rendering
  // `<line>` in JSX is ambiguous with the SVG element and types poorly.
  const line = useMemo(() => {
    const points: number[] = [];
    const SEGMENTS = 192;
    for (let i = 0; i < SEGMENTS; i++) {
      const angle = (i / SEGMENTS) * Math.PI * 2;
      const x = Math.cos(angle) * o.radius;
      const z = Math.sin(angle) * o.radius;
      points.push(x, z * Math.sin(o.inclination), z * Math.cos(o.inclination));
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(points, 3));
    const material = new LineBasicMaterial({
      color: o.accent,
      transparent: true,
      opacity: 0,
    });
    return new LineLoop(geometry, material);
  }, [o]);

  // Dispose explicitly — geometry and material here are created outside R3F's
  // automatic lifecycle, so nothing else will free them.
  useEffect(
    () => () => {
      line.geometry.dispose();
      (line.material as LineBasicMaterial).dispose();
    },
    [line],
  );

  useFrame(() => {
    (line.material as LineBasicMaterial).opacity = (revealRef.current ?? 0) * 0.5;
  });

  return <primitive object={line} ref={ref} />;
}

/* ── The Brand World ───────────────────────────────────────────────
   Faceted sphere silhouette plus an equatorial aperture band. */

function BrandWorld({ spinRef, coreRef }: { spinRef: React.RefObject<number>; coreRef: React.RefObject<number> }) {
  const group = useRef<Group>(null);
  const core = useRef<PointLight>(null);
  const band = useRef<Mesh>(null);

  useFrame((_, delta) => {
    const k = 1 - Math.pow(0.002, delta);
    if (group.current) {
      group.current.rotation.y += ((spinRef.current ?? 0) - group.current.rotation.y) * k;
    }
    const light = coreRef.current ?? 0;
    if (core.current) core.current.intensity += (light * 9 - core.current.intensity) * k;
    const mat = band.current?.material as MeshStandardMaterial | undefined;
    if (mat) {
      // The aperture warms toward gold only as the three signals land.
      mat.emissiveIntensity += (light * 1.2 - mat.emissiveIntensity) * k;
    }
  });

  return (
    <group ref={group}>
      {/* Low-poly on purpose: facets read as engineered, a smooth ball reads
          as a planet — which the brief explicitly rules out. */}
      <mesh castShadow receiveShadow>
        <icosahedronGeometry args={[WORLD_RADIUS, 3]} />
        <meshStandardMaterial color="#171a26" roughness={0.62} metalness={0.35} flatShading />
      </mesh>

      {/* Equatorial aperture — the internal light reads through here. */}
      <mesh ref={band} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[WORLD_RADIUS * 1.002, 0.055, 12, 128]} />
        <meshStandardMaterial
          color={ACCENT.unified}
          emissive={ACCENT.unified}
          emissiveIntensity={0}
          roughness={0.4}
        />
      </mesh>

      <pointLight ref={core} position={[0, 0, 0]} intensity={0} distance={9} color={ACCENT.unified} />
    </group>
  );
}

/* ── Satellites ────────────────────────────────────────────────────
   Three block-form stand-ins. Silhouettes are deliberately different so the
   three capabilities are distinguishable at a glance, which is the whole
   review criterion for this milestone. */

const SATELLITE_SCALE = [0.62, 0.78, 0.72];

function Satellite({
  index,
  presenceRef,
  emphasisRef,
  advanceRef,
}: {
  index: number;
  presenceRef: React.RefObject<[number, number, number]>;
  emphasisRef: React.RefObject<[number, number, number]>;
  advanceRef: React.RefObject<number>;
}) {
  const group = useRef<Group>(null);
  const light = useRef<PointLight>(null);
  const accent = ORBITS[index].accent;

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const k = 1 - Math.pow(0.002, delta);

    const presence = presenceRef.current?.[index] ?? 0;
    const emphasis = emphasisRef.current?.[index] ?? 0.25;
    // Each satellite advances at its own rate, so they never sit in a line.
    const advance = (advanceRef.current ?? 0) * (1 + index * 0.22);
    const [x, y, z] = orbitPosition(index, advance);

    g.position.x += (x - g.position.x) * k;
    g.position.y += (y - g.position.y) * k;
    g.position.z += (z - g.position.z) * k;

    // Presence scales them in during Stage 3 rather than popping them on.
    const s = presence * SATELLITE_SCALE[index];
    g.scale.x += (s - g.scale.x) * k;
    g.scale.y += (s - g.scale.y) * k;
    g.scale.z += (s - g.scale.z) * k;
    g.rotation.y += delta * 0.14;

    if (light.current) {
      light.current.intensity += (emphasis * presence * 6 - light.current.intensity) * k;
    }
  });

  return (
    <group ref={group} scale={0}>
      {/* Distinct silhouettes: prism / ring / open frame. */}
      {index === 0 && (
        <mesh castShadow>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#1d2130" emissive={accent} emissiveIntensity={0.35} roughness={0.45} metalness={0.6} flatShading />
        </mesh>
      )}
      {index === 1 && (
        <mesh castShadow rotation={[Math.PI / 2.6, 0, 0]}>
          <torusGeometry args={[0.85, 0.26, 10, 40]} />
          <meshStandardMaterial color="#1d2130" emissive={accent} emissiveIntensity={0.35} roughness={0.45} metalness={0.6} />
        </mesh>
      )}
      {index === 2 && (
        <group>
          {/* Open modular frame — reads as assembled parts, not a solid mass. */}
          {[
            [0.62, 0, 0],
            [-0.62, 0, 0],
            [0, 0.62, 0],
            [0, -0.62, 0],
            [0, 0, 0.62],
            [0, 0, -0.62],
          ].map((p, i) => (
            <mesh key={i} position={p as [number, number, number]} castShadow>
              <boxGeometry args={[0.42, 0.42, 0.42]} />
              <meshStandardMaterial color="#1d2130" emissive={accent} emissiveIntensity={0.35} roughness={0.45} metalness={0.6} flatShading />
            </mesh>
          ))}
        </group>
      )}
      <pointLight ref={light} intensity={0} distance={6} color={accent} />
    </group>
  );
}

/* ── Scene root ────────────────────────────────────────────────────*/

export function Ecosystem({
  scrollRef,
  pointerRef,
  compact,
}: {
  scrollRef: React.RefObject<number>;
  pointerRef: React.RefObject<{ x: number; y: number }>;
  compact: boolean;
}) {
  const { camera } = useThree();
  const lookAt = useRef(new Vector3());

  // Scene state is written to refs each frame; React never re-renders here.
  const spin = useRef(0);
  const coreLight = useRef(0);
  const orbitReveal = useRef(0);
  const satellites = useRef<[number, number, number]>([0, 0, 0]);
  const emphasis = useRef<[number, number, number]>([0.25, 0.25, 0.25]);
  const advance = useRef(0);
  const keyLight = useRef<DirectionalLight>(null);

  useFrame((_, delta) => {
    const s = sceneAt(scrollRef.current ?? 0, compact);
    const k = 1 - Math.pow(0.0018, delta);
    const p = pointerRef.current ?? { x: 0, y: 0 };

    // Cursor influence is capped hard — roughly 1–2 degrees, per the brief.
    const px = compact ? 0 : p.x * 0.28;
    const py = compact ? 0 : p.y * 0.2;

    camera.position.x += (s.camera[0] + px - camera.position.x) * k;
    camera.position.y += (s.camera[1] - py - camera.position.y) * k;
    camera.position.z += (s.camera[2] - camera.position.z) * k;

    lookAt.current.lerp(new Vector3(s.target[0], s.target[1], s.target[2]), k);
    camera.lookAt(lookAt.current);

    spin.current = s.worldSpin;
    coreLight.current = s.coreLight;
    orbitReveal.current = s.orbitReveal;
    satellites.current = s.satellites;
    emphasis.current = s.emphasis;
    advance.current = s.orbitAdvance;

    if (keyLight.current) {
      keyLight.current.intensity += (s.keyLight - keyLight.current.intensity) * k;
    }
  });

  return (
    <>
      <ambientLight intensity={0.22} />
      <directionalLight ref={keyLight} position={[-6, 7, 5]} intensity={1.4} castShadow />
      <directionalLight position={[7, -2, 4]} intensity={0.28} color="#8fa2c8" />

      <BrandWorld spinRef={spin} coreRef={coreLight} />

      {ORBITS.map((_, i) => (
        <OrbitPath key={i} index={i} revealRef={orbitReveal} />
      ))}

      {ORBITS.map((_, i) => (
        <Satellite
          key={i}
          index={i}
          presenceRef={satellites}
          emphasisRef={emphasis}
          advanceRef={advance}
        />
      ))}
    </>
  );
}
