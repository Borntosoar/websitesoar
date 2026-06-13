"use client";

import { useEffect, useState } from "react";
import { Search, Bell, Bookmark, ShoppingBag, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/ui/cart";

const nav = [
  ["Shop", "#collection"],
  ["Collections", "#featured"],
  ["The Box", "#the-box"],
  ["Community", "#community"],
  ["Upcoming", "#upcoming"],
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
        <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full border border-black/20 bg-white px-1 text-[9px] font-semibold leading-none text-black">
          {count}
        </span>
      )}
      {dot && <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-current" aria-hidden />}
    </button>
  );
}

export function SiteHeader() {
  const [stuck, setStuck] = useState(false);
  const [menu, setMenu] = useState(false);
  const [saved] = useState(0);
  const cart = useCart();

  useEffect(() => {
    const on = () => setStuck(window.scrollY > window.innerHeight * 0.7);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);

  // lock scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);

  return (
    <>
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
        <button
          type="button"
          onClick={() => setMenu(true)}
          aria-label="Open menu"
          className="grid h-10 w-10 place-items-center justify-self-start transition-opacity hover:opacity-60 md:hidden"
        >
          <Menu size={20} strokeWidth={1.6} />
        </button>

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

      {/* full-screen mobile menu */}
      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[115] flex flex-col bg-black text-white md:hidden"
          >
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-[11px] uppercase tracking-[0.3em] text-white/50">Menu</span>
              <button
                type="button"
                onClick={() => setMenu(false)}
                aria-label="Close menu"
                className="grid h-10 w-10 place-items-center transition-opacity hover:opacity-60"
              >
                <X size={20} strokeWidth={1.6} />
              </button>
            </div>
            <nav className="flex flex-1 flex-col justify-center gap-3 px-6" aria-label="Mobile">
              {nav.map(([label, href], i) => (
                <motion.a
                  key={href}
                  href={href}
                  onClick={() => setMenu(false)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i + 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="text-[clamp(2.5rem,11vw,4rem)] font-semibold leading-[0.95] tracking-tight"
                >
                  {label}
                </motion.a>
              ))}
            </nav>
            <span className="px-6 pb-10 text-[11px] uppercase tracking-[0.3em] text-white/40">Born to soar</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
