import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** The 2×2 mark from the wordmark, at favicon size. */
export default function Icon() {
  const cell = {
    width: 12,
    height: 12,
    background: "#ffffff",
  } as const;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexWrap: "wrap",
          alignContent: "center",
          justifyContent: "center",
          gap: 4,
          background: "#000000",
        }}
      >
        <div style={cell} />
        <div style={cell} />
        <div style={cell} />
        <div style={{ ...cell, opacity: 0.32 }} />
      </div>
    ),
    size,
  );
}
