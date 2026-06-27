import { ImageResponse } from "next/og";

export const alt = "SOAR — Born to soar. Collection One, Drop 001.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded share card — procedural backdrop (north-star glow over near-black),
// generated at build/request time. No external assets.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ position: "relative", display: "flex", width: "100%", height: "100%", background: "#0b0a09", overflow: "hidden" }}>
        {/* north-star glow */}
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 150,
            width: 480,
            height: 480,
            borderRadius: 9999,
            backgroundImage: "radial-gradient(circle, rgba(228,232,255,0.5), rgba(228,232,255,0.08) 42%, transparent 70%)",
            display: "flex",
          }}
        />
        {/* star core */}
        <div style={{ position: "absolute", top: 240, right: 366, width: 22, height: 22, borderRadius: 9999, background: "#ffffff", display: "flex" }} />
        {/* legibility */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(to bottom, rgba(11,10,9,0.05), rgba(11,10,9,0.8))", display: "flex" }} />

        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: 64, color: "#f4f3ef" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 6, color: "rgba(244,243,239,0.6)", fontFamily: "sans-serif" }}>
            <span>SOAR</span>
            <span>EST. ALBERTA · CANADA</span>
          </div>
          <div style={{ display: "flex", maxWidth: 960, fontSize: 134, lineHeight: 1.0, letterSpacing: -3, fontFamily: "Georgia, serif" }}>Born to soar.</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 22, letterSpacing: 6, color: "rgba(244,243,239,0.7)", fontFamily: "sans-serif" }}>
            <span>DROP 001 — COLLECTION ONE</span>
            <span>200 MADE</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
