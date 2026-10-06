import Link from "next/link";
import { ArrowUpRight, PhoneForwarded } from "lucide-react";
import { Badge, Breadcrumbs, Button, FaqList, SectionHeader } from "@/components/ui";
import { ProductDemo } from "@/components/product/product-demo";
import { ACCENT_BG, ACCENT_TEXT, CtaBand, ProductCard } from "@/components/product-blocks";
import { JsonLd, breadcrumbLd, faqLd, productLd } from "@/components/json-ld";
import { cn } from "@/lib/cn";
import { contact, productOrder, type Product } from "@/lib/site";

/**
 * One template for all four product pages, so they share structure, schema
 * and internal linking: breadcrumb → hero → live demo → facts → problem →
 * how it works → features → (extras) → FAQ → other products → CTA.
 */
export function ProductPage({
  product,
  extras,
}: {
  product: Product;
  /** Product-specific sections slotted in before the FAQ. */
  extras?: React.ReactNode;
}) {
  const crumbs = [
    { name: "Home", href: "/" },
    { name: product.name, href: product.path },
  ];
  const others = productOrder.filter((s) => s !== product.slug);
  const isVoice = product.slug === "voice-agent";

  return (
    <>
      <JsonLd data={[productLd(product), faqLd(product.faqs), breadcrumbLd(crumbs)]} />

      {/* Hero */}
      <section id="overview" className="relative isolate pb-14 pt-10 md:pb-20 md:pt-14" data-od-id="product-hero">
        <div className="atmosphere" />
        <div className="container-site">
          <Breadcrumbs items={crumbs} />
          <div className="grid items-end gap-10 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {product.status === "Live" ? <Badge tone="live">Live</Badge> : <Badge>{product.status}</Badge>}
                <Badge tone="price">
                  {product.price}
                  {product.priceNote && <span className="text-faint">· {product.priceNote}</span>}
                </Badge>
              </div>
              <h1 className="mt-6 max-w-[18ch] text-display md:text-[clamp(2.5rem,5vw,4rem)]">
                <span className={cn("eyebrow mb-4 flex font-sans", ACCENT_TEXT[product.accent])}>
                  {product.hero.eyebrow}
                </span>
                {product.hero.headline}
              </h1>
              <p className="mt-6 max-w-[56ch] text-sub text-mute">{product.hero.sub}</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href={product.cta.href} data-od-id="product-primary-cta">
                  {product.cta.label}
                </Button>
                <Button href="#how-it-works" variant="secondary">
                  How it works
                </Button>
              </div>
            </div>
            <p className="max-w-sm text-mute lg:justify-self-end lg:pb-2">
              <span className="text-paper">{product.audience}.</span> {product.summary}
            </p>
          </div>
        </div>
      </section>

      {/* Demo */}
      <section aria-label={`${product.name} interface preview`} className="pb-16 md:pb-24" data-od-id="product-demo">
        <div className="container-site">
          <div className="reveal">
            <ProductDemo slug={product.slug} />
          </div>
        </div>
      </section>

      {/* Facts */}
      <section id="at-a-glance" aria-labelledby="facts-title" className="pb-16 md:pb-24">
        <div className="container-site">
          <h2 id="facts-title" className="sr-only">
            {product.name} at a glance
          </h2>
          <dl className="reveal grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
            {product.facts.slice(0, 8).map((f) => (
              <div key={f.label} className="bg-ink-2 p-5">
                <dt className="ui-label text-faint">{f.label}</dt>
                <dd className="mt-2 text-paper">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Problem */}
      <section id="problem" className="section border-t border-rule" aria-labelledby="problem-title">
        <div className="container-site grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <SectionHeader eyebrow="The problem" title={<span id="problem-title">{product.problem.heading}</span>} />
          <div className="reveal space-y-5 text-mute lg:pt-10">
            {product.problem.body.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section id="how-it-works" className="section border-t border-rule" aria-labelledby="steps-title">
        <div className="container-site">
          <SectionHeader eyebrow="How it works" title={<span id="steps-title">{`${product.name} in ${product.steps.length} steps`}</span>} lede={product.tagline !== product.hero.headline ? product.tagline : product.summary} />
          <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {product.steps.map((s, i) => (
              <li key={s.title} className="card reveal p-6" data-od-id={`step-${i + 1}`}>
                <span className={cn("ui-label", ACCENT_TEXT[product.accent])}>
                  Step {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-title">{s.title}</h3>
                <p className="mt-3 text-[0.9375rem] text-mute">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section border-t border-rule" aria-labelledby="features-title">
        <div className="container-site">
          {/* TODO (owner, voice agent): the capability list in this section is
              draft marketing copy, not verified product truth. Confirm each
              capability matches the actual product before publishing, and trim
              anything not yet built. Source: products[].features in src/lib/site.ts */}
          <SectionHeader eyebrow="What you get" title={<span id="features-title">{isVoice ? "What the voice agent does" : "Everything it does"}</span>} />
          <ul className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {product.features.map((f) => (
              <li key={f.title} className="reveal border-t border-rule pt-6">
                <span aria-hidden className={cn("mb-4 block h-1 w-8 rounded-full", ACCENT_BG[product.accent])} />
                <h3 className="text-[1.0625rem] font-semibold">{f.title}</h3>
                <p className="mt-2 text-[0.9375rem] text-mute">{f.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {extras}

      {/* FAQ */}
      <section id="faq" className="section border-t border-rule" aria-labelledby="faq-title">
        <div className="container-site grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeader
            eyebrow="FAQ"
            title={<span id="faq-title">{product.name} questions</span>}
            lede={
              <>
                Something not covered?{" "}
                <Link href="/contact" className="text-paper underline underline-offset-4 hover:text-accent-strong">
                  Ask Hamza directly
                </Link>
                .
              </>
            }
          />
          <FaqList faqs={product.faqs} className="reveal" />
        </div>
      </section>

      {/* Other products */}
      <section id="other-products" className="section border-t border-rule" aria-labelledby="others-title">
        <div className="container-site">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionHeader eyebrow="Also from valueble.ai" title={<span id="others-title">The other products</span>} />
            <Link href="/pricing" className="reveal inline-flex items-center gap-1 text-paper hover:text-accent-strong">
              Compare pricing for all four <ArrowUpRight aria-hidden className="size-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {others.map((s) => (
              <ProductCard key={s} slug={s} className="reveal" />
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        heading={product.cta.heading}
        body={product.cta.body}
        primary={{ href: product.cta.href, label: product.cta.label }}
        secondary={{ href: contact.bookingGeneral, label: "Other ways to reach me" }}
      />
    </>
  );
}

/** Voice-agent-only extras: who it is for + the honest note. */
export function VoiceExtras() {
  const who = [
    { name: "Restaurants and takeaways", body: "Orders and reservations during the dinner rush, when nobody can reach the phone." },
    { name: "Clinics and dental practices", body: "Appointment booking and rescheduling, and the same opening-hours question all day." },
    { name: "Real estate teams", body: "Every enquiry answered and qualified, so agents call back the serious buyers first." },
    { name: "Service businesses and agencies", body: "Leads captured and booked while you are on a job or with a client." },
  ];
  return (
    <>
      <section id="who-its-for" className="section border-t border-rule" aria-labelledby="who-title">
        <div className="container-site">
          <SectionHeader eyebrow="Who it is for" title={<span id="who-title">Built for businesses that cannot afford a missed call</span>} />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {who.map((w) => (
              <li key={w.name} className="card reveal p-6" data-od-id={`voice-audience-${w.name.split(" ")[0].toLowerCase()}`}>
                <h3 className="text-title">{w.name}</h3>
                <p className="mt-3 text-[0.9375rem] text-mute">{w.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="honest-note" className="on-cloud section" aria-labelledby="honest-title" data-od-id="voice-honest-note">
        <div className="container-site grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="reveal">
            <p className="eyebrow mb-4">A note from Hamza</p>
            <h2 id="honest-title" className="text-head">Not every call should go to an agent</h2>
          </div>
          <div className="reveal space-y-5 text-[1.0625rem]">
            <p>
              The calls worth automating are the repetitive ones: bookings, orders, opening hours, prices,
              directions, and first-contact enquiries where the job is to capture details and get back to
              someone. Those are most of the volume, and they are exactly the calls that get missed.
            </p>
            <p>
              The calls that should go to a person are complaints, anything sensitive, anything expensive or
              unusual, and the caller who just wants to talk to someone. I will tell you which is which for
              your business before building anything, and the agent will transfer those calls instead of
              guessing.
            </p>
            <p className="flex items-center gap-2 font-medium text-ink">
              <PhoneForwarded aria-hidden className="size-5" />
              Same human checkpoint as everything else I build.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
