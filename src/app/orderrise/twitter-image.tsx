import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const dynamic = "force-static";
export const alt = "valueble.ai — A restaurant's WhatsApp, answered instantly. Even at 11pm on a Friday.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    eyebrow: "WhatsApp ordering bot for restaurants",
    title: "A restaurant's WhatsApp, answered instantly. Even at 11pm on a Friday.",
    meta: "OrderRise · $50 / month per restaurant",
    accent: "#ffb35c",
  });
}
