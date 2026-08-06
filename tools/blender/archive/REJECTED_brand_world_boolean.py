"""
THE BRAND WORLD — blockout.

Silhouette, shell-panel layout, three service ports and the recessed structural
equatorial channel. No glass chambers, no internal mechanisms, no fine detail.

Design intent, so future edits do not undo it:

  * NOT a sphere with lines drawn on it. Panel seams are carved grooves with
    real depth, and several large cuts break the outer silhouette so the
    profile itself reads as manufactured.
  * Deliberately asymmetric. Seam rings sit on offset circles rather than
    great circles, so no two panels are the same size and the pattern never
    repeats around an axis.
  * Flattened on one axis, so it can never read as a planet.
  * The equatorial channel is real recessed geometry, interrupted by shell
    panels bridging across it. It must reinforce construction with every light
    switched off.

Run:
    .venv-blender/Scripts/python.exe tools/blender/brand_world.py
"""

from __future__ import annotations

import math
import sys
import pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))

import bpy  # noqa: E402

from lib_hardsurface import (  # noqa: E402
    MODELS_DIR,
    add_box,
    add_cylinder,
    add_torus,
    boolean,
    direction_to_euler,
    export_glb,
    finalize,
    mesh_stats,
    pbr_material,
    reset_scene,
)

R = 1.0  # nominal radius; the site scales this up at runtime

# Three service port directions. Chosen far apart on the sphere so no camera
# state in the eight-stage journey can ever hide one behind another.
PORTS = {
    "maps": (0.94, 0.18, 0.28),      # front-right, slightly above the channel
    "orderrise": (-0.72, -0.10, 0.68),  # rear-left
    "agents": (-0.10, -0.62, -0.78),   # lower-front, below the channel
}

# Panel seams. Offset centres (not great circles) so panels come out unequal.
# (major, minor, location, rotation_deg)
SEAMS = [
    (0.995, 0.013, (0.0, 0.0, 0.30), (0, 0, 0)),
    (0.965, 0.011, (0.0, 0.0, -0.42), (0, 0, 0)),
    (0.99, 0.014, (0.12, 0.0, 0.0), (90, 0, 18)),
    (0.97, 0.010, (-0.20, 0.10, 0.0), (90, 0, 74)),
    (0.985, 0.012, (0.0, 0.18, 0.0), (90, 0, 126)),
    (0.96, 0.010, (0.05, -0.24, 0.05), (68, 12, 158)),
    (0.98, 0.013, (-0.08, 0.0, 0.12), (112, 0, 42)),
]


def build_shell():
    """Flattened sphere, carved rather than tessellated."""
    bpy.ops.mesh.primitive_uv_sphere_add(segments=112, ring_count=56, radius=R)
    shell = bpy.context.active_object
    shell.name = "BrandWorld"
    # Compression on one axis — a perfectly round mass reads as a planet.
    shell.scale = (1.0, 0.93, 1.0)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)

    # REAL SHELL THICKNESS — non-negotiable, and the reason the first attempt
    # failed. A UV sphere is a zero-thickness surface; cutting it with booleans
    # opens holes straight through into a hollow interior instead of revealing
    # a manufactured edge. Solidify gives every cut a visible wall.
    bpy.context.view_layer.objects.active = shell
    solid = shell.modifiers.new("Shell", "SOLIDIFY")
    solid.thickness = 0.075
    solid.offset = -1.0  # grow inward so the outer radius stays exactly R
    solid.use_even_offset = True
    solid.use_quality_normals = True
    bpy.ops.object.modifier_apply(modifier=solid.name)
    return shell


def cut_silhouette(shell) -> None:
    """
    Large structural cuts that break the outer profile.

    Without these the silhouette is a circle at every angle, which is the
    single biggest reason a sphere reads as a planet rather than a device.
    """
    # Shallow shaved flats, NOT chunks removed. Each box is positioned so only
    # its leading face intersects the shell — the first pass hacked whole
    # sections off and read as shattered rather than machined.
    boolean(shell, add_box((0.85, 0.85, 0.5), location=(-0.34, 0.26, 1.34), rotation=(math.radians(-20), math.radians(14), 0)))
    boolean(shell, add_box((0.7, 0.7, 0.45), location=(0.92, -0.40, -0.94), rotation=(math.radians(30), math.radians(-24), 0)))
    boolean(shell, add_box((0.5, 0.5, 0.3), location=(-0.78, -0.58, 0.86), rotation=(math.radians(16), math.radians(38), 0)))


def cut_panel_seams(shell) -> None:
    """Carve grooves with real depth. Panels are defined by these, not painted."""
    for major, minor, loc, rot_deg in SEAMS:
        torus = add_torus(
            major,
            minor,
            location=loc,
            rotation=tuple(math.radians(d) for d in rot_deg),
        )
        boolean(shell, torus)


