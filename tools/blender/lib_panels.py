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
RADII = (1.08, 0.99, 0.92)  # x (width), y (depth), z (height)


def envelope_flatten(az: float, el: float) -> float:
    """
    Broad manufactured flattening. Returns a radial multiplier.

    Four deliberate regions, all shallow surface decisions rather than cuts:
      * upper cap  — engineered rather than perfectly domed
      * lower cap  — smaller, gives the mass physical weight
      * Maps side  — slight lateral compression, makes one side directional
      * rear side  — calm shallow recession
    """
    f = 1.0
    el_deg, az_deg = math.degrees(el), math.degrees(az) % 360

    if el_deg > 58:
        f -= 0.085 * ((el_deg - 58) / 32) ** 1.5          # upper flat
    if el_deg < -64:
        f -= 0.035 * ((-el_deg - 64) / 26) ** 1.5         # lower flat

    # Lateral compression centred on the Maps port azimuth (85 deg).
    d_maps = abs(((az_deg - 85 + 180) % 360) - 180)
    if d_maps < 46:
        f -= 0.030 * math.cos(math.radians(d_maps * 90 / 46)) ** 2

    # Calm rear recession centred on 200 deg.
    d_rear = abs(((az_deg - 200 + 180) % 360) - 180)
    if d_rear < 55:
        f -= 0.022 * math.cos(math.radians(d_rear * 90 / 55)) ** 2

    return f


def spheroid_point(az: float, el: float, scale: float = 1.0):
    """Point on the flattened tri-axial envelope."""
    s = scale * envelope_flatten(az, el)
    ca, sa = math.cos(az), math.sin(az)
    ce, se = math.cos(el), math.sin(el)
    return (RADII[0] * s * ce * ca, RADII[1] * s * ce * sa, RADII[2] * s * se)


def make_panel(
    name: str,
    az_from: float,
    az_to: float,
    el_from: float,
    el_to: float,
    thickness: float = 0.055,
    gap: float = 1.4,
    scale: float = 1.0,
    az_taper: float = 0.0,
    segments_az: int | None = None,
    segments_el: int | None = None,
):
    """
    One shell panel as a solidified spherical patch.

    Angles in DEGREES. `gap` is the half-gap in degrees inset on every edge —
    this is what creates physical spacing between neighbouring panels, so the
    seams are gaps rather than grooves.

    `az_to` may exceed 360 to wrap across zero (e.g. 315 -> 425 means 315..65).

    `az_taper` narrows the azimuth span linearly toward the top edge (degrees
    removed from each side at el_to). A transition panel that tapers reads as a
    deliberate shape resolving into its neighbours; a constant-width one reads
    as a filler plate.
    """
    a0 = math.radians(az_from + gap)
    a1 = math.radians(az_to - gap)
    e0 = math.radians(el_from + gap)
    e1 = math.radians(el_to - gap)

    span_az = math.degrees(a1 - a0)
    span_el = math.degrees(e1 - e0)

    # Resolution follows angular size, so small panels do not carry the same
    # vertex budget as large ones.
    #
    # 2.0 deg per quad, not 4.5. At 4.5 the curvature read as visible faceting
    # in dark mode - flat quads catching the key light as discrete planes, which
    # is the single thing that made the object look low-poly rather than
    # manufactured. Smooth shading cannot rescue geometry that coarse.
    n_az = segments_az or max(8, min(110, int(span_az / 2.0)))
    n_el = segments_el or max(6, min(80, int(span_el / 2.0)))

    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)

    bm = bmesh.new()
    grid: list[list[bmesh.types.BMVert]] = []
    for i in range(n_el + 1):
        row = []
        t = i / n_el
        el = e0 + (e1 - e0) * t
        # Taper pulls both azimuth edges inward as elevation rises.
        inset = math.radians(az_taper) * t
        ta0, ta1 = a0 + inset, a1 - inset
        for j in range(n_az + 1):
            az = ta0 + (ta1 - ta0) * (j / n_az)
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


def surface_point(az_deg: float, el_deg: float, radial: float):
    """Point at a given fraction of the spheroid radius. Used to seat ribs."""
    az, el = math.radians(az_deg), math.radians(el_deg)
    return (
        RADII[0] * radial * math.cos(el) * math.cos(az),
        RADII[1] * radial * math.cos(el) * math.sin(az),
        RADII[2] * radial * math.sin(el),
    )


