"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";

type Kind = "jacket" | "top" | "shorts";

// Standard menswear BODY ranges (not garment specs) — a real, honest size guide.
const ROWS: [string, string, string][] = [
  ["S", "36–38 in · 91–97 cm", "28–30 in · 71–76 cm"],
  ["M", "38–40 in · 97–102 cm", "30–32 in · 76–81 cm"],
  ["L", "40–43 in · 102–109 cm", "32–35 in · 81–89 cm"],
  ["XL", "43–46 in · 109–117 cm", "35–38 in · 89–97 cm"],
];

function fitNote(kind: Kind) {
  if (kind === "shorts") return "Tailored length, regular fit — true to size. Go by your waist.";
  return "Boxy, modern fit — true to size. Size down for a sharper silhouette.";
}

export function SizeGuide({ kind, open, onClose }: { kind: Kind; open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const id = setTimeout(() => closeRef.current?.focus(), 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(id);
      document.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[70] bg-ink/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Size guide"
            className="fixed left-1/2 top-1/2 z-[71] w-[min(92vw,30rem)] -translate-x-1/2 -translate-y-1/2 border border-line bg-paper p-7 text-ink"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <div className="flex items-center justify-between">
              <h2 className="display text-2xl">Size guide</h2>
              <button ref={closeRef} type="button" onClick={onClose} aria-label="Close size guide" className="mono text-ash transition-colors hover:text-ink">Close</button>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-ash">
              Body measurements — find the range you fall into. Measure your chest at the fullest point and your waist at the natural line, tape level.
            </p>
            <table className="mt-6 w-full border-collapse text-left text-[13px]">
              <thead>
                <tr className="border-b border-line text-ash">
                  <th scope="col" className="mono py-2 font-medium">Size</th>
                  <th scope="col" className="mono py-2 font-medium">Chest</th>
                  <th scope="col" className="mono py-2 font-medium">Waist</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map(([s, c, w]) => (
                  <tr key={s} className="border-b border-line/60">
                    <th scope="row" className="py-2.5 text-left font-medium">{s}</th>
                    <td className="py-2.5 text-ink/80">{c}</td>
                    <td className="py-2.5 text-ink/80">{w}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-5 text-[13px] leading-relaxed text-ink">{fitNote(kind)}</p>
            <p className="mt-2 text-[12px] leading-relaxed text-ash">
              Between sizes? Email <a href="mailto:soarnextlevel@gmail.com" className="underline underline-offset-2">soarnextlevel@gmail.com</a> — we&rsquo;ll help.
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