def cut_equatorial_channel(shell) -> None:
    """
    The recessed structural channel.

    Built from two overlapping tori of slightly different major radius so the
    channel width varies around the object instead of being a perfect ring,
    then partially re-filled by bridge panels.
    """
    boolean(shell, add_torus(0.99, 0.055, location=(0.0, 0.0, 0.02)))
    boolean(shell, add_torus(0.955, 0.042, location=(0.06, 0.0, -0.01), rotation=(math.radians(5), 0, 0)))

    # Shell panels crossing and interrupting the channel. Unequal widths and
    # irregular spacing — evenly spaced bridges would read as decoration.
    for angle_deg, width in ((28, 0.16), (104, 0.10), (196, 0.21), (263, 0.12), (321, 0.08)):
        a = math.radians(angle_deg)
        # Seated at 0.955 so the bridge sits flush within the channel rather
        # than protruding off the surface as a stuck-on tab.
        bridge = add_box(
            (width, 0.055, 0.115),
            location=(math.cos(a) * 0.955, math.sin(a) * 0.955 * 0.93, 0.01),
            rotation=(0, 0, a),
        )
        boolean(shell, bridge, operation="UNION")


def cut_ports(shell) -> None:
    """
    Three structural ports. Same design language, different construction —
    each one's surrounding geometry is what tells the services apart before
    any colour or mechanism exists.
    """
    # ── Port 1 · Maps Lead Scraper — precise, directional, narrow ──
    d = PORTS["maps"]
    rot = direction_to_euler(*d)
    pos = tuple(c * 0.86 for c in d)
    boolean(shell, add_cylinder(0.155, 0.62, location=pos, rotation=rot))
    # Guide panels funnelling toward the opening — directional character.
    for offset, w in ((0.30, 0.055), (-0.30, 0.042)):
        boolean(
            shell,
            add_box(
                (0.30, w, 0.05),
                location=tuple(c * 0.96 for c in d),
                rotation=(rot[0], rot[1], rot[2] + offset),
            ),
        )

    # ── Port 2 · OrderRise — open, routed, circular ──
    d = PORTS["orderrise"]
    rot = direction_to_euler(*d)
    pos = tuple(c * 0.84 for c in d)
    boolean(shell, add_cylinder(0.235, 0.58, location=pos, rotation=rot))
    # Recessed step ring around the opening: routed, not a torus stuck on top.
    boolean(shell, add_cylinder(0.315, 0.14, location=tuple(c * 1.0 for c in d), rotation=rot))

    # ── Port 3 · Custom AI Agents — modular, multiple connection points ──
    d = PORTS["agents"]
    rot = direction_to_euler(*d)
    boolean(shell, add_cylinder(0.185, 0.56, location=tuple(c * 0.86 for c in d), rotation=rot))
    # Cluster of smaller connection recesses plus two rails — more complex than
    # the other two ports, but still only four elements.
    for k, (ox, oy) in enumerate(((0.26, 0.10), (-0.24, 0.14), (0.04, -0.28))):
        boolean(
            shell,
            add_cylinder(
                0.058,
                0.34,
                location=(d[0] * 0.93 + ox * 0.34, d[1] * 0.93 + oy * 0.34, d[2] * 0.93 + (0.05 * k)),
                rotation=rot,
            ),
        )
    for sign in (1, -1):
        boolean(
            shell,
            add_box(
                (0.036, 0.30, 0.05),
                location=(d[0] * 0.95, d[1] * 0.95 + sign * 0.12, d[2] * 0.95),
                rotation=rot,
            ),
        )


def main() -> int:
    reset_scene()

    shell = build_shell()
    cut_silhouette(shell)
    cut_panel_seams(shell)
    cut_equatorial_channel(shell)
    cut_ports(shell)

    finalize(shell, bevel_width=0.007, segments=3, angle_deg=38.0)

    # Single graphite material for the blockout. Material breakdown comes with
    # the detail pass; judging form is the point here.
    shell.data.materials.clear()
    shell.data.materials.append(pbr_material("Graphite", (0.052, 0.058, 0.075), 0.15, 0.55))

    tris, verts = mesh_stats(shell)
    export_glb(
        MODELS_DIR / "brand-world-blockout.glb",
        {
            "asset": "brand-world-blockout",
            "bpy": bpy.app.version_string,
            "triangles": tris,
            "vertices": verts,
            "meshes": 1,
            "panel_seams": len(SEAMS),
            "silhouette_cuts": 3,
            "channel_bridges": 5,
            "ports": list(PORTS.keys()),
        },
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
