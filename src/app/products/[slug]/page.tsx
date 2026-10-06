import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, products } from "@/lib/site";

/**
 * Legacy URLs (/products/lead-extractor, /products/orderrise,
 * /products/ai-agents) keep working. The site is a static export, so there is
 * no server to send a 301: each legacy page canonicalises to the new route,
 * is noindexed, and forwards with a meta refresh (React hoists the <meta> into
 * <head>). TODO (owner): if you move to a host with redirects (Vercel,
 * Netlify, Cloudflare), add real 301s for these three paths.
 */
const LEGACY = ["lead-extractor", "orderrise", "ai-agents"] as const;

export function generateStaticParams() {
  return products.filter((p) => (LEGACY as readonly string[]).includes(p.slug)).map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: { absolute: product.seo.title },
    alternates: { canonical: product.path },
    robots: { index: false, follow: true },
  };
}

export default async function LegacyProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <section className="container-site py-32 text-center">
      <meta httpEquiv="refresh" content={`0;url=${product.path}`} />
      <h1 className="text-head">{product.name} has moved</h1>
      <p className="mt-4 text-mute">
        This page now lives at{" "}
        <Link href={product.path} className="text-paper underline underline-offset-4">
          {product.path}
        </Link>
        .
      </p>
    </section>
  );
}
