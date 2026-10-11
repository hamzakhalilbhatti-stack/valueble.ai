import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const dynamic = "force-static";
export const alt = "valueble.ai — An AI voice agent that answers every call.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    eyebrow: "AI voice agent for business",
    title: "An AI voice agent that answers every call.",
    meta: "Custom pricing, scoped to your call volume",
    accent: "#7cc8ff",
  });
}
