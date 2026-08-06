import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Body, BoxButton, Head, Section } from "@/components/ui";
import { getProduct, productCta, products } from "@/lib/site";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.summary,
    openGraph: { title: product.name, description: product.summary },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const cta = productCta[product.slug];
  const others = products.filter((p) => p.slug !== product.slug);

  return (
    <>
      {/*
        Product heroes are typographic, not scenic. The block field belongs to
        the brand as a whole; repeating it on every product page would make
        three different things look like the same thing.
      */}
      <section className="pb-20 pt-40 md:pb-28 md:pt-56">
        <div className="rail">
          <p className="eyebrow reveal">
            {product.index} · {product.kind}
          </p>
          <div className="measure">
            <h1 className="reveal text-hero max-w-[16ch] text-balance text-paper">
              {product.hero.headline}
            </h1>
            <p className="reveal mt-8 max-w-[52ch] text-sub text-mute">{product.hero.sub}</p>
            <div className="reveal mt-10">
              <BoxButton href={cta.href}>{cta.label}</BoxButton>
            </div>
          </div>
        </div>
      </section>

      {/* Spec table. Facts only — the things a buyer checks before reading prose. */}
      <Section label="At a glance">
        <dl className="grid gap-x-10 sm:grid-cols-2">
          {product.facts.map((fact) => (
            <div key={fact.label} className="hairline reveal flex justify-between gap-6 py-4">
              <dt className="text-faint">{fact.label}</dt>
              <dd className="text-right text-paper">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section label="The problem">
        <Head>{product.problem.heading}</Head>
        <div className="mt-8 space-y-6">
          {product.problem.body.map((paragraph) => (
            <Body key={paragraph.slice(0, 40)}>{paragraph}</Body>
          ))}
        </div>
      </Section>

      <Section label="How it works">
        <Head>{product.tagline}</Head>
        <ol className="mt-14 space-y-0">
          {product.steps.map((step, i) => (
            <li key={step.title} className="hairline reveal py-8">
              <div className="flex gap-5">
                <span className="text-fine text-faint">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-sub text-paper">{step.title}</h3>
                  <p className="mt-3 max-w-[56ch] text-mute">{step.body}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section label="What you get">
        <Head>Everything it does</Head>
        <div className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {product.features.map((feature) => (
            <div key={feature.title} className="reveal">
              <h3 className="text-paper">{feature.title}</h3>
              <p className="mt-3 text-mute">{feature.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section label="Get started">
        <Head>{product.cta.heading}</Head>
        <Body className="mt-8">{product.cta.body}</Body>
        <div className="reveal mt-10">
          <BoxButton href={cta.href}>{cta.label}</BoxButton>
        </div>
      </Section>

      <Section label="Also">
        <ul>
          {others.map((other) => (
            <li key={other.slug} className="hairline reveal">
              <Link
                href={`/products/${other.slug}`}
                className="group flex items-baseline gap-5 py-8 transition-opacity duration-300 hover:opacity-65"
              >
                <span className="text-fine text-faint">{other.index}</span>
                <div>
                  <h3 className="flex items-center gap-3 text-sub text-paper">
                    {other.name}
                    <ArrowUpRight className="size-3 opacity-40 transition-transform duration-300 ease-[var(--ease-out)] group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </h3>
                  <p className="mt-2 max-w-[52ch] text-mute">{other.tagline}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
