"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { motion } from "framer-motion";
import { AuthCard } from "@/components/auth/auth-card";
import { CookieBanner } from "@/components/auth/cookie-banner";
import { LegalModal, type LegalKind } from "@/components/auth/legal-modal";

const AuthScene = dynamic(() => import("@/components/auth/auth-scene").then((m) => m.AuthScene), { ssr: false });

export function AuthExperience() {
  const [legal, setLegal] = useState<LegalKind>(null);

  return (
    <main className="relative min-h-svh w-full overflow-x-hidden bg-[#05060c] text-white">
      {/* living 3D logo */}
      <div className="fixed inset-0">
        <AuthScene />
      </div>
      {/* ambient rays + vignette */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(120%_70%_at_50%_-8%,rgba(120,150,255,0.20),transparent_55%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(100%_100%_at_50%_45%,transparent_52%,rgba(0,0,0,0.66))]" />

      <div className="relative z-10 flex min-h-svh flex-col items-center justify-end gap-6 px-5 pb-[7vh] pt-[34svh]">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.2, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="select-none text-[clamp(2.4rem,9vw,5rem)] font-semibold leading-none tracking-[0.16em]"
          style={{ textShadow: "0 3px 0 rgba(0,0,0,0.55), 0 1px 1px rgba(0,0,0,0.6), 0 0 46px rgba(155,180,255,0.5)" }}
        >
          SOAR
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 46 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.7, duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[420px]"
        >
          <AuthCard onLegal={setLegal} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.2, duration: 0.8 }}
          className="text-[11px] uppercase tracking-[0.26em] text-white/30"
        >
          Born to soar — secure access
        </motion.p>
      </div>

      <CookieBanner onPrivacy={() => setLegal("privacy")} />
      <LegalModal kind={legal} onClose={() => setLegal(null)} />
    </main>
  );
}
