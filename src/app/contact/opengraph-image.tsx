import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const dynamic = "force-static";
export const alt = "valueble.ai — Describe the job. I will tell you if I can take it.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    eyebrow: "Contact",
    title: "Describe the job. I will tell you if I can take it.",
    meta: "WhatsApp · LinkedIn · Email",
    accent: "#5fe8c8",
  });
}