def make_rib(name: str, az_deg: float, el_deg: float, base: float, tip: float,
             r_start: float = 0.70, r_end: float = 0.93):
    """
    A tapered support member spanning chassis → panel.

    The previous version placed free-standing cubes at mid-radius touching
    neither end. This is built from the two endpoints, deliberately
    over-running both (0.70 starts inside the chassis at 0.735; 0.93 ends
    inside the panel inner face at ~0.89) so contact is guaranteed and no rib
    can read as floating.

    Tapered base→tip so load visibly travels outward: broad where it meets the
    chassis, narrow where it meets the panel.
    """
    x0, y0, z0 = surface_point(az_deg, el_deg, r_start)
    x1, y1, z1 = surface_point(az_deg, el_deg, r_end)
    dx, dy, dz = x1 - x0, y1 - y0, z1 - z0
    length = math.sqrt(dx * dx + dy * dy + dz * dz)

    pitch = math.acos(max(-1.0, min(1.0, dz / length)))
    yaw = math.atan2(dy, dx)

    # 4-sided cone = tapered rectangular member, cheap and reads as machined.
    bpy.ops.mesh.primitive_cone_add(
        vertices=4,
        radius1=base,
        radius2=tip,
        depth=length,
        location=((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2),
        rotation=(0.0, pitch, yaw),
    )
    rib = bpy.context.active_object
    rib.name = name
    return rib


def make_chassis(scale: float = 0.680, port_dirs: list[tuple[float, float]] | None = None):
    """
    Purpose-built inner chassis — a compressed engineered drum.

    Replaces the subdivision-1 icosphere, whose triangular faceting risked the
    gemstone read. A 16-sided drum gives broad controlled surfaces and genuinely
    flat upper and lower regions, and its silhouette can never be mistaken for a
    planet when glimpsed through a seam.

    Returns a single JOINED mesh: drum + stepped collar + mounting zones. Joining
    is what stops the collar reading as a separate saucer floating around a core.
    """
    parts = []

    # ── Central drum. Flat top and bottom, broad vertical facets. ──
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=1.0, depth=1.0)
    drum = bpy.context.active_object
    drum.name = "Chassis"
    drum.scale = (RADII[0] * scale, RADII[1] * scale, RADII[2] * scale * 1.02)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    parts.append(drum)

    # ── Integrated stepped collar at the equator. ──
    # Three shallow radial steps, each joined into the drum body, providing
    # mounting surfaces for the bridge panels. Kept below the panel line so it
    # is only ever seen through the channel and selected gaps.
    for radial, height in ((scale + 0.020, 0.30), (scale + 0.048, 0.185), (scale + 0.072, 0.10)):
        bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=1.0, depth=height)
        step = bpy.context.active_object
        step.name = f"ChassisCollarStep_{radial:.3f}"
        step.scale = (RADII[0] * radial, RADII[1] * radial, 1.0)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        parts.append(step)

    # ── Three mounting zones aligned to the service ports. ──
    # Raised pads on the drum that give the port collars something to seat
    # against and mark each service region on the chassis itself.
    for i, (az_deg, el_deg) in enumerate(port_dirs or []):
        pad = make_rib(f"ChassisMount_{i}", az_deg, el_deg, 0.22, 0.17,
                       r_start=0.60, r_end=scale + 0.06)
        parts.append(pad)

    # Join everything into one mesh so there is no unsupported separation.
    bpy.ops.object.select_all(action="DESELECT")
    for part in parts:
        part.select_set(True)
    bpy.context.view_layer.objects.active = drum
    bpy.ops.object.join()

    chassis = bpy.context.active_object
    chassis.name = "Chassis"

    # Light bevel so the drum edges catch the key light rather than reading as
    # a raw primitive, then flat shading to keep the surfaces broad.
    bevel = chassis.modifiers.new("Bevel", "BEVEL")
    bevel.width = 0.012
    bevel.segments = 2
    bevel.limit_method = "ANGLE"
    bevel.angle_limit = math.radians(30)
    bpy.ops.object.modifier_apply(modifier=bevel.name)
    bpy.ops.object.shade_flat()

    return [chassis]


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
