"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export type LegalKind = "privacy" | "terms" | null;

const CONTENT: Record<"privacy" | "terms", { title: string; body: string[] }> = {
  privacy: {
    title: "Privacy Policy",
    body: [
      "SOAR collects only what it needs to sign you in and run your account — your email, phone, and basic auth metadata, handled by our authentication provider (Firebase).",
      "You must be at least 13 years old to create an account. We do not knowingly collect data from children under 13.",
      "We never sell your data. We use it to authenticate you, secure your account, and (with your consent) send drop updates. You can request access or deletion anytime.",
      "We are GDPR-aligned: lawful basis, data minimisation, and your rights to access, rectify, and erase. Contact soarnextlevel@gmail.com.",
    ],
  },
  terms: {
    title: "Terms of Service",
    body: [
      "By creating an account you confirm you are 13+ and agree to use SOAR lawfully and to keep your credentials secure.",
      "Accounts are personal. We may suspend access for abuse, fraud, or security risk.",
      "The SOAR name, the box-and-bird breakthrough mark, and all designs are owned by SOAR and may not be reused without permission.",
      "Service is provided “as is.” These terms are governed by the laws of Ontario, Canada.",
    ],
  },
};

export function LegalModal({ kind, onClose }: { kind: LegalKind; onClose: () => void }) {
  return (
    <AnimatePresence>
      {kind && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-label={CONTENT[kind].title}
            className="fixed left-1/2 top-1/2 z-[71] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b12]/90 text-white shadow-[0_0_80px_-20px_rgba(120,160,255,0.4)] backdrop-blur-2xl"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <h2 className="text-base font-semibold">{CONTENT[kind].title}</h2>
              <button onClick={onClose} aria-label="Close" className="text-white/60 transition-colors hover:text-white">
                <X size={18} strokeWidth={1.7} />
              </button>
            </div>
            <div className="max-h-[58svh] space-y-3 overflow-auto px-6 py-5 text-sm leading-relaxed text-white/65">
              {CONTENT[kind].body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
