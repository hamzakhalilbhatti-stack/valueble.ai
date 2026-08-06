"""
Pipeline verification for the valueble.ai 3D asset workflow.

Purpose: prove the whole Blender -> GLB -> React Three Fiber chain works BEFORE
any real modelling time is spent. Produces one minimal hard-surface test object
exercising every feature the real assets depend on:

  * bevel modifier with multiple segments   (are bevels preserved?)
  * weighted normals                        (does shading survive export?)
  * smooth-by-angle                         (do we get clean curvature?)
  * boolean cut                             (do panel recesses export?)
  * two separate PBR materials              (does material separation survive?)
  * non-uniform scale + applied transforms  (does scale arrive correct?)

Run:
    .venv-blender/Scripts/python.exe tools/blender/verify_pipeline.py

Writes: public/models/pipeline-test.glb
"""

import json
import pathlib
import sys

import bpy

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "public" / "models"
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_PATH = OUT_DIR / "pipeline-test.glb"


def reset_scene() -> None:
    """Blender's default scene ships a cube, camera and light. Start empty."""
    bpy.ops.wm.read_factory_settings(use_empty=True)


def pbr_material(name: str, base_color, metallic: float, roughness: float):
    """Principled BSDF only — the one node setup glTF exports losslessly."""
    mat = bpy.data.materials.new(name)
    # Blender 5.x creates the node tree by default; `use_nodes` is deprecated
    # and slated for removal in 6.0, so only set it if the tree is absent.
    if not mat.node_tree:
        mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*base_color, 1.0)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    return mat


def build_test_object():
    """A bevelled panel with a boolean recess and two materials."""
    bpy.ops.mesh.primitive_cube_add(size=2.0)
    body = bpy.context.active_object
    body.name = "PipelineTest"
    body.scale = (1.0, 0.28, 0.62)

    # Cutter for a recessed channel — proves booleans survive export.
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.0, 0.22, 0.0))
    cutter = bpy.context.active_object
    cutter.name = "Cutter"
    cutter.scale = (0.62, 0.2, 0.16)

    bpy.context.view_layer.objects.active = body
    boolean = body.modifiers.new("Recess", "BOOLEAN")
    boolean.operation = "DIFFERENCE"
    boolean.object = cutter
    bpy.ops.object.modifier_apply(modifier=boolean.name)
    bpy.data.objects.remove(cutter, do_unlink=True)

    bpy.context.view_layer.objects.active = body

    # Bevel + weighted normals: the two modifiers that separate a hard-surface
    # asset from a primitive. If these do not survive, the pipeline is useless.
    bevel = body.modifiers.new("Bevel", "BEVEL")
    bevel.width = 0.018
    bevel.segments = 3
    bevel.limit_method = "ANGLE"
    bevel.angle_limit = 1.0472  # 60 degrees
    bevel.harden_normals = True

    weighted = body.modifiers.new("WeightedNormal", "WEIGHTED_NORMAL")
    weighted.keep_sharp = True

    # Smooth-by-angle: renamed across Blender versions, so probe for it.
    try:
        bpy.ops.object.shade_smooth_by_angle(angle=1.0472)
    except Exception:
        try:
            bpy.ops.object.shade_auto_smooth(angle=1.0472)
        except Exception:
            bpy.ops.object.shade_smooth()

    # Two materials so we can confirm separation survives export.
    graphite = pbr_material("Graphite", (0.09, 0.10, 0.14), 0.12, 0.52)
    aluminium = pbr_material("BlackenedAluminium", (0.145, 0.165, 0.208), 0.9, 0.36)

    # Clear first. A primitive arrives with an empty slot at index 0, and every
    # polygon defaults to material_index 0 — append alone leaves the whole mesh
    # unmaterialled, which exports as default white.
    body.data.materials.clear()
    body.data.materials.append(graphite)
    body.data.materials.append(aluminium)

    # Assign the second material to the recess faces so the split is visible.
    mesh = body.data
    for poly in mesh.polygons:
        if poly.center.y > 0.12:
            poly.material_index = 1

    # Applying transforms proves scale arrives at 1:1 in Three.js.
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return body


def triangle_count(obj) -> int:
    """Evaluated count — includes modifier output, which is what actually exports."""
    depsgraph = bpy.context.evaluated_depsgraph_get()
    evaluated = obj.evaluated_get(depsgraph)
    mesh = evaluated.to_mesh()
    mesh.calc_loop_triangles()
    count = len(mesh.loop_triangles)
    evaluated.to_mesh_clear()
    return count


def main() -> int:
    print(f"bpy {bpy.app.version_string}")

    reset_scene()
    body = build_test_object()
    tris = triangle_count(body)

    bpy.ops.export_scene.gltf(
        filepath=str(OUT_PATH),
        export_format="GLB",
        export_apply=True,          # bake modifiers into exported geometry
        export_yup=True,            # Three.js is Y-up; Blender is Z-up
        export_materials="EXPORT",
        export_normals=True,
    )

    size = OUT_PATH.stat().st_size
    report = {
        "bpy": bpy.app.version_string,
        "output": str(OUT_PATH.relative_to(ROOT)).replace("\\", "/"),
        "triangles": tris,
        "bytes": size,
        "kb": round(size / 1024, 1),
        # Slots can hold None; filter rather than assume every slot is filled.
        "materials": [m.name for m in body.data.materials if m is not None],
        "material_slots": len(body.data.materials),
    }
    print("PIPELINE_REPORT " + json.dumps(report))
    return 0


if __name__ == "__main__":
    sys.exit(main())
