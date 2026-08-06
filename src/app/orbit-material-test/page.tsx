import type { Metadata } from "next";
import { MaterialTestViewer } from "./viewer";

/**
 * Temporary review route for the 3D asset pipeline.
 *
 * Not linked from anywhere and excluded from search — it exists so exported
 * GLB assets can be judged inside the real rendering pipeline rather than in a
 * Blender viewport. Delete once the assets are approved and integrated.
 */
export const metadata: Metadata = {
  title: "Orbit material test",
  robots: { index: false, follow: false },
};

export default function OrbitMaterialTestPage() {
  return <MaterialTestViewer />;
}
