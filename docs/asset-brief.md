# valueble.ai — asset brief

Everything needed to finish the site. Two categories, and the distinction matters:

- **Generate with AI** — ambient background video. Texture and metaphor, no product UI.
- **Capture yourself** — anything showing the actual products. No video model can invent
  your dashboard, your extension panel, or a real WhatsApp thread. Attempting it produces
  fake-looking UI with garbled text, which reads as dishonest and is worse than nothing.

---

## Part 1 — Background videos (AI generated)

### Global rules for every prompt

Paste these constraints with every generation. They matter more than the creative prompt.

**Palette lock:** warm off-white / bone `#f7f4ef`, warm near-black `#17140f`, burnt amber
`#c2551f`. Warm neutrals only. No blue, no cyan, no teal, no purple, no neon.

**Universal negative prompt:**

```
text, letters, words, numbers, logos, watermarks, UI, screens, interfaces, faces, people,
hands, arms, fast motion, quick cuts, camera shake, zoom, blue tones, cyan, neon, glitch
effects, digital particles, circuit boards, holograms, lens flare, oversaturation, HDR look
```

**Technical, every clip:** 10 seconds · 24fps · 1920×1080 · static locked-off camera unless
stated · shallow depth of field · slow motion · no audio · no cuts.

**Why static camera:** moving cameras cannot loop. A locked-off shot with motion *inside*
the frame loops cleanly. This is the single biggest factor in whether the result is usable.

### Looping strategy per clip

| Loop type | How it works | Which clips |
| --- | --- | --- |
| **True loop** | Last frame matches first. Continuous cyclical motion. | V5, V6, V7 |
| **Ping-pong** | Play forward, then reverse. Doubles to 20s, always seamless. | V1, V3 |
| **Crossfade** | Overlap last 1s onto first 1s with a dissolve. | V2, V4 |

Ping-pong is free and flawless for anything that spreads or moves one direction — set
the video element to alternate rather than trying to make the model produce a true loop.

---

### V1 — Home hero · "Ink into paper"

The signature shot. Your accent colour, literally, blooming into your background colour.

```
Extreme macro shot of a single drop of burnt-amber ink slowly blooming into thick
handmade cotton paper. The ink spreads outward in fine feathered tendrils that follow
the paper's fibres, revealing deep surface texture and tiny cotton threads. The paper is
warm off-white bone colour; the ink is deep burnt orange, almost rust. Soft diffused
overhead daylight from a large north-facing window, with gentle falloff toward the frame
edges. Locked-off static camera, 100mm macro lens, very shallow depth of field, only the
spreading edge in sharp focus. Extremely slow motion, hypnotic and continuous, no cuts.
Muted, elegant, editorial, fine-art photography feel, subtle 35mm film grain.
```

Loop: **ping-pong.** The ink blooms out, then draws back in. Reads as breathing.

### V2 — Home "work" section · "Scattered into order"

The metaphor for the whole business: chaos becomes a list. If you only make two videos,
make this one and V1.

```
Overhead top-down macro shot of about forty small blank cream-coloured paper cards
scattered at random angles across a warm off-white surface. One by one, then in groups,
the cards slide smoothly and precisely into neat aligned rows and columns, as if arranged
by an invisible hand. Continuous unbroken motion, nothing enters or leaves the frame.
All cards are blank. A single card is burnt amber; the rest are bone and cream. Soft
diffused studio light from above and slightly left, casting soft shadows that shift as the
cards move. Locked-off static overhead camera, slight shallow depth of field at the frame
edges. Slow, deliberate, mesmerising, satisfying. Subtle film grain.
```

Loop: **crossfade.** Add to the negative prompt: `hands, arms, fingers, text on cards`.

### V3 — Product: Maps Lead Extractor · "Pins into a line"

```
Extreme macro top-down shot of a field of small brass map pins standing upright in warm
bone-coloured paper, scattered at random positions. One by one the pins lift slightly and
glide across the surface into a single perfectly straight ordered row. Warm neutral
palette — aged brass, burnt amber, off-white paper. Soft directional daylight raking from
the left, casting long soft shadows that sweep as each pin moves. Locked-off static
camera, 100mm macro lens, shallow depth of field. Slow, precise, mechanical, satisfying.
Subtle film grain, fine-art still-life feel.
```

Loop: **ping-pong.**

### V4 — Product: OrderRise · "The ticket"

```
Extreme macro slow-motion shot of a blank thermal paper ticket feeding out of a receipt
printer, the paper curling gently as it emerges. Completely blank paper, no printing.
Warm amber tungsten kitchen light from the upper right against deep warm shadow. Soft
out-of-focus steam drifts slowly across the dark background. Locked-off static camera,
85mm lens, very shallow depth of field, filmic grain, warm highlights and rich blacks.
Slow, calm, continuous, no cuts.
```

Loop: **crossfade.** Critical addition to the negative prompt: `printed text, receipt text,
numbers, barcode, readable print`. Models will fight you on this — regenerate until the
paper is genuinely blank.

### V5 — Product: Custom AI Agents · "Mechanism"

