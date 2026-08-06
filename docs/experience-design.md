# valueble.ai — immersive experience design

Design document for the WebGL rebuild. Written before the code, so the concept can be
rejected cheaply rather than after eight sections are built around it.

---

## 1. Brand and goal

| | |
| --- | --- |
| **Brand** | valueble.ai |
| **Founder** | Hamza Khalil Bhatti — solo builder, not an agency with a bench |
| **Industry** | AI agents and internal tooling for small businesses and agencies |
| **Products** | Maps Lead Scraper (Chrome extension, v5.2) · OrderRise (WhatsApp ordering agent, $50/mo) · Custom AI agent builds |
| **Audience** | Agency owners with a prospecting bottleneck; restaurant and local-business operators losing orders to an unanswered phone; operators who can name the task eating twenty hours a month |
| **Primary goal** | Get a booked call or a WhatsApp message. Not signups, not newsletter, not "learn more" |
| **Secondary goal** | Make a solo operator read as a serious engineering outfit |

**The single idea the whole site exists to communicate:**

> Unstructured mess goes in. Structured, actionable records come out.

That is literally all three products. Maps chaos → a scored lead list. A messy WhatsApp
thread → a clean kitchen ticket. An undefined manual process → a system that runs
unattended. The 3D has to be *that*, or it is decoration.

---

## 2. Three creative 3D concepts

### Concept A — "The Instrument"

A precision mechanical apparatus, brass and matte steel, that assembles itself as you
scroll. Each product is a mechanism that clicks into the whole.

- **For:** "systems that run unattended without anyone watching" made literal. Machinery reads as engineering credibility.
- **Against:** brass gears are one degree from steampunk cliché, and a machine says *how* the work happens rather than *what the visitor gets*. Also the weakest fit for OrderRise, which is a conversation, not a mechanism.

### Concept B — "The Core" (recommended)

A single monolithic slab floating in space — dense, warm, ceramic-white, edges catching a
single amber rim light. It opens as an extreme macro of one edge and pulls back to reveal
a solid block. On scroll it **delaminates** into three strata, one per product, each with
its own surface language. At the call to action they compress back into one solid object.

- **For:** the delamination *is* the business idea — one system, three things it does, reassembling into something whole. Every stage is scroll-legible. It resolves to a satisfying final state instead of trailing off.
- **Against:** demands genuinely good lighting and materials; a poorly lit white block looks like grey soup.

### Concept C — "The Field"

An architectural terrain seen from above. Scattered points rise out of it, get filtered,
and march into ordered columns while the camera flies low across the surface.

- **For:** the most literal read of lead extraction — the strongest single-product visual.
- **Against:** it only tells the Maps Scraper story. OrderRise and custom builds have to be bolted on. It also reads as a data dashboard, which is exactly the SaaS look to avoid.

---

## 3. Recommended concept: **B — The Core**

Three reasons it wins:

1. **It carries all three products without strain.** One object, three strata. Concept C serves one product; Concept A serves the abstract idea of machinery.
2. **It has a real arc with a destination.** Mystery → whole → separated → reassembled. The brief asks for a satisfying final state at the CTA; a block that closes back into itself *is* that. Nothing else here resolves as cleanly.
3. **It suits a solo founder.** A monolith is austere and confident. Machinery would over-claim scale that does not exist.

### What each stratum is

| Stratum | Product | Surface language | Material |
| --- | --- | --- | --- |
| **Upper** | Maps Lead Scraper | Perforated with a grid of fine recesses that resolve into ordered rows across the face | Matte ceramic, deep pinholes, contact shadow |
| **Middle** | OrderRise | A single continuous channel routed through the face, entering ragged and leaving straight | Ceramic with a polished channel floor catching amber |
| **Lower** | Custom AI Agents | Interlocking recessed forms — parts that only make sense together | Ceramic with brushed-brass inlay |

The strata are never labelled in 3D. Their meaning comes from the copy beside them. Text
explains; the object shows.

---

## 4. Visual direction

Warm, austere, physical. Gallery lighting on a single object, not a product render.

