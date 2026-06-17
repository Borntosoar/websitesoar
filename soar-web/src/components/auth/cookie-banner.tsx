"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function CookieBanner({ onPrivacy }: { onPrivacy?: () => void }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      if (!localStorage.getItem("soar-cookie")) setShow(true);
    } catch {}
  }, []);
  function set(v: string) {
    try {
      localStorage.setItem("soar-cookie", v);
    } catch {}
    setShow(false);
  }
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ type: "spring", stiffness: 240, damping: 26 }}
          className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-2xl md:left-1/2 md:right-auto md:w-[640px] md:-translate-x-1/2"
        >
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] leading-snug text-white/70">
              We use essential cookies for sign-in and to improve SOAR. See our{" "}
              <button onClick={onPrivacy} className="text-white underline underline-offset-2 hover:text-white/80">
                Privacy Policy
              </button>
              .
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => set("declined")}
                className="rounded-full border border-white/15 px-4 py-2 text-[12px] text-white/70 transition-colors hover:text-white"
              >
                Decline
              </button>
              <button
                onClick={() => set("accepted")}
                className="rounded-full bg-white px-4 py-2 text-[12px] font-medium text-black transition-opacity hover:opacity-90"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
