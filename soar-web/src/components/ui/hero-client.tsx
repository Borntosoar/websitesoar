"use client";

import dynamic from "next/dynamic";

// Client-only wrapper so the WebGL hero never renders on the server.
const HeroBreakthrough = dynamic(
  () => import("@/components/ui/hero-breakthrough"),
  { ssr: false },
);

export function HeroClient() {
  return <HeroBreakthrough />;
}
