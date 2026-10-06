import Link from "next/link";
import { Check } from "lucide-react";
import { Badge, Breadcrumbs, Button, FaqList, SectionHeader } from "@/components/ui";
import { ACCENT_TEXT, CtaBand } from "@/components/product-blocks";
import { JsonLd, breadcrumbLd, faqLd } from "@/components/json-ld";
import { cn } from "@/lib/cn";
import { pageMeta } from "@/lib/meta";
import { getProduct, productOrder, type Faq } from "@/lib/site";

export const metadata = pageMeta({
  title: "Pricing | Maps Lead Scraper, OrderRise, AI Agents",
  description:
    "Plain prices: Maps Lead Scraper $200 one-time, OrderRise $50/month per restaurant, AI voice agent scoped to call volume, custom AI agents project-based.",
  path: "/pricing",
});

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Pricing", href: "/pricing" },
];

const pricingFaqs: Faq[] = [
  {
    q: "Is the Maps Lead Scraper a subscription?",
    a: "No. It is a one-time purchase of $200. There is no subscription and no Places API bill.",
  },
  {
    q: "What is included in the OrderRise price?",
    a: "$50 a month per restaurant, with menu setup and onboarding included.",
  },
  {
    q: "Why is the voice agent not listed with a fixed price?",
    a: "The work depends on your call volume and what the agent needs to do on each call. Rather than publish a number that would be wrong for most businesses, it is scoped on a call and you get a straight figure.",
  },
  {
    q: "How are custom AI agents priced?",
    a: "Project-based, after a 20-minute scoping call. You get a clear scope, including which parts are not worth automating, before any build starts.",
  },
];

export default function PricingPage() {
  return (
    <>
      <JsonLd data={[breadcrumbLd(crumbs), faqLd(pricingFaqs)]} />

      <section id="overview" className="relative isolate pb-12 pt-10 md:pb-16 md:pt-14" data-od-id="pricing-hero">
        <div className="atmosphere" />
        <div className="container-site">
          <Breadcrumbs items={crumbs} />
          <div className="max-w-3xl">
            <h1 className="text-display md:text-[clamp(2.5rem,5vw,4rem)]">
              <span className="eyebrow mb-4 flex font-sans">valueble.ai pricing</span>
              Four products. Plain prices.
            </h1>
            <p className="mt-6 text-sub text-mute">
              Two have a fixed price. The other two depend on your volume and your process, so they are
              scoped on a call instead of guessed at here.
            </p>
          </div>
        </div>
      </section>

      <section id="plans" aria-labelledby="plans-title" className="pb-20 md:pb-28">
        <div className="container-site">
          <h2 id="plans-title" className="sr-only">
            Prices by product
          </h2>
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {productOrder.map((slug) => {
              const p = getProduct(slug)!;
              return (
                <li key={slug} className="card reveal flex flex-col p-6" data-od-id={`pricing-card-${slug}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className={cn("ui-label", ACCENT_TEXT[p.accent])}>{p.kind}</span>
                    {p.status === "Live" && <Badge tone="live">Live</Badge>}
                  </div>
                  <h3 className="mt-5 text-title">
                    <Link href={p.path} className="hover:underline hover:underline-offset-4">
                      {p.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-faint">{p.audience}</p>
                  <p className="mt-6 whitespace-nowrap font-display text-[1.75rem] font-semibold leading-none text-paper">{p.price}</p>
                  <p className="mt-2 text-sm text-faint">{p.priceNote}</p>
                  <ul className="mt-6 flex-1 space-y-2.5 border-t border-rule pt-6 text-[0.9375rem]">
                    {p.facts
                      .filter((f) => f.label !== "Price")
                      .slice(0, 4)
                      .map((f) => (
                        <li key={f.label} className="flex gap-2.5">
                          <Check aria-hidden className={cn("mt-1 size-4 shrink-0", ACCENT_TEXT[p.accent])} />
                          <span>
                            <span className="text-faint">{f.label}:</span> <span className="text-paper">{f.value}</span>
                          </span>
                        </li>
                      ))}
                  </ul>
                  <div className="mt-7 grid gap-2">
                    <Button href={p.cta.href} variant="secondary" size="sm" className="w-full">
                      {slug === "voice-agent" ? "Book a call" : p.cta.label}
                    </Button>
                    <Link href={p.path} className="inline-flex min-h-10 items-center justify-center text-sm text-mute hover:text-paper">
                      Read about {p.name}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section id="faq" className="section border-t border-rule" aria-labelledby="faq-title">
        <div className="container-site grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeader eyebrow="FAQ" title={<span id="faq-title">Pricing questions</span>} />
          <FaqList faqs={pricingFaqs} className="reveal" />
        </div>
      </section>

      <CtaBand
        heading="Not sure which one fits?"
        body="Describe the job and I will tell you which product fits, or whether none of them do."
      />
    </>
  );
}
