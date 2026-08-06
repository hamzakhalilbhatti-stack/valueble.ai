"""
THE BRAND WORLD — additive blockout.

Ten individually constructed shell panels around a separate internal core.
Replaces the rejected boolean-subtraction version entirely.

Panel hierarchy (see PANELS below):
  4 major   — define the silhouette and overall mass
  3 port    — integrate each service connection into the shell
  3 bridge  — cross the equatorial separation band, tying upper to lower mass

The equatorial channel is NOT cut. It is the empty elevation band between the
upper and lower panel sets, crossed by the three bridge panels. Nothing is
carved into the core.

Run:
    .venv-blender/Scripts/python.exe tools/blender/brand_world_additive.py
    .venv-blender/Scripts/python.exe tools/blender/brand_world_additive.py --proof
"""

from __future__ import annotations

import json
import math
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))

import bpy  # noqa: E402

from lib_hardsurface import MODELS_DIR, ROOT, export_glb, pbr_material, reset_scene  # noqa: E402
from lib_panels import make_chassis, make_panel, make_rib, port_collar  # noqa: E402

# Equatorial separation band: no panel occupies this elevation range except the
# three bridges. This is what makes the channel structural rather than engraved.
CHANNEL_LO, CHANNEL_HI = -2.0, 2.0

# name, az_from, az_to, el_from, el_to, thickness, gap, role
PANELS = [
    # name, az_from, az_to, el_from, el_to, thickness, gap, role, taper, projection
    #
    # CROWN JUNCTION: every upper panel is dimensioned so that AFTER its own gap
    # inset it terminates at exactly el 49.0, and the cap begins at 50.4. That
    # gives one coordinated 1.4 deg seam (~0.024 units) instead of two
    # independent insets compounding into an opening.
    #
    # RECESS: az 250-270 (20 deg). The hero camera sits at az 24 and sees
    # roughly 294->114, so this sits squarely on the far side and is only
    # discovered when the camera travels round.
    ("major_upper_front", 330, 425, 2.0, 50.5, 0.115, 1.5, "major", 0.0, 1.052),
    ("major_upper_rear", 123, 270, 2.0, 50.5, 0.118, 1.5, "major", 0.0, 1.038),
    ("major_lower_front", 296, 430, -57, -2.0, 0.112, 1.5, "major", 0.0, 1.046),
    ("major_lower_rear", 70, 215, -90, -2.0, 0.110, 1.5, "major", 0.0, 1.035),
    ("port_maps_panel", 65, 105, 2.0, 50.7, 0.098, 1.7, "port", 0.0, 1.068),
    ("port_orderrise_panel", 215, 296, -57, -2.0, 0.102, 1.7, "port", 0.0, 1.052),
    ("port_agents_cap", 0, 360, 50.4, 90, 0.094, 0.0, "port", 0.0, 1.044),
    ("bridge_a", 28, 54, CHANNEL_LO, CHANNEL_HI, 0.120, 0.5, "bridge", 0.0, 1.010),
    ("bridge_b", 148, 168, CHANNEL_LO, CHANNEL_HI, 0.118, 0.5, "bridge", 0.0, 1.008),
    # Dual-role transition: crosses the channel and carries the side shell from
    # major_upper_rear across to the recess edge.
    ("bridge_c", 270, 330, CHANNEL_LO, 49.9, 0.120, 0.9, "transition", 9.0, 1.024),
]

# Controlled recess: azimuth 250-270 above the channel (20 degrees) exposes
# chassis depth as a secondary side detail. The first attempt left 115 degrees
# open, which read as a missing quarter of the shell rather than a design
# feature. bridge_c now spans channel-to-upper-shell to close the rest.

PORTS = {
    "maps": (85, 28),        # az, el — on port_maps_panel
    "orderrise": (255, -30),  # on port_orderrise_panel
    "agents": (150, 66),      # on port_agents_cap
}


