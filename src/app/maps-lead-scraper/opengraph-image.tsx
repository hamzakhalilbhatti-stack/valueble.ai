import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const dynamic = "force-static";
export const alt = "valueble.ai — Turn any Google Maps search into a scored, contactable lead list.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    eyebrow: "Google Maps lead scraper · Chrome extension",
    title: "Turn any Google Maps search into a scored, contactable lead list.",
    meta: "$200 one-time · CSV export · email enrichment",
    accent: "#5fe8c8",
  });
}
