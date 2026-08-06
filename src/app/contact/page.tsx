import type { Metadata } from "next";
import { PageTransition } from "@/components/page-transition";
import { Reveal, RevealLines } from "@/components/reveal";
import { Container, Eyebrow, Section } from "@/components/ui";
import { contact, site, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Talk to ${site.founder} about an AI agent, a lead engine, or a custom automation build. WhatsApp, a 20-minute call, or email.`,
};

const channels = [
  {
    index: "01",
    label: "WhatsApp",
    heading: "Message me directly",
    body: "The fastest route. Same number the demo agent runs on, answered by an actual person.",
    action: "Open WhatsApp",
    href: whatsappUrl,
    primary: true,
  },
  {
    index: "02",
    label: "Book a call",
    heading: "Twenty minutes, no deck",
    body: "You describe the process. I tell you whether it is worth automating and roughly what it takes. No obligation attached.",
    action: "Pick a time",
    href: contact.bookingGeneral,
    primary: false,
  },
  {
    index: "03",
    label: "Email",
    heading: "Send the long version",
    body: "Better if you have specifics — volumes, tools you already use, screenshots of the thing that is broken.",
    action: contact.email,
    href: `mailto:${contact.email}`,
    primary: false,
  },
  {
    index: "04",
    label: "LinkedIn",
    heading: "See the background first",
    body: "If you would rather know who you are talking to before you talk to them.",
    action: "View profile",
    href: contact.linkedin,
    primary: false,
  },
];

const helpful = [
  "The task you want handled, in one sentence.",
  "Roughly how often it happens — per day, per week.",
  "The tools it currently touches (WhatsApp, a CRM, sheets, your site).",
  "Who does it today, and how long it takes them.",
];

const next = [
  {
    index: "01",
    title: "You send the problem",
    body: "In whatever form you have it. A voice note describing the annoyance is genuinely fine.",
  },
  {
    index: "02",
    title: "I tell you if it's buildable",
    body: "Usually within a day, and sometimes the answer is that you do not need me — an existing tool already does it.",
  },
  {
    index: "03",
    title: "We scope it properly",
    body: "If it is worth doing, you get a clear scope: what gets automated, what stays manual, how long, what it costs.",
  },
];

export default function ContactPage() {
  return (
    <PageTransition>
      <section className="pt-32 pb-16 md:pt-48 md:pb-24">
        <Container>
          <Reveal>
            <Eyebrow>Contact</Eyebrow>
          </Reveal>

          <RevealLines
            as="h1"
            delay={100}
            stagger={100}
            lines={["Start with a message,", "not a brief."]}
            className="font-display text-display mt-10 max-w-[16ch] text-balance"
          />

          <Reveal delay={300} className="mt-12">
            <p className="text-lead max-w-2xl text-bone-soft">
              You do not need to know what should be built or how. You need to know which part
              of the week you would like back. Tell me that part.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ── Channels ─────────────────────────────────────────── */}
      <Container>
        <div className="border-t border-rule">
          {channels.map((channel, index) => (
            <Reveal key={channel.label} delay={index * 90}>
              <a
                href={channel.href}
                target={channel.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="group relative block overflow-hidden border-b border-rule"
              >
                {/* Accent panel that wipes up on hover. */}
                <span
                  aria-hidden
                  className="absolute inset-0 origin-bottom scale-y-0 bg-bone transition-transform duration-700 ease-[var(--ease-editorial)] group-hover:scale-y-100"
                />

                <div className="relative grid items-baseline gap-4 py-10 transition-colors duration-500 group-hover:text-void md:grid-cols-12 md:gap-8 md:py-14">
                  <span className="label text-amber md:col-span-1">{channel.index}</span>

                  <div className="md:col-span-5">
                    <p className="label text-bone-faint transition-colors duration-500 group-hover:text-void/55">
                      {channel.label}
                    </p>
                    <h2 className="font-display text-title mt-3 leading-none">
                      {channel.heading}
                    </h2>
                  </div>

                  <p className="max-w-md text-bone-soft transition-colors duration-500 group-hover:text-void/70 md:col-span-4">
                    {channel.body}
                  </p>

                  <span className="flex items-center gap-2 text-sm tracking-tight md:col-span-2 md:justify-self-end">
                    <span className="truncate">{channel.action}</span>
                    <span
                      aria-hidden
                      className="transition-transform duration-500 ease-[var(--ease-editorial)] group-hover:translate-x-1"
                    >
                      &rarr;
                    </span>
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </Container>

      {/* ── What helps / what happens next ───────────────────── */}
      <Section>
        <Container>
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Reveal>
                <Eyebrow index="01">What helps</Eyebrow>
              </Reveal>
              <RevealLines
                as="h2"
                delay={100}
                lines={["Four lines is", "enough to start."]}
                className="font-display text-title mt-8 text-balance"
              />
              <Reveal delay={220}>
                <ul className="mt-8 border-t border-rule">
                  {helpful.map((item) => (
                    <li
                      key={item}
                      className="flex gap-4 border-b border-rule py-4 text-bone-soft"
                    >
                      <span aria-hidden className="text-amber">
                        &rarr;
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal>
                <Eyebrow index="02">What happens next</Eyebrow>
              </Reveal>
              <div className="mt-8 border-t border-rule">
                {next.map((step, index) => (
                  <Reveal key={step.index} delay={index * 90}>
                    <div className="border-b border-rule py-8">
                      <span className="label text-amber">{step.index}</span>
                      <h3 className="font-display mt-2 text-2xl leading-tight md:text-3xl">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-bone-soft">{step.body}</p>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={300} className="mt-8">
                <p className="label text-bone-faint">
                  Typical first reply: same day{/* TODO: confirm response time */}
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>
    </PageTransition>
  );
}