- **Light:** one hard key from upper-left, broad soft fill from the right, tight amber rim along the back edge. Real contact shadows. No bloom, no lens flare, no glow.
- **Surface:** fine imperfection everywhere — the object should read as fired ceramic, not plastic. Roughness ~0.65 with subtle variation. Never mirror-finish.
- **Space:** the object sits in warm void. No floor plane, no horizon, no environment scenery. Negative space does the work.
- **Restraint:** amber appears on exactly three things across the site — the rim light, one accent rule per stratum, and the primary CTA. Nothing else.

---

## 5. Website structure

Eight stages, each a distinct camera position on one continuous scene.

| # | Section | Scene state |
| --- | --- | --- |
| 00 | Cinematic loader | Black. Monogram, real percentage, a single lit edge emerging from dark |
| 01 | Hero | Macro on one edge. Object mostly out of frame. Mystery |
| 02 | The premise | Camera pulls back — the whole monolith, still sealed |
| 03 | Work index | First separation: three strata part slightly, hairlines of amber between |
| 04–06 | Product stages | Camera travels to each stratum in turn; the other two dim and recede |
| 07 | Approach | All three orbit slowly at mid-distance |
| 08 | Proof | Object at rest, far back, small in frame. Stillness so numbers read |
| 09 | Final CTA | Strata compress back into one solid block, amber rim ignites |
| 10 | Footer | Object drops below frame; only its shadow remains |

---

## 6. Section-by-section animation storyboard

| Scroll | Camera | Object | Type | Light |
| --- | --- | --- | --- | --- |
| 0.00 | z 1.4, tight | Edge only, filling frame | Headline masked reveal, line by line | Key hard, rim off |
| 0.10 | pull to z 6 | Full monolith, slow y-rotate | Headline exits upward behind object | Rim fades in |
| 0.22 | hold | Sealed, breathing drift | Premise copy enters | Fill lifts |
| 0.35 | drift left | Strata part 0.4 units | Index rows enter, staggered | Amber hairlines appear |
| 0.45 | to upper stratum | Others drop to 25% opacity | Product 01 copy | Key tightens on face |
| 0.58 | to middle stratum | Channel catches amber as it turns | Product 02 copy | Rim sweeps the channel |
| 0.70 | to lower stratum | Brass inlay catches key | Product 03 copy | Warmest point of page |
| 0.80 | pull back, orbit | All three, slow orbit | Approach list | Even, calm |
| 0.88 | far, static | At rest, minimal drift | Proof numbers — **no object motion** | Flat, low contrast |
| 0.95 | push in | Strata slam together, settle | CTA headline | Rim ignites full amber |
| 1.00 | tilt down | Drops below frame | Footer | Key fades, shadow lingers |

**Stillness is scheduled, not accidental.** At 0.22 and 0.88 the object is deliberately
near-static so copy can be read. Everything moving all the time is how these sites become
unreadable.

---

## 7. Object behaviour rules

- Scroll progress drives a **single normalised timeline** (0–1). Every camera and object property reads from it. No independent animations that can desync.
- All values are **damped, never snapped** — frame-rate independent interpolation, so a 144Hz display and a 60Hz laptop resolve identically.
- Idle drift continues under the scroll-driven motion so the object never looks frozen — but at ~15% amplitude during reading sections.
- The object **never spins continuously**. Rotation is always going somewhere.
- Pointer parallax is capped at ±0.08 radians. Enough to feel alive, not enough to fight the scroll.

---

## 8. Typography and colour

Carried over — this part was already right and does not need reinventing.

| Role | Face |
| --- | --- |
| Display | Instrument Serif |
| Body / UI | Inter |
| Labels, numerals | JetBrains Mono, uppercase, 0.16em tracking |

| Token | Value | Role |
| --- | --- | --- |
| `--color-paper` | `#f7f4ef` | Dominant background |
| `--color-ink` | `#17140f` | Foreground |
| `--color-accent` | `#c2551f` | Accent — rim light, one rule, primary CTA only |
| `--color-paper-deep` | `#efeae1` | Supporting neutral |
| `--color-ink-soft` | `#5f584e` | Body copy |

