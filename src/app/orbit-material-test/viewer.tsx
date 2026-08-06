"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  ACESFilmicToneMapping,
  Box3,
  Color,
  MeshBasicMaterial,
  MeshStandardMaterial,
  SRGBColorSpace,
  Sphere,
  Vector2,
  Vector3,
  type Mesh,
  type Object3D,
  type PerspectiveCamera,
} from "three";
import {
  CLAY_RIG,
  DARK_RIG,
  MODELS,
  VIEWS,
  type ModelKey,
  type Mode,
  type ViewKey,
} from "./config";

/**
 * Asset review harness.
 *
 * Four architecture rules this file exists to hold:
 *   1. ONE Canvas, mounted once. Model / mode / view changes never replace it.
 *   2. The container carries explicit dimensions, so the Canvas can never fall
 *      back to the HTML 300x150 default.
 *   3. Route params arrive as props already resolved on the server, so the
 *      first client render is the final configuration — nothing remounts.
 *   4. PresetCamera and OrbitControls never both own the camera.
 */

type Report = {
  meshes: number;
  triangles: number;
  vertices: number;
  materials: number;
  bbox: [number, number, number];
  radius: number;
};

function Model({
  url,
  mode,
  onReport,
}: {
  url: string;
  mode: Mode;
  onReport: (r: Report) => void;
}) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    let meshes = 0;
    let triangles = 0;
    let vertices = 0;
    const materials = new Set<string>();

    cloned.traverse((child: Object3D) => {
      const mesh = child as Mesh;
      if (!mesh.isMesh) return;
      meshes += 1;
      const geo = mesh.geometry;
      const pos = geo.getAttribute("position");
      vertices += pos?.count ?? 0;
      triangles += geo.index ? geo.index.count / 3 : (pos?.count ?? 0) / 3;

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
        });
      } else if (mode === "silhouette") {
        mesh.material = new MeshBasicMaterial({ color: new Color("#000000") });
      } else {
        mesh.material = original;
      }
    });

    const box = new Box3().setFromObject(cloned);
    const size = new Vector3();
    box.getSize(size);
    const sphere = new Sphere();
    box.getBoundingSphere(sphere);

    onReport({
      meshes,
      triangles: Math.round(triangles),
      vertices,
      materials: materials.size,
      bbox: [+size.x.toFixed(3), +size.y.toFixed(3), +size.z.toFixed(3)],
      radius: +sphere.radius.toFixed(3),
    });
  }, [cloned, mode, onReport]);

  return <primitive object={cloned} />;
}

/**
 * Sole owner of the camera for pinned views. Sets the transform once and on
 * aspect change, then leaves it — no per-frame loop holding a static shot.
 */
function PresetCamera({ view, aspect }: { view: ViewKey | null; aspect: number }) {
  const { camera } = useThree();
  useEffect(() => {
    if (!view || !aspect) return;
    const v = VIEWS[view];
    const cam = camera as PerspectiveCamera;
    cam.position.set(v.pos[0], v.pos[1], v.pos[2]);
    cam.fov = v.fov;
    cam.aspect = aspect;
    cam.lookAt(v.target[0], v.target[1], v.target[2]);
    cam.updateProjectionMatrix();
  }, [camera, view, aspect]);
  return null;
}

/**
 * Direct-light rig. Deliberately contains NO environment map.
 *
 * Every mode renders from these lights alone, so the scene can never be
 * blocked by a reflection system. drei's <Environment preset> fetches an HDRI
 * from a remote CDN; when that request could not complete the component
 * suspended forever, the render loop never started, and clay and dark modes
 * rendered a blank canvas with a 0x0 drawing buffer.
 */
function Rig({ mode }: { mode: Mode }) {
  if (mode === "silhouette") return <ambientLight intensity={1} />;

  const rig = mode === "dark" ? DARK_RIG : CLAY_RIG;
  return (
    <>
      <ambientLight intensity={rig.ambient} />
      {mode === "clay" && <hemisphereLight intensity={0.25} groundColor="#5a5f66" />}
      <directionalLight
        position={[-4.5, 5.5, 3.5]}
        intensity={rig.key}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0005}
      />
      <directionalLight position={[1.5, 0.5, 6]} intensity={rig.fill} color="#c4d0e6" />
      <directionalLight position={[2.5, 1.5, -5]} intensity={rig.rim} color="#dbe3f2" />
    </>
  );
}

/**
 * Dark-mode reflections, generated locally from Lightformers.
 *
 * No `preset`, no HDRI file, no network request — the cube map is rendered
 * once (`frames={1}`) from geometry defined here, so it works fully offline.
 * `background={false}` keeps the page's dark colour rather than showing the
 * environment itself.
 */
