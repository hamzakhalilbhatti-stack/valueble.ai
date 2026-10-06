import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Breadcrumbs, SectionHeader } from "@/components/ui";
import { ACCENT_TEXT, CtaBand, PRODUCT_ICON } from "@/components/product-blocks";
import { AppTile, StickyNote } from "@/components/polish";
import { JsonLd, breadcrumbLd } from "@/components/json-ld";
import { pageMeta } from "@/lib/meta";
import { getProduct, productOrder, site, whatsappUrl } from "@/lib/site";

export const metadata = pageMeta({
  title: "About Hamza Khalil Bhatti | Founder of valueble.ai",
  description:
    "valueble.ai is one person: Hamza Khalil Bhatti. He scopes, builds and supports every AI agent and tool himself, with no account manager in between.",
  path: "/about",
});

const crumbs = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />

      <section id="overview" className="relative isolate pb-16 pt-10 md:pb-24 md:pt-14" data-od-id="about-hero">
        <div className="atmosphere" />
        <div className="container-site">
          <Breadcrumbs items={crumbs} />
          <div className="max-w-4xl">
            <h1 className="text-display md:text-[clamp(2.5rem,5vw,4rem)]">
              <span className="eyebrow mb-4 flex font-sans">About valueble.ai</span>
              One person, three systems, no agency overhead
            </h1>
            <p className="mt-6 text-sub text-mute">
              {site.founder} — {site.founderRole}
            </p>
          </div>
        </div>
      </section>

      <section id="what-i-do" className="section pt-0 md:pt-0" aria-labelledby="do-title">
        <div className="container-site">
         <div className="canvas-panel dot-grid grid gap-10 px-5 py-12 md:px-12 md:py-16 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionHeader eyebrow="What I do" id="do-title" title="I build the thing," muted="and then I keep it running" />
            <div className="frag reveal mt-8 flex max-w-sm items-center gap-4 p-5">
              <AppTile size="lg" dark>
                <span className="font-display text-lg font-semibold">HK</span>
              </AppTile>
              <div>
                <p className="font-medium text-paper">{site.founder}</p>
                <p className="text-sm text-mute">{site.founderRole}</p>
              </div>
            </div>
          </div>
          <div className="reveal space-y-5 text-[1.0625rem] lg:pt-10">
            <p>
              valueble.ai is not a team you get assigned to. You talk to me, I scope the work, I build it,
              and I am the person you contact when reality does something new. That is a hard limit on how
              much I can take on, and it is the reason the work holds.
            </p>
            <p>
              Everything on this site came out of a real business problem rather than a product roadmap.
              The Maps Lead Scraper exists because prospecting by hand was eating weekends. OrderRise exists
              because restaurants were losing paid orders to an unanswered phone during the dinner rush.
            </p>
          </div>
         </div>
        </div>
      </section>

      <section id="what-i-have-built" className="section border-t border-rule" aria-labelledby="built-title">
        <div className="container-site">
          <SectionHeader eyebrow="What I have built" id="built-title" title="The products" muted="I build and support" />
          <ul className="mt-10 grid gap-3">
            {productOrder.map((slug) => {
              const p = getProduct(slug)!;
              return (
                <li key={slug} className="reveal">
                  <Link href={p.path} className="frag group grid items-center gap-4 p-5 transition-[transform,box-shadow] duration-300 ease-[var(--ease-spring)] hover:-translate-y-1 md:grid-cols-[auto_14rem_1fr_auto] md:gap-8 md:p-6">
                    <AppTile size="md" className={ACCENT_TEXT[p.accent]}>
                      <ProductGlyph slug={slug} />
                    </AppTile>
                    <span>
                      <span className="block font-display text-title font-semibold text-paper">{p.name}</span>
                      <span className="mt-1 block text-sm text-faint">
                        {p.kind} · {p.status}
                      </span>
                    </span>
                    <span className="max-w-[62ch] text-mute">{p.summary}</span>
                    <span aria-hidden className="hidden size-10 place-items-center rounded-full border border-rule-strong text-paper transition-[background-color,color,transform] duration-300 group-hover:rotate-45 group-hover:bg-paper group-hover:text-ink md:grid">
                      <ArrowUpRight className="size-4" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section id="how-i-work" className="on-cloud section" aria-labelledby="work-title">
        <div className="container-site grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="reveal">
            <p className="eyebrow mb-4"><span aria-hidden className="h-px w-6 bg-accent" />How I work</p>
            <h2 id="work-title" className="text-head">Honest scope beats<span className="head-muted"> an impressive demo</span></h2>
            <StickyNote className="mt-10 hidden w-60 rotate-[-3deg] lg:block">
              Eighty percent, reliably, beats a hundred that quietly fails.
            </StickyNote>
          </div>
          <div className="reveal space-y-5 text-[1.0625rem]">
            <p>
              The first thing I do on any project is tell you which parts are not worth automating. A
              system that handles eighty percent of a process reliably is worth more than one that claims a
              hundred and quietly fails on the cases that matter.
            </p>
            <p>
              You own what gets built and the data that runs through it. No platform commission, no
              per-seat licence on your own workflow, and nothing that stops working if you stop paying me.
            </p>
          </div>
        </div>
      </section>

      <CtaBand
        heading="Tell me what the twenty hours go on"
        body="The fastest way to find out whether I can help is to describe the task. If it is not a fit, I will say so."
        primary={{ href: whatsappUrl, label: "Message me on WhatsApp" }}
        secondary={{ href: "/contact", label: "Other ways to reach me" }}
      />
    </>
  );
}

function ProductGlyph({ slug }: { slug: keyof typeof PRODUCT_ICON }) {
  const Icon = PRODUCT_ICON[slug];
  return <Icon className="size-5" />;
}
