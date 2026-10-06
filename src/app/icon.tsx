import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 7,
        }}
      >
        <svg width="20" height="19" viewBox="0 0 102 96">
          <path d="M6 12H18L44 66L74 4H96L46 92L6 12Z" fill="#5fe8c8" />
        </svg>
      </div>
    ),
    size,
  );
}