# Support ribs: (name, az, el, base_width, tip_width, panel_supported)
# Only enough are exposed to explain the assembly - they must stay subordinate
# to the shell panels, so most sit behind panel centres where they are unseen.
RIBS = [
    # Major-panel supports: broader and more stable.
    ("rib_major_upper_front", 20, 26, 0.105, 0.062, "major_upper_front"),
    # Sits behind the recess so one rib is glimpsed through it.
    ("rib_recess_witness", 114, 26, 0.090, 0.056, "major_upper_rear"),
    ("rib_major_upper_rear", 152, 30, 0.100, 0.060, "major_upper_rear"),
    ("rib_major_lower_front", 350, -32, 0.105, 0.062, "major_lower_front"),
    ("rib_major_lower_rear", 140, -38, 0.098, 0.058, "major_lower_rear"),
    # Port-region supports: directional, aligned with each port axis.
    ("rib_port_maps", 85, 28, 0.088, 0.055, "port_maps_panel"),
    ("rib_port_orderrise", 255, -30, 0.090, 0.056, "port_orderrise_panel"),
    ("rib_port_agents", 150, 66, 0.082, 0.052, "port_agents_cap"),
    # Bridge supports: narrower but structurally continuous across the channel.
    ("rib_bridge_a", 41, 0, 0.070, 0.048, "bridge_a"),
    ("rib_bridge_b", 158, 0, 0.068, 0.046, "bridge_b"),
    ("rib_bridge_c", 300, 24, 0.082, 0.052, "bridge_c"),
]


RECESS_CENTRE = 114.0   # Blender azimuth, derived from the hero camera below.
RECESS_SPAN = 18.0      # 105 -> 123


def validate_recess_against_hero() -> None:
    """
    Refuse to export if the recess is not opposite the hero camera.

    Two previous repositionings failed because the azimuth was reasoned about in
    Blender space while the camera lives in Three space, and glTF export
    (export_yup=True) remaps the axes. This converts explicitly and checks the
    dot product rather than trusting intuition.

        Blender (Bx, By, Bz) -> Three (Bx, Bz, -By)
        Three horizontal     -> Blender [Bx, By] = [Tx, -Tz]
    """
    cfg = json.loads((ROOT / "config" / "orbit-review.json").read_text(encoding="utf-8"))
    cam = cfg["heroCamera"]["position"]
    limit = cfg["recess"]["maxDotProduct"]

    # Hero camera horizontal direction, normalised, in Three space.
    cx, cz = cam[0], cam[2]
    clen = math.hypot(cx, cz)
    cam_three = (cx / clen, 0.0, cz / clen)

    # Recess outward normal in Blender, transformed into Three space.
    a = math.radians(RECESS_CENTRE)
    recess_three = (math.cos(a), 0.0, -math.sin(a))

    dot = recess_three[0] * cam_three[0] + recess_three[2] * cam_three[2]

    facing = math.degrees(math.atan2(-cz, cx)) % 360
    print(f"  hero camera horizontal (three) : [{cam_three[0]:.4f}, 0, {cam_three[2]:.4f}]")
    print(f"  camera-facing Blender azimuth  : {facing:.2f} deg")
    print(f"  opposite (rear) azimuth        : {(facing + 180) % 360:.2f} deg")
    print(f"  recess centre                  : {RECESS_CENTRE:.2f} deg")
    print(f"  recess span                    : {RECESS_CENTRE - RECESS_SPAN/2:.1f} -> {RECESS_CENTRE + RECESS_SPAN/2:.1f}")
    print(f"  recess vector (three)          : [{recess_three[0]:.4f}, 0, {recess_three[2]:.4f}]")
    print(f"  dot(recess, heroCamera)        : {dot:.4f}  (must be <= {limit})")

    if dot > limit:
        raise SystemExit(
            f"RECESS VALIDATION FAILED: dot {dot:.4f} > {limit}. "
            "The recess is not opposite the hero camera; refusing to export."
        )
    print("  RECESS VALIDATION PASSED")


def build_ribs(panel_names: set[str]) -> list:
    """Tapered members spanning chassis to panel. Only build ribs whose panel exists."""
    return [
        make_rib(name, az, el, base, tip, r_start=0.64, r_end=0.94)
        for name, az, el, base, tip, panel in RIBS
        if panel in panel_names
    ]


