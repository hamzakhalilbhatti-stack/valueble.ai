import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const dynamic = "force-static";
export const alt = "valueble.ai — Find the customers. Answer them instantly.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    eyebrow: "valueble.ai · AI agents, WhatsApp ordering, lead tools",
    title: "Find the customers. Answer them instantly.",
    meta: "AI systems that do the work your team runs out of hours for.",
    accent: "#5fe8c8",
  });
}
