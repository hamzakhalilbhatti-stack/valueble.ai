import Link from "next/link";
import { ArrowUpRight, Mail, MessageCircle, PhoneCall } from "lucide-react";
import { HeroVisual } from "@/components/hero-visual";
import { Waveform } from "@/components/product/voice-demo";
import { ScraperDemo } from "@/components/product/scraper-demo";
import { OrderRiseDemo } from "@/components/product/orderrise-demo";
import { AgentDemo } from "@/components/product/agent-demo";
import { ACCENT_BG, ACCENT_TEXT, CtaBand, ProductCard } from "@/components/product-blocks";
import { Badge, Button, CheckList, FaqList, SectionHeader } from "@/components/ui";
import { JsonLd, faqLd } from "@/components/json-ld";
import { cn } from "@/lib/cn";
import { pageMeta } from "@/lib/meta";
import { contact, getProduct, homeFaqs, productOrder, site, whatsappUrl } from "@/lib/site";

export const metadata = pageMeta({
  title: "Valueble AI | AI Agents, WhatsApp Ordering and Lead Tools",
  description:
    "AI agents, a WhatsApp ordering bot for restaurants, an AI voice agent and a Google Maps lead scraper, built and supported by one founder.",
  path: "/",
});

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.url,
  publisher: { "@id": `${site.url}/#organization` },
};

