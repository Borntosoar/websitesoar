"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  ["hero", "Born"],
  ["the-box", "Box"],
  ["collection", "Shop"],
  ["community", "Flock"],
  ["upcoming", "Drops"],
] as const;

/** Fixed dot navigation; highlights the section in view. mix-blend keeps it
 *  legible over both dark and light sections. */
export function SectionNav() {
  const pathname = usePathname();
  const [active, setActive] = useState("top");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { threshold: 0.5 },
    );
    items.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  if (pathname !== "/") return null;

  return (
    <nav
      className="fixed right-5 top-1/2 z-[110] hidden -translate-y-1/2 flex-col items-end gap-3.5 mix-blend-difference md:flex"
      aria-label="Sections"
    >
      {items.map(([id, label]) => (
        <a key={id} href={`#${id}`} aria-label={label} className="group flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.16em] text-white opacity-0 transition-opacity group-hover:opacity-100">
            {label}
          </span>
          <span
            className={cn(
              "h-2 w-2 rounded-full border border-white transition-all duration-300",
              active === id ? "scale-125 bg-white" : "bg-transparent",
            )}
          />
        </a>
      ))}
    </nav>
  );
}
