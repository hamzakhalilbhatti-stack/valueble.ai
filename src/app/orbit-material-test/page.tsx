import type { Metadata } from "next";
import { MaterialTestViewer } from "./viewer";
import { MODEL_KEYS, MODES, VIEW_KEYS, type ModelKey, type Mode, type ViewKey } from "./config";

/**
 * Temporary review route for the 3D asset pipeline.
 *
 * Query parameters are resolved HERE, on the server, and passed to the client
 * scene as initial props. Reading them on the client instead caused the scene
 * to mount with `view = null` and then remount once the params hydrated — which
 * is what left the canvas stranded at its 300×150 default.
 */
export const metadata: Metadata = {
  title: "Orbit material test",
  robots: { index: false, follow: false },
};

function pick<T extends string>(value: string | undefined, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

export default async function OrbitMaterialTestPage(
  props: PageProps<"/orbit-material-test">,
) {
  const params = await props.searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

  return (
    <MaterialTestViewer
      initialModel={pick<ModelKey>(one(params.model), MODEL_KEYS, "additive-full")}
      initialMode={pick<Mode>(one(params.mode), MODES, "clay")}
      initialView={
        VIEW_KEYS.includes(one(params.view) as ViewKey) ? (one(params.view) as ViewKey) : null
      }
      debug={one(params.debug) === "1"}
    />
  );
}
