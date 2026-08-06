"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  ACESFilmicToneMapping,
  Box3,
  Color,
  MeshBasicMaterial,
  MeshStandardMaterial,
  SRGBColorSpace,
  Vector3,
  type Mesh,
  type Object3D,
} from "three";

/**
 * Asset review route.
 *
 * Two deliberately different modes:
 *   clay       — judge FORM. Mid-grey, metalness 0, neutral light, pale bg.
 *   dark       — judge the production look. Restrained studio rig.
 *   silhouette — judge the PROFILE. Flat black on white.
 *
 * If the geometry only works in `dark`, the design is not ready — which is
 * exactly what the clay mode exists to expose.
 */

const MODELS = {
  "additive-proof": "/models/brand-world-proof.glb",
  "additive-full": "/models/brand-world-additive.glb",
  // Rejected boolean-subtraction version, kept only as a documented failure.
  "rejected-boolean": "/models/brand-world-blockout.glb",
} as const;

type ModelKey = keyof typeof MODELS;
type Mode = "clay" | "dark" | "silhouette";

/**
 * Calibrated dark-studio values.
 *
 * The previous rig (key 2.6 + rim 1.5 + fill 0.5 + ambient 0.18 + env 0.45)
 * washed graphite to pale blue-grey. Every value below is substantially lower;
 * the studio does its work through falloff and reflection, not raw intensity.
 */
const DARK_RIG = {
  key: 1.15,
  fill: 0.14,
  rim: 0.45,
  ambient: 0.03,
  env: 0.22,
  exposure: 0.95,
  background: "#0a0c12",
} as const;

const CLAY_RIG = {
  key: 1.9,
  fill: 0.55,
  rim: 0.5,
  ambient: 0.35,
  env: 0.55,
  exposure: 1.0,
  background: "#8e9299",
} as const;


/**
 * Deterministic review cameras. Every artifact angle is reproducible from a URL
 * so reviews never depend on hand-dragging orbit controls.
 */
const VIEWS = {
  front: { pos: [2.9, 1.5, 3.4], target: [0, 0, 0] },
  rear: { pos: [2.6, 0.9, -2.9], target: [0, 0, 0] },   // opposite the recess
  side: { pos: [-3.35, 0.55, 2.0], target: [0, 0, 0] },  // recess side (az ~290)
  elevated: { pos: [2.2, 4.2, 2.6], target: [0, 0, 0] },
  // Designed hero: yaw 24 deg, pitch 9 deg, distance 3.55. The thumbnail is
  // judged from HERE, not from a dead front view.
  hero: { pos: [1.426, 0.555, 3.203], target: [0, -0.04, 0] },
  mobile: { pos: [1.505, 0.936, 4.136], target: [0, -0.02, 0] },
  thumb: { pos: [1.426, 0.555, 3.203], target: [0, -0.04, 0] },
  bridge: { pos: [-1.4, 1.5, 2.4], target: [-0.55, 0.55, 0.9] },
  rib: { pos: [1.5, 0.9, 2.0], target: [0.55, 0.3, 0.75] },
  collar: { pos: [2.3, 0.15, 2.1], target: [0.5, 0, 0.5] },
} as const;
type ViewKey = keyof typeof VIEWS;

function PresetCamera({ view }: { view: ViewKey | null }) {
  const { camera } = useThree();
  useEffect(() => {
    if (!view) return;
    const v = VIEWS[view];
    camera.position.set(v.pos[0], v.pos[1], v.pos[2]);
    camera.lookAt(v.target[0], v.target[1], v.target[2]);
    camera.updateProjectionMatrix();
  }, [camera, view]);
  return null;
}

type Report = {
  meshes: number;
  triangles: number;
  vertices: number;
  materials: string[];
  size: [number, number, number];
  hasNormals: boolean;
};

