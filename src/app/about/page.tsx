import type { Metadata } from "next";
import { SceneBackdrop, SceneBreak } from "@/components/scene-backdrop";
import { Body, BoxButton, Head, Section } from "@/components/ui";
import { products, site, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.founder} builds AI agents and growth tools for businesses and agencies.`,
};

export default function AboutPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden pb-24 pt-40 md:pb-36 md:pt-56">
        <SceneBackdrop density={4} seed={3307} />
        <div className="rail">
          <p className="eyebrow reveal">About</p>
          <div className="measure">
            <h1 className="reveal text-hero max-w-[15ch] text-balance text-paper">
              One person, three systems, no agency overhead
            </h1>
            <p className="reveal mt-8 max-w-[52ch] text-sub text-mute">
              {site.founder} — {site.founderRole}
            </p>
          </div>
        </div>
      </section>

      <Section label="What I do">
        <Head>I build the thing, and then I keep it running</Head>
        <div className="mt-8 space-y-6">
          <Body>
            valueble.ai is not a team you get assigned to. You talk to me, I scope the work, I
            build it, and I am the person you contact when reality does something new. That is
            a hard limit on how much I can take on, and it is the reason the work holds.
          </Body>
          <Body>
            Everything on this site came out of a real business problem rather than a product
            roadmap. The Maps Lead Scraper exists because prospecting by hand was eating
            weekends. OrderRise exists because restaurants were losing paid orders to an
            unanswered phone during the dinner rush.
          </Body>
        </div>
      </Section>

      <Section label="What I have built">
        <ul>
          {products.map((product) => (
            <li key={product.slug} className="hairline reveal py-8">
              <div className="flex gap-5">
                <span className="text-fine text-faint">{product.index}</span>
                <div>
                  <h3 className="text-sub text-paper">{product.name}</h3>
                  <p className="mt-1 text-fine text-faint">
                    {product.kind} · {product.status}
                  </p>
                  <p className="mt-4 max-w-[56ch] text-mute">{product.summary}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <SceneBreak seed={3862} />

      <Section label="How I work">
        <Head>Honest scope beats an impressive demo</Head>
        <div className="mt-8 space-y-6">
          <Body>
            The first thing I do on any project is tell you which parts are not worth
            automating. A system that handles eighty percent of a process reliably is worth
            more than one that claims a hundred and quietly fails on the cases that matter.
          </Body>
          <Body>
            You own what gets built and the data that runs through it. No platform commission,
            no per-seat licence on your own workflow, and nothing that stops working if you
            stop paying me.
          </Body>
        </div>
      </Section>

      <Section label="Get started">
        <Head>Tell me what the twenty hours go on</Head>
        <Body className="mt-8">
          The fastest way to find out whether I can help is to describe the task. If it is not
          a fit, I will say so.
        </Body>
        <div className="reveal mt-10">
          <BoxButton href={whatsappUrl}>Message me on WhatsApp</BoxButton>
        </div>
      </Section>
    </>
  );
}