export default function HomePage() {
  const voice = getProduct("voice-agent")!;

  return (
    <>
      <JsonLd data={[websiteLd, faqLd(homeFaqs)]} />

      {/* ── Hero ── */}
      <section id="top" className="relative isolate overflow-hidden" data-od-id="home-hero">
        <div className="atmosphere" />
        <div className="container-site grid items-start gap-12 pb-16 pt-12 md:pb-24 md:pt-20 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <h1 className="text-hero">
              <span className="eyebrow mb-6 flex font-sans">
                <span aria-hidden className="pulse-dot size-1.5 rounded-full bg-accent" />
                AI agents and automation for small teams
              </span>
              {site.headline}
            </h1>
            <p className="mt-6 max-w-[34ch] text-sub text-mute md:text-[1.375rem]">
              {site.tagline}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href={contact.bookingGeneral} data-od-id="hero-book-call">
                Book a call
              </Button>
              <Button href="#products" variant="secondary" data-od-id="hero-see-products">
                See the products
              </Button>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-5 gap-y-2 text-sm text-faint" aria-label="Products">
              {productOrder.map((slug) => {
                const p = getProduct(slug)!;
                return (
                  <li key={slug}>
                    <Link href={p.path} className="inline-flex min-h-8 items-center gap-2 transition-colors hover:text-paper">
                      <span aria-hidden className={cn("size-1.5 rounded-full", ACCENT_BG[p.accent])} />
                      {p.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          {/* Hidden below 640px: on phones it sat below the fold, shifted on font
              load, and repeated the voice banner directly underneath. */}
          <div className="hidden sm:block lg:pt-10">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* ── Featured: AI Voice Agent ── */}
      {/* TODO (owner): voice agent capabilities on this site are draft marketing
          copy. Confirm each against the actual product before publishing. */}
      <section id="voice-agent" aria-labelledby="voice-banner-title" className="pb-8" data-od-id="voice-banner">
        <div className="container-site">
          <div className="reveal relative isolate overflow-hidden rounded-[1.75rem] border border-voice/25 bg-[linear-gradient(120deg,rgb(124_200_255/0.12),rgb(124_200_255/0.02)_45%,transparent)] p-6 md:p-10">
            <div aria-hidden className="absolute -right-24 -top-24 -z-10 size-80 rounded-full bg-voice/15 blur-3xl" />
            <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="accent">New</Badge>
                  <span className="ui-label text-voice">AI voice agent for business</span>
                </div>
                <h2 id="voice-banner-title" className="mt-5 text-head">
                  {voice.tagline}
                </h2>
                <p className="mt-4 max-w-[52ch] text-mute">{voice.hero.sub}</p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button href={voice.path} variant="secondary">
                    Explore the AI voice agent
                  </Button>
                  <Link href={voice.cta.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 px-2 text-paper hover:text-voice">
                    Hear a demo call <ArrowUpRight aria-hidden className="size-4" />
                  </Link>
                </div>
              </div>
              <div className="panel p-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-voice/15 text-voice">
                    <PhoneCall aria-hidden className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm text-paper">Inbound call · answered</p>
                    <p className="ui-label mt-1 text-voice">24/7 · no hold music</p>
                  </div>
                </div>
                <Waveform className="mt-5 h-12" />
                <ul className="mt-5 grid grid-cols-2 gap-2 text-xs text-mute">
                  {["Books appointments", "Takes orders", "Qualifies leads", "Hands off to a human"].map((t) => (
                    <li key={t} className="rounded-lg border border-rule bg-ink/60 px-3 py-2">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Problem ── */}
      <section id="problem" className="section" aria-labelledby="problem-title" data-od-id="home-problem">
        <div className="container-site grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <SectionHeader eyebrow="The problem" title={<span id="problem-title">Small teams lose the work before they ever get to do it</span>} />
          <div className="reveal space-y-6 text-[1.0625rem] lg:pt-10">
            <p>
              The businesses that need help most are the ones with the fewest spare hours. To grow, the
              same handful of people are expected to:
            </p>
            <CheckList
              className="rounded-2xl border border-rule bg-ink-2 p-6 text-paper"
              items={[
                "Find and qualify prospects by hand, one browser tab at a time",
                "Answer every enquiry personally — including the ones at 11pm on a Friday",
                "Re-key the same information between tools that were never meant to talk",
                "Repeat all of it tomorrow, at the same volume, without dropping anything",
              ]}
            />
            <p>
              So it gets done badly, or late, or not at all. The lost revenue never shows up on a report,
              because a customer who was never reached and a message that was never answered leave no
              record behind.
            </p>
          </div>
        </div>
      </section>

      {/* ── Products overview ── */}
      <section id="products" className="section border-t border-rule" aria-labelledby="products-title" data-od-id="home-products">
        <div className="container-site">
          <SectionHeader
            eyebrow="Products"
            title={<span id="products-title">Four working systems, each built around one job</span>}
            lede="Who it is for, what it does, what it costs. Every price below is the real price."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {productOrder.map((slug) => (
              <ProductCard key={slug} slug={slug} className="reveal" />
            ))}
          </div>
        </div>
      </section>

      {/* ── Product showcases, each shown working ── */}
      <Showcase slug="lead-extractor" demo={<ScraperDemo />} />
      <Showcase slug="orderrise" demo={<OrderRiseDemo />} />
      <Showcase slug="ai-agents" demo={<AgentDemo className="mx-auto max-w-3xl" />} />

      {/* ── Built from real problems (proof block) ── */}
      {/*
        TODO (owner): this is where social proof normally goes. Add real proof
        only — client names with permission, a real testimonial with a name, a
        measured result, a Chrome Web Store rating. Do not add placeholders that
        look like proof.
      */}
      <section id="built-from-real-problems" className="on-cloud section" aria-labelledby="real-title" data-od-id="home-real-problems">
        <div className="container-site">
          <div className="reveal max-w-3xl">
            <p className="eyebrow mb-4">Built from real problems</p>
            <h2 id="real-title" className="text-head">Nothing here started as a roadmap</h2>
            <p className="mt-5 text-sub">
              Everything here came out of a real business problem rather than a product roadmap. Each one
              was built until it held.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              {
                tag: "Maps Lead Scraper",
                problem: "Prospecting by hand was eating weekends.",
                body: "A list of 400 prospects was becoming a weekend of tabs. So the extension reads the Maps results, visits each website and scores the lead.",
                href: "/maps-lead-scraper",
              },
              {
                tag: "OrderRise",
                problem: "Restaurants were losing paid orders to a phone nobody could reach during the dinner rush.",
                body: "So the WhatsApp number on the door now answers, builds the cart and sends a clean ticket to the kitchen.",
                href: "/orderrise",
              },
              {
                tag: "Custom AI Agents",
                problem: "The gap is never the model. It's everything around it.",
                body: "So every build starts with one process and an honest list of what should stay manual.",
                href: "/custom-ai-agents",
              },
            ].map((c) => (
              <article key={c.tag} className="reveal flex flex-col rounded-[1.25rem] border border-cloud-2 bg-white p-6 shadow-[0_1px_0_rgb(0_0_0/0.04)]">
                <p className="ui-label text-slate">{c.tag}</p>
                <h3 className="mt-4 text-title">{c.problem}</h3>
                <p className="mt-3 flex-1 text-[0.9375rem]">{c.body}</p>
                <Link href={c.href} className="mt-6 inline-flex min-h-11 items-center gap-1 font-medium text-ink underline-offset-4 hover:underline">
                  How {c.tag} works <ArrowUpRight aria-hidden className="size-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Founder ── */}
      <section id="approach" className="section defer-render" aria-labelledby="founder-title" data-od-id="home-founder">
        <div className="container-site grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="reveal">
            <p className="eyebrow mb-4">Who builds it</p>
            <h2 id="founder-title" className="text-head">One person, and you talk to him</h2>
            {/* TODO (owner): add a real portrait of Hamza here (next/image, with alt text). */}
            <div className="mt-8 flex items-center gap-4 rounded-2xl border border-rule bg-ink-2 p-5">
              <span aria-hidden className="grid size-14 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#5fe8c8,#7cc8ff)] font-display text-lg font-semibold text-ink">
                HK
              </span>
              <div>
                <p className="font-medium text-paper">{site.founder}</p>
                <p className="text-sm text-faint">{site.founderRole}</p>
              </div>
            </div>
          </div>
          <div className="reveal space-y-5 text-[1.0625rem]">
            <p>
              I am Hamza Khalil Bhatti. I scope the work, build it, and support it after it ships — there is
              no account manager between you and the person writing the code. That is a hard limit on how
              much I take on, and it is the reason the work holds.
            </p>
            <p>
              Everything here came out of a real business problem rather than a product roadmap. The
              scraper exists because prospecting by hand was eating weekends. OrderRise exists because
              restaurants were losing paid orders to a phone nobody could reach during the dinner rush.
            </p>
            <p>
              The first thing I do on any project is tell you which parts are not worth automating. A system
              that handles eighty percent of a process reliably is worth more than one that claims all of it
              and quietly fails on the cases that matter.
            </p>
            <Link href="/about" className="inline-flex min-h-11 items-center gap-1.5 font-medium text-paper hover:text-accent-strong">
              More about how I work <ArrowUpRight aria-hidden className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="section defer-render border-t border-rule" aria-labelledby="faq-title" data-od-id="home-faq">
        <div className="container-site grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeader eyebrow="FAQ" title={<span id="faq-title">Questions people ask first</span>} />
          <FaqList faqs={homeFaqs} className="reveal" />
        </div>
      </section>

      {/* ── CTA ── */}
      <CtaBand
        id="get-started"
        heading="Bring the process, not the spec"
        body="You do not need to know how it should be built. You need to know which twenty hours a month you want back. Tell me what those hours go on and I will tell you honestly whether I can take them — including when the answer is no."
        primary={{ href: whatsappUrl, label: "Message me on WhatsApp" }}
        secondary={{ href: contact.bookingGeneral, label: "Or see every way to reach me" }}
      />
      <div className="container-site -mt-12 pb-20 md:-mt-20">
        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm" aria-label="Contact links">
          <li>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-mute hover:text-paper">
              <MessageCircle aria-hidden className="size-4" /> WhatsApp
            </a>
          </li>
          <li>
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-mute hover:text-paper">
              <ArrowUpRight aria-hidden className="size-4" /> LinkedIn
            </a>
          </li>
          <li>
            <a href={`mailto:${contact.email}`} className="inline-flex min-h-11 items-center gap-2 break-all text-mute hover:text-paper">
              <Mail aria-hidden className="size-4 shrink-0" /> {contact.email}
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}

/** Alternating split: copy + price + CTA, then the product running full width. */
function Showcase({ slug, demo }: { slug: "lead-extractor" | "orderrise" | "ai-agents"; demo: React.ReactNode }) {
  const p = getProduct(slug)!;
  return (
    <section id={`showcase-${p.path.slice(1)}`} className="section defer-render border-t border-rule" aria-labelledby={`${slug}-title`} data-od-id={`showcase-${slug}`}>
      <div className="container-site">
        <div className="grid items-end gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div className="reveal">
            <p className={cn("ui-label", ACCENT_TEXT[p.accent])}>
              {p.kind} · {p.audience}
            </p>
            <h2 id={`${slug}-title`} className="mt-4 text-head">
              {p.name}
            </h2>
            <p className="mt-4 max-w-[46ch] text-sub text-mute">{p.tagline}</p>
          </div>
          <div className="reveal flex flex-wrap items-center gap-3 lg:justify-end">
            {p.status === "Live" ? <Badge tone="live">Live</Badge> : <Badge>{p.status}</Badge>}
            <Badge tone="price">{p.price}</Badge>
          </div>
        </div>
        <div className="reveal mt-10">{demo}</div>
        <div className="reveal mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button href={p.path} variant="secondary">
            How {p.name} works
          </Button>
          <Link href={p.cta.href} {...(/^https?:/.test(p.cta.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="inline-flex min-h-11 items-center gap-1.5 px-2 text-paper hover:text-accent-strong">
            {p.cta.label} <ArrowUpRight aria-hidden className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
