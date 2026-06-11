"use client";

import { MotionConfig } from "framer-motion";
import { type ReactNode } from "react";
import { CartProvider, CartDrawer } from "@/components/ui/cart";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { SectionNav } from "@/components/ui/section-nav";
import { Cursor } from "@/components/ui/cursor";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <CartProvider>
        <SmoothScroll>{children}</SmoothScroll>
        <CartDrawer />
        <ScrollProgress />
        <SectionNav />
        <Cursor />
      </CartProvider>
    </MotionConfig>
  );
}
