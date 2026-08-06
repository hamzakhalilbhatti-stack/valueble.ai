import type { Metadata } from "next";
import { PageTransition } from "@/components/page-transition";
import { Reveal, RevealLines } from "@/components/reveal";
import { Action, Container, Eyebrow, Section } from "@/components/ui";
import { contact, products, site, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.founder} builds AI agents and growth tools for businesses and agencies. Here's how the work goes and who it's for.`,
};

const capabilities = [
  {
    title: "Conversational agents",
    body: "WhatsApp, web chat, and messaging agents that handle ordering, support, qualification, and booking — in the channel the customer already uses.",
  },
  {
    title: "Lead engines",
    body: "Extraction, enrichment, and scoring pipelines that turn a market into a contactable list without a person doing the clicking.",
  },
  {
    title: "Browser extensions & internal tools",
    body: "The small piece of software that removes a recurring manual step from someone's week. Usually the highest return per hour spent building.",
  },
  {
    title: "Integration and plumbing",
    body: "Getting the tools you already pay for to hand data to each other, on a schedule, without silent failures.",
  },
];

const facts = [
  { label: "Founder", value: site.founder },
  { label: "Role", value: site.founderRole },
  { label: "Based", value: "Pakistan" }, // TODO: confirm city
  { label: "Working", value: "Worldwide, remote" },
  { label: "Products live", value: String(products.length) },
  { label: "Availability", value: "Taking projects" },
];

export default function AboutPage() {
  return (
    <PageTransition>
      <section className="pt-32 pb-20 md:pt-48 md:pb-28">
        <Container>
          <Reveal>
            <Eyebrow>About</Eyebrow>
          </Reveal>

          <RevealLines
            as="h1"
            delay={100}
            stagger={100}
            lines={["I build the boring", "software that quietly", "makes money."]}
            className="font-display text-headline mt-10 max-w-[20ch] text-balance"
          />

          <div className="mt-16 grid gap-12 lg:grid-cols-12">
            <Reveal delay={200} className="lg:col-span-7">
              <div className="text-lead space-y-6 text-bone-soft">
                <p>
                  I&rsquo;m {site.founder}. {site.name} is the name I put on the AI systems and
                  tools I build for businesses and agencies — usually the ones drowning in a
                  process that works fine at ten a day and falls apart at two hundred.
                </p>
                <p>
                  Everything here started as somebody&rsquo;s actual problem. A restaurant losing
                  orders because nobody could reach the phone during the dinner rush. An agency
                  paying a person to copy business details off Google Maps one tab at a time.
                  Neither needed a strategy. Both needed a specific thing built and made to
                  hold up.
                </p>
                <p>
                  That is the whole approach. Find the process that is high-volume and
                  rules-shaped, build the system that runs it unattended, and be honest about
                  the parts that should stay human.
                </p>
              </div>
            </Reveal>

            <Reveal delay={400} className="lg:col-span-4 lg:col-start-9">
              {/* TODO: replace this plate with a portrait of Hamza once he sends one. */}
              <dl className="border-t border-bone">
                {facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="flex items-baseline justify-between gap-6 border-b border-rule py-4"
                  >
                    <dt className="label text-bone-faint">{fact.label}</dt>
                    <dd className="text-right text-sm tracking-tight">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </Container>
      </section>

      <Section tone="surface">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Reveal>
                <Eyebrow index="01">What I build</Eyebrow>
              </Reveal>
              <RevealLines
                as="h2"
                delay={100}
                lines={["Four kinds of", "work, mostly."]}
                className="font-display text-headline mt-8 text-balance"
              />
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <dl className="border-t border-rule-strong">
                {capabilities.map((capability, index) => (
                  <Reveal key={capability.title} delay={index * 80}>
                    <div className="border-b border-rule-strong py-8">
                      <dt className="font-display text-2xl leading-tight md:text-3xl">
                        {capability.title}
                      </dt>
                      <dd className="mt-3 max-w-2xl text-bone-soft">{capability.body}</dd>
                    </div>
                  </Reveal>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-3">
              <Eyebrow index="02">Who it&rsquo;s for</Eyebrow>
            </Reveal>

            <div className="lg:col-span-8 lg:col-start-5">
              <RevealLines
                as="h2"
                lines={["Small teams doing", "volume by hand."]}
                className="font-display text-title text-balance"
              />
              <Reveal delay={180} className="text-lead mt-8 max-w-2xl space-y-6 text-bone-soft">
                <p>
                  Agencies with a prospecting bottleneck. Restaurants and local businesses
                  losing orders to an unanswered phone. Operators who know exactly which task
                  is eating twenty hours a month and have never had the time to fix it.
                </p>
                <p>
                  If you are looking for a research partner to explore what AI could
                  theoretically do for your industry, I am the wrong person. If you can name
                  the task, I can probably build it.
                </p>
              </Reveal>

              <Reveal delay={300} className="mt-10 flex flex-wrap gap-3">
                <Action href={contact.bookingGeneral}>Book a 20-minute call</Action>
                <Action href={whatsappUrl} variant="outline">
                  Message on WhatsApp
                </Action>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>
    </PageTransition>
  );
}
