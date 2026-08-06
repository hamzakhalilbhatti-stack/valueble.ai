"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/**
 * The block field — the one visual on the site.
 *
 * A few very large cubes of mirror-polished dark glass, tumbling slowly against
 * black. The blocks are the brand mark: separate systems, same material, moving
 * together.
 *
 * Proportions were taken off the reference frame by frame rather than guessed.
 * The things that actually carry the look, in order of importance:
 *
 *   1. Scale. Three or four cubes each spanning a quarter of the viewport —
 *      not a dozen small ones. A crowd of small blocks reads as debris.
 *   2. Contrast. Faces sweep from near-white to pure black across a single
 *      surface. That sweep is the whole effect; a uniform grey face is dead.
 *   3. Cubic proportion. Flattened boxes read as shards of broken glass.
 *
 * Rendered live rather than shipped as a video. The reference uses a 3840×2160
 * mp4, which costs several megabytes, cannot adapt to the viewport, and cannot
 * react to anything the visitor does. This costs no download, reframes itself
 * on resize, and moves with the cursor and the scroll.
 */

/** Deterministic — a seeded generator keeps every render identical. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

type Block = {
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number, number];
  spin: [number, number];
  drift: number;
};

function useBlocks(count: number, seed: number, scale: number): Block[] {
  return useMemo(() => {
    const rand = rng(seed);
    return Array.from({ length: count }, () => {
      const base = (1.9 + rand() * 1.5) * scale;
      return {
        position: [
          (rand() - 0.5) * 11,
          (rand() - 0.5) * 6.5,
          // Spread in depth so some read as near and some as far. Everything at
          // one depth flattens the frame into a pattern.
          (rand() - 0.5) * 7 - 1,
        ],
        rotation: [rand() * Math.PI, rand() * Math.PI, rand() * Math.PI],
        // Near-cubic. The small variation stops them reading as a tiled set.
        size: [base, base * (0.86 + rand() * 0.28), base * (0.86 + rand() * 0.28)],
        // Two independent axes, so no two blocks tumble in step.
        spin: [(rand() - 0.5) * 0.5, (rand() - 0.5) * 0.5],
        drift: rand() * Math.PI * 2,
      } satisfies Block;
    });
  }, [count, seed, scale]);
}

function Blocks({
  blocks,
  parallax,
}: {
  blocks: Block[];
  /** 0 disables scroll response — used for the mid-page interstitial. */
  parallax: number;
}) {
  const group = useRef<THREE.Group>(null);
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const scroll = useRef(0);

  useFrame(({ clock, pointer, camera }, delta) => {
    const t = clock.elapsedTime;
    // Clamp so a backgrounded tab does not resume with one enormous jump.
    const step = Math.min(delta, 0.05);

    meshes.current.forEach((mesh, i) => {
      if (!mesh) return;
      const block = blocks[i];
      mesh.rotation.x += block.spin[0] * step * 0.14;
      mesh.rotation.y += block.spin[1] * step * 0.14;
      mesh.position.y = block.position[1] + Math.sin(t * 0.16 + block.drift) * 0.3;
    });

    if (group.current) {
      // Cursor parallax, heavily damped. The scene leads the pointer rather
      // than tracking it — tracking reads as a gimmick, lag reads as weight.
      group.current.rotation.y +=
        (pointer.x * 0.13 - group.current.rotation.y) * 0.02;
      group.current.rotation.x +=
        (-pointer.y * 0.08 - group.current.rotation.x) * 0.02;
    }

    if (parallax > 0) {
      /*
       * Scroll-driven camera.
       *
       * This is the part a pre-rendered video cannot do: as the page moves the
       * camera actually travels through the cluster, so near blocks slide past
       * far ones at different rates. That differential is what reads as depth.
       *
       * Read from the DOM rather than from a scroll event, because Lenis
       * animates scroll position outside the event loop and a listener would
       * quantise the motion into steps.
       */
      const target = Math.min(1, window.scrollY / window.innerHeight);
      scroll.current += (target - scroll.current) * 0.06;
      const p = scroll.current;

      camera.position.z = 8.5 - p * 3.2;
      camera.position.y = p * 1.1;
      camera.rotation.x = -p * 0.09;
    }
  });

  return (
    <group ref={group}>
      {blocks.map((block, i) => (
        <RoundedBox
          key={i}
          ref={(el: THREE.Mesh | null) => {
            meshes.current[i] = el;
          }}
          args={block.size}
          // A hard 90° edge shows a sudden change of reflection; a chamfer
          // shows a thin bright line running the length of the edge. At this
          // block size the bevel has to grow with it to stay visible.
          radius={0.09}
          smoothness={6}
          position={block.position}
          rotation={block.rotation}
        >
          {/*
            Metalness is deliberately zero. A metal tints its reflections by
            its own base colour, so a near-black metal reflects near-black and
            the whole field disappears — which is exactly what happened on an
            earlier pass. A black *dielectric* keeps an untinted white specular
            over an unlit body, which is what polished dark glass actually is.
          */}
          <meshPhysicalMaterial
            color="#000000"
            metalness={0}
            roughness={0.02}
            clearcoat={1}
            clearcoatRoughness={0.01}
            reflectivity={1}
            ior={1.9}
            envMapIntensity={2.2}
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
 * explicitly, and it needs two kinds of source doing two different jobs:
 *
 *   Broad panels produce the long gradient that sweeps from white to black
 *   across a single face as it turns. That sweep is what gives a face volume.
 *
 *   Narrow strips produce the hard bright line down a chamfered edge.
 *
 * Panels alone give flat grey card. Strips alone give a black frame. Both were
 * tried on their own before this; neither works.
 *
 * Built from geometry rather than an HDRI file, so there is no network fetch
 * and nothing to 404 in production.
 */
function Studio() {
  return (
    <>
      <Environment resolution={512} frames={1}>
        {/* Black room. Anything that is not a source must read as void. */}
        <mesh scale={140}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color="#000000" side={THREE.BackSide} />
        </mesh>

        {/* Key — a tall bright panel high and right. Carries the main sweep. */}
        <Lightformer
          form="rect"
          intensity={8}
          position={[6, 4, 4]}
          rotation={[0, -Math.PI / 3, 0]}
          scale={[11, 17, 1]}
          color="#ffffff"
        />

        {/* Fill — cool, dimmer, opposite side. Keeps the shadow face alive. */}
        <Lightformer
          form="rect"
          intensity={1.8}
          position={[-7, -2, 3]}
          rotation={[0, Math.PI / 3, 0]}
          scale={[9, 12, 1]}
          color="#9fb0d0"
        />

        {/* Overhead bar — the highlight that runs across a top face. */}
        <Lightformer
          form="rect"
          intensity={6.5}
          position={[0, 8, 2]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[20, 4, 1]}
          color="#ffffff"
        />

        {/* Edge strips — the hard lines along the chamfers. */}
        {[4, 0, -4].map((y, i) => (
          <Lightformer
            key={i}
            form="rect"
            intensity={16}
            position={[5, y, 6]}
            rotation={[0, -Math.PI / 6, 0]}
            scale={[0.4, 16, 1]}
            color="#ffffff"
          />
        ))}

        {/*
          Front fill — guarantees every block has one bright facet.

          A rectangle, not a circle. A circular source reflects as a
          recognisable disc, and once the eye reads that blob as a light bulb
          the illusion of a polished solid is gone. Rectangles read as studio
          panels, which is what they are.
        */}
        <Lightformer
          form="rect"
          intensity={4}
          position={[-3, 2, 8]}
          scale={[6, 4, 1]}
          color="#ffffff"
        />

        {/*
          Camera-side softbox — dim, but very wide.

          This exists to guarantee the frame is never empty. Every other source
          here is off to one side, so a block whose faces happen to point at
          camera reflects nothing but the black room and vanishes completely.
          The blocks tumble, so that is not a rare orientation: the hero
          rendered as an empty black rectangle on load until this was added.

          It has to stay dim. Brightening it is what turns the whole field into
          flat grey card, since a broad frontal source reflects the same value
          across an entire face.
        */}
        <Lightformer
          form="rect"
          intensity={1.15}
          position={[0, 0, 12]}
          scale={[34, 22, 1]}
          color="#dfe4ee"
        />
      </Environment>

      {/*
        There is deliberately no direct light in this scene.

        On a black dielectric a punctual light contributes no diffuse term at
        all — base colour is #000, so the whole diffuse lobe is zero. The only
        thing it produced was its own specular reflection: a small round
        blown-out dot on every polished face, which reads as a light bulb
        floating inside the glass. The environment supplies everything real.
      */}
    </>
  );
}

export function BlockField({
  className,
  density = 5,
  seed = 20260806,
  scale = 1,
  parallax = 0,
}: {
  className?: string;
  /** Deliberately low. Few large blocks; a crowd of small ones reads as debris. */
  density?: number;
  seed?: number;
  scale?: number;
  /** Enables the scroll-driven camera. Hero only. */
  parallax?: number;
}) {
  const blocks = useBlocks(density, seed, scale);

  return (
    <div className={className} aria-hidden>
      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 8.5], fov: 44 }}
        onCreated={({ gl }) => {
          // Without tone mapping the specular sweeps clip to a flat white slab
          // and the gradient across each face is lost.
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1;
        }}
      >
        <Studio />
        <Blocks blocks={blocks} parallax={parallax} />
      </Canvas>
    </div>
  );
}
