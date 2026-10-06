import type { Metadata } from "next";
import { site } from "@/lib/site";

/**
 * Per-page metadata in one shape: absolute title (<=60 chars), description
 * (<=155 chars), canonical, Open Graph, Twitter summary_large_image and
 * robots index/follow. OG/Twitter images come from each route's
 * opengraph-image.tsx / twitter-image.tsx file convention.
 */
export function pageMeta({
  title,
  description,
  path,
  type = "website",
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  noindex?: boolean;
}): Metadata {
  const url = path === "/" ? site.url : `${site.url}${path}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url,
      siteName: site.name,
      locale: "en_US",
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
  };
}
