import { AgentDemo } from "@/components/product/agent-demo";
import { OrderRiseDemo } from "@/components/product/orderrise-demo";
import { ScraperDemo } from "@/components/product/scraper-demo";
import { VoiceDemo } from "@/components/product/voice-demo";
import type { ProductSlug } from "@/lib/site";

/** Maps a product to its HTML/CSS interface demonstration. */
export function ProductDemo({ slug }: { slug: ProductSlug }) {
  if (slug === "lead-extractor") return <ScraperDemo />;
  if (slug === "orderrise") return <OrderRiseDemo />;
  if (slug === "voice-agent") return <VoiceDemo />;
  return <AgentDemo className="mx-auto max-w-3xl" />;
}
