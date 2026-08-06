"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * The block field — the one visual on the site.
 *
 * A few very large blocks of dark transmissive glass. It is not decoration: the
 * scene states the business.
 *
 * Blocks begin unsorted, unaligned and tumbling — work as it actually arrives —
 * and resolve into an even, level row over the first few seconds. Same work, run
 * as a system. Three of them carry the product accents and land in the same
 * left-to-right order as the index rows beneath the hero, so once it settles the
 * picture is literally what is for sale rather than an abstract mood.
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

type Vec3 = [number, number, number];

type Block = {
  /** Where it starts: unsorted, unaligned, drifting. */
  chaos: { position: Vec3; rotation: Vec3 };
  /** Where it ends: placed, level, square to camera. */
  order: { position: Vec3; rotation: Vec3 };
  size: Vec3;
  spin: [number, number];
  drift: number;
  /** Set on the three product blocks. Tints the glass. */
  accent: string | null;
};

/**
 * The three product accents, in the same left-to-right order as the index rows
 * under the hero. This is the whole reason the scene means anything: once the
 * blocks settle, the teal one sits above "01 Maps Lead Scraper", the amber
 * above "02 OrderRise", the violet above "03 Custom AI Agents". The visual
 * stops being an abstract mood and becomes a picture of what is for sale.
 */
const PRODUCT_ACCENTS = ["#128a72", "#9c5a08", "#4a37a8"];

/** Shared resting rotation. Identical across blocks is what reads as "aligned". */
const RESTING_ROTATION: Vec3 = [0, -0.32, 0];

function useBlocks(
  count: number,
  seed: number,
  scale: number,
  clearCentre: boolean,
): Block[] {
  return useMemo(() => {
    const rand = rng(seed);

    // The first three are the products and get the accents and the front row.
    const featured = Math.min(3, count);

    return Array.from({ length: count }, (_, i) => {
      const isProduct = i < featured;
      const base = (isProduct ? 2.1 : 1.6 + rand() * 1.2) * scale;

      /*
       * Horizontal placement in the scattered state.
       *
       * On pages whose headline runs through the middle of the frame, blocks
       * are pushed out to either side to leave a corridor. Scrims alone could
       * not solve this: a face turning to catch the key light goes near-white,
       * and no amount of overlay makes white type legible on it. Moving the
       * geometry is the only fix that holds at every frame of the animation.
       */
      const spread = (rand() - 0.5) * 11;
      const chaosX = clearCentre
        ? Math.sign(spread || 1) * (3.6 + Math.abs(spread) * 0.7)
        : spread;

      const chaos = {
        position: [
          chaosX,
          (rand() - 0.5) * 6.5,
          // Spread in depth so some read as near and some as far. Everything at
          // one depth flattens the frame into a pattern.
          (rand() - 0.5) * 7 - 1,
        ] as Vec3,
        rotation: [rand() * Math.PI, rand() * Math.PI, rand() * Math.PI] as Vec3,
      };

      /*
       * The resolved state.
       *
       * Products land in an evenly spaced front row. Everything else retreats
       * into a calm back rank, out of the way and out of focus — the supporting
       * blocks exist to give the row depth, not to compete with it.
       *
       * Where a corridor is required the row splits either side of it, because
       * legibility of the copy outranks the tidiness of the formation.
       */
      const slot = isProduct ? i - (featured - 1) / 2 : 0;
      const backX = clearCentre
        ? Math.sign(spread || 1) * (5.2 + (i % 3) * 1.4)
        : (rand() - 0.5) * 13;

      const order = {
        position: (isProduct
          ? clearCentre
            ? [Math.sign(slot || 1) * 4.6, slot * 1.9, -0.5]
            : [slot * 4.3, -0.4, 0]
          : [backX, (rand() - 0.5) * 5, -5.5 - rand() * 2]) as Vec3,
        rotation: RESTING_ROTATION,
      };

      return {
        chaos,
        order,
        // Near-cubic. The small variation stops them reading as a tiled set.
        size: [base, base * (0.86 + rand() * 0.28), base * (0.86 + rand() * 0.28)] as Vec3,
        // Two independent axes, so no two blocks tumble in step.
        spin: [(rand() - 0.5) * 0.5, (rand() - 0.5) * 0.5],
        drift: rand() * Math.PI * 2,
        accent: isProduct ? PRODUCT_ACCENTS[i] : null,
      } satisfies Block;
    });
  }, [count, seed, scale, clearCentre]);
}

