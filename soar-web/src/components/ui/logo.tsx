import Image from "next/image";
import { cn } from "@/lib/utils";

const SRC = { white: "/soar-logo-white.png", black: "/soar-logo.png" } as const;

/** SOAR logo lockup (box + S-swoosh + breakthrough star + wordmark).
 *  `variant` picks the colour; size via className (e.g. `h-8 w-auto`). */
export function Logo({
  variant = "white",
  className,
  priority = false,
  decorative = false,
}: {
  variant?: "white" | "black";
  className?: string;
  priority?: boolean;
  decorative?: boolean;
}) {
  return (
    <Image
      src={SRC[variant]}
      alt={decorative ? "" : "SOAR"}
      aria-hidden={decorative || undefined}
      width={430}
      height={359}
      priority={priority}
      draggable={false}
      className={cn("select-none", className)}
    />
  );
}
