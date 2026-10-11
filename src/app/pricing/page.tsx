import { Breadcrumbs, FaqList, SectionHeader } from "@/components/ui";
import { CtaBand } from "@/components/product-blocks";
import { FaqAside } from "@/components/polish";
import { JsonLd, breadcrumbLd, faqLd } from "@/components/json-ld";
import { pageMeta } from "@/lib/meta";
import { type Faq } from "@/lib/site";
import { PricingSection } from "@/components/ui/pricing-section";
import type { PricingTier } from "@/components/ui/pricing-card";

export const metadata = pageMeta({
  title: "Pricing | Maps Lead Scraper, OrderRise, AI Agents",
  description:
    "Plain prices: Maps Lead Scraper $200 one-time, OrderRise setup from $200 one-time plus operating costs, AI voice agent scoped to call volume, custom AI agents project-based.",
  path: "/pricing",
});

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Pricing", href: "/pricing" },
];

const pricingFaqs: Faq[] = [
  {
    q: "Is the Maps Lead Scraper a subscription?",
    a: "No. It is a one-time purchase of $200. There is no subscription and no Google Places API bill.",
  },
  {
    q: "What is included in the OrderRise price?",
    a: "Chatbot setup is $200 one-time. Connected setup is $300-$400 one-time. Monthly API and platform operating costs are separate.",
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

const PAYMENT_FREQUENCIES = ["One-time / setup", "With ongoing support"];

const VALUEBLE_TIERS: PricingTier[] = [
  {
    id: "lead-extractor",
    name: "Maps Lead Scraper",
    price: {
      "One-time / setup": 200,
      "With ongoing support": 200,
    },
    priceNote: "One-time purchase · Zero subscription",
    description: "Unlimited Google Maps lead extraction directly into clean CSV with emails and socials.",
    features: [
      "Runs locally on your machine or VPS",
      "Unlimited searches & query results",
      "Pulls emails & socials from actual websites",
      "No Google Places API billing ever",
      "Direct CSV export ready for cold outreach",
    ],
    cta: "Get Maps Scraper",
    href: "/contact?intent=maps-scraper",
    productPath: "/products/lead-extractor",
    popular: false,
  },
  {
    id: "orderrise",
    name: "OrderRise",
    price: {
      "One-time / setup": 200,
      "With ongoing support": 350,
    },
    priceNote: "One-time setup · Direct POS / WhatsApp connect",
    description: "Autonomous WhatsApp & Instagram ordering agent built for busy takeaway restaurants.",
    features: [
      "Takes orders & collects full delivery address",
      "Calculates itemized subtotal accurately",
      "Answers delivery radius & menu queries",
      "Sends order tickets straight to kitchen staff",
      "Live order management dashboard",
    ],
    cta: "Setup OrderRise",
    href: "/contact?intent=orderrise",
    productPath: "/products/orderrise",
    popular: true,
  },
  {
    id: "voice-agent",
    name: "AI Voice Agent",
    price: {
      "One-time / setup": "Custom",
      "With ongoing support": "Custom",
    },
    priceNote: "Scoped per call volume & integrations",
    description: "Inbound voice assistant answering calls with ultra-low latency and natural pacing.",
    features: [
      "Sub-second voice response, no awkward lag",
      "Answers FAQs, business hours, and services",
      "Books appointments straight to calendar",
      "Logs every call transcript & summary to CRM",
      "Instant warm transfer to live team members",
    ],
    cta: "Book scoping call",
    href: "/contact?intent=voice-agent",
    productPath: "/products/voice-agent",
    highlighted: true,
  },
  {
    id: "ai-agents",
    name: "Custom AI Agents",
    price: {
      "One-time / setup": "Project",
      "With ongoing support": "Project",
    },
    priceNote: "Fixed-price milestone contracts",
    description: "Bespoke operational workflows built around your specific tools and daily friction.",
    features: [
      "Detailed process audit & feasibility review",
      "No generic AI wrap: built for your database",
      "Integrates with your existing software stack",
      "Clear definition of ROI before build starts",
      "Handover training & dedicated monitoring",
    ],
    cta: "Discuss project",
    href: "/contact?intent=ai-agents",
    productPath: "/products/ai-agents",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <JsonLd data={[breadcrumbLd(crumbs), faqLd(pricingFaqs)]} />

      <section id="overview" className="relative isolate pt-10 pb-4 md:pt-14" data-od-id="pricing-hero">
        <div className="atmosphere" />
        <div className="container-site">
          <Breadcrumbs items={crumbs} />
        </div>
      </section>

      <section id="plans" aria-labelledby="plans-title" className="pb-20 md:pb-28">
        <div className="container-site">
          <h2 id="plans-title" className="sr-only">
            Prices by product
          </h2>
          <PricingSection
            title="Four products. Plain prices."
            subtitle="Two have fixed one-time pricing. The other two are scoped to your volume and process, so they are transparently quoted on a call."
            frequencies={PAYMENT_FREQUENCIES}
            tiers={VALUEBLE_TIERS}
          />
        </div>
      </section>

      <section id="faq" className="section border-t border-rule" aria-labelledby="faq-title">
        <div className="container-site grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <SectionHeader eyebrow="FAQ" id="faq-title" title="Pricing" muted="questions" />
            <FaqAside className="max-lg:hidden" />
          </div>
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
