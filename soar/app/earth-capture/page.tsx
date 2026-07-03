"use client";

import dynamic from "next/dynamic";

// Offline render surface for the Earth hero video (drive it with ?capture=1 and
// window.__CAP_T). Not linked from anywhere; it exists so the scene can be
// captured to an MP4 without the site chrome.
const EarthScene = dynamic(() => import("../components/earth/EarthScene").then((m) => m.EarthScene), { ssr: false });

export default function EarthCapture() {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#050507" }}>
      <EarthScene />
    </div>
  );
}
