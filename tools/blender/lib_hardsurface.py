"""
Shared hard-surface helpers for the valueble.ai asset pipeline.

Kept separate so every asset script uses the same boolean, bevel and export
behaviour — the alternative is each script drifting into its own conventions.
"""

from __future__ import annotations

import json
import math
import pathlib

import bpy

ROOT = pathlib.Path(__file__).resolve().parents[2]
MODELS_DIR = ROOT / "public" / "models"


def reset_scene() -> None:
    """Blender ships a default cube, camera and light. Start genuinely empty."""
    bpy.ops.wm.read_factory_settings(use_empty=True)


def pbr_material(name: str, base_color, metallic: float, roughness: float):
    """Principled BSDF only — the single node setup glTF exports losslessly."""
    mat = bpy.data.materials.new(name)
    # `use_nodes` is deprecated in Blender 5.x and removed in 6.0; the tree
    # already exists, so only create it if genuinely absent.
    if not mat.node_tree:
        mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*base_color, 1.0)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    return mat


def boolean(target, cutter, operation: str = "DIFFERENCE", solver: str = "EXACT") -> None:
    """Apply a boolean and delete the cutter. Cutters are always throwaway."""
    bpy.context.view_layer.objects.active = target
    mod = target.modifiers.new(f"bool_{cutter.name}", "BOOLEAN")
    mod.operation = operation
    mod.object = cutter
    mod.solver = solver
    bpy.ops.object.modifier_apply(modifier=mod.name)
    bpy.data.objects.remove(cutter, do_unlink=True)


def add_torus(major: float, minor: float, location=(0, 0, 0), rotation=(0, 0, 0), segments=96):
    """Ring cutter — the right tool for carving a seam along a circle on a sphere."""
    bpy.ops.mesh.primitive_torus_add(
        major_radius=major,
        minor_radius=minor,
        major_segments=segments,
        minor_segments=12,
        location=location,
        rotation=rotation,
    )
    return bpy.context.active_object


def add_box(scale, location=(0, 0, 0), rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(size=2.0, location=location, rotation=rotation)
    obj = bpy.context.active_object
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return obj


def add_cylinder(radius: float, depth: float, location=(0, 0, 0), rotation=(0, 0, 0), verts=48):
    bpy.ops.mesh.primitive_cylinder_add(
        radius=radius, depth=depth, vertices=verts, location=location, rotation=rotation
    )
    return bpy.context.active_object


def direction_to_euler(x: float, y: float, z: float):
    """
    Euler rotation that points a +Z-aligned primitive along the given vector.

    Ports are placed by direction rather than by hand-tuned angles, so moving a
    port is a one-line change instead of re-deriving three rotations.
    """
    length = math.sqrt(x * x + y * y + z * z)
    xn, yn, zn = x / length, y / length, z / length
    pitch = math.acos(max(-1.0, min(1.0, zn)))
    yaw = math.atan2(yn, xn)
    return (0.0, pitch, yaw + math.pi / 2)


def finalize(obj, bevel_width: float = 0.006, segments: int = 3, angle_deg: float = 42.0):
    """
    Bevel + weighted normals + smooth-by-angle.

    This is what separates a hard-surface asset from a primitive: bevels give
    edges something to catch light with, weighted normals keep large panels
    reading flat next to them.
    """
    bpy.context.view_layer.objects.active = obj

    bevel = obj.modifiers.new("Bevel", "BEVEL")
    bevel.width = bevel_width
    bevel.segments = segments
    bevel.limit_method = "ANGLE"
    bevel.angle_limit = math.radians(angle_deg)
    bevel.harden_normals = True
    bevel.miter_outer = "MITER_ARC"
    bpy.ops.object.modifier_apply(modifier=bevel.name)

    weighted = obj.modifiers.new("WeightedNormal", "WEIGHTED_NORMAL")
    weighted.keep_sharp = True
    bpy.ops.object.modifier_apply(modifier=weighted.name)

    for op in ("shade_smooth_by_angle", "shade_auto_smooth", "shade_smooth"):
        try:
            getattr(bpy.ops.object, op)()
            break
        except Exception:
            continue


def mesh_stats(obj) -> tuple[int, int]:
    depsgraph = bpy.context.evaluated_depsgraph_get()
    evaluated = obj.evaluated_get(depsgraph)
    mesh = evaluated.to_mesh()
    mesh.calc_loop_triangles()
    tris = len(mesh.loop_triangles)
    verts = len(mesh.vertices)
    evaluated.to_mesh_clear()
    return tris, verts


def export_glb(path: pathlib.Path, report: dict) -> None:
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=str(path),
        export_format="GLB",
        export_apply=True,
        export_yup=True,
        export_materials="EXPORT",
        export_normals=True,
    )
    report["bytes"] = path.stat().st_size
    report["kb"] = round(path.stat().st_size / 1024, 1)
    report["output"] = str(path.relative_to(ROOT)).replace("\\", "/")
    print("PIPELINE_REPORT " + json.dumps(report))
