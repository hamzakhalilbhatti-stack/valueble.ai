import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const size = {
  width: 32,
  height: 32,
};

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
          background: "#F0EEE8",
        }}
      >
        <svg
          width="22"
          height="26"
          viewBox="0 0 102 96"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 12H18L44 66L74 4H96L46 92L6 12Z"
            fill="#0B0D0C"
          />
        </svg>
      </div>
    ),
    size
  );
}
