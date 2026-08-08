import { ImageResponse } from "next/og";
export const dynamic = "force-static";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const cell = { width: 20, height: 20, background: "#ffffff" } as const;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#000000",
          color: "#ffffff",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 34 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              width: 46,
              gap: 6,
            }}
          >
            <div style={cell} />
            <div style={cell} />
            <div style={cell} />
            <div style={{ ...cell, opacity: 0.32 }} />
          </div>
          {site.name}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 66,
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
            maxWidth: 900,
          }}
        >
          AI that does the work you ran out of hours for
        </div>

        <div style={{ display: "flex", fontSize: 26, color: "#a1a1a6" }}>
          Lead extraction · WhatsApp ordering agents · Custom AI automation
        </div>
      </div>
    ),
    size,
  );
}
