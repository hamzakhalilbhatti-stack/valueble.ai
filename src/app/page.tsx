import Link from "next/link";
import { MorphTitle, PageTransition } from "@/components/page-transition";
import { Reveal, RevealLines } from "@/components/reveal";
import { Action, Container, Eyebrow, Section } from "@/components/ui";
import {
  contact,
  products,
  proofPoints,
  proofPointsArePlaceholder,
  site,
  whatsappUrl,
} from "@/lib/site";

const principles = [
  {
    index: "01",
    title: "One process at a time",
    body: "Ambitious roadmaps stall in month two. A single workflow that runs by itself every Monday morning does not. We start with the one task that is high-volume, rules-shaped, and quietly expensive.",
  },
  {
    index: "02",
    title: "Built against your mess",
    body: "Not a clean demo dataset. Your real inbox, your real customers typing in three languages, your CRM with the fields nobody filled in. That is where automation actually breaks, so that is where it gets tested.",
  },
  {
    index: "03",
    title: "Told what not to automate",
    body: "Some of the work should stay human, and some of it is not worth the build cost. You will hear which parts those are before you spend anything on them.",
  },
  {
    index: "04",
    title: "Yours at the end",
    body: "The system, the data, and the documentation of how it fails. No black box you have to keep renting access to.",
  },
];

export default function HomePage() {
  return (
    <PageTransition>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="flex min-h-[100svh] flex-col justify-between pt-32 pb-12 md:pt-40">
        <Container>
          <Reveal>
            <Eyebrow>AI agents &amp; growth tools</Eyebrow>
          </Reveal>

          <RevealLines
            as="h1"
            delay={120}
            stagger={110}
            lines={["Software that", "does the work", "nobody has time for."]}
            className="font-display text-display mt-10 max-w-[18ch] text-balance"
          />

          <div className="mt-14 grid gap-10 lg:grid-cols-12">
            <Reveal delay={360} className="lg:col-span-5 lg:col-start-7">
              <p className="text-lead max-w-xl text-bone-soft">
                I&rsquo;m {site.founder.split(" ")[0]}. I build AI agents and internal tools for
                businesses and agencies — lead engines, WhatsApp ordering assistants, and
                custom automation shaped around how you already operate.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Action href={contact.bookingGeneral}>Book a 20-minute call</Action>
                <Action href="/#work" variant="outline">
                  See the work
                </Action>
              </div>
            </Reveal>
          </div>
        </Container>

        <Container className="mt-16">
          <Reveal delay={480}>
            <div className="label flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-rule pt-6 text-bone-faint">
              {/* TODO: confirm base location line */}
              <span>Based in Pakistan</span>
              <span>Working worldwide</span>
              <span className="flex items-center gap-2 text-amber">
                <span aria-hidden className="size-1.5 rounded-full bg-amber" />
                Taking projects
              </span>
              <span className="ml-auto hidden md:inline">Scroll</span>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── Positioning statement ────────────────────────────── */}
      <Section tone="surface">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-3">
              <Eyebrow index="01">The premise</Eyebrow>
            </Reveal>

            <div className="lg:col-span-8 lg:col-start-5">
              <RevealLines
                as="p"
                lines={[
                  "Most businesses do not",
                  "have an AI problem.",
                ]}
                className="font-display text-title text-balance"
              />
              <Reveal delay={200} className="mt-8 space-y-6 text-lead max-w-2xl text-bone-soft">
                <p>
                  They have a volume problem. The same forty questions answered by hand every
                  day. The lead list nobody has time to build. The order that came in at 11pm
                  and sat unread until morning.
                </p>
                <p>
                  Those are not strategy problems and they do not need a transformation
                  programme. They need one specific piece of software that does one specific
                  job, reliably, without anyone watching it. That is what I build.
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Work index ───────────────────────────────────────── */}
      <Section id="work">
        <Container>
          <Reveal>
            <Eyebrow index="02">Work</Eyebrow>
          </Reveal>

          <RevealLines
            as="h2"
            delay={100}
            lines={["Three things, built", "and in use."]}
            className="font-display text-headline mt-8 max-w-[16ch] text-balance"
          />

          <div className="mt-20 border-t border-rule">
            {products.map((product, index) => (
              <Reveal key={product.slug} delay={index * 90}>
                <Link
                  href={`/products/${product.slug}`}
                  transitionTypes={["nav-forward"]}
                  className="group block border-b border-rule py-10 transition-colors duration-500 md:py-14"
                >
                  <div className="grid items-baseline gap-4 md:grid-cols-12 md:gap-8">
                    <span className="label text-amber md:col-span-1">{product.index}</span>

                    <div className="md:col-span-5">
                      {/* Morph pair: this title becomes the product page headline. */}
                      <MorphTitle name={`product-${product.slug}`}>
                        <h3 className="font-display text-title leading-none transition-colors duration-500 group-hover:text-amber">
                          {product.name}
                        </h3>
                      </MorphTitle>
                      <p className="label mt-3 text-bone-faint">{product.kind}</p>
                    </div>

                    <p className="max-w-md text-bone-soft md:col-span-5">{product.tagline}</p>

                    <span
                      aria-hidden
                      className="hidden text-2xl text-bone-faint transition-all duration-500 ease-[var(--ease-editorial)] group-hover:translate-x-2 group-hover:text-amber md:col-span-1 md:block md:justify-self-end"
                    >
                      &rarr;
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Approach ─────────────────────────────────────────── */}
      <Section id="approach" tone="surface">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Reveal>
                <Eyebrow index="03">Approach</Eyebrow>
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
                {principles.map((principle, index) => (
                  <Reveal key={principle.index} delay={index * 80}>
                    <div className="grid gap-3 border-b border-rule-strong py-8 md:grid-cols-12 md:gap-6">
                      <dt className="md:col-span-4">
                        <span className="label text-amber">{principle.index}</span>
                        <p className="mt-2 text-lg tracking-tight">{principle.title}</p>
                      </dt>
                      <dd className="text-bone-soft md:col-span-8">{principle.body}</dd>
                    </div>
                  </Reveal>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Proof ────────────────────────────────────────────── */}
      <Section>
        <Container>
          <Reveal>
            <Eyebrow index="04">Where it stands</Eyebrow>
          </Reveal>

          {proofPointsArePlaceholder && (
            <Reveal delay={60}>
              <p className="label mt-6 inline-flex items-center gap-2 border border-amber/40 px-3 py-2 text-amber">
                <span aria-hidden>&#9888;</span>
                Placeholder figures &mdash; awaiting verified numbers
              </p>
            </Reveal>
          )}

          <div className="mt-16 grid gap-12 border-t border-rule pt-12 md:grid-cols-3">
            {proofPoints.map((point, index) => (
              <Reveal key={point.label} delay={index * 110}>
                <p className="font-display text-headline leading-none text-amber">
                  {point.value}
                </p>
                <p className="mt-4 max-w-xs text-bone-soft">{point.label}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={340} className="mt-20">
            <p className="text-lead max-w-2xl text-bone-soft">
              The fastest way to judge any of this is to use it. The WhatsApp agent has a live
              demo you can order from right now — no call, no form, no signup.
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