# ── Segmented seam backing ────────────────────────────────────────────
# Local plates sitting just behind selected shell seams, so a narrow gap shows
# STRUCTURE close behind rather than a 0.28-unit black shaft down to the
# chassis. Deliberately segmented: a continuous shell at this radius would read
# as a second sphere and would undo the chassis recession.
#
# name, az_from, az_to, el_from, el_to, radial, thickness
BACKING = [
    # The hero-facing junction (major_upper_rear | bridge_c at az 270).
    ("backing_rear_bridge", 261, 279, -1.0, 50.5, 0.822, 0.030),
    # bridge_c | major_upper_front at az 330.
    ("backing_bridge_front", 321, 339, -1.0, 50.5, 0.816, 0.028),
    # major_upper_front | port_maps_panel at az 65.
    ("backing_front_maps", 56, 74, -1.0, 50.5, 0.816, 0.028),
    # Lower shell junctions.
    ("backing_lower_a", 61, 79, -54, -1.0, 0.810, 0.028),
    ("backing_lower_b", 206, 224, -54, -1.0, 0.810, 0.028),
    # Crown seam, in three arcs. Broken at the recess (105-123) so the rear
    # opening keeps its deep view through to the 0.68 chassis.
    ("backing_crown_a", 128, 262, 44.0, 54.0, 0.834, 0.026),
    ("backing_crown_b", 280, 320, 44.0, 54.0, 0.834, 0.026),
    ("backing_crown_c", 340, 420, 44.0, 54.0, 0.834, 0.026),
]

# Deliberately NOT backed, so depth hierarchy survives:
#   * rear recess az 105-123      - deep view to the 0.68 chassis
#   * the three future service chamber sites
#   * the equatorial channel      - collar and ribs stay readable


def build_backing() -> list:
    """Segmented plates behind selected seams. Never a continuous layer."""
    return [
        make_panel(name, a0, a1, e0, e1, thickness=th, gap=0.0, scale=r)
        for name, a0, a1, e0, e1, r, th in BACKING
    ]


def build_ports() -> list:
    """Three collars in one design family, differing in construction detail."""
    parts = []

    # ── Maps — directional and precise: narrow collar plus two guide rails ──
    az, el = PORTS["maps"]
    collar, pos, normal, rot = port_collar("port_maps_collar", az, el, 0.20, 0.135, 0.075)
    parts.append(collar)
    for side in (-1, 1):
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=pos, rotation=rot)
        rail = bpy.context.active_object
        rail.name = f"port_maps_rail_{side}"
        rail.scale = (0.035, 0.30, 0.045)
        # Offset along the collar's local Y so rails flank the opening.
        rail.location = (
            pos[0] + normal[0] * 0.012 - math.sin(math.radians(az)) * 0.24 * side * 0.0,
            pos[1] + normal[1] * 0.012,
            pos[2] + normal[2] * 0.012 + 0.22 * side,
        )
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        parts.append(rail)

    # ── OrderRise — routed and open: layered collar with routing divisions ──
    az, el = PORTS["orderrise"]
    outer, _, _, rot2 = port_collar("port_orderrise_collar", az, el, 0.29, 0.205, 0.062)
    parts.append(outer)
    inner_collar, pos2, n2, _ = port_collar("port_orderrise_inner", az, el, 0.205, 0.135, 0.10)
    parts.append(inner_collar)
    for k in range(3):
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=pos2, rotation=rot2)
        div = bpy.context.active_object
        div.name = f"port_orderrise_div_{k}"
        div.scale = (0.030, 0.115, 0.030)
        ang = math.radians(90 * k + 25)
        div.location = (
            pos2[0] + n2[0] * 0.02,
            pos2[1] + n2[1] * 0.02 + math.cos(ang) * 0.17,
            pos2[2] + n2[2] * 0.02 + math.sin(ang) * 0.17,
        )
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        parts.append(div)

    # ── Agents — modular: main seat plus three smaller docking seats ──
    az, el = PORTS["agents"]
    collar3, pos3, n3, rot3 = port_collar("port_agents_collar", az, el, 0.185, 0.12, 0.070)
    parts.append(collar3)
    for k, ang_deg in enumerate((20, 145, 265)):
        a = math.radians(ang_deg)
        seat, _, _, _ = port_collar(
            f"port_agents_seat_{k}",
            az + math.cos(a) * 15.0,
            el + math.sin(a) * 11.0,
            0.075,
            0.046,
            0.055,
        )
        parts.append(seat)

    return parts


