import Link from "next/link";
import { MorphTitle, PageTransition } from "@/components/page-transition";
import { AnimatedScraperDemo } from "@/components/product/animated-demo";
import { FounderVideo } from "@/components/product/founder-video";
import { ScoreBreakdown } from "@/components/product/maps-scraper-demo";
import { KitchenTicket, WhatsAppThread } from "@/components/product/orderrise-demo";
import { Reveal, RevealLines } from "@/components/reveal";
import { Action, Container, Eyebrow, Section } from "@/components/ui";
import {
  contact,
  productCta,
  products,
  proofPoints,
  proofPointsArePlaceholder,
  site,
  whatsappUrl,
} from "@/lib/site";

/**
 * Product-demo led home page.
 *
 * Every section shows the product doing its job before it explains anything.
 * The previous version led with an abstract 3D object, which meant a visitor
 * could scroll a full screen without learning what is sold here.
 */

const principles = [
  {
    index: "01",
    title: "One process at a time",
    body: "Ambitious roadmaps stall in month two. A single workflow that runs by itself every Monday morning does not.",
  },
  {
    index: "02",
    title: "Built against your mess",
    body: "Your real inbox, your real customers typing in three languages, your CRM with the fields nobody filled in. That is where automation breaks, so that is where it gets tested.",
  },
  {
    index: "03",
    title: "Told what not to automate",
    body: "Some work should stay human, and some is not worth the build cost. You hear which parts before you spend anything.",
  },
  {
    index: "04",
    title: "Yours at the end",
    body: "The system, the data, and the documentation of how it fails. No black box you keep renting access to.",
  },
];

