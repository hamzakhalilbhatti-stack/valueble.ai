# CHANGES — redesign-seo

Full design overhaul plus SEO restructure. Same stack (Next.js 16 static export, React 19,
Tailwind v4), same content and voice, same prices and contact details.

## Design
- New token system in `src/app/globals.css`: deep blue-black ink (not flat black) with
  layered radial light and a masked fine grid; one brand accent (signal mint `#5fe8c8`), one
  secondary (amber); per-product accents kept only to tell products apart. All text pairs
  computed for WCAG AA. A light "cloud" section style gives contrast on Home, About,
  Contact and the voice agent page.
- Type: Bricolage Grotesque (display) + Geist (body) + Geist Mono (UI labels), all via
  `next/font` (self-hosted at build).
- ~1200px content width, 8px-based spacing, rounded cards, pill buttons, badges, price chips,
  "Live" badges, native `<details>` FAQ accordion, lucide-react icons.
- Sticky translucent navbar: logo, Products menu (AI Voice Agent first, marked New), Voice
  Agent, Pricing, About, Contact, and one primary "Book a call" button that stays visible on
  mobile next to the menu button.
- Hero: headline, tagline as subhead, Book a call / See the products, and an HTML/CSS
  animated visual (scraper table card, WhatsApp order card, voice waveform card).
- Featured AI Voice Agent banner directly under the hero.
- Existing product demos (scraper, OrderRise chat + kitchen display, 5-step agent flow) kept
  and restyled; new call-transcript + waveform demo for the voice agent.
- Footer: sitemap columns, socials (WhatsApp, LinkedIn, email), legal lines, Blog link.
- Motion: CSS only (reveal-on-scroll, gentle float, waveform). Everything is disabled under
  `prefers-reduced-motion`. Content never hidden without JS (the `html.js` scoping is kept).

## Removed (performance)
- The WebGL "block field" (three.js, @react-three/fiber, drei), Lenis smooth scroll, gsap and
  motion were removed with their components (`block-field`, `scene-backdrop`,
  `smooth-scroll`, `scroll-lock`). They were the heaviest thing on the page and blocked a
  95+ Lighthouse target. Added one dependency: `lucide-react`.
- `public/video/*` and `public/models/*` are no longer referenced. Left in place so nothing is
  lost; delete them when you are happy with the redesign.

## Routes
| Route | Notes |
| --- | --- |
| `/` | Overview: hero, voice banner, problem, 4 product cards, 3 product showcases, "Built from real problems", founder, FAQ, CTA |
| `/voice-agent` | New. AI Voice Agent landing page |
| `/maps-lead-scraper` | Was `/products/lead-extractor` |
| `/orderrise` | Was `/products/orderrise` |
| `/custom-ai-agents` | Was `/products/ai-agents` |
| `/pricing` | New. All four prices side by side + pricing FAQ |
| `/about`, `/contact` | Kept, restyled, same copy |
| `/blog`, `/blog/[slug]` | New. File-based posts in `src/content/blog.ts`, 3 outline stubs |
| `/products/[slug]` | Kept so old links work: noindex, canonical to the new URL, instant meta-refresh |

All product pages share one template (`src/components/product-page.tsx`): breadcrumb, hero,
demo, facts, problem, steps, features, FAQ, links to the other products and pricing, CTA.

## SEO
- Metadata API on every page via `src/lib/meta.ts`: absolute title (all ≤60 chars),
  description (all ≤155), canonical, Open Graph, Twitter `summary_large_image`, robots
  index/follow. Home title is now "Valueble AI | AI Agents, WhatsApp Ordering and Lead Tools";
  the old tagline is the hero subhead.
- One H1 per page (checked on every route), keyword-led eyebrow inside the H1.
- JSON-LD (`src/components/json-ld.tsx`): Organization + Person site-wide;
  SoftwareApplication + Offer for Maps Lead Scraper ($200) and OrderRise ($50/month);
  Service for Voice Agent and Custom AI Agents; FAQPage on home, pricing and every product
  page; BreadcrumbList on inner pages; Article on blog posts. No ratings or reviews.
- Branded 1200×630 `opengraph-image` + `twitter-image` for every page (`src/lib/og.tsx`).
- `sitemap.ts` lists all routes and posts; `robots.ts` allows all and points to the sitemap.
- New favicon (`icon.tsx`) and `apple-icon.tsx`; `theme-color` via `viewport`.
- Clean 404 with links to every product.

## Decisions made without asking
- Product order is Voice Agent, Maps Lead Scraper, OrderRise, Custom AI Agents (voice first, as
  requested). Product index numbers were renumbered accordingly.
- Kept the static export (`output: "export"`, GitHub Pages). That rules out server-side 301s,
  so legacy URLs use canonical + noindex + meta refresh. Add real 301s if you change host.
- Each product H1 combines the keyword line with the existing headline, e.g.
  "WhatsApp ordering bot for restaurants / The number is already on the door. Now it answers."
