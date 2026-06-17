import Image from "next/image";
import { cn } from "@/lib/utils";
import logoWhite from "@/assets/soar-logo-white.png";
import logoBlack from "@/assets/soar-logo.png";

const SRC = { white: logoWhite, black: logoBlack } as const;

/** SOAR logo lockup (box + S-swoosh + breakthrough star + wordmark).
 *  Statically imported so the URL is basePath-correct on GitHub Pages.
 *  Size via className (e.g. `h-8 w-auto`). */
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
      priority={priority}
      draggable={false}
      className={cn("select-none", className)}
    />
  );
}
