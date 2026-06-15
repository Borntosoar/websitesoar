"use client";

import { MotionConfig } from "framer-motion";
import { type ReactNode } from "react";
import { CartProvider, CartDrawer } from "@/components/ui/cart";
import { QuickViewProvider, ProductQuickView } from "@/components/ui/quick-view";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { SectionNav } from "@/components/ui/section-nav";
import { Cursor } from "@/components/ui/cursor";
import { PromoPopup } from "@/components/ui/promo-popup";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <CartProvider>
        <QuickViewProvider>
          <SmoothScroll>{children}</SmoothScroll>
          <CartDrawer />
          <ProductQuickView />
          <PromoPopup />
          <ScrollProgress />
          <SectionNav />
          <Cursor />
        </QuickViewProvider>
      </CartProvider>
    </MotionConfig>
  );
}
