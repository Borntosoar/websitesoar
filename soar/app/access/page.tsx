import { GateEntrance } from "../components/entrance/GateEntrance";

export const metadata = { title: "Enter" };

// The pre-launch gate IS the entrance. proxy.ts routes unauthenticated visitors
// here when SOAR_ACCESS_PASSWORD is set; GateEntrance validates server-side and,
// on success, breaks through into the destination.
export default async function AccessPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  return <GateEntrance from={from ?? "/"} />;
}
