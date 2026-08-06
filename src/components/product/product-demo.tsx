import { AgentDemo } from "@/components/product/agent-demo";
import { OrderRiseDemo } from "@/components/product/orderrise-demo";
import { ScraperDemo } from "@/components/product/scraper-demo";
import type { ProductSlug } from "@/lib/site";

/**
 * Maps a product to its demonstration.
 *
 * Kept in one place so the product page stays a single template — adding a
 * fourth product means adding a row here, not branching the page.
 */
export function ProductDemo({ slug }: { slug: ProductSlug }) {
  if (slug === "lead-extractor") return <ScraperDemo />;
  if (slug === "orderrise") return <OrderRiseDemo />;
  return <AgentDemo className="max-w-3xl" />;
}
