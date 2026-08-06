# Phase 3 checkpoint — resume here

Validated state of the Brand World blockout work. **Resume from this document.
Do not repeat setup or reinstall dependencies.**

---

## Status

| Item | State |
| --- | --- |
| bpy pipeline | ✅ Verified and documented |
| GLB → R3F import | ✅ Verified (scale, normals, Y-up, material separation) |
| Clay / dark / silhouette review modes | ✅ Working |
| Dark-studio rig calibration | ✅ Calibrated |
| Additive panel method | ✅ **Approved by client** |
| 3-panel proof — panels, thickness, chassis recession | ✅ Passing |
| 3-panel proof — ribs, chassis body, collar | ❌ **Failing — fix these first** |
| Full ten-panel blockout | ⬜ Not started |
| Phase 3 review package (34 items) | ⬜ Not started |

---

## Environment — already installed, do not redo

```bash
# EXISTS ALREADY at .venv-blender/ (~1 GB, git-ignored)
# Only recreate if the venv is missing:
python -m venv .venv-blender
.venv-blender/Scripts/python.exe -m pip install "bpy==5.2.0"
```

Python 3.13.14 · bpy 5.2.0 LTS (pinned) · global Python deliberately untouched.

## Commands

```bash
# Regenerate the 3-panel proof
.venv-blender/Scripts/python.exe tools/blender/brand_world_additive.py --proof

# Generate the full ten-panel model
.venv-blender/Scripts/python.exe tools/blender/brand_world_additive.py

# Pipeline sanity check (only if export behaviour looks wrong)
.venv-blender/Scripts/python.exe tools/blender/verify_pipeline.py

# Review in browser
npm run dev   # then open http://localhost:3000/orbit-material-test
```

Every script prints a `PIPELINE_REPORT {…}` line with triangle count, vertex
count, mesh count and byte size. Measure from that, never estimate.

## File map

| File | Role |
| --- | --- |
| `tools/blender/lib_panels.py` | **Core of the approved method.** `make_panel` (parametric quad-grid spherical patch + solidify), `make_chassis`, `port_collar` |
| `tools/blender/lib_hardsurface.py` | Shared bevel / weighted-normal / export helpers |
| `tools/blender/brand_world_additive.py` | **Entry point.** `PANELS` table, `PORTS`, `build_ports()` |
| `tools/blender/brand_world.py` | ⚠️ **REJECTED** boolean version. Archived as a documented failed experiment. Do not extend |
| `tools/blender/verify_pipeline.py` | Pipeline verification only |
| `src/app/orbit-material-test/viewer.tsx` | Clay / dark / silhouette review route |
| `public/models/brand-world-proof.glb` | Current proof output |
| `public/models/brand-world-blockout.glb` | ⚠️ Rejected boolean output, kept for comparison only |
| `public/models/pipeline-test.glb` | ⚠️ **Do not overwrite** — verified pipeline reference asset |

---

## Approved parameters — do not re-litigate

```
Spheroid radii (x, y, z)        1.06, 1.00, 0.92   # tri-axial, never spherical
Chassis scale                   0.735              # recessed; 0.90 FAILED
Panel thickness — major         0.110 – 0.118
Panel thickness — port surround 0.094 – 0.102
Panel thickness — bridge        0.118 – 0.120
Panel gap (half-inset)          1.5° major · 1.7° port · 0.5° bridge
Equatorial channel band         ±2.0° elevation
Bevel                           0.009 width, 2 segments, 35° limit, hardened
```

### Calibrated dark-studio rig

```
key 1.15 · fill 0.14 · rim 0.45 · ambient 0.03 · env 0.22 · exposure 0.95
```

Starting values only — recalibrate against the finished ten-panel geometry.

---

## Next actions, in order

### 1. Fix the ribs — the blocking failure

Currently `make_chassis` emits **free-standing 0.30 cubes at mid-radius (0.76)**
that touch neither the chassis (0.735) nor the panel inner face (~0.885). They
read as floating blocks.

Each rib must be a **tapered member spanning the full radial gap**: anchored on
the chassis surface, terminating against a recessed shoulder under its panel.
Vary by function — broad for major panels, directional for ports, narrow for
bridges. Expose only enough to explain assembly.

### 2. Rebuild the chassis body

Replace the subdivision-1 icosphere — its triangular faceting risks the gemstone
read. Build a compressed drum / rounded polyhedral body with broad controlled
surfaces, flattened top and bottom, and three mounting zones aligned to the ports.

### 3. Integrate the collar

The current `ChassisRing` cylinder floats as a saucer. Make it a stepped
structural collar joined to the chassis body, two or three radial steps,
providing bridge-panel mounting surfaces. Must not form a complete visible disc.

### 4. Re-run the proof, then the full ten panels

The `PANELS` table is already written and role-tagged — no layout work needed.

### 5. Performance instrumentation

Measure separately, cold (cache disabled) and warm, dev and production build:
GLB download · parse · geometry upload · first shader compile · env-map
processing · first interactive frame · settled fps.

Preliminary and **unconfirmed**: the dip appears on first load only, settles to
60fps, and scales with GLB size (3.34 MB → 16fps; 213 KB → barely dips). That
points at parse plus first-frame upload rather than shader compilation. Confirm
with markers before reporting as fact.

---

## Measurements so far

| Version | Triangles | GLB | Verdict |
| --- | --- | --- | --- |
| Boolean blockout | 46,386 | 3.34 MB | **Rejected** — carved sphere |
| Additive proof (3 panels) | 3,680 | 213 KB | Method approved; ribs/chassis/collar failing |
| Full ten-panel target | 12,000–25,000 | < 1.5 MB | Not yet built |
