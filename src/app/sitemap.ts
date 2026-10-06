import type { MetadataRoute } from "next";
import { posts } from "@/content/blog";
import { products, site } from "@/lib/site";

export const dynamic = "force-static";

/**
 * lastmod is the build date for evergreen pages and the post's own date for
 * articles. TODO (owner): set real per-page dates if pages change on
 * different schedules.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, freq: "weekly" | "monthly" | "yearly") => ({
    url: path === "/" ? site.url : `${site.url}${path}`,
    lastModified: now,
    changeFrequency: freq,
    priority,
  });

  return [
    page("/", 1, "weekly"),
    ...products.map((p) => page(p.path, 0.9, "monthly")),
    page("/pricing", 0.8, "monthly"),
    page("/about", 0.6, "yearly"),
    page("/contact", 0.7, "yearly"),
    page("/blog", 0.6, "weekly"),
    ...posts.map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: new Date(post.updated ?? post.date),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
