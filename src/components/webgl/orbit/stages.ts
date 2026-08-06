/**
 * THE ORBIT — the master stage table.
 *
 * One normalised scroll progress (0 → 1) resolves to one scene state. This is
 * the single source of truth for the camera, the sphere, the satellites and the
 * lighting. Nothing else in the scene may write those values — competing
 * writers are the most common way these builds break.
 */

export const STAGES = [
  "atmosphereCloseup",
  "worldReveal",
  "orbitActivation",
  "serviceOneFocus",
  "serviceTwoFocus",
  "serviceThreeFocus",
  "ecosystemAlignment",
  "finalDestination",
] as const;

export type StageName = (typeof STAGES)[number];

/** Accent per capability. Never reused across services. */
export const ACCENT = {
  lead: "#35e0c4",
  orderrise: "#ffa63d",
  agents: "#8f7cff",
  unified: "#ffd39b",
} as const;

/** Orbit geometry. Radii and inclinations chosen so no satellite ever hides
 *  behind another at any of the eight camera states. */
export const ORBITS = [
  { radius: 4.8, inclination: 0.21, restAngle: 0.35, accent: ACCENT.lead },
  { radius: 6.1, inclination: -0.49, restAngle: 2.88, accent: ACCENT.orderrise },
  { radius: 7.4, inclination: 0.8, restAngle: 4.63, accent: ACCENT.agents },
] as const;

export type SceneState = {
  camera: [number, number, number];
  target: [number, number, number];
  /** Sphere Y rotation. Directed, never free-running. */
  worldSpin: number;
  /** 0 → orbit paths invisible, 1 → fully drawn. */
  orbitReveal: number;
  /** Per-satellite presence: 0 hidden, 1 fully in position. */
  satellites: [number, number, number];
  /** Per-satellite emphasis: dimmed services sit at 0.25, never black. */
  emphasis: [number, number, number];
  /** How far each satellite has travelled along its orbit from rest. */
  orbitAdvance: number;
  /** Internal light of the Brand World; unifies to gold at the end. */
  coreLight: number;
  keyLight: number;
  /** Ambient drift multiplier. Near zero at stillness points. */
  drift: number;
};

type Keyframe = { at: number; stage: StageName } & SceneState;

/**
 * Eight art-directed stages. Read this table as the storyboard.
 *
 * Four deliberate stillness points — worldReveal, orbitActivation,
 * ecosystemAlignment and finalDestination all hold `drift` near zero so copy
 * can be read against a near-static scene.
 */
const KEYFRAMES: Keyframe[] = [
  {
    at: 0.0,
    stage: "atmosphereCloseup",
    // Outside the 2.4-radius shell, but far enough that the curve and the lit
    // aperture edge are both legible. At 0.15 units off the surface the frame
    // filled with flat dark and the opening read as an empty screen.
    camera: [3.15, 0.55, 1.5],
    target: [0, 0, 0],
    worldSpin: 0,
    orbitReveal: 0,
    satellites: [0, 0, 0],
    emphasis: [0.25, 0.25, 0.25],
    orbitAdvance: 0,
    coreLight: 0.25,
    keyLight: 1.4,
    drift: 0.3,
  },
  {
    at: 0.12,
    stage: "worldReveal",
    camera: [4.2, 1.8, 6.4],
    target: [0, 0, 0],
    worldSpin: 0.5,
    orbitReveal: 0,
    satellites: [0, 0, 0],
    emphasis: [0.25, 0.25, 0.25],
    orbitAdvance: 0,
    coreLight: 0.55,
    keyLight: 1.7,
    drift: 0.08, // stillness
  },
  {
    at: 0.28,
    stage: "orbitActivation",
    camera: [0.5, 3.4, 11.5],
    target: [0, 0, 0],
    worldSpin: 0.75,
    orbitReveal: 1,
    satellites: [1, 1, 1],
    emphasis: [1, 1, 1],
    orbitAdvance: 0,
    coreLight: 0.7,
    keyLight: 1.8,
    drift: 0.06, // stillness
  },
  {
    at: 0.41,
    stage: "serviceOneFocus",
    camera: [5.4, 1.4, 6.2],
    target: [4.6, 0.9, 0],
    worldSpin: 0.9,
    orbitReveal: 1,
    satellites: [1, 1, 1],
    emphasis: [1, 0.25, 0.25],
    orbitAdvance: 0.12,
    coreLight: 0.7,
    keyLight: 1.9,
    drift: 0.1,
  },
  {
    at: 0.55,
    stage: "serviceTwoFocus",
    camera: [-4.8, -0.6, 6.6],
    target: [-4.2, -0.4, 0],
    worldSpin: 1.25,
    orbitReveal: 1,
    satellites: [1, 1, 1],
    emphasis: [0.25, 1, 0.25],
    orbitAdvance: 0.26,
    coreLight: 0.75,
    keyLight: 1.9,
    drift: 0.1,
  },
  {
    at: 0.69,
    stage: "serviceThreeFocus",
    camera: [1.6, -4.2, 6.0],
    target: [0.8, -3.4, 0],
    worldSpin: 1.6,
    orbitReveal: 1,
    satellites: [1, 1, 1],
    emphasis: [0.25, 0.25, 1],
    orbitAdvance: 0.4,
    coreLight: 0.8,
    keyLight: 1.95,
    drift: 0.1,
  },
  {
    at: 0.84,
    stage: "ecosystemAlignment",
    camera: [0, 2.6, 14.5],
    target: [0, 0, 0],
    worldSpin: 1.9,
    orbitReveal: 1,
    satellites: [1, 1, 1],
    emphasis: [1, 1, 1],
    orbitAdvance: 0.5,
    coreLight: 1.6, // all three signals absorbed
    keyLight: 1.7,
    drift: 0.04, // deepest stillness — proof numbers are read here
  },
  {
    at: 1.0,
    stage: "finalDestination",
    camera: [2.2, 1.2, 12.0],
    target: [-0.6, 0, 0],
    worldSpin: 2.1,
    orbitReveal: 0.75, // paths thin and calm
    satellites: [1, 1, 1],
    emphasis: [0.8, 0.8, 0.8],
    orbitAdvance: 0.58,
    coreLight: 2.0,
    keyLight: 1.8,
    drift: 0.05, // stillness
  },
];

