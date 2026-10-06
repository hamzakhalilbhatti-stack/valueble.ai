import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Breadcrumbs } from "@/components/ui";
import { CtaBand } from "@/components/product-blocks";
import { JsonLd, breadcrumbLd } from "@/components/json-ld";
import { getPost, posts } from "@/content/blog";
import { pageMeta } from "@/lib/meta";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return pageMeta({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    type: "article",
  });
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: post.title, href: `/blog/${post.slug}` },
  ];

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: { "@id": `${site.url}/#founder` },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  };

  return (
    <>
      <JsonLd data={[articleLd, breadcrumbLd(crumbs)]} />
      <article className="relative isolate pb-16 pt-10 md:pt-14">
        <div className="atmosphere" />
        <div className="container-site">
          <Breadcrumbs items={crumbs} />
          <header className="max-w-3xl">
            <div className="flex items-center gap-3">
              <time dateTime={post.date} className="text-sm text-faint">
                {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </time>
              {post.draft && <Badge>Outline · full article coming</Badge>}
            </div>
            <h1 className="mt-5 text-display">{post.title}</h1>
            <p className="mt-6 text-sub text-mute">{post.intro}</p>
            <p className="mt-4 text-sm text-faint">By {site.founder}</p>
          </header>

          <div className="prose-post mt-6 max-w-3xl text-[1.0625rem]">
            {post.sections.map((s) => (
              <section key={s.heading}>
                <h2>{s.heading}</h2>
                {s.paragraphs?.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
                {!s.paragraphs?.length && !s.bullets?.length && (
                  <p className="text-faint">This section is still being written.</p>
                )}
                {s.bullets && (
                  <ul>
                    {s.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
            <p className="mt-12 border-t border-rule pt-6">
              Related: <Link href={post.related.href} className="text-paper underline underline-offset-4 hover:text-accent-strong">{post.related.label}</Link>
              {" · "}
              <Link href="/blog" className="text-paper underline underline-offset-4 hover:text-accent-strong">All articles</Link>
            </p>
          </div>
        </div>
      </article>
      <CtaBand
        heading="Bring the process, not the spec"
        body="You do not need to know how it should be built. You need to know which twenty hours a month you want back."
      />
    </>
  );
}