- The OrderRise CTA on its page is "Book an OrderRise demo" (the existing cal.com link); the
  "Try the WhatsApp demo" wording had no link to the demo restaurant's number.
- Voice agent demo is a clearly labelled *illustrative* call.
- Blog posts are outlines (shown with an "Outline" badge) containing only facts from the site;
  owner notes live in `todo` fields that are never rendered.
- Founder block uses initials until a real portrait is supplied.

## Owner TODOs (search the code for `TODO`)
- Voice agent capability list, FAQ answers and demo transcript are draft. Confirm each
  capability against the real product and trim anything not built (`src/lib/site.ts`,
  `src/components/product/voice-demo.tsx`).
- Attach a real demo call recording to "Hear a demo call".
- Verify OrderRise WhatsApp Business requirements answer and the scraping-legality answer.
- Add real proof only (named testimonials, permissioned client names, Chrome Web Store
  rating) in the "Built from real problems" block.
- Add a portrait of Hamza; confirm "Usually answered same day"; replace `bookingGeneral`
  with a real cal.com discovery call; confirm the domain in `site.url`.
- Finish the three blog articles.

## Verification
- `npm run lint`: clean. `npm run build`: passes, 39 static routes.
- Served `out/` locally and screenshotted every page at 360, 768 and 1280px: no horizontal
  scroll, one H1 per page. Checked the Products dropdown (opens, closes on Escape), mobile
  menu, FAQ accordion, and that all JSON-LD parses.
- Lighthouse (local, simulated mobile, Edge): accessibility 100, SEO 100, best practices 96
  on every page tested. Performance ranged 82–95 between runs on a loaded machine; CLS is 0.
  Re-run against the deployed site. The 96 best-practices score comes from 404s on Next's
  client prefetch `.txt` files under a plain static server; check it on the real host.
- Mobile: below 640px the hero visual is hidden. It sat below the fold, shifted on font load
  and duplicated the voice banner directly underneath.


---

# Fix pass (branch `fix-pass`)

## What was broken and how it was fixed
- **Mobile menu did nothing.** The header's `backdrop-filter` created a containing block, so the fixed mobile sheet was squashed to zero height inside the 64px bar. The blur now lives on its own layer; the sheet is a fixed overlay.
- **Products dropdown** now opens on hover (with a grace delay), click, Enter or Arrow Down; Esc closes and returns focus; it closes on every navigation.
- **Scroll animations never played.** The reveal observer ran once from the root layout (new pages after client navigation were never observed) and a 2.5s watchdog force-showed everything. Replaced with `RevealDriver`, which re-scans on route change and DOM insertion.
- **Fake demo videos and the kitchen display** were removed. Replaced with working in-browser demos (OrderRise chat, scraper with CSV export, voice call player with human handoff, custom agent with approve/reject checkpoint). Each is labelled as a demo with sample data.

## Flair pass (yellow, colour, hero object, scroll motion)
- **Palette:** butter-yellow canvas, white frosted cards, near-black ink. Primary buttons are ink-on-yellow. Product colours (blue voice, teal scraper, orange OrderRise, violet agents) tint each product card and hero.
- **Living background:** a fixed `.aurora` layer of four slow-drifting colour blooms (sun, coral, violet, mint) plus fine grain. Transform-only animation; disabled under reduced motion. Tinted section bands were removed so the background reads as one continuous canvas.
- **Hero object (style reference: QClay "AI Skincare" shot):** a framed glass "window" with a real CC0 photo of a customer on her phone, background removed (`public/images/hero-caller.webp`, credited in `CREDITS.json`). Scan-box annotations ("Customer, 11pm Friday", "New WhatsApp order"), floating product chips, and a right-hand rail of real prices/hours (24/7, $50, $200). Headline is two-tone with one serif italic word.
- **Scroll-driven motion:** `ScrollScene` writes scroll progress to a CSS variable; as the hero leaves, the copy lifts and fades, the photo pushes in, and the chips fan out at different depths. Products are now a stack of sticky cards that slide over each other. Word-by-word headline entrance, gradient scroll-progress bar, capability marquee (words only, no logos).
- **Type:** Instrument Sans (display) + Instrument Serif italic (one flair word) + Geist body, all via next/font.
- **Removed:** `hero-visual.tsx` (replaced by `hero-stage.tsx`).

## Owner TODOs added in this pass
- Replace the hero photo with your own (a real customer or your team) if you have one; the current one is a CC0 stock model.
- The scan-box labels and hero chips are illustrative of the products, not real orders.

## Verified
- `tsc`, `eslint`, `next build` pass. 18/18 click tests pass (nav, dropdown, mobile menu, all four demos, FAQ, keyboard). No horizontal scroll at 390, 768, 1280. No console errors.

## Polish pass (branch `polish-pass`, off `fix-pass`)