export default function HomePage() {
  const maps = products[0];
  const orderrise = products[1];
  const agents = products[2];

  return (
    <PageTransition>
      {/* ── Hero — the product, working ─────────────────────────── */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28">
        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Reveal>
                <Eyebrow>AI agents &amp; growth tools</Eyebrow>
              </Reveal>

              <RevealLines
                as="h1"
                delay={100}
                lines={["The repetitive half", "of your business,", "run by software."]}
                className="font-display text-headline mt-8 text-balance"
              />

              <Reveal delay={220}>
                <p className="text-lead mt-8 max-w-lg text-bone-soft">
                  I&rsquo;m {site.founder.split(" ")[0]}. I build the tools that do the repetitive
                  half of your business — finding leads, answering customers, running the process
                  nobody has time for.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Action href={contact.bookingGeneral}>Book a discovery call</Action>
                  <Action href={whatsappUrl} variant="outline">
                    Message on WhatsApp
                  </Action>
                </div>
              </Reveal>
            </div>

            {/* The founder pitch carries the hero. A person making the argument
                converts better than a product shot for a service business. */}
            <Reveal delay={320} className="lg:col-span-7">
              <FounderVideo />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ── The premise ─────────────────────────────────────────── */}
      <Section tone="surface">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-3">
              <Eyebrow index="01">The premise</Eyebrow>
            </Reveal>
            <div className="lg:col-span-8 lg:col-start-5">
              <RevealLines
                as="p"
                lines={["Most businesses do not", "have an AI problem."]}
                className="font-display text-title text-balance"
              />
              <Reveal delay={180} className="text-lead mt-8 max-w-2xl space-y-6 text-bone-soft">
                <p>
                  They have a volume problem. The same forty questions answered by hand every day.
                  The lead list nobody has time to build. The order that came in at 11pm and sat
                  unread until morning.
                </p>
                <p>
                  Those need one specific piece of software that does one specific job, reliably,
                  without anyone watching it. That is what I build.
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 01 · Maps Lead Scraper ──────────────────────────────── */}
      <Section id="work">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Reveal>
                <Eyebrow index="01">{maps.kind}</Eyebrow>
              </Reveal>
              <MorphTitle name={`product-${maps.slug}`}>
                <h2 className="font-display text-headline mt-6 text-balance">{maps.name}</h2>
              </MorphTitle>
              <Reveal delay={160}>
                <p className="text-lead mt-6 max-w-lg text-bone-soft">{maps.hero.sub}</p>
                <ul className="mt-8 space-y-3">
                  {[
                    "Follows each business to its own website for the email Maps never shows",
                    "Scores every lead 0–100 on how reachable it actually is",
                    "Keeps working until it hits your target, not until the page stops scrolling",
                    "No Places API bill, no CAPTCHA solving, no login walls",
                  ].map((point) => (
                    <li key={point} className="flex gap-3 text-sm text-bone-soft">
                      <span aria-hidden className="text-signal">
                        &rarr;
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Action href={productCta[maps.slug].href}>{productCta[maps.slug].label}</Action>
                  <Action href={`/products/${maps.slug}`} variant="outline">
                    Full details
                  </Action>
                </div>
              </Reveal>
            </div>

            <Reveal delay={120} className="lg:col-span-6 lg:col-start-7">
              <ScoreBreakdown />
              <p className="label mt-4 text-bone-faint">
                Actual weighting from the extension&rsquo;s scoring function
              </p>
            </Reveal>
          </div>

          {/* Scripted run: cursor, typing, live counters, rows arriving scored. */}
          <Reveal delay={200} className="mt-16">
            <AnimatedScraperDemo />
          </Reveal>
        </Container>
      </Section>

      {/* ── 02 · OrderRise ──────────────────────────────────────── */}
      <Section tone="surface">
        <Container>
          <Reveal>
            <Eyebrow index="02">{orderrise.kind}</Eyebrow>
          </Reveal>
          <div className="mt-6 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <MorphTitle name={`product-${orderrise.slug}`}>
                <h2 className="font-display text-headline text-balance">{orderrise.name}</h2>
              </MorphTitle>
              <Reveal delay={160}>
                <p className="text-lead mt-6 max-w-lg text-bone-soft">{orderrise.hero.sub}</p>
                <p className="mt-6 text-sm text-bone-soft">
                  A customer types the way they always do. The kitchen receives a structured ticket.
                  Nothing in between is manual.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Action href={productCta[orderrise.slug].href}>
                    {productCta[orderrise.slug].label}
                  </Action>
                  <Action href={`/products/${orderrise.slug}`} variant="outline">
                    Full details
                  </Action>
                </div>
              </Reveal>
            </div>

            <Reveal delay={120} className="lg:col-span-6 lg:col-start-7">
              <div className="grid gap-4 sm:grid-cols-2">
                <WhatsAppThread />
                <KitchenTicket className="self-start" />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ── 03 · Custom AI Agents ───────────────────────────────── */}
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Reveal>
                <Eyebrow index="03">{agents.kind}</Eyebrow>
              </Reveal>
              <MorphTitle name={`product-${agents.slug}`}>
                <h2 className="font-display text-headline mt-6 text-balance">{agents.name}</h2>
              </MorphTitle>
              <Reveal delay={160}>
                <p className="text-lead mt-6 max-w-lg text-bone-soft">{agents.hero.sub}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Action href={productCta[agents.slug].href}>
                    {productCta[agents.slug].label}
                  </Action>
                  <Action href={`/products/${agents.slug}`} variant="outline">
                    Full details
                  </Action>
                </div>
              </Reveal>
            </div>

            <Reveal delay={120} className="lg:col-span-6 lg:col-start-7">
              <div className="border border-rule">
                {agents.steps.map((step, i) => (
                  <div
                    key={step.title}
                    className="grid gap-2 border-b border-rule p-5 last:border-0 sm:grid-cols-[auto_1fr] sm:gap-5"
                  >
                    <span className="label text-violet">0{i + 1}</span>
                    <div>
                      <p className="text-sm text-bone">{step.title}</p>
                      <p className="mt-1.5 text-sm text-bone-soft">{step.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ── Approach ────────────────────────────────────────────── */}
      <Section id="approach" tone="surface">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Reveal>
                <Eyebrow index="04">Approach</Eyebrow>
              </Reveal>
              <RevealLines
                as="h2"
                delay={100}
                lines={["How the work", "actually goes."]}
                className="font-display text-headline mt-8 text-balance"
              />
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <dl className="border-t border-rule-strong">
                {principles.map((p, i) => (
                  <Reveal key={p.index} delay={i * 80}>
                    <div className="grid gap-3 border-b border-rule-strong py-8 md:grid-cols-12 md:gap-6">
                      <dt className="md:col-span-4">
                        <span className="label text-amber">{p.index}</span>
                        <p className="mt-2 text-lg tracking-tight">{p.title}</p>
                      </dt>
                      <dd className="text-bone-soft md:col-span-8">{p.body}</dd>
                    </div>
                  </Reveal>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Proof ───────────────────────────────────────────────── */}
      <Section>
        <Container>
          <Reveal>
            <Eyebrow index="05">Where it stands</Eyebrow>
          </Reveal>

          {proofPointsArePlaceholder && (
            <Reveal delay={60}>
              <p className="label mt-6 inline-flex items-center gap-2 border border-amber/40 px-3 py-2 text-amber">
                <span aria-hidden>&#9888;</span>
                Placeholder figures &mdash; awaiting verified numbers
              </p>
            </Reveal>
          )}

          <div className="mt-12 grid gap-12 border-t border-rule pt-12 md:grid-cols-3">
            {proofPoints.map((point, i) => (
              <Reveal key={point.label} delay={i * 110}>
                <p className="font-display text-headline leading-none text-amber">{point.value}</p>
                <p className="mt-4 max-w-xs text-bone-soft">{point.label}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={340} className="mt-16">
            <p className="text-lead max-w-2xl text-bone-soft">
              The fastest way to judge any of this is to use it. The WhatsApp agent has a live demo
              you can order from right now — no call, no form, no signup.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Action href={whatsappUrl}>Try the WhatsApp demo</Action>
              <Action href="/contact" variant="outline">
                Other ways to reach me
              </Action>
            </div>
          </Reveal>
        </Container>
      </Section>
    </PageTransition>
  );
}
