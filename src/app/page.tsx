import Link from "next/link";
import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import { HeroStage } from "@/components/hero-stage";
import { Marquee } from "@/components/marquee";
import { ProductStack } from "@/components/product-stack";
import { VoiceDemo } from "@/components/product/voice-demo";
import { DemoTabs } from "@/components/product/demo-tabs";
import { CountUp } from "@/components/motion";
import { ACCENT_TEXT, ACCENT_TINT, CtaBand, PRODUCT_ICON, Photo } from "@/components/product-blocks";
import { ArrowLink, Badge, Button, CheckList, FaqList, SectionHeader } from "@/components/ui";
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

      <HeroStage />

      {/* ── What I build, in one glance ── */}
      <section aria-label="What valueble.ai builds" className="relative pt-10 md:pt-14" data-od-id="home-glance">
        <div className="container-site pb-14 md:pb-20">
          <Marquee />
          <p className="eyebrow mb-4 mt-10">What I build</p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Products at a glance">
            {productOrder.map((slug) => {
              const p = getProduct(slug)!;
              const Icon = PRODUCT_ICON[slug];
              return (
                <li key={slug} className="reveal">
                  <Link
                    href={p.path}
                    className="group flex h-full items-start gap-3 rounded-3xl border border-ink-2/80 bg-ink-2/75 p-5 shadow-[var(--shadow-card)] backdrop-blur-xl transition-[transform,box-shadow,background-color] duration-300 ease-[var(--ease-spring)] hover:-translate-y-1.5 hover:bg-ink-2 hover:shadow-[var(--shadow-lift)]"
                  >
                    <span aria-hidden className={cn("grid size-10 shrink-0 place-items-center rounded-xl", ACCENT_TINT[p.accent])}>
                      <Icon className="size-[1.125rem]" />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5 font-medium text-paper">
                        {p.name}
                        <ArrowUpRight aria-hidden className="size-3.5 opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </span>
                      <span className="mt-0.5 block text-sm leading-snug text-mute">{HERO_LINES[slug]}</span>
                      <span className="mt-1.5 block text-xs font-semibold text-paper">{p.price}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── Featured: AI Voice Agent (dark band, interactive) ── */}
      {/* TODO (owner): voice agent capabilities on this site are draft marketing
          copy. Confirm each against the actual product before publishing. */}
      <section id="voice-agent" aria-labelledby="voice-banner-title" className="theme-dark section relative isolate mx-2 overflow-hidden rounded-[2rem] sm:mx-4 md:rounded-[2.5rem] lg:mx-6" data-od-id="voice-banner">
        <div aria-hidden className="absolute -right-40 -top-40 -z-10 size-[36rem] rounded-full bg-voice/20 blur-3xl" />
        <div aria-hidden className="absolute -bottom-48 -left-32 -z-10 size-[30rem] rounded-full bg-sun/15 blur-3xl" />
        <div className="container-site grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="reveal">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="accent">New</Badge>
              <span className="ui-label text-voice">AI voice agent for business</span>
            </div>
            <h2 id="voice-banner-title" className="mt-5 text-display">
              {voice.tagline}
            </h2>
            <p className="mt-5 max-w-[48ch] text-sub text-mute">{voice.hero.sub}</p>
            <ul className="mt-7 grid grid-cols-2 gap-2 text-sm text-paper">
              {["Answers 24/7", "Books and takes orders", "Qualifies leads", "Hands off to a human"].map((t) => (
                <li key={t} className="rounded-xl border border-rule bg-ink-2 px-3.5 py-2.5">
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-mute">
              <span className="font-medium text-paper">Price:</span> {voice.plain.cost}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href={voice.path} variant="secondary">
                Explore the AI voice agent
              </Button>
              <ArrowLink href={voice.cta.href}>Hear a demo call</ArrowLink>
            </div>
          </div>
          <div className="reveal reveal-right">
            <VoiceDemo compact className="shadow-none" />
          </div>
        </div>
      </section>

      {/* ── Problem ── */}
      <section id="problem" className="section" aria-labelledby="problem-title" data-od-id="home-problem">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <Photo
            src="/images/restaurant-kitchen.webp"
            width={960}
            height={640}
            alt="A chef working the pass in a busy restaurant kitchen during service"
            caption="The phone rings during the rush. Nobody can reach it."
            className="reveal reveal-left order-last lg:order-first"
          />
          <div>
            <SectionHeader eyebrow="The problem" title={<span id="problem-title">Small teams lose the work before they ever get to do it</span>} />
            <div className="reveal mt-6 space-y-6 text-[1.0625rem]">
              <p>The businesses that need help most are the ones with the fewest spare hours. To grow, the same handful of people are expected to:</p>
              <CheckList
                className="card p-6 text-paper"
                items={[
                  "Find and qualify prospects by hand, one browser tab at a time",
                  "Answer every enquiry personally — including the ones at 11pm on a Friday",
                  "Re-key the same information between tools that were never meant to talk",
                  "Repeat all of it tomorrow, at the same volume, without dropping anything",
                ]}
              />
              <p>
                So it gets done badly, or late, or not at all. The lost revenue never shows up on a report, because a customer who
                was never reached and a message that was never answered leave no record behind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Products overview ── */}
      <section id="products" className="section" aria-labelledby="products-title" data-od-id="home-products">
        <div className="container-site">
          <SectionHeader
            eyebrow="Products"
            title={<span id="products-title">Four working systems, each built around one job</span>}
            lede="Who it is for, what it does, what it costs. Every price below is the real price."
          />
          <ProductStack />
          {/* Real numbers from the offers above, not invented metrics. */}
          <dl className="reveal mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-rule bg-rule md:grid-cols-4">
            {[
              { v: <CountUp to={200} prefix="$" />, k: "one-time for the Maps Lead Scraper" },
              { v: <CountUp to={50} prefix="$" />, k: "a month per restaurant for OrderRise" },
              { v: <CountUp to={24} suffix="/7" />, k: "call answering with the voice agent" },
              { v: <CountUp to={1} />, k: "person, from scoping to support" },
            ].map((s, i) => (
              <div key={i} className="bg-ink-2 p-5 md:p-6">
                <dt className="sr-only">{s.k}</dt>
                <dd>
                  <span className="block font-display text-[2.25rem] font-semibold leading-none text-paper md:text-[2.75rem]">{s.v}</span>
                  <span className="mt-2 block text-sm text-mute">{s.k}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Try the products ── */}
      <section id="demos" className="section" aria-labelledby="demos-title" data-od-id="home-demos">
        <div className="container-site">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionHeader eyebrow="Try them" title={<span id="demos-title">Don&apos;t read about it. Click it.</span>} lede="Working demos in your browser with sample data. Run a search, place an order, approve an agent's action." />
          </div>
          <div className="reveal mt-10">
            <DemoTabs />
          </div>
        </div>
      </section>

      {/* ── Built from real problems (proof block) ── */}
      {/*
        TODO (owner): this is where social proof normally goes. Add real proof
        only — client names with permission, a real testimonial with a name, a
        measured result, a Chrome Web Store rating. Do not add placeholders that
        look like proof.
      */}
      <section id="built-from-real-problems" className="on-cloud section" aria-labelledby="real-title" data-od-id="home-real-problems">
        <div className="container-site">
          <SectionHeader eyebrow="Built from real problems" title={<span id="real-title">Nothing here started as a roadmap</span>} lede="Everything here came out of a real business problem rather than a product roadmap. Each one was built until it held." />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              { slug: "lead-extractor" as const, problem: "Prospecting by hand was eating weekends.", body: "A list of 400 prospects was becoming a weekend of tabs. So the extension reads the Maps results, visits each website and scores the lead." },
              { slug: "orderrise" as const, problem: "Restaurants were losing paid orders to a phone nobody could reach during the dinner rush.", body: "So the WhatsApp number on the door now answers, builds the cart and sends a clean ticket to the restaurant." },
              { slug: "ai-agents" as const, problem: "The gap is never the model. It's everything around it.", body: "So every build starts with one process and an honest list of what should stay manual." },
            ].map((c) => {
              const p = getProduct(c.slug)!;
              return (
                <article key={c.slug} className="card card-hover reveal flex flex-col overflow-hidden">
                  <Photo src={p.photo.src} width={p.photo.width} height={p.photo.height} alt={p.photo.alt} className="rounded-none border-0 shadow-none" />
                  <div className="flex flex-1 flex-col p-6">
                    <p className={cn("ui-label", ACCENT_TEXT[p.accent])}>{p.name}</p>
                    <h3 className="mt-3 text-title">{c.problem}</h3>
                    <p className="mt-3 flex-1 text-[0.9375rem] text-mute">{c.body}</p>
                    <ArrowLink href={p.path} className="mt-5">
                      How {p.name} works
                    </ArrowLink>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Founder ── */}
      <section id="approach" className="section" aria-labelledby="founder-title" data-od-id="home-founder">
        <div className="container-site grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="reveal">
            <p className="eyebrow mb-4">
              <span aria-hidden className="h-px w-6 bg-accent" />
              Who builds it
            </p>
            <h2 id="founder-title" className="text-head">
              One person, and you talk to him
            </h2>
            {/* TODO (owner): add a real portrait of Hamza here (next/image, with alt text). */}
            <div className="card mt-8 flex items-center gap-4 p-5">
              <span aria-hidden className="grid size-14 shrink-0 place-items-center rounded-full bg-paper font-display text-lg font-semibold text-ink">
                HK
              </span>
              <div>
                <p className="font-medium text-paper">{site.founder}</p>
                <p className="text-sm text-mute">{site.founderRole}</p>
              </div>
            </div>
          </div>
          <div className="reveal space-y-5 text-[1.0625rem]">
            <p>
              I am Hamza Khalil Bhatti. I scope the work, build it, and support it after it ships — there is no account manager
              between you and the person writing the code. That is a hard limit on how much I take on, and it is the reason the work
              holds.
            </p>
            <p>
              Everything here came out of a real business problem rather than a product roadmap. The scraper exists because
              prospecting by hand was eating weekends. OrderRise exists because restaurants were losing paid orders to a phone nobody
              could reach during the dinner rush.
            </p>
            <p>
              The first thing I do on any project is tell you which parts are not worth automating. A system that handles eighty
              percent of a process reliably is worth more than one that claims all of it and quietly fails on the cases that matter.
            </p>
            <ArrowLink href="/about">More about how I work</ArrowLink>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="on-cloud section" aria-labelledby="faq-title" data-od-id="home-faq">
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
      <div className="container-site -mt-10 pb-20 md:-mt-16">
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

/** One plain line per product for the above-the-fold strip. */
const HERO_LINES: Record<string, string> = {
  "voice-agent": "Answers your business phone 24/7 and books, orders or hands off.",
  "lead-extractor": "Turns a Google Maps search into a scored lead list with emails.",
  orderrise: "Takes restaurant orders on WhatsApp, day and night.",
  "ai-agents": "One repetitive process you run, handled by an agent.",
};