function Model({
  url,
  mode,
  wireframe,
  onReport,
}: {
  url: string;
  mode: Mode;
  wireframe: boolean;
  onReport: (r: Report) => void;
}) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(true), [scene]);

  // Override materials per mode. Originals are kept so `dark` can restore them.
  useEffect(() => {
    let meshes = 0;
    let triangles = 0;
    let vertices = 0;
    let hasNormals = true;
    const materials = new Set<string>();

    cloned.traverse((child: Object3D) => {
      const mesh = child as Mesh;
      if (!mesh.isMesh) return;
      meshes += 1;
      const geo = mesh.geometry;
      const pos = geo.getAttribute("position");
      vertices += pos?.count ?? 0;
      triangles += geo.index ? geo.index.count / 3 : (pos?.count ?? 0) / 3;
      if (!geo.getAttribute("normal")) hasNormals = false;

      if (!mesh.userData.original) mesh.userData.original = mesh.material;
      const original = mesh.userData.original;
      (Array.isArray(original) ? original : [original]).forEach(
        (m) => m && materials.add(m.name || "(unnamed)"),
      );

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      if (mode === "clay") {
        mesh.material = new MeshStandardMaterial({
          color: new Color("#9a9a9a"),
          roughness: 0.62,
          metalness: 0,
          wireframe,
        });
      } else if (mode === "silhouette") {
        mesh.material = new MeshBasicMaterial({ color: new Color("#000000") });
      } else {
        mesh.material = original;
        (Array.isArray(original) ? original : [original]).forEach((m) => {
          if (m) (m as MeshStandardMaterial).wireframe = wireframe;
        });
      }
    });

    const box = new Box3().setFromObject(cloned);
    const size = new Vector3();
    box.getSize(size);

    onReport({
      meshes,
      triangles: Math.round(triangles),
      vertices,
      materials: [...materials],
      size: [+size.x.toFixed(3), +size.y.toFixed(3), +size.z.toFixed(3)],
      hasNormals,
    });
  }, [cloned, mode, wireframe, onReport]);

  return <primitive object={cloned} />;
}

function Rig({ mode }: { mode: Mode }) {
  const rig = mode === "dark" ? DARK_RIG : CLAY_RIG;

  if (mode === "silhouette") {
    // Flat black on white — profile only, no shading information at all.
    return <ambientLight intensity={1} />;
  }

  return (
    <>
      <ambientLight intensity={rig.ambient} />
      {/* Key: broad source above and to the left. */}
      <directionalLight
        position={[-4.5, 5.5, 3.5]}
        intensity={rig.key}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0005}
      />
      {/* Camera-side fill, very low — stops recesses crushing to pure black. */}
      <directionalLight position={[1.5, 0.5, 6]} intensity={rig.fill} color="#c4d0e6" />
      {/* Narrow rear rim to separate silhouette from background. */}
      <directionalLight position={[2.5, 1.5, -5]} intensity={rig.rim} color="#dbe3f2" />
    </>
  );
}

function Fps({ onFps }: { onFps: (n: number) => void }) {
  const frames = useRef(0);
  const last = useRef(performance.now());
  useFrame(() => {
    frames.current += 1;
    const now = performance.now();
    if (now - last.current >= 1000) {
      onFps(frames.current);
      frames.current = 0;
      last.current = now;
    }
  });
  return null;
}

function RendererConfig({ exposure }: { exposure: number }) {
  const { gl } = useThree();
  useEffect(() => {
    gl.outputColorSpace = SRGBColorSpace;
    gl.toneMapping = ACESFilmicToneMapping;
    gl.toneMappingExposure = exposure;
  }, [gl, exposure]);
  return null;
}

