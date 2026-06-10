import dynamic from "next/dynamic";

// WebGL/Three can't render on the server — load the hero client-only.
const HeroBreakthrough = dynamic(
  () => import("@/components/ui/hero-breakthrough"),
  { ssr: false },
);

export default function Page() {
  return (
    <main>
      <HeroBreakthrough />
    </main>
  );
}
