import { ArrowUpRight, CalendarCheck, Mail, MessageCircle, UserRound } from "lucide-react";
import { Breadcrumbs, SectionHeader } from "@/components/ui";
import { JsonLd, breadcrumbLd } from "@/components/json-ld";
import { pageMeta } from "@/lib/meta";
import { contact, getProduct, productOrder, whatsappUrl } from "@/lib/site";

export const metadata = pageMeta({
  title: "Contact valueble.ai | WhatsApp, Email or LinkedIn",
  description:
    "Reach Hamza Khalil Bhatti on WhatsApp, email or LinkedIn, or book an OrderRise demo. Describe the job and get an honest answer on whether it is a fit.",
  path: "/contact",
});

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Contact", href: "/contact" },
];

/**
 * Every channel is listed with what it is actually for. The OrderRise booking
 * link stays on its own row: it is a restaurant-ordering demo, and sending an
 * agency lead there loses them.
 */
const channels = [
  {
    label: "WhatsApp",
    // TODO (owner): confirm "same day" before it reads as a promise.
    detail: "Fastest. Usually answered same day.",
    href: whatsappUrl,
    value: contact.whatsappDisplay,
    Icon: MessageCircle,
    primary: true,
  },
  {
    label: "Email",
    detail: "For anything that needs attachments or detail.",
    href: `mailto:${contact.email}`,
    value: contact.email,
    Icon: Mail,
  },
  {
    label: "LinkedIn",
    detail: "If you would rather see who you are talking to first.",
    href: contact.linkedin,
    value: "hamza-khalil",
    Icon: UserRound,
  },
  {
    label: "Book an OrderRise demo",
    detail: "Restaurants only — a live walkthrough of the ordering agent.",
    href: contact.bookingOrderRise,
    value: "cal.com",
    Icon: CalendarCheck,
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />

      <section id="overview" className="relative isolate pb-12 pt-10 md:pb-16 md:pt-14" data-od-id="contact-hero">
        <div className="atmosphere" />
        <div className="container-site">
          <Breadcrumbs items={crumbs} />
          <div className="max-w-3xl">
            <h1 className="text-display md:text-[clamp(2.5rem,5vw,4rem)]">
              <span className="eyebrow mb-4 flex font-sans">Contact valueble.ai</span>
              Describe the job. I will tell you if I can take it
            </h1>
            <p className="mt-6 text-sub text-mute">
              No form, no funnel, no discovery sequence. Pick whichever of these you already have open.
            </p>
          </div>
        </div>
      </section>

      <section id="channels" aria-labelledby="channels-title" className="pb-20 md:pb-28">
        <div className="container-site">
          <h2 id="channels-title" className="sr-only">
            Channels
          </h2>
          <ul className="grid gap-4 md:grid-cols-2">
            {channels.map(({ label, detail, href, value, Icon, primary }) => {
              const newTab = /^https?:/.test(href);
              return (
                <li key={label} className="reveal">
                  <a
                    href={href}
                    {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className={
                      "card card-link group flex h-full items-start gap-4 p-6 " +
                      (primary ? "border-accent/35 bg-[linear-gradient(180deg,rgb(95_232_200/0.08),transparent)]" : "")
                    }
                    data-od-id={`contact-channel-${label.split(" ")[0].toLowerCase()}`}
                  >
                    <span className={"grid size-11 shrink-0 place-items-center rounded-full " + (primary ? "bg-accent text-ink" : "border border-rule-strong text-paper")}>
                      <Icon aria-hidden className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 font-display text-title font-semibold text-paper">
                        {label}
                        <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                      <span className="mt-1 block break-all text-sm text-faint">{value}</span>
                      <span className="mt-3 block text-mute">{detail}</span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section id="what-helps" className="on-cloud section" aria-labelledby="helps-title">
        <div className="container-site grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="reveal">
            <p className="eyebrow mb-4">What helps</p>
            <h2 id="helps-title" className="text-head">Three things make the first reply useful</h2>
          </div>
          <ol className="reveal grid gap-4">
            {[
              ["The process, not the product.", "Describe the task somebody on your team does repeatedly — what triggers it, what they do, and where the output goes."],
              ["The volume.", "Ten a week and a thousand a week are different problems with different answers."],
              ["What you already use.", "The tools it has to talk to matter more than any preference about how it is built."],
            ].map(([t, b], i) => (
              <li key={t} className="flex gap-4 rounded-2xl border border-cloud-2 bg-white p-5">
                <span className="ui-label pt-1 text-slate">0{i + 1}</span>
                <p>
                  <strong>{t}</strong> {b}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="straight-to-a-product" className="section" aria-labelledby="direct-title">
        <div className="container-site">
          <SectionHeader eyebrow="Straight to a product" title={<span id="direct-title">Already know which one?</span>} />
          <ul className="mt-10 divide-y divide-rule border-y border-rule">
            {productOrder.map((slug) => {
              const p = getProduct(slug)!;
              const newTab = /^https?:/.test(p.cta.href);
              return (
                <li key={slug} className="reveal">
                  <a
                    href={p.cta.href}
                    {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex min-h-16 flex-wrap items-center justify-between gap-x-8 gap-y-1 py-5"
                  >
                    <span className="font-medium text-paper">{p.name}</span>
                    <span className="inline-flex items-center gap-2 text-mute group-hover:text-paper">
                      {p.cta.label}
                      <ArrowUpRight aria-hidden className="size-4" />
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
