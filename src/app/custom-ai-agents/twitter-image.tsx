import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const dynamic = "force-static";
export const alt = "valueble.ai — The repetitive part of your operation, handed to something that does not get tired.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    eyebrow: "Custom AI agents · business automation",
    title: "The repetitive part of your operation, handed to something that does not get tired.",
    meta: "Project-based · starts with a 20-minute call",
    accent: "#a99cff",
  });
}
