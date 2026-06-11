"use client";

import { useEffect, useState } from "react";
import { Search, Bell, Bookmark, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/ui/cart";

const nav = [
  ["Collection", "#shop"],
  ["The Drop", "#drop"],
  ["World", "#world"],
  ["Contact", "#list"],
] as const;

function IconBtn({
  label,
  count,
  dot,
  onClick,
  children,
}: {
  label: string;
  count?: number;
  dot?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label + (typeof count === "number" ? `, ${count} items` : "")}
      className="relative grid h-10 w-10 place-items-center rounded-full transition-opacity hover:opacity-60"
    >
      {children}
      {typeof count === "number" && count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#E6C566] px-1 text-[9px] font-semibold leading-none text-ink">
          {count}
        </span>
      )}
      {dot && <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#E6C566]" aria-hidden />}
    </button>
  );
}

export function SiteHeader() {
  const [stuck, setStuck] = useState(false);
  const [saved] = useState(0);
  const cart = useCart();

  useEffect(() => {
    const on = () => setStuck(window.scrollY > window.innerHeight * 0.7);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);

  return (
    <header
      data-site-header
      className={cn(
        "fixed inset-x-0 top-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center px-5 py-4 transition-all duration-500 md:px-10",
        stuck
          ? "border-b border-ink/10 bg-oat/70 text-ink backdrop-blur-xl"
          : "bg-gradient-to-b from-espresso/55 to-transparent text-bone backdrop-blur-[2px]",
      )}
    >
      <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
        {nav.map(([label, href]) => (
          <a key={href} href={href} className="text-[12px] uppercase tracking-[0.12em] opacity-75 transition-opacity hover:opacity-100">
            {label}
          </a>
        ))}
      </nav>
      <span className="md:hidden" />

      <a href="#top" className="justify-self-center text-[1.15rem] font-semibold tracking-[0.22em]" aria-label="SOAR home">
        SOAR<sup className="align-super text-[0.5em] opacity-70">®</sup>
      </a>

      <div className="flex items-center justify-end gap-0.5">
        <IconBtn label="Search">
          <Search size={17} strokeWidth={1.6} />
        </IconBtn>
        <IconBtn label="Notifications" dot>
          <Bell size={17} strokeWidth={1.6} />
        </IconBtn>
        <IconBtn label="Saved pieces" count={saved}>
          <Bookmark size={17} strokeWidth={1.6} />
        </IconBtn>
        <IconBtn label="Bag" count={cart.count} onClick={() => cart.setOpen(true)}>
          <ShoppingBag size={17} strokeWidth={1.6} />
        </IconBtn>
      </div>
    </header>
  );
}
