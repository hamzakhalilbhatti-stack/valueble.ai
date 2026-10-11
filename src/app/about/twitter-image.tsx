import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const dynamic = "force-static";
export const alt = "valueble.ai — One person, and you talk to him.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    eyebrow: "About the founder",
    title: "One person, and you talk to him.",
    meta: "Hamza Khalil Bhatti · Founder & AI Systems Engineer",
    accent: "#5fe8c8",
  });
}
