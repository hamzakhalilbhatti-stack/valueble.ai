"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/**
 * The block field — the one visual on the site.
 *
 * Slabs of dark polished glass turning very slowly against black. Almost the
 * whole frame is unlit; what you see are thin bright lines running down the
 * edges where the bevels catch a light. The blocks are the brand mark:
 * separate systems, same material, moving together.
 *
 * Rendered live rather than shipped as a video. The reference for this look
 * uses a 3840×2160 mp4, which costs several megabytes and cannot adapt to the
 * viewport; this is a few thousand triangles and reframes itself on resize.
 */

/** Deterministic — a seeded generator keeps every render identical. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

type Slab = {
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number, number];
  spin: number;
  drift: number;
};

function useSlabs(count: number, seed: number): Slab[] {
  return useMemo(() => {
    const rand = rng(seed);
    return Array.from({ length: count }, () => {
      const base = 1.3 + rand() * 2.0;
      return {
        // Clustered toward centre and below, so the mass sits under the
        // headline rather than competing with it.
        position: [
          (rand() - 0.5) * 10,
          (rand() - 0.72) * 6,
          (rand() - 0.5) * 6 - 2.2,
        ],
        rotation: [rand() * Math.PI, rand() * Math.PI, rand() * Math.PI],
        // Kept close to cubic. Thin slabs read as shards or broken glass; the
        // form has to have obvious thickness for the edges to describe a solid.
        size: [base, base * (0.7 + rand() * 0.5), base * (0.6 + rand() * 0.45)],
        spin: (rand() - 0.5) * 0.5 + (rand() > 0.5 ? 0.25 : -0.25),
        drift: rand() * Math.PI * 2,
      } satisfies Slab;
    });
  }, [count, seed]);
}

function Slabs({ slabs }: { slabs: Slab[] }) {
  const group = useRef<THREE.Group>(null);
  const meshes = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock, pointer }, delta) => {
    const t = clock.elapsedTime;
    // Clamp so a backgrounded tab does not resume with one enormous jump.
    const step = Math.min(delta, 0.05);

    meshes.current.forEach((mesh, i) => {
      if (!mesh) return;
      const slab = slabs[i];
      mesh.rotation.x += slab.spin * step * 0.12;
      mesh.rotation.y += slab.spin * step * 0.17;
      mesh.position.y = slab.position[1] + Math.sin(t * 0.18 + slab.drift) * 0.22;
    });

    if (group.current) {
      // Parallax, heavily damped. The scene leads the cursor rather than
      // tracking it — tracking reads as a gimmick, lag reads as weight.
      group.current.rotation.y +=
        (pointer.x * 0.14 - group.current.rotation.y) * 0.02;
      group.current.rotation.x +=
        (-pointer.y * 0.09 - group.current.rotation.x) * 0.02;
    }
  });

  return (
    <group ref={group}>
      {slabs.map((slab, i) => (
        <RoundedBox
          key={i}
          ref={(el: THREE.Mesh | null) => {
            meshes.current[i] = el;
          }}
          args={slab.size}
          // A hard 90° edge shows a sudden change of reflection; a small bevel
          // shows a thin bright line. That line is the entire look.
          radius={0.045}
          smoothness={5}
          position={slab.position}
          rotation={slab.rotation}
        >
          {/*
            Metalness is deliberately zero. A metal tints its reflections by
            its own base colour, so a near-black metal reflects near-black and
            the whole field disappears — which is exactly what happened on the
            first pass. A black *dielectric* keeps an untinted white specular
            over an unlit body, which is what dark glass actually looks like.
          */}
          <meshPhysicalMaterial
            color="#000000"
            metalness={0}
            roughness={0.08}
            clearcoat={1}
            clearcoatRoughness={0.02}
            reflectivity={1}
            ior={1.7}
            envMapIntensity={1.5}
          />
        </RoundedBox>
      ))}
    </group>
  );
}

/**
 * Studio lighting.
 *
 * A polished surface shows almost nothing of a directional light — what you see
 * reflected in glass is the *shape of the room*. So the room is built
 * explicitly: a couple of broad panels for volume, and several narrow bright
 * strips for the edges. See the note inside for why both are needed.
 *
 * Built from geometry rather than an HDRI file, so there is no network fetch
 * and nothing to 404 in production.
 */
function Studio() {
  return (
    <>
      <Environment resolution={512} frames={1}>
        {/* Black room. Anything that is not a strip must read as void. */}
        <mesh scale={120}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color="#000000" side={THREE.BackSide} />
        </mesh>

        {/*
          Two kinds of source, doing two different jobs.

          Large soft panels produce the broad gradient that sweeps across a flat
          face as it turns — that gradient is what gives each slab volume.
          Narrow strips produce the hard bright line down a bevelled edge. Use
          only the soft panels and everything reads as flat grey card; use only
          the strips and the frame goes black. Both are needed.
        */}

        {/* Soft key — a big panel high and right. */}
        <Lightformer
          form="rect"
          intensity={2.4}
          position={[7, 4, 2]}
          rotation={[0, -Math.PI / 2.4, 0]}
          scale={[8, 10, 1]}
          color="#ffffff"
        />
        {/* Soft fill — wider, dimmer, cool, opposite side. */}
        <Lightformer
          form="rect"
          intensity={1.1}
          position={[-8, -1, 1]}
          rotation={[0, Math.PI / 2.4, 0]}
          scale={[8, 9, 1]}
          color="#98a2bd"
        />

        {/* Hard strips — the edge lines. */}
        {[3.5, 0.5, -2.5].map((y, i) => (
          <Lightformer
            key={i}
            form="rect"
            intensity={11}
            position={[4.5, y, 4]}
            rotation={[0, -Math.PI / 5, 0]}
            scale={[0.35, 14, 1]}
            color="#ffffff"
          />
        ))}

        {/* Top bar — the highlight that travels across a face as it turns. */}
        <Lightformer
          form="rect"
          intensity={5.5}
          position={[0, 7, 2]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[16, 1.2, 1]}
          color="#ffffff"
        />

        {/* Hot spot near camera — gives every slab one bright facet. */}
        <Lightformer
          form="circle"
          intensity={4}
          position={[-2.5, 2.5, 7]}
          scale={[3, 3, 1]}
          color="#ffffff"
        />
      </Environment>

      {/* A trace of direct light so faces square to camera are not pure void. */}
      <directionalLight position={[4, 6, 6]} intensity={0.5} />
    </>
  );
}

export function BlockField({
  className,
  density = 14,
  seed = 20260806,
}: {
  className?: string;
  /** Fewer blocks for the strip between sections. */
  density?: number;
  seed?: number;
}) {
  const slabs = useSlabs(density, seed);

  return (
    <div className={className} aria-hidden>
      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 7.4], fov: 44 }}
        onCreated={({ gl }) => {
          // Without tone mapping the clearcoat highlights clip to flat white.
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.72;
        }}
      >
        <Studio />
        <Slabs slabs={slabs} />
      </Canvas>
    </div>
  );
}
