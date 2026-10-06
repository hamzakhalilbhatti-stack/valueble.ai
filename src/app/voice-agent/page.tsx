import { ProductPage, VoiceExtras } from "@/components/product-page";
import { pageMeta } from "@/lib/meta";
import { getProduct } from "@/lib/site";

const product = getProduct("voice-agent")!;

export const metadata = pageMeta({
  title: product.seo.title,
  description: product.seo.description,
  path: product.path,
});

export default function Page() {
  return <ProductPage product={product} extras={<VoiceExtras />} />;
}
