# valueble.ai — motion system

The reference sites (stonestyle, brewdistrict) do not feel expensive because they move
a lot. They feel expensive because **everything that moves, moves the same way**, and
nothing moves without a reason. This document is the ruleset that keeps that true as the
site grows.

## Architecture

The site is now **WebGL-first**, matching the reference. One fixed, full-viewport
`<canvas>` sits at `z-0` behind everything; all page content is `z-10` on top.

This is why `html` carries the page background colour and `body` is transparent — a
solid `body` background would sit between the canvas and the viewer and hide the scene
entirely. If the page ever renders as flat paper with no slabs, check that first.

Sections choose whether to reveal it:

| Section tone | Background | Canvas |
| --- | --- | --- |
| `paper` | transparent | visible |
| `deep` | `bg-paper-deep` | hidden |
| `ink` | `bg-paper-dark` | hidden |

That alternation is deliberate. An unbroken 3D backdrop down the whole page stops
reading as depth and starts reading as wallpaper; closing the view periodically is what
makes the open sections land.

### Composition rule for the 3D

**Type always wins.** Slab positions are hand-placed, never random, and the two
constraints are non-negotiable: nothing sits in the headline's column, and nothing
crowds the body-copy band. Row bars are kept faint for the same reason. If you add a
slab, check it against the text at 1280px and 1920px before keeping it.

## The one rule

> Motion exists to explain a relationship. If a movement is not telling the visitor
> *"this came from there"*, *"this is the same thing"*, or *"this just arrived"*,
> it should not be there.

Decoration is how a site starts looking cheap. Every pattern below earns its place by
answering a question the visitor would otherwise have to work out for themselves.

---

## 1. The timing scale

Four durations. Nothing on the site uses a number outside this set.

| Token | Value | Used for |
| --- | --- | --- |
| `--dur-exit` | 160ms | Anything leaving. Always the fastest — departing content must not compete for attention |
| `--dur-enter` | 220ms | Anything arriving. Delayed until the exit finishes |
| `--dur-move` | 420ms | Position and size changes during navigation |
| `--dur-reveal` | 850ms | Scroll reveals. Slow, because the visitor controls the pace |

**Exits are always faster than enters.** This asymmetry is the single most important
timing decision — it's what makes a transition feel intentional instead of sluggish.

### Easing

One curve everywhere: `--ease-editorial` = `cubic-bezier(0.22, 1, 0.36, 1)`.

Fast out of the gate, long settle. It reads as *weight* — things arrive like paper
settling, not like UI snapping. Never use `linear` (feels mechanical) or `ease-in-out`
(feels sluggish at this duration).

### Distance

| Token | Value | Rationale |
| --- | --- | --- |
| Reveal rise | 28px | Enough to read as movement, small enough not to shift layout perceptibly |
| Nav slide | 48px | Communicates direction without making the eye chase content |
| Parallax drift | 6% of height | Below the threshold where it reads as "effect" |

---

## 2. The patterns

### A. Shared-element morph — *"this is the same thing"*

The signature transition. On the home page, each product is a row with its name set large.
On the product page, that same name is the headline. Wrapping both in `<ViewTransition>`
with a matching `name` makes the browser animate one into the other — the visitor watches
the title travel and resize, rather than watching one page vanish and another appear.

This is the highest-value motion on the site because it is the only one carrying
information the visitor could not otherwise get.

A brief blur mid-flight hides pixel interpolation artifacts on large type.

### B. Directional slide — *"forward" / "back"*

Horizontal direction encodes navigation depth. Going deeper slides content left; coming
back slides it right. Tagged explicitly per link via `transitionTypes`, because the
correct direction is a judgement about the site's hierarchy, not something to infer:

| Navigation | Type |
| --- | --- |
| Home → product, product → next product | `nav-forward` |
| Product → home, footer/nav links, logo | `nav-back` |

The header is anchored (`view-transition-name: site-header`, animation suppressed) so the
visitor keeps one fixed reference point. A sliding header destroys the sense that
*content* moved rather than the whole viewport.

### C. Scroll reveal — *"this just arrived"*

Rise-and-fade for blocks, masked line-rise for display type. Fires once, on first entry.

Hidden state is scoped to `html.js` so a JS failure leaves everything visible — see the
note in `globals.css`. **Never hide content by default.**

### D. Parallax — *"this is behind"*

Background video drifts slower than the page, at 6% of section height. This is depth
cueing, not an effect: it stops the video reading as a flat pasted-on image. Anything
stronger becomes noticeable and cheapens it immediately.

### E. Count-up — *"this is a quantity"*

Proof numbers animate from zero on first view. Only for actual quantities, never for
labels. Non-numeric values pass straight through untouched.

### F. Scroll progress — *"you are here"*

A one-pixel amber line across the top. On long editorial pages this is the only cue for
how much is left. Not a scrollbar replacement — a reading indicator.

### G. Header retract — *"get out of the way"*

The header hides on scroll down and returns on scroll up. Reading gets the full viewport;
navigation is one small gesture away. Never hides near the top of the page, and never
while the mobile menu is open.

---

## 3. Reduced motion

`prefers-reduced-motion: reduce` is not a downgrade path to be half-implemented. When set:

- All scroll reveals resolve instantly, fully visible
- View transition durations drop to `0s` — content swaps, which is browser default
- Lenis smooth scrolling never initialises
- Background video never mounts; the poster shows instead
- Count-ups jump to their final value

Positional movement is the most common motion-sensitivity trigger, and directional slides
are the worst offender on this site. They are removed entirely rather than shortened.

---

## 4. What is deliberately absent

Documented so nobody adds them later thinking they were forgotten:

- **Cursor followers / magnetic buttons** — cost real interaction latency, break on touch entirely, and date a site faster than anything else.
- **Scroll-jacking / pinned sections** — takes control away from the reader. The references don't do it either.
- **Text scramble / typewriter effects** — makes editorial copy hard to read, which is the one thing this site cannot afford.
- **Entrance animation on every element** — if everything animates, nothing reads as significant.
- **Loading spinners** — every route is static and prerendered. There is nothing to wait for.

---

## 5. Where it lives

| File | Contains |
| --- | --- |
| `src/app/globals.css` | Duration tokens, view-transition CSS, reveal utilities, reduced-motion overrides |
| `src/components/page-transition.tsx` | Directional slide wrapper — used in each `page.tsx`, never in a layout |
| `src/components/reveal.tsx` | `Reveal` and `RevealLines` scroll primitives |
| `src/components/scroll-progress.tsx` | Reading indicator |
| `src/components/counter.tsx` | Count-up |
| `src/components/site-header.tsx` | Retract behaviour, anchored view-transition name |
| `src/components/background-video.tsx` | Parallax drift, poster/reduced-motion fallbacks |

**Directional wrappers must go in `page.tsx`, not `layout.tsx`.** Layouts persist across
navigation, so enter and exit never fire there.
