import type { Metadata } from "next";
import { SceneBackdrop, SceneBreak } from "@/components/scene-backdrop";
import { ArrowUpRight, Body, Head, Section } from "@/components/ui";
import { contact, products, productCta, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach Hamza Khalil Bhatti on WhatsApp, LinkedIn or email — or book a demo of OrderRise.",
};

/**
 * Contact.
 *
 * Every channel is listed with what it is actually for. The OrderRise booking
 * link is deliberately kept on its own row rather than promoted to the top: it
 * is a restaurant-ordering demo, and sending an agency lead there loses them.
 */
const channels = [
  {
    label: "WhatsApp",
    detail: "Fastest. Usually answered same day.",
    href: whatsappUrl,
    value: "+92 300 179 4940",
  },
  {
    label: "Email",
    detail: "For anything that needs attachments or detail.",
    href: `mailto:${contact.email}`,
    value: contact.email,
  },
  {
    label: "LinkedIn",
    detail: "If you would rather see who you are talking to first.",
    href: contact.linkedin,
    value: "hamza-khalil",
  },
  {
    label: "Book an OrderRise demo",
    detail: "Restaurants only — a live walkthrough of the ordering agent.",
    href: contact.bookingOrderRise,
    value: "cal.com",
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden pb-24 pt-40 md:pb-36 md:pt-56">
        <SceneBackdrop density={4} seed={6190} />
        <div className="rail">
          <p className="eyebrow reveal rail-label-hero">Contact</p>
          <div className="measure">
            <h1 className="reveal text-hero max-w-[14ch] text-balance text-paper">
              Describe the job. I will tell you if I can take it
            </h1>
            <p className="reveal mt-8 max-w-[52ch] text-sub text-mute">
              No form, no funnel, no discovery sequence. Pick whichever of these you already
              have open.
            </p>
          </div>
        </div>
      </section>

      <Section label="Channels">
        <ul>
          {channels.map((channel) => (
            <li key={channel.label} className="hairline reveal">
              <a
                href={channel.href}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 py-7 transition-opacity duration-300 hover:opacity-65"
              >
                <span className="flex items-center gap-3 text-sub text-paper">
                  {channel.label}
                  <ArrowUpRight className="size-3 opacity-40 transition-transform duration-300 ease-[var(--ease-out)] group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
                <span className="text-fine text-faint">{channel.value}</span>
                <span className="w-full text-mute">{channel.detail}</span>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <SceneBreak seed={6745} />

      <Section label="What helps">
        <Head>Three things make the first reply useful</Head>
        <div className="mt-8 space-y-6">
          <Body>
            <strong>The process, not the product.</strong>{" "}
            Describe the task somebody on your team does repeatedly — what triggers it, what
            they do, and where the output goes.
          </Body>
          <Body>
            <strong>The volume.</strong> Ten a week and a
            thousand a week are different problems with different answers.
          </Body>
          <Body>
            <strong>What you already use.</strong> The
            tools it has to talk to matter more than any preference about how it is built.
          </Body>
        </div>
      </Section>

      <Section label="Straight to a product">
        <ul>
          {products.map((product) => (
            <li key={product.slug} className="hairline reveal">
              <a
                href={productCta[product.slug].href}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 py-6 transition-opacity duration-300 hover:opacity-65"
              >
                <span className="text-paper">{product.name}</span>
                <span className="flex items-center gap-2 text-mute">
                  {productCta[product.slug].label}
                  <ArrowUpRight className="size-3 opacity-50 transition-transform duration-300 ease-[var(--ease-out)] group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
