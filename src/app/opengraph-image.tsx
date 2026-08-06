import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f7f4ef",
          color: "#17140f",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 24,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#8d8578",
          }}
        >
          <div style={{ width: 48, height: 2, background: "#c2551f" }} />
          AI agents &amp; growth tools
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 96,
            lineHeight: 1,
            letterSpacing: "-0.035em",
            maxWidth: 940,
          }}
        >
          Software that does the work nobody has time for.
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            borderTop: "1px solid #e2dbd0",
            paddingTop: 32,
            fontSize: 34,
            letterSpacing: "-0.02em",
          }}
        >
          <div style={{ display: "flex" }}>
            valueble<span style={{ color: "#c2551f" }}>.ai</span>
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#5f584e" }}>
            {site.founder}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
