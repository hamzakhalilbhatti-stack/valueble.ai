import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MorphTitle, PageTransition } from "@/components/page-transition";
import { ProductVisual } from "@/components/product-visual";
import { Reveal, RevealLines } from "@/components/reveal";
import { Action, Container, Eyebrow, Section } from "@/components/ui";
import { contact, getProduct, productCta, products } from "@/lib/site";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata(
  props: PageProps<"/products/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = getProduct(slug);

  if (!product) return {};

  return {
    title: `${product.name} — ${product.kind}`,
    description: product.summary,
    openGraph: {
      title: `${product.name} — ${product.kind}`,
      description: product.summary,
      url: `/products/${product.slug}`,
    },
  };
}

export default async function ProductPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const product = getProduct(slug);

  if (!product) notFound();

  const position = products.findIndex((entry) => entry.slug === product.slug);
  const next = products[(position + 1) % products.length];

  return (
    <PageTransition>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-28">
        <Container>
          <Reveal>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Eyebrow index={product.index}>{product.kind}</Eyebrow>
              <span className="label border border-rule-strong px-3 py-1.5 text-amber">
                {product.status}
              </span>
            </div>
          </Reveal>

          {/* Morph pair: arrives from the home index row, so it must not also
              run a scroll reveal — it is already on screen when the page opens. */}
          <MorphTitle name={`product-${product.slug}`}>
            <h1 className="font-display text-display mt-8 leading-none">{product.name}</h1>
          </MorphTitle>

          <div className="mt-16 grid gap-12 lg:grid-cols-12">
            <Reveal delay={160} className="lg:col-span-7">
              <p className="font-display text-title text-balance">{product.hero.headline}</p>
              <p className="text-lead mt-8 max-w-xl text-bone-soft">{product.hero.sub}</p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Action href={productCta[product.slug].href}>{productCta[product.slug].label}</Action>
                <Action href="/contact" variant="outline">
                  Ask a question
                </Action>
              </div>
            </Reveal>

            {/* Facts plate — reads as designed rather than as a missing image. */}
            <Reveal delay={240} className="lg:col-span-4 lg:col-start-9">
              <dl className="border-t border-bone">
                {product.facts.map((fact) => (
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

      {/* ── Diagram ──────────────────────────────────────────── */}
      <Container>
        <Reveal>
          <ProductVisual slug={product.slug} />
        </Reveal>
      </Container>

      {/* ── The problem ──────────────────────────────────────── */}
      <Section tone="surface" className="mt-24 md:mt-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-3">
              <Eyebrow index="01">The problem</Eyebrow>
            </Reveal>
            <div className="lg:col-span-8 lg:col-start-5">
              <RevealLines
                as="h2"
                lines={[product.problem.heading]}
                className="font-display text-title text-balance"
              />
              <Reveal delay={180} className="text-lead mt-8 max-w-2xl space-y-6 text-bone-soft">
                {product.problem.body.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── How it works ─────────────────────────────────────── */}
      <Section>
        <Container>
          <Reveal>
            <Eyebrow index="02">How it works</Eyebrow>
          </Reveal>

          <div className="mt-16 border-t border-rule">
            {product.steps.map((step, index) => (
              <Reveal key={step.title} delay={index * 80}>
                <div className="grid gap-4 border-b border-rule py-10 md:grid-cols-12 md:gap-8">
                  <span className="label text-amber md:col-span-1">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-2xl leading-tight md:col-span-4 md:text-3xl">
                    {step.title}
                  </h3>
                  <p className="max-w-2xl text-bone-soft md:col-span-7">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── What it does ─────────────────────────────────────── */}
      <Section tone="surface">
        <Container>
          <Reveal>
            <Eyebrow index="03">What it does</Eyebrow>
          </Reveal>

          <div className="mt-16 grid gap-px border border-rule-strong bg-rule-strong sm:grid-cols-2">
            {product.features.map((feature, index) => (
              <Reveal key={feature.title} delay={index * 70} className="bg-surface">
                <div className="h-full p-8 md:p-10">
                  <h3 className="font-display text-2xl leading-tight">{feature.title}</h3>
                  <p className="mt-4 text-bone-soft">{feature.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Product CTA ──────────────────────────────────────── */}
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <RevealLines
                as="h2"
                lines={[product.cta.heading]}
                className="font-display text-headline text-balance"
              />
              <Reveal delay={180}>
                <p className="text-lead mt-8 max-w-xl text-bone-soft">{product.cta.body}</p>
                <div className="mt-10 flex flex-wrap gap-3">
                  <Action href={productCta[product.slug].href}>{productCta[product.slug].label}</Action>
                  <Action href={contact.bookingGeneral} variant="outline">
                    Ask something first
                  </Action>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Next product ─────────────────────────────────────── */}
      <Container>
        <Reveal>
          <Link
            href={`/products/${next.slug}`}
            transitionTypes={["nav-forward"]}
            className="group flex items-baseline justify-between gap-6 border-t border-rule py-12 md:py-16"
          >
            <div>
              <p className="label text-bone-faint">Next</p>
              <p className="font-display text-headline mt-3 leading-none transition-colors duration-500 group-hover:text-amber">
                {next.name}
              </p>
            </div>
            <span
              aria-hidden
              className="text-3xl text-bone-faint transition-all duration-500 ease-[var(--ease-editorial)] group-hover:translate-x-2 group-hover:text-amber"
            >
              &rarr;
            </span>
          </Link>
        </Reveal>
      </Container>
    </PageTransition>
  );
}