/** Slow orbit for the recorded camera-movement artifact. */
function AutoOrbit({ active }: { active: boolean }) {
  const { camera } = useThree();
  const t = useRef(0);
  useFrame((_, delta) => {
    if (!active) return;
    t.current += delta * 0.22;
    const r = 3.6;
    camera.position.set(Math.sin(t.current) * r, 0.9 + Math.sin(t.current * 0.5) * 0.5, Math.cos(t.current) * r);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export function MaterialTestViewer() {
  // Review state is URL-addressable so every artifact angle is reproducible.
  //
  // Read AFTER mount, never during render: reading window.location during the
  // render pass makes the client tree diverge from the server tree, and the
  // resulting hydration error tore down the canvas and blanked every preset URL.
  const [model, setModel] = useState<ModelKey>("additive-full");
  const [mode, setMode] = useState<Mode>("clay");
  const [view, setView] = useState<ViewKey | null>(null);
  const [debug, setDebug] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const m = p.get("model") as ModelKey | null;
    const md = p.get("mode") as Mode | null;
    const v = p.get("view") as ViewKey | null;
    if (m && m in MODELS) setModel(m);
    if (md && ["clay", "dark", "silhouette"].includes(md)) setMode(md);
    if (v && v in VIEWS) setView(v);
    if (p.get("debug") === "1") setDebug(true);
  }, []);
  const [wireframe, setWireframe] = useState(false);
  const [orbiting, setOrbiting] = useState(false);
  const [hud, setHud] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [fps, setFps] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const url = MODELS[model];
  const rig = mode === "dark" ? DARK_RIG : CLAY_RIG;
  const background = mode === "silhouette" ? "#f2f2f0" : rig.background;

  useEffect(() => {
    if (debug) setHud(true);
  }, [debug]);

  useEffect(() => {
    setError(null);
    fetch(url, { method: "HEAD" })
      .then((r) => {
        if (!r.ok) setError(`${url} not found (${r.status}). Run the export script first.`);
      })
      .catch((e) => setError(String(e)));
  }, [url]);

  return (
    <div className="fixed inset-0" style={{ background }}>
      <Canvas
        dpr={[1, 2]}
        shadows
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [2.6, 1.3, 2.9], fov: 40 }}
      >
        <RendererConfig exposure={mode === "silhouette" ? 1 : rig.exposure} />
        <PresetCamera view={view} />
        <Fps onFps={setFps} />
        <AutoOrbit active={orbiting} />
        <Rig mode={mode} />
        {mode !== "silhouette" && (
          <Environment preset={mode === "dark" ? "warehouse" : "studio"} environmentIntensity={rig.env} />
        )}
        <Suspense fallback={null}>
          {!error && <Model url={url} mode={mode} wireframe={wireframe} onReport={setReport} />}
        </Suspense>
        {!view && <OrbitControls makeDefault enablePan enabled={!orbiting} target={[0, 0, 0]} />}
      </Canvas>

      {hud && (
        <div className="pointer-events-auto absolute top-4 left-4 max-w-sm space-y-3 bg-black/75 p-4 font-mono text-[11px] text-neutral-200 backdrop-blur">
          <p className="text-neutral-400">
            {model} — {mode} — ACES · sRGB · no post
          </p>
          {error && <p className="text-red-400">{error}</p>}
          {report && (
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
              <dt className="text-neutral-500">meshes</dt>
              <dd>{report.meshes}</dd>
              <dt className="text-neutral-500">triangles</dt>
              <dd>{report.triangles.toLocaleString()}</dd>
              <dt className="text-neutral-500">vertices</dt>
              <dd>{report.vertices.toLocaleString()}</dd>
              <dt className="text-neutral-500">materials</dt>
              <dd>{report.materials.join(", ")}</dd>
              <dt className="text-neutral-500">bbox</dt>
              <dd>{report.size.join(" × ")}</dd>
              <dt className="text-neutral-500">fps</dt>
              <dd>{fps}</dd>
              <dt className="text-neutral-500">exposure</dt>
              <dd>{mode === "silhouette" ? "1.00" : rig.exposure.toFixed(2)}</dd>
            </dl>
          )}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {(["clay", "dark", "silhouette"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`border px-2 py-1 ${mode === m ? "border-emerald-400 text-emerald-300" : "border-neutral-600"}`}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(MODELS) as ModelKey[]).map((k) => (
              <button
                key={k}
                onClick={() => setModel(k)}
                className={`border px-2 py-1 ${model === k ? "border-emerald-400 text-emerald-300" : "border-neutral-600"}`}
              >
                {k}
              </button>
            ))}
            <button
              onClick={() => setWireframe((v) => !v)}
              className="border border-neutral-600 px-2 py-1"
            >
              wire: {wireframe ? "on" : "off"}
            </button>
            <button
              onClick={() => setOrbiting((v) => !v)}
              className="border border-neutral-600 px-2 py-1"
            >
              orbit: {orbiting ? "on" : "off"}
            </button>
            <button onClick={() => setHud(false)} className="border border-neutral-600 px-2 py-1">
              hide hud
            </button>
          </div>
        </div>
      )}

      {!hud && (
        <button
          onClick={() => setHud(true)}
          className="absolute top-4 left-4 border border-neutral-600 bg-black/70 px-2 py-1 font-mono text-[11px] text-neutral-300"
        >
          hud
        </button>
      )}
    </div>
  );
}

// Preload ONLY the approved model. Preloading the whole map pulled all three
// GLBs on every load, including the 1.29 MB rejected boolean experiment.
useGLTF.preload(MODELS["additive-full"]);
