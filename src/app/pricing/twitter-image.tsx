import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const dynamic = "force-static";
export const alt = "valueble.ai — Four products. Plain prices.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    eyebrow: "Pricing",
    title: "Four products. Plain prices.",
    meta: "$200 scraper · OrderRise setup from $200 · custom voice · project-based",
    accent: "#5fe8c8",
  });
}