Text motion is **line masking only**. Per-character staggering was built, tested, and
removed — it makes words arrive later than the reader and reads as a template effect.

---

## 9. Desktop vs mobile

Not a shrink. A different composition.

| | Desktop | Mobile |
| --- | --- | --- |
| Camera path | Full 11-stage travel | 4 stages: macro → whole → separated → reassembled |
| Object detail | Full geometry, all inlays | Reduced segments, inlays baked into texture |
| Pointer parallax | Yes | None — replaced by gentle device-orientation drift, or nothing |
| Shadows | Real contact shadows | Baked shadow plane |
| Hover states | Full | Replaced by press states |
| Fallback | — | Pre-rendered stills of the four key states if the device is weak |

---

## 10. Technical architecture

Already in place: Next.js 16, React 19, TypeScript, Tailwind v4, R3F 9.7, drei 10.7,
three 0.185, Lenis, motion. To add: GSAP + ScrollTrigger for the master timeline.

```
src/
  components/
    webgl/
      stage.tsx          Canvas, quality tier, resize + visibility handling
      core/
        monolith.tsx     The object; consumes timeline progress
        strata.tsx       The three plates and their surface treatments
        lighting.tsx     Key / fill / rim rig
      timeline.ts        Scroll → normalised progress → per-section scene state
      quality.ts         Device capability probe → high | balanced | lightweight
      loader.tsx         Cinematic loader with real progress + skip
```

**Non-negotiable:** every word of content stays in semantic HTML. The canvas is
decorative and `aria-hidden`. Nothing indexable lives inside WebGL. All routes stay
statically prerendered — that is already true and must not regress.

---

## 11. Asset requirements

Geometry is **generated in code**, not imported — the strata are extruded plates with
boolean-style recesses, which keeps the payload near zero and avoids a GLTF pipeline.

Still needed from you:

1. Product screenshots (extension mid-scrape, OrderRise dashboard, real WhatsApp thread) — for the media planes in the product stages
2. A portrait — About
3. Three real proof numbers
4. Optional: a monogram mark for the loader. Type-set `v.` works if there is none

---

## 12. Performance strategy

Three tiers, chosen by a capability probe at boot (device memory, hardware concurrency,
GPU renderer string, screen size):

| Tier | Gets |
| --- | --- |
| **High** | Full geometry, contact shadows, all light sources, DPR up to 1.75 |
| **Balanced** | Reduced segments, baked shadow, two lights, DPR capped at 1.25 |
| **Lightweight** | No canvas. Pre-rendered stills at section boundaries. Layout identical |

Plus: render loop pauses on tab blur, geometry and materials disposed on unmount, no
per-frame allocation in `useFrame`, and a hard rule that scroll and pointer values flow
through refs so a frame never triggers React.

**Budget: interactive within 2.5s on a mid laptop.** If the loader routinely runs longer
than that, the scene is too heavy and gets cut down — not the other way round.

---

## 13. Accessibility strategy

- Canvas is `aria-hidden`; every piece of content exists as semantic HTML underneath
- Full keyboard navigation with visible focus states — already in place
- Correct heading order; no heading exists only as a 3D element
- `prefers-reduced-motion`: no camera travel, no cursor effects, no Lenis, transitions become fades, object becomes a static still. **All content and functions remain available**
- No scroll hijacking. Scroll drives the scene but never blocks or overrides normal scrolling
- Custom cursor on fine-pointer devices only, and never as the sole affordance
- Contrast maintained against every scene state — the object must never sit behind body copy

---

## 14. Open risks

1. **Ceramic white on warm paper is a narrow contrast band.** If the object fails to separate from the background, the fix is a deeper background for 3D-visible sections, not a brighter object.
2. **The booking link is OrderRise-specific** (`meeting-for-orderrise`) but is wired to every "Book a call" button site-wide. A generic event type would serve the agency-level CTAs better.
3. **Product screenshots are still missing.** The product stages have a media plane in the design with nothing to put on it yet.
