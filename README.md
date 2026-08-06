# valueble.ai

Personal-brand / agency site for **valueble.ai** — AI agents and growth tools built by Hamza Khalil Bhatti.

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind v4 · TypeScript.

## Running it

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve the production build
npm run lint    # eslint (note: `next lint` was removed in Next 16)
```

## Where to change things

**`src/lib/site.ts` is the file you'll edit most.** It holds every contact link, all
product copy, and the proof numbers. Changing one string there updates every page
that uses it — you should not need to touch a component to change a phone number,
a price, or a product description.

| What | Where |
| --- | --- |
| WhatsApp number, LinkedIn, booking link, email | `contact` in `src/lib/site.ts` |
| Product copy (all three) | `products` in `src/lib/site.ts` |
| Home page numbers | `proofPoints` in `src/lib/site.ts` |
| Colours, type scale, motion easing | `@theme` block in `src/app/globals.css` |
| Nav links | `nav` in `src/lib/site.ts` |

Adding a fourth product means adding one entry to `products` and one slug to
`ProductSlug` — the route, the nav, the footer, the sitemap and the "next product"
link all pick it up automatically.

## Outstanding TODOs

Every one of these is marked with a `TODO` comment in the code — search the repo for
`TODO` to find them.

1. **Booking link** — `contact.booking` is a placeholder (`cal.com/hamza-khalil`).
   cal.com was down when this was built. Replace with the real event URL.
2. **Chrome extension** — the first product is named "Maps Lead Extractor" as a
   placeholder. The real name and verified feature list still need to come from the
   extension source.
3. **Proof numbers** — `proofPoints` are placeholders. Real figures convert far better.
4. **Brand assets** — see below.
5. **Location lines** — "Based in Pakistan" appears on the home page, About page, and
   footer. Confirm or narrow to a city.
6. **Response time** — the contact page claims "same day". Confirm before it's a promise.

## Brand assets still needed

The site is built to look finished without images, using typographic layouts and
SVG diagrams. These are the swaps that would raise it further, in priority order:

1. **Product screenshots** — extension mid-scrape, OrderRise dashboard, a real
   WhatsApp order thread. These replace the diagrams in `src/components/product-visual.tsx`.
2. **A portrait of Hamza** — replaces the facts plate on the About page.
3. **A 10–15s screen recording** of the WhatsApp agent replying.
4. **A wordmark** — currently set in type (`Wordmark` in `src/components/ui.tsx`),
   which is a deliberate choice, not a gap. Only replace it with a real logo if the
   logo is better than the type.

## Motion

The full ruleset — timing scale, patterns, and what is deliberately excluded — is in
`docs/motion-system.md`. Read it before adding any animation. Two rules that are easy
to break by accident:

- **Directional page wrappers go in `page.tsx`, never `layout.tsx`.** Layouts persist
  across navigation, so enter/exit never fire there.
- **Never hide content by default.** Reveal hidden states are scoped to `html.js` so a
  JS failure leaves the page readable.

## Notes on how it's built

- **Motion**: scroll reveals are CSS transitions released by an `IntersectionObserver`
  (`src/components/reveal.tsx`). The hidden state is scoped to `html.js`, set by an
  inline script in the root layout — so if JavaScript never runs, nothing is hidden
  and the page still reads. Do not remove that scoping.
- **Smooth scroll**: Lenis (`src/components/smooth-scroll.tsx`), disabled when the
  visitor prefers reduced motion.
- **Background video**: `src/components/background-video.tsx`. Each slot expects three
  files in `public/video/` sharing a basename — `.webm`, `.mp4`, `.jpg` (poster). The
  `<video>` is only mounted above 768px and when reduced motion is not requested, so
  phones download the poster alone. Every clip is trimmed then mirrored (forward +
  reverse) so the loop is seamless by construction — see `docs/asset-brief.md` for the
  ffmpeg pipeline. Product-page videos are keyed by product slug.
- **Type scale**: the display sizes have a deliberately low floor on phones. The
  longest display line is ~8.2px wide per 1px of font size and overflows a 320px
  screen above ~33px. Desktop gets the full scale back via a `min-width: 768px`
  override in `globals.css`. If you raise the mobile floor, check for horizontal scroll.
- **Palette** is light-only on purpose (`color-scheme: light`), matching the
  editorial references.

## Deploying

Not deployed yet. Vercel is the path of least resistance for Next 16:
push to GitHub, import the repo, no configuration needed. Set the real domain in
`site.url` (`src/lib/site.ts`) before deploying — it drives the sitemap, the
canonical URLs, and the OG image metadata.