def main() -> int:
    proof = "--proof" in sys.argv
    print("Recess / hero-camera validation:")
    validate_recess_against_hero()
    reset_scene()

    chassis_parts = make_chassis(scale=0.680, port_dirs=list(PORTS.values()))
    graphite = pbr_material("Graphite", (0.055, 0.061, 0.078), 0.18, 0.52)
    core_mat = pbr_material("CoreDark", (0.020, 0.023, 0.030), 0.30, 0.62)
    for part in chassis_parts:
        part.data.materials.clear()
        part.data.materials.append(core_mat)

    # The proof builds one representative slice: two adjacent panels, one
    # bridge crossing the channel, one port collar, and the core behind them.
    selected = (
        [p for p in PANELS if p[0] in ("major_upper_front", "port_maps_panel", "bridge_a")]
        if proof
        else PANELS
    )

    panels = []
    for name, a0, a1, e0, e1, thick, gap, _role, taper, proj in selected:
        panel = make_panel(name, a0, a1, e0, e1, thickness=thick, gap=gap,
                           az_taper=taper, scale=proj)
        panel.data.materials.clear()
        panel.data.materials.append(graphite)
        panels.append(panel)

    # Backing is exterior-adjacent structure, so it carries the chassis
    # material and stays visually subordinate to the shell panels.
    backing = [] if proof else build_backing()
    for b in backing:
        b.data.materials.clear()
        b.data.materials.append(core_mat)

    ribs = build_ribs({p.name for p in panels})
    for rib in ribs:
        rib.data.materials.clear()
        rib.data.materials.append(core_mat)

    port_parts = []
    if proof:
        collar, _, _, _ = port_collar("port_maps_collar", *PORTS["maps"], 0.20, 0.135, 0.075)
        port_parts = [collar]
    else:
        port_parts = build_ports()

    for part in port_parts:
        part.data.materials.clear()
        part.data.materials.append(graphite)

    # Bevel every panel and port part. Panels are separate objects, so each gets
    # its own bevelled border — that border is what reads as manufactured edge.
    for obj in panels + port_parts:
        bpy.context.view_layer.objects.active = obj
        bevel = obj.modifiers.new("Bevel", "BEVEL")
        bevel.width = 0.009
        bevel.segments = 2
        bevel.limit_method = "ANGLE"
        bevel.angle_limit = math.radians(35)
        bevel.harden_normals = True
        bpy.ops.object.modifier_apply(modifier=bevel.name)
        wn = obj.modifiers.new("WeightedNormal", "WEIGHTED_NORMAL")
        wn.keep_sharp = True
        bpy.ops.object.modifier_apply(modifier=wn.name)
        for op in ("shade_smooth_by_angle", "shade_auto_smooth", "shade_smooth"):
            try:
                getattr(bpy.ops.object, op)()
                break
            except Exception:
                continue

    all_objs = chassis_parts + backing + ribs + panels + port_parts
    tris = 0
    verts = 0
    depsgraph = bpy.context.evaluated_depsgraph_get()
    for obj in all_objs:
        ev = obj.evaluated_get(depsgraph)
        m = ev.to_mesh()
        m.calc_loop_triangles()
        tris += len(m.loop_triangles)
        verts += len(m.vertices)
        ev.to_mesh_clear()

    out = MODELS_DIR / ("brand-world-proof.glb" if proof else "brand-world-additive.glb")
    export_glb(
        out,
        {
            "asset": out.stem,
            "mode": "proof" if proof else "full",
            "bpy": bpy.app.version_string,
            "triangles": tris,
            "vertices": verts,
            "meshes": len(all_objs),
            "panels": len(panels),
            "port_parts": len(port_parts),
            "ribs": len(ribs),
            "backing_segments": len(backing),
        },
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
