import Link from "next/link";
import { Hero } from "@/components/hero";
import { SceneBreak } from "@/components/scene-backdrop";
import { ScraperDemo } from "@/components/product/scraper-demo";
import { OrderRiseDemo } from "@/components/product/orderrise-demo";
import { AgentDemo } from "@/components/product/agent-demo";
import { ArrowUpRight, Body, BoxButton, Head, List, Section } from "@/components/ui";
import { contact, getProduct, productCta, whatsappUrl } from "@/lib/site";

/**
 * Home.
 *
 * Problem, then each product shown *working*, then who builds it, then contact.
 *
 * The demonstrations are the argument. An earlier version of this page
 * described three products in prose and showed nothing, which asked a visitor
 * to take on trust the one thing that is trivial to simply prove. Every panel
 * below is built from the real product: the scraper fields and score weights
 * come from the v5.2 source, and the OrderRise thread and ticket are the same
 * order seen from both ends.
 */
export default function HomePage() {
  return (
    <>
      <Hero />

      <Section label="The problem" id="problem">
        <Head>Small teams lose the work before they ever get to do it</Head>

        <div className="mt-8 space-y-6">
          <Body>
            The businesses that need help most are the ones with the fewest spare hours. To
            grow, the same handful of people are expected to:
          </Body>

          <List
            items={[
              "Find and qualify prospects by hand, one browser tab at a time",
              "Answer every enquiry personally — including the ones at 11pm on a Friday",
              "Re-key the same information between tools that were never meant to talk",
              "Repeat all of it tomorrow, at the same volume, without dropping anything",
            ]}
          />

          <Body>
            So it gets done badly, or late, or not at all. The lost revenue never shows up on
            a report, because a customer who was never reached and a message that was never
            answered leave no record behind.
          </Body>
        </div>
      </Section>

      <SceneBreak />

      <ProductShowcase slug="lead-extractor">
        <ScraperDemo />
      </ProductShowcase>

      <ProductShowcase slug="orderrise">
        <OrderRiseDemo />
      </ProductShowcase>

      <ProductShowcase slug="ai-agents">
        <AgentDemo className="max-w-3xl" />
      </ProductShowcase>

      <Section label="Who builds it" id="approach">
        <Head>One person, and you talk to him</Head>

        <div className="mt-8 space-y-6">
          <Body>
            I am Hamza Khalil Bhatti. I scope the work, build it, and support it after it
            ships — there is no account manager between you and the person writing the code.
            That is a hard limit on how much I take on, and it is the reason the work holds.
          </Body>
          <Body>
            Everything here came out of a real business problem rather than a product
            roadmap. The scraper exists because prospecting by hand was eating weekends.
            OrderRise exists because restaurants were losing paid orders to a phone nobody
            could reach during the dinner rush.
          </Body>
          <Body>
            The first thing I do on any project is tell you which parts are not worth
            automating. A system that handles eighty percent of a process reliably is worth
            more than one that claims all of it and quietly fails on the cases that matter.
          </Body>
        </div>

        <div className="mt-10">
          <Link
            href="/about"
            className="reveal inline-flex items-center gap-2 text-mute transition-colors duration-200 hover:text-paper"
          >
            More about how I work
            <ArrowUpRight className="size-3" />
          </Link>
        </div>
      </Section>

      <Section label="Get started">
        <Head>Bring the process, not the spec</Head>
        <Body className="mt-8">
          You do not need to know how it should be built. You need to know which twenty hours
          a month you want back. Tell me what those hours go on and I will tell you honestly
          whether I can take them — including when the answer is no.
        </Body>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <BoxButton href={whatsappUrl}>Message me on WhatsApp</BoxButton>
          <Link
            href={contact.bookingGeneral}
            className="reveal inline-flex items-center gap-2 py-3.5 text-mute transition-colors duration-200 hover:text-paper"
          >
            Or see every way to reach me
            <ArrowUpRight className="size-3" />
          </Link>
        </div>
      </Section>
    </>
  );
}

/** Accent per product. Used only here and on the hero index — never mixed. */
const ACCENT: Record<string, { text: string; border: string }> = {
  "lead-extractor": { text: "text-scan", border: "border-scan/40" },
  orderrise: { text: "text-warm", border: "border-warm/40" },
  "ai-agents": { text: "text-mind", border: "border-mind/40" },
};

/**
 * One product: who it is for, what it costs, then the thing itself running.
 *
 * The demonstration is full-bleed rather than confined to the rail's content
 * column — these panels carry the persuasion and the reading measure would
 * squeeze them into illegibility.
 */
function ProductShowcase({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const product = getProduct(slug);
  if (!product) return null;

  const accent = ACCENT[slug];
  const cta = productCta[product.slug];

  return (
    <section id={slug} className="py-24 md:py-32">
      <div className="rail">
        <div className="reveal">
          <p className={`ui-label ${accent.text}`}>{product.index}</p>
          <p className="mt-3 text-fine text-faint">{product.audience}</p>
        </div>

        <div className="measure">
          <h2 className="reveal text-head max-w-[20ch] text-balance">{product.name}</h2>
          <p className="reveal mt-5 max-w-[54ch] text-sub text-mute">{product.tagline}</p>

          <div className="reveal mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-fine">
            <span className={`border px-3 py-1.5 ${accent.border} ${accent.text}`}>
              {product.price}
            </span>
            <span className="text-faint">
              {product.kind} · {product.status}
            </span>
          </div>
        </div>
      </div>

      {/* Full width — the demo is the argument, not an illustration beside it. */}
      <div className="mx-auto mt-12 max-w-[96rem] px-6 md:mt-16 md:px-[3.25rem]">
        <div className="reveal">{children}</div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <BoxButton href={cta.href}>{cta.label}</BoxButton>
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center gap-2 py-3.5 text-mute transition-colors duration-200 hover:text-paper"
          >
            How {product.name} works
            <ArrowUpRight className="size-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
