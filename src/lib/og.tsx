import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/**
 * Branded 1200×630 share image, rendered at build time per route via the
 * opengraph-image / twitter-image file conventions.
 */
export function renderOg({
  eyebrow,
  title,
  meta,
  accent = "#5fe8c8",
}: {
  eyebrow: string;
  title: string;
  meta?: string;
  accent?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "radial-gradient(60% 70% at 85% 10%, rgba(95,232,200,0.22), transparent 70%), radial-gradient(50% 60% at 0% 0%, rgba(124,200,255,0.16), transparent 70%), #07080d",
          color: "#f3f4f8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#f3f4f8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="30" height="28" viewBox="0 0 102 96">
              <path d="M6 12H18L44 66L74 4H96L46 92L6 12Z" fill="#07080d" />
            </svg>
          </div>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 700, letterSpacing: -1 }}>
            valueble<span style={{ color: "#5fe8c8" }}>.</span>ai
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: accent,
              marginBottom: 22,
            }}
          >
            {eyebrow}
          </div>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 700, lineHeight: 1.04, letterSpacing: -2.5, maxWidth: 980 }}>
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #2b3044",
            paddingTop: 26,
            fontSize: 24,
            color: "#a9aebd",
          }}
        >
          <div style={{ display: "flex" }}>{meta ?? "AI systems built by Hamza Khalil Bhatti"}</div>
          <div style={{ display: "flex", color: "#f3f4f8" }}>valuebleai.com</div>
        </div>
      </div>
    ),
    ogSize,
  );
}