/** Stage boundaries, for the HUD and for stage-synced copy. */
export const STAGE_BOUNDS = KEYFRAMES.map((k, i) => ({
  stage: k.stage,
  from: k.at,
  to: KEYFRAMES[i + 1]?.at ?? 1,
}));

export function stageIndexAt(progress: number) {
  const p = Math.min(1, Math.max(0, progress));
  for (let i = STAGE_BOUNDS.length - 1; i >= 0; i--) {
    if (p >= STAGE_BOUNDS[i].from) return i;
  }
  return 0;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Smootherstep — flat at both ends so stage boundaries never read as a gear change. */
const ease = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

const lerp3 = (a: readonly number[], b: readonly number[], t: number) =>
  [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)] as [number, number, number];

/**
 * Mobile framing is a different composition, not a scaled-down desktop one:
 * the camera sits further back and the orbits pull in, or the satellites fall
 * outside a portrait viewport entirely.
 */
export function sceneAt(progress: number, compact = false): SceneState {
  const p = Math.min(1, Math.max(0, progress));

  let a = KEYFRAMES[0];
  let b = KEYFRAMES[KEYFRAMES.length - 1];
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    if (p >= KEYFRAMES[i].at && p <= KEYFRAMES[i + 1].at) {
      a = KEYFRAMES[i];
      b = KEYFRAMES[i + 1];
      break;
    }
  }

  const span = b.at - a.at;
  const t = span > 0 ? ease((p - a.at) / span) : 0;

  const camera = lerp3(a.camera, b.camera, t);
  const target = lerp3(a.target, b.target, t);

  if (compact) {
    // Pull back and flatten: portrait viewports need more headroom and less
    // lateral travel, and the copy column occupies the whole width.
    camera[2] *= 1.34;
    camera[0] *= 0.66;
    target[0] *= 0.66;
  } else {
    // Desktop: bias the composition right so the copy column on the left is
    // never fighting the ecosystem for the same pixels.
    target[0] -= 1.35;
  }

  return {
    camera,
    target,
    worldSpin: lerp(a.worldSpin, b.worldSpin, t),
    orbitReveal: lerp(a.orbitReveal, b.orbitReveal, t),
    satellites: lerp3(a.satellites, b.satellites, t),
    emphasis: lerp3(a.emphasis, b.emphasis, t),
    orbitAdvance: lerp(a.orbitAdvance, b.orbitAdvance, t),
    coreLight: lerp(a.coreLight, b.coreLight, t),
    keyLight: lerp(a.keyLight, b.keyLight, t),
    drift: lerp(a.drift, b.drift, t),
  };
}

/** Orbit-space position for a satellite at a given advance along its path. */
export function orbitPosition(index: number, advance: number): [number, number, number] {
  const o = ORBITS[index];
  const angle = o.restAngle + advance * Math.PI * 2;
  const x = Math.cos(angle) * o.radius;
  const z = Math.sin(angle) * o.radius;
  // Inclination tilts the ring about the X axis.
  const y = z * Math.sin(o.inclination);
  return [x, y, z * Math.cos(o.inclination)];
}
