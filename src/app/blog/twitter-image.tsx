import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const dynamic = "force-static";
export const alt = "valueble.ai — Notes on AI agents, WhatsApp ordering and lead generation.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    eyebrow: "Blog",
    title: "Notes on AI agents, WhatsApp ordering and lead generation.",
    meta: "Practical guides from valueble.ai",
    accent: "#5fe8c8",
  });
}
