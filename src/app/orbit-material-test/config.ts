/**
 * Review-harness configuration, shared by the server page and the client scene.
 *
 * Lives outside the client component so the server can validate query params
 * against the same lists the scene uses — that shared source of truth is what
 * lets params be resolved before the Canvas ever mounts.
 */

export const MODELS = {
  "additive-full": "/models/brand-world-additive.glb",
  "additive-proof": "/models/brand-world-proof.glb",
  // Rejected boolean-subtraction version, kept only as a documented failure.
  "rejected-boolean": "/models/brand-world-blockout.glb",
} as const;

export type ModelKey = keyof typeof MODELS;
export const MODEL_KEYS = Object.keys(MODELS) as ModelKey[];

export const MODES = ["clay", "dark", "silhouette"] as const;
export type Mode = (typeof MODES)[number];

/**
 * Deterministic review cameras. Every artifact angle is reproducible from a URL
 * so reviews never depend on hand-dragging orbit controls.
 *
 * `hero` is the designed three-quarter angle — yaw 24°, pitch 9°, distance 3.55.
 * The thumbnail is judged from here, never from a dead front view.
 */
export const VIEWS = {
  hero: { pos: [1.426, 0.555, 3.203], target: [0, -0.04, 0], fov: 40 },
  front: { pos: [0.0, 0.35, 3.75], target: [0, -0.02, 0], fov: 40 },
  rear: { pos: [0.9, 0.7, -3.55], target: [0, 0, 0], fov: 40 },
  side: { pos: [-3.45, 0.5, 1.15], target: [0, 0, 0], fov: 40 },
  elevated: { pos: [1.5, 3.1, 2.4], target: [0, 0, 0], fov: 40 },
  mobile: { pos: [1.539, 0.936, 4.229], target: [0, -0.02, 0], fov: 46 },
  thumb: { pos: [1.426, 0.555, 3.203], target: [0, -0.04, 0], fov: 40 },
} as const;

export type ViewKey = keyof typeof VIEWS;
export const VIEW_KEYS = Object.keys(VIEWS) as ViewKey[];

/**
 * Calibrated dark-studio values. An earlier rig (key 2.6 + rim 1.5 + fill 0.5 +
 * ambient 0.18 + env 0.45) washed graphite to pale blue-grey; these are far
 * lower and let falloff and reflection do the work instead of raw intensity.
 */
export const DARK_RIG = {
  key: 1.15,
  fill: 0.14,
  rim: 0.45,
  ambient: 0.03,
  env: 0.22,
  exposure: 0.95,
  background: "#0a0c12",
} as const;

export const CLAY_RIG = {
  key: 1.9,
  fill: 0.55,
  rim: 0.5,
  ambient: 0.35,
  env: 0.55,
  exposure: 1.0,
  background: "#8e9299",
} as const;