Reference: Outcrowd's ChronoTask landing page (Dribbble) for craft, not layout.
The yellow canvas, hero object, fonts and demos from the flair pass are kept.

What was bland, and what replaced it:
- **Sections floating on the background** → framed "canvas" panels (frosted
  white, large radius) with a fine dot-grid texture. Used for the problem,
  demos, founder, about, contact and every product page's demo and problem.
- **Flat icon circles** → glossy 3D app tiles (`.app-tile`) on product
  cards, feature cards, how-it-works steps, about/contact lists.
- **Single-tone headings** → two-tone headings: the second line recedes
  (`SectionHeader muted=`). Same words, same single H2.
- **Empty left column under FAQ headings** → a "Not covered here? Ask Hamza"
  card with WhatsApp and email (home, product pages, pricing).
- **Empty space beside photos / headings** → pinned sticky notes quoting a
  line that already exists in the site copy (no new claims).
- **Founder block** had a lone HK card → plus three working rules restated
  from the founder copy (no account manager, says what not to automate,
  human checkpoint).
- **New "Where the work lands" block** on home: WhatsApp, Google Maps,
  Chrome, Sheets/CSV, email inbox — the tools the products already name.
  Marks from Simple Icons (CC0), credits in `public/logos/CREDITS.txt`.
  These are tools, not clients or partners; no affiliation is implied.
- About and contact lists became hoverable cards with product tiles.
- Section rhythm tightened (5.5rem desktop instead of 7rem); background
  blooms toned down so the yellow reads clean.
- Uneven photo heights in "Built from real problems" are now a consistent 3:2.

Checked: tsc, eslint, `next build` pass; 16 click tests pass (dropdown,
mobile menu, FAQ, demo tabs, every route with one H1); no horizontal
scroll at 390 and 1440; no console errors.

## Dark pass (branch `dark-pass`, off `polish-pass`)

Reference: outcrowd.io (dark agency site). Its *patterns* were reused, not its
code, copy, artwork or brand: our content, prices and demos are unchanged.

- **Dark canvas.** Site-wide tokens flipped to near-black with butter yellow as
  the single accent. Drifting colour embers (violet, sun, coral, sky) and film
  grain replace the yellow aurora. Every existing component reads through the
  same tokens, so all pages switched together. Text contrast on the canvas:
  paper ~17:1, mute ~9:1, faint ~6:1.
- **Floating pill navbar.** Centred, frosted pill that narrows when you scroll.
  Menu logic, keyboard handling and the mobile sheet fix are unchanged.
- **New hero.** Spotlight beam from the top, faint grid, headline lines slide up
  out of a mask, "instantly." in the yellow serif. Below it, a product console
  (sample data, labelled) sits tilted back and straightens as you scroll, with
  floating call, order and $200 widgets drifting apart at different speeds.
- **Scroll-lit statement.** Hamza's own line ("The first thing I do on any
  project is tell you which parts are not worth automating…") lights up word
  by word as you scroll.
- **Tilted stat cards.** The four real-number cards ($200, $50, 24/7, 1) start
  tilted and settle flat on reveal, with a cursor-following glow.
- **Section headers** now reveal with a blur-to-sharp transition.
- **Product stack cards** recoloured to dark gradients per product.
- All motion is transform/opacity only and switches off under
  prefers-reduced-motion.

Checked: tsc, eslint, production build pass; 18/18 click tests pass; no
horizontal scroll at 390 and 1440px; no console errors.

## Hero restore (on dark theme)

- Brought back the QClay-inspired home hero from the polish pass (`src/components/hero-stage.tsx`): framed glass panel, cut-out photo with scan-box labels, floating call / WhatsApp / lead chips, and the real-price rail (24/7, $50, $200).
- Re-skinned for the dark theme: dark glass frame with dot grid, the spotlight beam, a yellow glow behind the photo, faint coral/violet washes, dark pill chips, yellow italic "instantly.", and masked line-by-line headline entrance.
- Scroll motion kept: copy lifts and fades, photo pushes in, chips fan outward. Reduced-motion respected.
- Copy column widened so the headline breaks cleanly at 1280px+. The tilted console hero is removed; everything below the hero is unchanged.
- The photo is a stock model, not a customer; the chip labels are examples.

## Voice demo audio

- The /voice-agent call player now plays real AI-generated speech: 7 clips in `public/audio/voice-demo/` (ElevenLabs TTS, agent voice "Bella", caller voice "Sarah", ~42s total, ~260 KB, loaded only when Play is pressed).
- The transcript and the CRM card stay in sync with the audio clock. There is a mute button, and if the browser blocks sound the demo keeps running silently.
- Labelled "Demo call · AI voices": it is a scripted text-to-speech call, not a recording of a real customer call.
- The API key is not stored anywhere in the repo.
- TODO (owner): rotate the ElevenLabs key that was shared in chat, and swap in a real demo call of the product once one exists.