/**
 * Timing of the hero's resolve, in seconds. Long enough to be watched rather
 * than glimpsed; short enough that it has finished before anyone scrolls.
 */
const RESOLVE_DELAY = 0.7;
const RESOLVE_DURATION = 3.4;

/** Smoothstep — eases both ends, so nothing starts or stops abruptly. */
function ease(x: number) {
  const c = Math.min(1, Math.max(0, x));
  return c * c * (3 - 2 * c);
}

function Blocks({
  blocks,
  parallax,
  formation,
}: {
  blocks: Block[];
  /** 0 disables scroll response — used for the mid-page interstitial. */
  parallax: number;
  /**
   * Fixed resolve amount, 0–1, for scenes that should simply sit at a given
   * state. Ignored on the hero, which plays the resolve on a timer.
   */
  formation: number;
}) {
  const group = useRef<THREE.Group>(null);
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const scroll = useRef(0);

  useFrame(({ clock, pointer, camera }) => {
    const t = clock.elapsedTime;

    /*
     * Scroll progress. Read from the DOM in the frame loop rather than from a
     * scroll event, because Lenis animates scroll position outside the event
     * loop and a listener would quantise the motion into steps.
     */
    if (parallax > 0) {
      const target = Math.min(1, window.scrollY / window.innerHeight);
      scroll.current += (target - scroll.current) * 0.06;
    }

    /*
     * The resolve — the thing that makes the scene say something.
     *
     * Blocks start unsorted, unaligned and tumbling — work as it actually
     * arrives — and settle into an even, level row: the same work, run as a
     * system. The three tinted blocks land in the same left-to-right order as
     * the product index directly beneath them, so what you end up looking at
     * is a picture of what is for sale.
     *
     * It plays on a timer, not on scroll. Tied to scroll it only finished as
     * the hero was leaving the viewport, which meant nobody ever saw it land —
     * the entire point of the animation was happening off screen. On a clock
     * it reads in the first few seconds without the visitor doing anything.
     *
     * Everything below derives from this one number, so there is no state to
     * fall out of sync.
     */
    const p =
      parallax > 0 ? ease((t - RESOLVE_DELAY) / RESOLVE_DURATION) : ease(formation);
    const chaosAmount = 1 - p;

    meshes.current.forEach((mesh, i) => {
      if (!mesh) return;
      const b = blocks[i];

      // Tumbling decays to nothing as the formation resolves.
      const tumble = t * 0.14 * chaosAmount;
      mesh.rotation.set(
        b.chaos.rotation[0] * chaosAmount + b.order.rotation[0] * p + b.spin[0] * tumble,
        b.chaos.rotation[1] * chaosAmount + b.order.rotation[1] * p + b.spin[1] * tumble,
        b.chaos.rotation[2] * chaosAmount + b.order.rotation[2] * p,
      );

      // Idle drift fades out too — a resolved system should look settled.
      const drift = Math.sin(t * 0.16 + b.drift) * 0.3 * chaosAmount;

      mesh.position.set(
        b.chaos.position[0] * chaosAmount + b.order.position[0] * p,
        b.chaos.position[1] * chaosAmount + b.order.position[1] * p + drift,
        b.chaos.position[2] * chaosAmount + b.order.position[2] * p,
      );
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
      // The camera travels through the cluster as the page moves, so near
      // blocks slide past far ones at different rates. That differential is
      // the depth cue a pre-rendered video cannot produce.
      const s = scroll.current;
      camera.position.z = 8.5 - s * 2.4;
      camera.position.y = s * 0.8;
      camera.rotation.x = -s * 0.07;
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
          smoothness={3}
        >
          {/*
            Real transmissive glass — light passes through the solid and
            refracts, so you see the far faces and whatever sits behind.

            Two things about transmission are counter-intuitive and both bit
            this scene:

            `color` must stay white. On an opaque surface colour is what you
            see; on a transmissive one it multiplies the light *coming
            through*, so a black colour absorbs everything and the block turns
            into a flat black cutout — which is the exact opposite of glass.
            The smoke tint has to come from attenuation instead.

            `attenuationColor` with `attenuationDistance` is the physical way
            to darken it: light is absorbed as it travels through the volume,
            so thin parts stay clear and thick parts go dark. That gradient
            across a single block is what makes it read as a solid rather than
            a tinted sheet.

            Metalness stays zero. A metal tints reflections by its own base
            colour and admits no transmission at all.
          */}
          <meshPhysicalMaterial
            color="#ffffff"
            metalness={0}
            roughness={0.05}
            transmission={1}
            // Thickness drives how far light travels inside, so it has to
            // track block size or big blocks read as thin shells.
            thickness={block.size[0] * 0.9}
            // Product blocks are tinted; the supporting rank stays neutral so
            // it recedes rather than competing with them.
            attenuationColor={block.accent ?? "#333a47"}
            attenuationDistance={block.accent ? 0.85 : 1.0}
            ior={1.52}
            clearcoat={1}
            clearcoatRoughness={0.02}
            reflectivity={1}
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
      <Environment resolution={256} frames={1}>
        {/* Black room. Anything that is not a source must read as void. */}
        <mesh scale={140}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color="#000000" side={THREE.BackSide} />
        </mesh>

        {/* Key — a tall bright panel high and right. Carries the main sweep. */}
        <Lightformer
          form="rect"
          intensity={6.5}
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
          intensity={0.55}
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
  clearCentre = false,
  formation = 1,
}: {
  className?: string;
  /** Deliberately low. Few large blocks; a crowd of small ones reads as debris. */
  density?: number;
  seed?: number;
  scale?: number;
  /** Enables the scroll-driven camera. Hero only. */
  parallax?: number;
  /** Leaves a corridor down the middle for pages with centred headlines. */
  clearCentre?: boolean;
  /**
   * How resolved the formation sits, 0 (scattered) to 1 (aligned). Ignored
   * when `parallax` is on, since the hero animates the resolve on a timer.
   */
  formation?: number;
}) {
  const blocks = useBlocks(density, seed, scale, clearCentre);
  const host = useRef<HTMLDivElement>(null);

  /*
   * Only render while on screen.
   *
   * Every page carries two of these, and a transmissive material forces the
   * renderer to draw the whole scene a second time into a transmission buffer
   * on every frame. Two canvases both doing that continuously — including the
   * one metres below the fold — is what locked up the main thread.
   *
   * `frameloop="never"` stops the loop entirely rather than merely skipping
   * draws, so an off-screen canvas costs nothing at all.
   */
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setLive(entry.isIntersecting),
      // Start a little early so the scene is already moving when it arrives.
      { rootMargin: "150px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /*
   * Resolution is the other half of the cost, and it is quadratic. Start at a
   * modest cap rather than the display's full ratio — at dpr 1.75 a 1900px
   * canvas is rendering 11M pixels per frame, twice, for a background.
   */
  const [dpr, setDpr] = useState(1.2);

  // Honour reduced motion by rendering a single frame and then stopping.
  const reduced = useReducedMotion();

  const frameloop = reduced ? "demand" : live ? "always" : "never";

  return (
    <div ref={host} className={className} aria-hidden>
      <Canvas
        frameloop={frameloop}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        dpr={dpr}
        camera={{ position: [0, 0, 8.5], fov: 44 }}
        onCreated={({ gl }) => {
          // Without tone mapping the specular sweeps clip to a flat white slab
          // and the gradient across each face is lost.
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.82;
          /*
           * The transmission pass does not need full resolution. It is only
           * ever seen refracted through glass, which blurs it anyway, so half
           * resolution is invisible here and quarters that pass's pixel cost.
           */
          gl.transmissionResolutionScale = 0.5;
        }}
      >
        {/*
          Steps resolution down if the machine cannot hold frame rate, and back
          up if it can. A fixed dpr that happens to suit this laptop is not a
          performance decision, it is a guess about someone else's hardware.
        */}
        <PerformanceMonitor
          onDecline={() => setDpr((d) => Math.max(0.75, d - 0.25))}
          onIncline={() => setDpr((d) => Math.min(1.5, d + 0.25))}
          // Lowering resolution raises frame rate, which can read as headroom
          // and raise it straight back. `flipflops` caps how many times that
          // can reverse before `onFallback` pins the value for good — without
          // it the monitor can sit there oscillating, which is worse than any
          // resolution it might have settled on.
          flipflops={3}
          onFallback={() => setDpr(0.75)}
        />
        <Studio />
        <Blocks blocks={blocks} parallax={parallax} formation={formation} />
      </Canvas>
    </div>
  );
}
