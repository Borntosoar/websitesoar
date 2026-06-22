import { ImageResponse } from "next/og";

export const alt = "SOAR — Growth begins where comfort ends. Drop 001.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded share card — generated at build/request time (no external assets).
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
          background: "#0b0a09",
          color: "#f4f3ef",
          padding: 64,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 6, color: "rgba(244,243,239,0.6)", fontFamily: "sans-serif" }}>
          <span>SOAR</span>
          <span>EST. ALBERTA · CANADA</span>
        </div>

        <div style={{ display: "flex", maxWidth: 960, fontSize: 96, lineHeight: 1.02, letterSpacing: -2 }}>
          Growth begins where comfort ends.
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 22, letterSpacing: 6, color: "rgba(244,243,239,0.7)", fontFamily: "sans-serif" }}>
          <span>DROP 001 — COLLECTION ONE</span>
          <span>200 MADE</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
