import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge, Breadcrumbs } from "@/components/ui";
import { JsonLd, breadcrumbLd } from "@/components/json-ld";
import { posts } from "@/content/blog";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "Blog | AI Agents, WhatsApp Ordering and Lead Generation",
  description:
    "Practical guides from valueble.ai on WhatsApp ordering for restaurants, Google Maps lead generation and AI voice agents for small business.",
  path: "/blog",
});

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Blog", href: "/blog" },
];

const fmt = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default function BlogIndex() {
  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <section id="overview" className="relative isolate pb-12 pt-10 md:pb-16 md:pt-14">
        <div className="atmosphere" />
        <div className="container-site">
          <Breadcrumbs items={crumbs} />
          <div className="max-w-3xl">
            <h1 className="text-display md:text-[clamp(2.5rem,5vw,4rem)]">
              <span className="eyebrow mb-4 flex font-sans">The valueble.ai blog</span>
              Notes on AI agents, WhatsApp ordering and lead generation
            </h1>
          </div>
        </div>
      </section>

      <section id="posts" aria-label="Articles" className="pb-24">
        <div className="container-site">
          <ul className="grid gap-4 md:grid-cols-3">
            {posts.map((p) => (
              <li key={p.slug} className="reveal">
                <article className="card card-link group flex h-full flex-col p-6" data-od-id={`post-card-${p.slug}`}>
                  <div className="flex items-center gap-2">
                    <time dateTime={p.date} className="text-sm text-faint">
                      {fmt(p.date)}
                    </time>
                    {p.draft && <Badge>Outline</Badge>}
                  </div>
                  <h2 className="mt-4 text-title">
                    <Link href={`/blog/${p.slug}`} className="after:absolute after:inset-0">
                      {p.title}
                    </Link>
                  </h2>
                  <p className="mt-3 flex-1 text-[0.9375rem] text-mute">{p.description}</p>
                  <span className="mt-6 inline-flex items-center gap-1 text-sm text-paper">
                    Read the outline <ArrowUpRight aria-hidden className="size-4" />
                  </span>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
