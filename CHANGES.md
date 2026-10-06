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
