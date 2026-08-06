"""
Parametric shell-panel construction for THE BRAND WORLD.

Why this exists: the rejected first blockout carved grooves into one continuous
sphere with booleans. That can only ever read as "a sphere with lines cut into
it", and boolean subtraction produced 46k triangles of messy topology.

Here every panel is built directly as a quad grid on a tri-axial spheroid over
an explicit azimuth/elevation range, then solidified inward. Consequences:

  * Gaps between panels are REAL empty space, created by insetting each panel's
    angular bounds — not engraved lines.
  * Topology is clean quads by construction. No boolean solver involved.
  * Panel proportions are designed values, not leftovers between cuts.
  * Triangle count is predictable and low.
"""

from __future__ import annotations

import math

import bmesh
import bpy

# Tri-axial spheroid: wider than tall, and slightly unequal front-to-back so no
# two axes match. A perfectly round mass is what makes an object read as a planet.
RADII = (1.06, 1.00, 0.92)  # x (width), y (depth), z (height)


def spheroid_point(az: float, el: float, scale: float = 1.0):
    """Point on the tri-axial spheroid. az in radians around Z, el from -pi/2 to pi/2."""
    ca, sa = math.cos(az), math.sin(az)
    ce, se = math.cos(el), math.sin(el)
    return (
        RADII[0] * scale * ce * ca,
        RADII[1] * scale * ce * sa,
        RADII[2] * scale * se,
    )


def make_panel(
    name: str,
    az_from: float,
    az_to: float,
    el_from: float,
    el_to: float,
    thickness: float = 0.055,
    gap: float = 1.4,
    scale: float = 1.0,
    segments_az: int | None = None,
    segments_el: int | None = None,
):
    """
    One shell panel as a solidified spherical patch.

    Angles in DEGREES. `gap` is the half-gap in degrees inset on every edge —
    this is what creates physical spacing between neighbouring panels, so the
    seams are gaps rather than grooves.

    `az_to` may exceed 360 to wrap across zero (e.g. 315 -> 425 means 315..65).
    """
    a0 = math.radians(az_from + gap)
    a1 = math.radians(az_to - gap)
    e0 = math.radians(el_from + gap)
    e1 = math.radians(el_to - gap)

    span_az = math.degrees(a1 - a0)
    span_el = math.degrees(e1 - e0)

    # Resolution follows angular size, so small panels do not carry the same
    # vertex budget as large ones.
    n_az = segments_az or max(6, min(40, int(span_az / 4.5)))
    n_el = segments_el or max(4, min(30, int(span_el / 4.5)))

    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)

    bm = bmesh.new()
    grid: list[list[bmesh.types.BMVert]] = []
    for i in range(n_el + 1):
        row = []
        el = e0 + (e1 - e0) * (i / n_el)
        for j in range(n_az + 1):
            az = a0 + (a1 - a0) * (j / n_az)
            row.append(bm.verts.new(spheroid_point(az, el, scale)))
        grid.append(row)

    bm.verts.ensure_lookup_table()
    for i in range(n_el):
        for j in range(n_az):
            bm.faces.new((grid[i][j], grid[i][j + 1], grid[i + 1][j + 1], grid[i + 1][j]))

    bm.normal_update()
    bm.to_mesh(mesh)
    bm.free()

    # Thickness grows inward so the outer silhouette stays exactly on the
    # spheroid — panels must define the profile, not sit proud of it.
    bpy.context.view_layer.objects.active = obj
    solid = obj.modifiers.new("Thickness", "SOLIDIFY")
    solid.thickness = thickness
    solid.offset = 1.0
    solid.use_even_offset = True
    solid.use_quality_normals = True
    solid.use_rim = True
    bpy.ops.object.modifier_apply(modifier=solid.name)

    return obj


