import type { Metadata } from "next";
import { AuthExperience } from "@/components/auth/auth-experience";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Secure access to SOAR — a living 3D entrance.",
};

export default function AuthPage() {
  return <AuthExperience />;
}
