"use client";

import { cn } from "@/lib/utils";
import { Garment } from "@/components/ui/garment";
import type { Product } from "@/lib/products";

/** Renders a real photo when `p.image` is set, otherwise the vector studio
 *  render. Drop files into /public/products/<id>.jpg and set `image` to swap. */
export function ProductImage({ p, className }: { p: Product; className?: string }) {
  if (p.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={p.image} alt={p.name} loading="lazy" className={cn("h-full w-full object-cover", className)} />;
  }
  return <Garment kind={p.category} className={className} />;
}
