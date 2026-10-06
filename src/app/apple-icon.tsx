import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#07080d",
        }}
      >
        <svg width="104" height="98" viewBox="0 0 102 96">
          <path d="M6 12H18L44 66L74 4H96L46 92L6 12Z" fill="#5fe8c8" />
        </svg>
      </div>
    ),
    size,
  );
}
