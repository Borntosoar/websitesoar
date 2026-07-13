"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { label: "Drops", href: "#drop" },
  { label: "Archive", href: "#archive" },
  { label: "Access", href: "#access" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 mix-blend-difference md:px-10">
        <a
          href="#"
          className="font-display text-lg tracking-tight text-white"
          onClick={() => setOpen(false)}
        >
          SOAR
        </a>

        <nav className="hidden items-center gap-8 text-xs uppercase tracking-[0.25em] text-white md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="transition-opacity hover:opacity-60"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <span className="text-xs uppercase tracking-[0.25em] text-white">
            Bag (0)
          </span>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="flex flex-col gap-[5px] md:hidden"
          >
            <span
              className={`block h-px w-5 bg-white transition-transform duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span
              className={`block h-px w-5 bg-white transition-opacity duration-300 ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-px w-5 bg-white transition-transform duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-0 z-40 flex min-h-screen flex-col justify-between bg-black px-6 pb-12 pt-24"
          >
            <nav className="flex flex-col gap-8">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="font-display text-4xl tracking-tight text-white"
                >
                  {l.label}
                </a>
              ))}
            </nav>
            <div className="flex flex-col gap-2">
              <p className="text-[10px] uppercase tracking-[0.35em] text-white/30">
                Growth begins where comfort ends.
              </p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/20">
                © {new Date().getFullYear()} SOAR
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