```
Extreme macro shot of a precision brass clockwork mechanism — interlocking gears, a
rotating escapement wheel, a slowly oscillating balance — turning continuously against a
warm bone-coloured background. Aged polished brass and burnt amber tones only, no chrome,
no steel, no blue. Soft diffused light with a single warm highlight raking across the
metal surfaces. Locked-off static camera, 100mm macro lens, shallow depth of field.
Smooth continuous rotation at constant speed with no beginning and no end. Subtle film
grain, fine-art product photography.
```

Loop: **true loop** — constant rotation cycles naturally. The most reliably loopable of the set.

### V6 — About page · "Light across plaster"

Nearly still. Ambient texture, not a subject. Good behind text.

```
Slow drifting macro shot across a warm off-white plaster wall with fine hand-troweled
surface texture, as the soft shadow of a window frame moves gradually across it. Warm
bone, sand and cream tones. Natural late-afternoon sunlight, very soft edges, gentle
warmth. Almost imperceptible lateral camera drift, 50mm lens. Minimal, calm, meditative,
nearly static. Subtle film grain.
```

Loop: **true loop** if the shadow drift is slow enough; **crossfade** otherwise.

### V7 — Footer / CTA band (dark) · "Amber across dark stone"

The footer is near-black. This is the one clip built for a dark background.

```
Extreme macro of warm amber light slowly sweeping across a matte black textured stone
surface, like a very slow sunrise raking across basalt. Deep warm near-black background
with a single soft burnt-amber light source drifting slowly from left to right, revealing
fine surface grain as it passes. No visible objects — pure light, shadow and texture.
Locked-off static camera, very shallow depth of field, rich blacks, filmic grain.
Extremely slow, meditative, continuous.
```

Loop: **true loop** — have the light exit right and re-enter left.

---

### Delivery spec

| Setting | Value | Why |
| --- | --- | --- |
| Resolution | 1920×1080 master | Downscale for web; never upscale |
| Frame rate | 24fps | Filmic, and 20% fewer frames than 30 |
| Codec | H.264 MP4 **and** VP9 WebM | WebM is ~30% smaller where supported |
| Audio | **Stripped entirely** | Saves size; browsers block autoplay with audio |
| Target size | **Under 2 MB** per clip | Background video must not delay the page |
| Poster | JPEG of frame 1, under 100 KB | Shown before play and on reduced-motion |

Compress with:

```bash
# MP4 — the main file
ffmpeg -i in.mp4 -an -c:v libx264 -crf 30 -preset slow -vf "scale=1920:-2,fps=24" out.mp4

# WebM — smaller, served first where supported
ffmpeg -i in.mp4 -an -c:v libvpx-vp9 -crf 40 -b:v 0 -vf "scale=1920:-2,fps=24" out.webm

# Poster frame
ffmpeg -i in.mp4 -vframes 1 -q:v 4 poster.jpg
```

`-an` strips audio. Push `-crf` higher (34, 38) until it looks bad — background video sits
under text and behind a scrim, so it tolerates far more compression than you'd expect.

Drop finished files in `public/video/` as `hero.mp4`, `hero.webm`, `hero.jpg`, etc.

### Implementation requirements

When these are wired in, the video element must:

- `autoplay muted loop playsinline` — `playsinline` is required or iOS goes fullscreen
- `preload="metadata"` — never `auto`, it blocks the page
- Show the poster image only, no video, when `prefers-reduced-motion: reduce` is set
- Show the poster image only on screens under 768px — phones are usually on mobile data
- Sit under a scrim (`bg-paper/70` light, or `bg-paper-dark/60` dark) so text stays legible

---

## Part 2 — Assets to capture yourself

No AI involved. These are the credibility assets and they cannot be generated.

### Screen recordings

**R1 — Extension mid-scrape** · ~15s · record at 1440×900
Google Maps open on a real category search. Start recording *before* you trigger the
extension so the viewer sees the before state, then the panel working, then rows filling.
Keep the cursor visible. Scrub any real business data you don't want public.

**R2 — WhatsApp order, customer side** · ~20s · phone screen recording
A full order in the demo restaurant thread: opening message, menu, adding an item,
confirming. Use a test contact so no real customer name or number appears.

**R3 — Order landing on the dashboard** · ~10s · desktop screen recording
The ticket appearing on the dashboard. If you can time it against R2, the two cut together
into the single most convincing thing on the entire site.

### Screenshots — 2x / retina, PNG

- **S1** OrderRise dashboard, populated with several realistic orders
- **S2** Kitchen display view
- **S3** Extension panel mid-run, rows visible
- **S4** An exported CSV open in Excel or Google Sheets — this one proves the output is real
- **S5** Analytics view, if it looks good

Use plausible fake business names. Never ship a screenshot with a real customer's phone
number, address, or name in it.

### Photography

- **P1 — Portrait.** Plain warm wall, natural window light from the side, waist-up, no
  flash. Phone portrait mode is fine. The About page is a personal-brand page with no face
  on it right now, which undercuts the whole premise.
- **P2 — Optional workspace shot.** Desk, laptop, warm light, shot from a low angle.
  Useful as an About-page band.

### Numbers

Three real figures to replace the placeholders in `proofPoints` (`src/lib/site.ts`).
Anything true and specific: leads extracted to date, orders handled, businesses using it,
hours saved per week. One honest number beats three vague ones.