function ProceduralStudio() {
  return (
    <Environment resolution={256} frames={1} background={false}>
      {/* Large overhead-left softbox — the dominant reflection. */}
      <Lightformer
        form="rect"
        intensity={1.6}
        color="#e8eef8"
        position={[-3.5, 4.5, 2.5]}
        rotation={[-Math.PI / 3, 0, 0]}
        scale={[7, 5, 1]}
      />
      {/* Broad, weak frontal card so dark panels keep some fill. */}
      <Lightformer
        form="rect"
        intensity={0.35}
        color="#aebdd6"
        position={[2, 0.5, 5]}
        scale={[6, 4, 1]}
      />
      {/* Narrow rear strip for edge separation. */}
      <Lightformer
        form="rect"
        intensity={1.1}
        color="#cfd9ea"
        position={[3, 1.5, -4.5]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[5, 0.7, 1]}
      />
      {/* Small top card — puts a highlight on the upper flattened region. */}
      <Lightformer
        form="rect"
        intensity={0.7}
        color="#ffffff"
        position={[0, 5, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[2.5, 2.5, 1]}
      />
      {/* Dark base so the lower hemisphere does not wash out. */}
      <mesh scale={40}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#0a0c12" side={1} />
      </mesh>
    </Environment>
  );
}

type Stats = { fps: number; calls: number; bufW: number; bufH: number; camAspect: number };

/** Reports real renderer state to the HUD — measured, never assumed. */
function Instruments({ onStats }: { onStats: (s: Stats) => void }) {
  const { gl, camera } = useThree();
  const frames = useRef(0);
  const last = useRef(performance.now());
  const buf = useMemo(() => new Vector2(), []);

  useFrame(() => {
    frames.current += 1;
    const now = performance.now();
    if (now - last.current >= 1000) {
      gl.getDrawingBufferSize(buf);
      onStats({
        fps: frames.current,
        calls: gl.info.render.calls,
        bufW: Math.round(buf.x),
        bufH: Math.round(buf.y),
        camAspect: +(camera as PerspectiveCamera).aspect.toFixed(3),
      });
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

export function MaterialTestViewer({
  initialModel,
  initialMode,
  initialView,
  debug,
}: {
  initialModel: ModelKey;
  initialMode: Mode;
  initialView: ViewKey | null;
  debug: boolean;
}) {
  const [model, setModel] = useState<ModelKey>(initialModel);
  const [mode, setMode] = useState<Mode>(initialMode);
  const view = initialView;

  const [report, setReport] = useState<Report | null>(null);
  const [stats, setStats] = useState<Stats>({ fps: 0, calls: 0, bufW: 0, bufH: 0, camAspect: 0 });
  const [size, setSize] = useState({ w: 0, h: 0 });
  // Read AFTER mount. Rendering window.devicePixelRatio inline made the server
  // emit "?" and the client emit "1.25" — that mismatch tore down the whole
  // tree, taking the Canvas with it.
  const [dpr, setDpr] = useState<number | null>(null);

  const hostRef = useRef<HTMLDivElement>(null);
  const mounts = useRef(0);
  mounts.current ||= 1;

  // Measure the container explicitly rather than trusting percentage inheritance.
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const r = entry.contentRect;
      setSize({ w: Math.round(r.width), h: Math.round(r.height) });
    });
    ro.observe(el);
    setSize({ w: el.clientWidth, h: el.clientHeight });
    setDpr(window.devicePixelRatio);
    return () => ro.disconnect();
  }, []);

  const rig = mode === "dark" ? DARK_RIG : CLAY_RIG;
  const background = mode === "silhouette" ? "#f2f2f0" : rig.background;
  const aspect = size.h > 0 ? size.w / size.h : 0;

  return (
    <div
      ref={hostRef}
      // Explicit sizing. `height: 100%` on an ancestor chain with no defined
      // height is exactly how the canvas ended up at 300x150.
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100dvh",
        minWidth: 320,
        minHeight: 240,
        overflow: "hidden",
        background,
      }}
    >
      <Canvas
        dpr={[1, 2]}
        shadows
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [1.426, 0.555, 3.203], fov: 40 }}
        style={{ display: "block", width: "100%", height: "100%" }}
      >
        <RendererConfig exposure={mode === "silhouette" ? 1 : rig.exposure} />
        <PresetCamera view={view} aspect={aspect} />
        <Instruments onStats={setStats} />
        <Rig mode={mode} />
        <Suspense fallback={null}>
          <Model url={MODELS[model]} mode={mode} onReport={setReport} />
        </Suspense>
        {/* Optional reflections only. Never gates the scene. */}
        {mode === "dark" && <ProceduralStudio />}
        {/* Free inspection only, and never `makeDefault`, so it can never
            contest the preset camera. */}
        {!view && <OrbitControls enablePan target={[0, 0, 0]} />}
      </Canvas>

      {debug && (
        <div className="pointer-events-none absolute top-3 left-3 bg-black/80 p-3 font-mono text-[10px] leading-relaxed text-neutral-200">
          <div className="text-neutral-400">
            {model} · {mode} · {view ?? "free"}
          </div>
          <div>
            container {size.w}×{size.h}
          </div>
          <div>
            buffer {stats.bufW}×{stats.bufH} · dpr {dpr ?? "—"}
          </div>
          <div>cam aspect {stats.camAspect}</div>
          <div>canvas mounts {mounts.current}</div>
          <div className={report ? "text-emerald-400" : "text-red-400"}>
            model {report ? "LOADED" : "not loaded"}
          </div>
          {report && (
            <>
              <div>
                meshes {report.meshes} · mats {report.materials}
              </div>
              <div>tris {report.triangles.toLocaleString()}</div>
              <div>bbox {report.bbox.join(" × ")}</div>
              <div>radius {report.radius}</div>
            </>
          )}
          <div>
            draw calls {stats.calls} · fps {stats.fps}
          </div>
        </div>
      )}

      {!view && (
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5 font-mono text-[10px]">
          {(["clay", "dark", "silhouette"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`border px-2 py-1 ${mode === m ? "border-emerald-400 text-emerald-300" : "border-neutral-500 text-neutral-300"}`}
            >
              {m}
            </button>
          ))}
          {(Object.keys(MODELS) as ModelKey[]).map((k) => (
            <button
              key={k}
              onClick={() => setModel(k)}
              className={`border px-2 py-1 ${model === k ? "border-emerald-400 text-emerald-300" : "border-neutral-500 text-neutral-300"}`}
            >
              {k}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Preload ONLY the approved model. Preloading the whole map pulled all three
// GLBs on every visit, including the 1.29 MB rejected boolean experiment.
useGLTF.preload(MODELS["additive-full"]);
