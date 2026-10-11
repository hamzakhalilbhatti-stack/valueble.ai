import { Check, PhoneForwarded } from "lucide-react";
import { ArrowLink, Badge, Breadcrumbs, Button, FaqList, SectionHeader } from "@/components/ui";
import { ProductDemo } from "@/components/product/product-demo";
import { ACCENT_BG, ACCENT_TEXT, CtaBand, HowItWorks3, PRODUCT_ICON, Photo, PlainFacts, ProductCard } from "@/components/product-blocks";
import { AppTile, FaqAside, StickyNote } from "@/components/polish";
import { JsonLd, breadcrumbLd, faqLd, productLd } from "@/components/json-ld";
import { cn } from "@/lib/cn";
import { FluidBalloonDigit, FluidNumberText } from "@/components/fluid-number";
import { OnboardingWheel } from "@/components/onboarding-wheel";
import { contact, productOrder, type Product } from "@/lib/site";

/**
 * One template for all four product pages:
 * breadcrumb → hero (what / who / cost / what happens) → interactive demo →
 * 3-step how it works → problem + photo → features → detailed steps →
 * (extras) → FAQ → other products → CTA.
 */
export function ProductPage({ product, extras }: { product: Product; extras?: React.ReactNode }) {
  const crumbs = [
    { name: "Home", href: "/" },
    { name: product.name, href: product.path },
  ];
  const others = productOrder.filter((s) => s !== product.slug);
  const isVoice = product.slug === "voice-agent";
  const HeroIcon = PRODUCT_ICON[product.slug];

  return (
    <>
      <JsonLd data={[productLd(product), faqLd(product.faqs), breadcrumbLd(crumbs)]} />

      {/* Hero */}
      <section id="overview" className="relative pb-14 pt-3 md:pb-20 md:pt-5" data-od-id="product-hero">
        <div className="container-site !max-w-[84rem]">
         <div className="hero-frame dot-grid px-5 pb-10 pt-6 md:px-10 md:pb-14 md:pt-8 lg:px-12">
          <div aria-hidden className={cn("absolute inset-0 -z-10 opacity-90", HERO_WASH[product.accent])} />
          <Breadcrumbs items={crumbs} />
          <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <AppTile size="md" className={cn("mr-1", ACCENT_TEXT[product.accent])}>
                  <HeroIcon className="size-5" />
                </AppTile>
                {product.status !== "Live" && (
                  <Badge>{product.status}</Badge>
                )}
                <Badge tone="price">
                  <FluidNumberText tint="accent">{product.price}</FluidNumberText>
                  {product.priceNote && <span className="text-faint">· {product.priceNote}</span>}
                </Badge>
              </div>
              <h1 className="word-in mt-6 max-w-[18ch] text-display md:text-[clamp(2.5rem,4.6vw,3.75rem)]">
                <span className={cn("eyebrow mb-4 flex font-sans", ACCENT_TEXT[product.accent])}>{product.hero.eyebrow}</span>
                <span style={{ ["--i" as string]: 1 }}>{product.hero.headline}</span>
              </h1>
              <p className="mt-6 max-w-[54ch] text-sub text-mute">{product.hero.sub}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href={product.cta.href} data-od-id="product-primary-cta">
                  {product.cta.label}
                </Button>
                <Button href="#demo" variant="secondary">
                  Try the demo
                </Button>
              </div>
              {product.slug === "orderrise" && (
                <div className="mt-8 flex flex-wrap gap-3" data-od-id="product-outcomes-strip">
                  {["Repeated answers", "Useful enquiry details", "Connected next steps"].map((outcome) => (
                    <div key={outcome} className="flex items-center gap-2 rounded-full border border-rule bg-ink-2/50 px-3 py-1 text-xs font-medium text-paper">
                      <span className={cn("size-1.5 rounded-full", ACCENT_BG[product.accent])} />
                      {outcome}
                    </div>
                  ))}
                </div>
              )}

            </div>
            <PlainFacts product={product} className="h-fit lg:mt-12" />
          </div>
         </div>
        </div>
      </section>

      {/* Interactive demo */}
      <section id="demo" aria-labelledby="demo-title" className="on-cloud section" data-od-id="product-demo">
        <div className="container-site">
         <div className="canvas-panel dot-grid px-4 py-10 md:px-10 md:py-14">
          <SectionHeader eyebrow="Try it" id="demo-title" title={`See ${product.name} work.`} muted="Click through it." lede="A working demo in your browser, with sample data." />
          <div className="reveal mt-10">
            <ProductDemo slug={product.slug} />
          </div>
         </div>
        </div>
      </section>

      {/* 3-step how it works */}
      <section id="how-it-works" className="section" aria-labelledby="how-title">
        <div className="container-site">
          <SectionHeader align="center" eyebrow="How it works" id="how-title" title="Three steps," muted="no jargon" />
          {product.slug === "orderrise" ? (
            <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1fr]">
              <div className="relative space-y-8">
                {[
                  { title: "Message + knowledge", body: "Customer messages your business number. The agent uses your approved business info to understand." },
                  { title: "Answer or connect", body: "It answers the question instantly, or triggers a connected tool to book a slot or take an order." },
                  { title: "Reply and record", body: "The customer gets their answer; you get a clean record or a ticket in your dashboard." },
                ].map((step, i) => (
                  <div key={i} className="relative pl-10 reveal">
                    <div className="absolute -left-3.5 -top-1">
                      <FluidBalloonDigit char={String(i + 1)} size={28} tint={product.accent === "voice" ? "voice" : product.accent === "scan" ? "scan" : "blue"} isActive={true} />
                    </div>
                    <h3 className="text-title">{step.title}</h3>
                    <p className="mt-2 text-[0.9375rem] text-mute">{step.body}</p>
                  </div>
                ))}
              </div>
              <div className="relative rounded-3xl border border-rule bg-ink-2/50 p-8 reveal">
                <p className="eyebrow mb-4 text-accent">Example: Restaurant Ordering</p>
                <ul className="space-y-4">
                  {[
                    { step: "1", text: "Customer asks if you deliver to their area." },
                    { step: "2", text: "AI confirms delivery and shares the menu." },
                    { step: "3", text: "AI takes the order and sends a ticket to the kitchen." },
                  ].map((item, i) => (
                    <li key={i} className="flex gap-4 text-sm">
                      <span className="font-mono font-bold text-accent"><FluidNumberText tint="accent">{item.step}</FluidNumberText></span>
                      <span className="text-paper">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <HowItWorks3 product={product} className="mt-14" />
          )}
        </div>
      </section>

      {/* Problem + photo */}
      <section id="problem" className="section" aria-labelledby="problem-title">
        <div className="container-site">
          <div className="canvas-panel dot-grid grid items-center gap-12 px-5 py-12 md:px-12 md:py-16 lg:grid-cols-2">
            <div>
              <SectionHeader
                eyebrow="The problem"
                title={
                  <span id="problem-title">
                    {product.slug === "orderrise"
                      ? "Missed messages can mean missed orders."
                      : product.problem.heading}
                  </span>
                }
              />
              <div className="reveal mt-6 space-y-5 text-mute">
                {product.slug === "orderrise" ? (
                  <p>
                    The businesses that need help most are the ones with the fewest spare hours.
                    During a rush, the phone is often the first thing to be ignored—but every
                    unanswered enquiry is a potential customer who simply goes elsewhere.
                  </p>
                ) : (
                  product.problem.body.map((p) => (
                    <p key={p.slice(0, 32)}>{p}</p>
                  ))
                )}
              </div>
            </div>
            <div className="relative">
              <Photo {...product.photo} className="reveal reveal-right" />
              <StickyNote className="float-b absolute -bottom-8 -left-3 hidden w-56 rotate-[-3deg] sm:block lg:-left-8">
                {NOTE[product.slug]}
              </StickyNote>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="on-cloud section" aria-labelledby="features-title">
        <div className="container-site">
          <SectionHeader eyebrow="What you get" title={<span id="features-title">{isVoice ? "What the voice agent does" : "Everything it does"}</span>} />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {product.features.map((f, i) => {
              const isOrderRise = product.slug === "orderrise";
              const scope = isOrderRise
                ? (f.body.includes("(Connected setup)")
                    ? "Connected setup"
                    : "Chatbot setup")
                : null;
              return (
                <li key={f.title} className="card card-hover reveal group p-6">
                  <div className="flex items-center justify-between mb-5">
                    <AppTile size="md" className={cn("transition-transform duration-300 ease-[var(--ease-spring)] group-hover:rotate-[-6deg]", ACCENT_TEXT[product.accent])}>
                      <span className="font-mono text-sm font-medium">{String(i + 1).padStart(2, "0")}</span>
                    </AppTile>
                    {scope && (
                      <span className="text-[0.6rem] font-bold uppercase tracking-widest text-mute border border-rule px-2 py-0.5 rounded-full">
                        {scope}
                      </span>
                    )}
                  </div>
                  <h3 className="text-[1.0625rem] font-semibold">{f.title}</h3>
                  <p className="mt-2 text-[0.9375rem] text-mute">{f.body}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {product.slug === "orderrise" && (
        <>
          {/* Pricing Cards */}
          <section id="pricing" className="section" aria-labelledby="pricing-title">
            <div className="container-site">
              <SectionHeader align="center" eyebrow="Investment" id="pricing-title" title="Clear, one-time setup" muted="plus monthly operating costs" />
              <div className="mt-12 grid gap-6 sm:grid-cols-2 max-w-[64rem] mx-auto">
                {[
                  {
                    title: "Chatbot Setup",
                    price: "$200",
                    desc: "Perfect for answering FAQs, capturing enquiries and automating basic responses using your business info.",
                    features: ["Knowledge base setup", "WhatsApp integration", "Approved content flow", "Standard support"]
                  },
                  {
                    title: "Connected Setup",
                    price: "$300-$400",
                    desc: "For businesses needing the agent to take actions—like booking slots or syncing orders to a dashboard.",
                    features: ["Everything in Chatbot", "Tool/API connection", "Custom workflow design", "Priority deployment"]
                  }
                ].map((card, i) => (
                  <div key={i} className="card card-hover reveal p-8 flex flex-col">
                    <p className="text-sm font-bold uppercase tracking-wider text-accent">{card.title}</p>
                    <h3 className="text-display mt-2">{card.price}</h3>
                    <p className="mt-3 text-mute leading-relaxed">{card.desc}</p>
                    <ul className="mt-6 space-y-3 flex-1">
                      {card.features.map((f) => (
                        <li key={f} className="flex items-center gap-3 text-sm text-paper">
                          <Check className="size-4 text-accent" /> {f}
                        </li>
                      ))}
                    </ul>
                    <Button className="mt-8" href={product.cta.href}>{card.title === "Chatbot Setup" ? "Start here" : "Discuss scope"}</Button>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-center text-sm text-mute max-w-[40ch] mx-auto">
                Note: Standard WhatsApp Business API costs (per conversation) are billed separately by Meta.
              </p>
            </div>
          </section>

          {/* Trust & Onboarding */}
          <section id="onboarding" className="on-cloud section" aria-labelledby="onboard-title">
            <div className="container-site">
              <div className="canvas-panel dot-grid grid gap-12 px-5 py-12 md:px-12 md:py-16 lg:grid-cols-2">
                <div className="reveal">
                  <SectionHeader eyebrow="Peace of mind" id="onboard-title" title="You are in control" />
                  <div className="mt-6 space-y-6 text-mute">
                    <p>Every AI agent starts with a strict &quot;Knowledge Base&quot;—a document of approved facts. The agent never guesses; it only answers from what you provide.</p>
                    <p>You can review every conversation in real-time and jump in whenever a human touch is required. The AI handles the volume; you handle the relationship.</p>
                  </div>
                </div>
                <div className="reveal space-y-6">
                  <p className="eyebrow"><span aria-hidden className="h-px w-6 bg-accent" />Done-for-you onboarding</p>
                  <OnboardingWheel />
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Detailed steps */}

      {/* Detailed steps */}
      <section id="in-detail" className="section" aria-labelledby="detail-title">
        <div className="container-site grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <SectionHeader eyebrow="In more detail" title={<span id="detail-title">{`What ${product.name} does, step by step`}</span>} lede={product.summary} />
          <ol className="relative space-y-4 border-l border-rule pl-8">
            {product.steps.map((s, i) => (
              <li key={s.title} className="reveal relative" data-od-id={`step-${i + 1}`}>
                <span aria-hidden className={cn("absolute -left-[2.6rem] top-1 grid size-5 place-items-center rounded-full border-2 border-ink bg-ink-2 ring-1 ring-rule-strong")}>
                  <span className={cn("size-2 rounded-full", ACCENT_BG[product.accent])} />
                </span>
                <h3 className="text-title">{s.title}</h3>
                <p className="mt-2 text-[0.9375rem] text-mute">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {extras}

      {/* FAQ */}
      <section id="faq" className="section" aria-labelledby="faq-title">
        <div className="container-site grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <SectionHeader
              eyebrow="FAQ"
              id="faq-title"
              title={product.name}
              muted="questions"
              lede={
                <span className="lg:hidden">
                  Something not covered? <ArrowLink href="/contact">Ask Hamza directly</ArrowLink>
                </span>
              }
            />
            <FaqAside className="max-lg:hidden" />
          </div>
          <FaqList faqs={product.faqs} className="reveal" />
        </div>
      </section>

      {/* Other products */}
      <section id="other-products" className="on-cloud section" aria-labelledby="others-title">
        <div className="container-site">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionHeader eyebrow="Also from valueble.ai" id="others-title" title="The other" muted="products" />
            <ArrowLink href="/pricing" className="reveal">
              Compare pricing for all four
            </ArrowLink>
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
      <section id="who-its-for" className="on-cloud section" aria-labelledby="who-title">
        <div className="container-site">
          <SectionHeader eyebrow="Who it is for" title={<span id="who-title">Built for businesses that cannot afford a missed call</span>} />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {who.map((w) => (
              <li key={w.name} className="card card-hover reveal p-6" data-od-id={`voice-audience-${w.name.split(" ")[0].toLowerCase()}`}>
                <h3 className="text-title">{w.name}</h3>
                <p className="mt-3 text-[0.9375rem] text-mute">{w.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="honest-note" className="section" aria-labelledby="honest-title" data-od-id="voice-honest-note">
        <div className="container-site grid items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
          <Photo src="/images/phone-call-clinic.webp" width={960} height={640} alt="A woman with glasses listening carefully on a phone call" className="reveal reveal-left" />
          <div className="reveal space-y-5 text-[1.0625rem]">
            <p className="eyebrow">
              <span aria-hidden className="h-px w-6 bg-accent" />A note from Hamza
            </p>
            <h2 id="honest-title" className="text-head">
              Not every call should go to an agent
            </h2>
            <p>
              The calls worth automating are the repetitive ones: bookings, orders, opening hours, prices, directions, and
              first-contact enquiries where the job is to capture details and get back to someone. Those are most of the
              volume, and they are exactly the calls that get missed.
            </p>
            <p>
              The calls that should go to a person are complaints, anything sensitive, anything expensive or unusual, and the
              caller who just wants to talk to someone. I will tell you which is which for your business before building
              anything, and the agent will transfer those calls instead of guessing.
            </p>
            <p className="flex items-center gap-2 font-medium text-paper">
              <PhoneForwarded aria-hidden className="size-5 text-voice" />
              Same human checkpoint as everything else I build.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

/** One real line from each product's own copy, set on the sticky note. */
const NOTE: Record<Product["slug"], string> = {
  "voice-agent": "Calls at 11pm, during the dinner rush, or while you're with a customer.",
  "lead-extractor": "Search once. Export a lead list your sales team can actually work from.",
  orderrise: "No app to download, no link to trust, no account to make.",
  "ai-agents": "The gap is never the model. It's everything around it.",
};

/** Soft colour wash behind each product hero, keyed to the product accent. */
const HERO_WASH: Record<Product["accent"], string> = {
  voice: "bg-[radial-gradient(50%_70%_at_85%_20%,oklch(0.85_0.08_250/0.55),transparent_70%),radial-gradient(40%_60%_at_10%_100%,oklch(0.89_0.17_95/0.5),transparent_70%)]",
  scan: "bg-[radial-gradient(50%_70%_at_85%_20%,oklch(0.86_0.1_172/0.55),transparent_70%),radial-gradient(40%_60%_at_10%_100%,oklch(0.89_0.17_95/0.5),transparent_70%)]",
  warm: "bg-[radial-gradient(50%_70%_at_85%_20%,oklch(0.82_0.12_45/0.45),transparent_70%),radial-gradient(40%_60%_at_10%_100%,oklch(0.89_0.17_95/0.55),transparent_70%)]",
  mind: "bg-[radial-gradient(50%_70%_at_85%_20%,oklch(0.82_0.1_300/0.45),transparent_70%),radial-gradient(40%_60%_at_10%_100%,oklch(0.89_0.17_95/0.5),transparent_70%)]",
};