def make_chassis(scale: float = 0.735, port_dirs: list[tuple[float, float]] | None = None):
    """
    Recessed structural chassis — NOT a sphere.

    The previous proof failed because a smooth core at 0.90 scale sat flush
    against the panels and became the silhouette. This is a low-subdivision
    icosphere (80 large planes, flat-shaded) with extra vertical compression,
    recessed to ~0.735 so seams open onto real depth.

    Ribs run outward toward each port so panels visibly land on structure
    instead of floating over a void.
    """
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=1.0)
    chassis = bpy.context.active_object
    chassis.name = "Chassis"
    # Flattened harder than the shell — glimpsed through a gap it must never
    # read as a continuation of the outer sphere.
    chassis.scale = (RADII[0] * scale, RADII[1] * scale, RADII[2] * scale * 0.88)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    bpy.ops.object.shade_flat()

    parts = [chassis]

    # Equatorial support ring: gives the structural channel something to read
    # at depth so it is an assembly zone rather than an empty black belt.
    bpy.ops.mesh.primitive_cylinder_add(radius=1.0, depth=0.16, vertices=18)
    ring = bpy.context.active_object
    ring.name = "ChassisRing"
    ring.scale = (RADII[0] * (scale + 0.085), RADII[1] * (scale + 0.085), 1.0)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    bpy.ops.object.shade_flat()
    parts.append(ring)

    # Radial ribs toward each port — the visible attachment logic.
    for i, (az_deg, el_deg) in enumerate(port_dirs or []):
        az, el = math.radians(az_deg), math.radians(el_deg)
        inner = 0.62
        outer = 0.90
        mid = (inner + outer) / 2
        cx = RADII[0] * mid * math.cos(el) * math.cos(az)
        cy = RADII[1] * mid * math.cos(el) * math.sin(az)
        cz = RADII[2] * mid * math.sin(el)

        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(cx, cy, cz))
        rib = bpy.context.active_object
        rib.name = f"ChassisRib_{i}"
        rib.scale = (0.30, 0.30, 0.30)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        bpy.ops.object.shade_flat()
        parts.append(rib)

    return parts


def port_collar(name: str, az_deg: float, el_deg: float, outer: float, inner: float, depth: float):
    """
    A constructed port collar — a raised frame ring seated on the shell.

    Built additively and oriented to the surface normal. The rejected version
    carved cylinders into the sphere, which read as gouges; a collar reads as a
    fitted component.
    """
    az, el = math.radians(az_deg), math.radians(el_deg)
    px, py, pz = spheroid_point(az, el, 1.0)

    # Outward normal of a spheroid is not the position vector — it needs the
    # inverse-square-radii scaling, or collars sit visibly skewed off-axis.
    nx = px / (RADII[0] ** 2)
    ny = py / (RADII[1] ** 2)
    nz = pz / (RADII[2] ** 2)
    n_len = math.sqrt(nx * nx + ny * ny + nz * nz)
    nx, ny, nz = nx / n_len, ny / n_len, nz / n_len

    pitch = math.acos(max(-1.0, min(1.0, nz)))
    yaw = math.atan2(ny, nx)
    rotation = (0.0, pitch, yaw + math.pi / 2)

    bpy.ops.mesh.primitive_cylinder_add(
        radius=outer,
        depth=depth,
        vertices=40,
        location=(px - nx * depth * 0.18, py - ny * depth * 0.18, pz - nz * depth * 0.18),
        rotation=rotation,
    )
    collar = bpy.context.active_object
    collar.name = name

    # Hollow it so the collar is a rim, not a plug.
    bpy.ops.mesh.primitive_cylinder_add(
        radius=inner,
        depth=depth * 2.4,
        vertices=40,
        location=(px, py, pz),
        rotation=rotation,
    )
    bore = bpy.context.active_object

    bpy.context.view_layer.objects.active = collar
    mod = collar.modifiers.new("bore", "BOOLEAN")
    mod.operation = "DIFFERENCE"
    mod.object = bore
    mod.solver = "EXACT"
    bpy.ops.object.modifier_apply(modifier=mod.name)
    bpy.data.objects.remove(bore, do_unlink=True)

    return collar, (px, py, pz), (nx, ny, nz), rotation
